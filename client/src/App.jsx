import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import WhatBringsYouHere from "./components/WhatBringsYouHere";
import Login from "./pages/auth/Login";
import UserRegister from "./pages/auth/UserRegister";
import TrainerRegister from "./pages/auth/TrainerRegister";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import TrainerDashboard from "./pages/TrainerDashboard/TrainerDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loginSuccess } from "./redux/slices/AuthSlice";
import AdminHome from "./pages/AdminDashboard/AdminHome";
import ManageTrainers from "./pages/AdminDashboard/ManageTrainers";
import ManageUsers from "./pages/AdminDashboard/ManageUsers";
import TrainerHome from "./pages/TrainerDashboard/TrainerHome";
import ManageSessions from "./pages/TrainerDashboard/ManageSessions";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const verified = localStorage.getItem("verified") === "true";

    if (token && role) {
      dispatch(loginSuccess({ token, role,verified  })); 
    }
  }, [dispatch]);
  return (
    <Router>
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
          }
        />
        <Route
          path="/trainer-dashboard"
          element={
            <ProtectedRoute role="trainer">
              <TrainerDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<TrainerHome />} />
            <Route path="manage-sessions" element={<ManageSessions />} />
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
        </Route>
        
      </Routes>
    </Router>
  )
};

export default App;
