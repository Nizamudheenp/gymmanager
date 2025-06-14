import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./components/HomePage";
import WhatBringsYouHere from "./components/WhatBringsYouHere";
import Login from "./pages/auth/Login";
import UserRegister from "./pages/auth/UserRegister";
import TrainerRegister from "./pages/auth/TrainerRegister";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import TrainerDashboard from "./pages/TrainerDashboard/TrainerDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminHome from "./pages/AdminDashboard/AdminHome";
import ManageTrainers from "./pages/AdminDashboard/ManageTrainers";
import ManageUsers from "./pages/AdminDashboard/ManageUsers";
import TrainerHome from "./pages/TrainerDashboard/TrainerHome";
import ManageSessions from "./pages/TrainerDashboard/ManageSessions";
import UserHome from "./pages/UserDashboard/UserHome";
import NutritionLog from "./pages/UserDashboard/Nutrition";
import TrainingDashboard from "./pages/UserDashboard/Training";
import ClientSession from "./pages/TrainerDashboard/Clientsession";
import ManageWorkouts from "./pages/TrainerDashboard/ManageWorkouts";
import ClientNutrition from "./pages/TrainerDashboard/ClientNutrition";
import Fitnessgoals from "./pages/UserDashboard/Fitnessgoals";
import UserProgress from "./pages/UserDashboard/UserProgress";
import Sessions from "./pages/UserDashboard/Sessions";
import SessionDetails from "./pages/UserDashboard/SessionDetails";
import PaymentPage from "./components/PaymentPage";
import PaymentSuccess from "./components/PaymentSuccess";
import Messages from "./components/Messages";
import TrainerReviews from "./pages/UserDashboard/ReviewTrainer";
import MyReviews from "./pages/TrainerDashboard/MyReviews";
import AdminManageSessions from "./pages/AdminDashboard/ManageSessions";
import ManageFeedbacks from "./pages/AdminDashboard/ManageFeedbacks";
import AdminPayment from "./pages/AdminDashboard/AdminPaymentsGraph";
import SessionManager from "./components/SessionManager";

const App = () => {

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <SessionManager />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/what-brings-you-here" element={<WhatBringsYouHere />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/register/trainer" element={<TrainerRegister />} />


          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }>
            <Route index element={<UserHome />} />
            <Route path="training" element={<TrainingDashboard />} />
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
            <Route path="manage-clients" element={<ClientSession />} />
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

        </Routes>
      </Router>
    </>
  )
};

export default App;
