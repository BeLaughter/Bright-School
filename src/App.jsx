// src/App.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Routes, Route, useNavigate } from "react-router-dom";

// Firebase Auth
import { getAuth, signOut } from "firebase/auth";

// Public Pages
import Login from "./components/Login";
import AddUser from "./components/AddUser";

// Private Routes
import PrivateRoute from "./PrivateRoute";

// Dashboards
import AdminDashboard from "./Pages/AdminDashboard";
import Dashboard from "./Pages/Dashboard";
import StudentDashboard from "./Pages/StudentDashboard";

// Admin viewing individual student
import AdminViewStudentDashboard from "./Pages/AdminViewStudentDashboard"; // 🆕

function App() {
  const auth = getAuth();
  const navigate = useNavigate();

  // Fix: Logout handler for sidebar
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Logged out");
        navigate("/"); // Optional: redirect to login or home
      })
      .catch((err) => console.error("Logout error:", err));
  };

  return (
    <div className="app-container">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/adduser" element={<AddUser />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="student">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/adminDashboard"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminDashboard onLogout={handleLogout} />{" "}
              {/* ✅ Pass onLogout */}
            </PrivateRoute>
          }
        />
        <Route
          path="/studentDashboard"
          element={
            <PrivateRoute requiredRole="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        {/* ✅ Admin route to view individual student dashboard */}
        <Route
          path="/admin/student/:studentId"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminViewStudentDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
