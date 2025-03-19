const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();
const PaymentDB = require("../models/paymentmodel");
const AppointmentDB = require("../models/appointmentmodel");

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create a payment intent
router.post("/create-payment-intent", async (req, res) => {
    const { amount, userId, appointmentId, trainerId, method } = req.body;

    // Validate required fields
    if (!userId || !trainerId || !appointmentId || !amount || !method) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: { appointmentId } // ✅ Store appointmentId in Stripe metadata
        });

        // ✅ Only store payment info, NOT confirm appointment yet!
        await PaymentDB.create({
            userId,
            trainerId,
            appointmentId,
            amount,
            status: "pending", // ✅ Payment pending
            method,
            paymentIntentId: paymentIntent.id
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Confirm Payment & Update Appointment
router.post("/confirm-payment", async (req, res) => {
    const { paymentIntentId } = req.body;

    try {
        // Retrieve the payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const appointmentId = paymentIntent.metadata.appointmentId; // ✅ Get stored appointmentId

        if (paymentIntent.status === "succeeded") {
            // ✅ Mark Payment as Completed
            await PaymentDB.findOneAndUpdate(
                { appointmentId },
                { status: "completed", paymentIntentId }
            );

            // ✅ Mark Appointment as "Paid" (Only Now It’s Confirmed!)
            await AppointmentDB.findByIdAndUpdate(
                appointmentId,
                { status: "paid" } // ✅ Change status to Paid
            );

            return res.status(200).json({ success: true, message: "Payment successful!" });
        }

        res.status(400).json({ success: false, message: "Payment not completed." });
    } catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Fetch Client Secret
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

module.exports = router;
