import React, { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = lazy(() => import("./components/HomePage"));
const WhatBringsYouHere = lazy(() => import("./components/WhatBringsYouHere"));
const Login = lazy(() => import("./pages/auth/Login"));
const UserRegister = lazy(() => import("./pages/auth/UserRegister"));
const TrainerRegister = lazy(() => import("./pages/auth/TrainerRegister"));
const UserDashboard = lazy(() => import("./pages/UserDashboard/UserDashboard"));
const TrainerDashboard = lazy(() => import("./pages/TrainerDashboard/TrainerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard/AdminDashboard"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const AdminHome = lazy(() => import("./pages/AdminDashboard/AdminHome"));
const ManageTrainers = lazy(() => import("./pages/AdminDashboard/ManageTrainers"));
const ManageUsers = lazy(() => import("./pages/AdminDashboard/ManageUsers"));
const TrainerHome = lazy(() => import("./pages/TrainerDashboard/TrainerHome"));
const ManageSessions = lazy(() => import("./pages/TrainerDashboard/ManageSessions"));
const Appointments = lazy(() => import("./pages/TrainerDashboard/Appointments"));
const ManageClients = lazy(() => import("./pages/TrainerDashboard/ManageClients"));
const UserHome = lazy(() => import("./pages/UserDashboard/UserHome"));
const NutritionLog = lazy(() => import("./pages/UserDashboard/Nutrition"));
const TrainingDashboard = lazy(() => import("./pages/UserDashboard/Training"));
const ClientSession = lazy(() => import("./pages/TrainerDashboard/Clientsession"));
const ManageWorkouts = lazy(() => import("./pages/TrainerDashboard/ManageWorkouts"));
const ClientNutrition = lazy(() => import("./pages/TrainerDashboard/ClientNutrition"));
const UserWorkouts = lazy(() => import("./pages/UserDashboard/Workouts"));
const BookTraining = lazy(() => import("./pages/UserDashboard/BookTraining"));
const MyBookings = lazy(() => import("./pages/UserDashboard/MyBookings"));
const TrainingMenu = lazy(() => import("./pages/UserDashboard/TrainingMenu"));
const Fitnessgoals = lazy(() => import("./pages/UserDashboard/Fitnessgoals"));
const UserProgress = lazy(() => import("./pages/UserDashboard/UserProgress"));
const Sessions = lazy(() => import("./pages/UserDashboard/Sessions"));
const SessionDetails = lazy(() => import("./pages/UserDashboard/SessionDetails"));
const PaymentPage = lazy(() => import("./components/PaymentPage"));
const PaymentSuccess = lazy(() => import("./components/PaymentSuccess"));
const Messages = lazy(() => import("./components/Messages"));
const TrainerReviews = lazy(() => import("./pages/UserDashboard/ReviewTrainer"));
const MyReviews = lazy(() => import("./pages/TrainerDashboard/MyReviews"));
const AdminManageSessions = lazy(() => import("./pages/AdminDashboard/ManageSessions"));
const ManageFeedbacks = lazy(() => import("./pages/AdminDashboard/ManageFeedbacks"));
const AdminPayment = lazy(() => import("./pages/AdminDashboard/AdminPaymentsGraph"));
const SessionManager = lazy(() => import("./components/SessionManager"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const NotFound = lazy(() => import("./components/NotFound"));

const App = () => {

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <SessionManager />
        <Suspense fallback={<div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/what-brings-you-here" element={<WhatBringsYouHere />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/user" element={<UserRegister />} />
            <Route path="/register/trainer" element={<TrainerRegister />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />


            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              }>
              <Route index element={<UserHome />} />
              <Route path="training" element={<TrainingDashboard />}>
                <Route index element={<TrainingMenu />} />
                <Route path="book" element={<BookTraining />} />
                <Route path="bookings" element={<MyBookings />} />
                <Route path="workouts" element={<UserWorkouts />} />
              </Route>
              <Route path="nutritions" element={<NutritionLog />} />
              <Route path="goals" element={<Fitnessgoals />} />
              <Route path="progress" element={<UserProgress />} />
              <Route path="session" element={<Sessions />} />
              <Route path="sessiondetailes/:sessionId" element={<SessionDetails />} />
              <Route path="payment/:appointmentId" element={<PaymentPage />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
              <Route path="messages" element={<Messages />} />
              <Route path="review-trainer/:trainerId" element={<TrainerReviews />} />


            </Route>
            <Route
              path="/trainer-dashboard"
              element={
                <ProtectedRoute role="trainer">
                  <TrainerDashboard />
                </ProtectedRoute>
              }>
              <Route index element={<TrainerHome />} />
              <Route path="manage-sessions" element={<ManageSessions />} />
              <Route path="manage-clients" element={<ClientSession />}>
                <Route path="appointments" element={<Appointments />} />
                <Route path="clients" element={<ManageClients />} />
              </Route>
              <Route path="manage-workouts/:userId" element={<ManageWorkouts />} />
              <Route path="manage-nutritions/:userId" element={<ClientNutrition />} />
              <Route path="messages" element={<Messages />} />
              <Route path="myreviews" element={<MyReviews />} />
            </Route>


            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }>
              <Route index element={<AdminHome />} />
              <Route path="manage-trainers" element={<ManageTrainers />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="admin-manage-sessions" element={<AdminManageSessions />} />
              <Route path="manage-payments" element={<AdminPayment />} />
              <Route path="manage-feedbacks" element={<ManageFeedbacks />} />

            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  )
};

export default App;
