// src/routes/AppRouter.tsx
import React, { useContext, type JSX } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import ProjectsDashboard from "../components/Dashboard/ProjectDashboard";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Redirect root URL "/" to /login explicitly */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ProjectsDashboard />
            </PrivateRoute>
          }
        />

        {/* Catch all unknown paths and redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
