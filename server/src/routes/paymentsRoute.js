const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();
const PaymentDB = require("../models/paymentmodel");
const AppointmentDB = require("../models/appointmentmodel");
const { trainerAuth } = require('../middleware/auth')
const { adminAuth } = require("../middleware/auth");

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//  Create a payment intent
router.post("/create-payment-intent", async (req, res) => {
    const { amount, userId, appointmentId, trainerId, method } = req.body;

    if (!userId || !trainerId || !appointmentId || !amount || !method) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: { appointmentId } //  Store appointmentId in Stripe metadata
        });

        await PaymentDB.create({
            userId,
            trainerId,
            appointmentId,
            amount,
            status: "pending",
            method,
            paymentIntentId: paymentIntent.id
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: error.message });
    }
});

// Confirm Payment & Update Appointment
router.post("/confirm-payment", async (req, res) => {
    const { paymentIntentId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const appointmentId = paymentIntent.metadata.appointmentId;

        if (paymentIntent.status === "succeeded") {
            await PaymentDB.findOneAndUpdate(
                { appointmentId },
                { status: "completed", paymentIntentId }
            );

            await AppointmentDB.findByIdAndUpdate(
                appointmentId,
                { status: "paid" }
            );

            return res.status(200).json({ success: true, message: "Payment successful!" });
        }

        res.status(400).json({ success: false, message: "Payment not completed." });
    } catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).json({ error: error.message });
    }
});

//  Fetch Client Secret
router.get("/get-client-secret/:appointmentId", async (req, res) => {
    try {
        const payment = await PaymentDB.findOne({ appointmentId });

        if (!payment || !payment.paymentIntentId) {
            return res.status(404).json({ message: "Payment not found" });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(payment.paymentIntentId);

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error fetching client secret:", error);
        res.status(500).json({ error: error.message });
    }
});



// Fetch Trainer Earnings
router.get("/trainer-earnings", trainerAuth, async (req, res) => {
    try {
        const trainerId = req.trainer.id; 
        
        const payments = await PaymentDB.find({ trainerId, status: "completed" });

        const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);

        res.status(200).json({
            totalEarnings,
            sessions: payments.map(payment => ({
                appointmentId: payment.appointmentId,
                amount: payment.amount,
                method: payment.method,
                date: payment.createdAt
            }))
        });
    } catch (error) {
        console.error("Error fetching trainer earnings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/admin-payment-report", adminAuth, async (req, res) => {
    try {
        const payments = await PaymentDB.find({ status: "completed" });

        const dailyReport = payments.reduce((acc, payment) => {
            const date = new Date(payment.createdAt).toISOString().split("T")[0]; 
            acc[date] = (acc[date] || 0) + payment.amount;
            return acc;
        }, {});

        res.status(200).json(dailyReport);
    } catch (error) {
        console.error("Error fetching payment report:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
