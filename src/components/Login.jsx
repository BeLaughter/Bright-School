import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaSignInAlt,
  FaUserShield,
  FaUserGraduate,
} from "react-icons/fa";
import "./Login.css";
import schoolLogo from "../assets/logo.webp";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // make sure auth and db are correctly exported

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Sign in with email & password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.username,
        formData.password
      );

      const uid = userCredential.user.uid;

      // Fetch user data from Firestore
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("No user profile found in database.");
      }

      const userData = docSnap.data();

      // Check if role matches selected role
      if (userData.role !== formData.role) {
        throw new Error("Incorrect role selected.");
      }

      // Call onLogin callback with user info if provided
      if (onLogin) {
        onLogin({
          role: userData.role,
          studentId: userData.studentId || null,
          username: userData.username || formData.username,
          isAuthenticated: true,
        });
      }

      // Navigate based on role & your routes
      if (userData.role === "admin") {
        navigate("/adminDashboard");
      } else if (userData.role === "student") {
        navigate("/studentDashboard");
      } else {
        throw new Error("Unknown user role.");
      }
    } catch (err) {
      setError(err.message || "Failed to login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <img src={schoolLogo} alt="School Logo" className="logo" />
            <h1>Bright Future Academy</h1>
            <p>Result Management System</p>
          </div>
          <div className="login-illustration">
            <div className="book"></div>
            <div className="pencil"></div>
            <div className="ruler"></div>
          </div>
        </div>

        <div className="login-form-container">
          <div className="login-card">
            <div className="login-header">
              <h2>School Result System</h2>
              <p>Welcome! Please login to continue</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${
                    formData.role === "admin" ? "active" : ""
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, role: "admin", username: "" })
                  }
                >
                  <FaUserShield className="icon" />
                  Admin
                </button>
                <button
                  type="button"
                  className={`role-btn ${
                    formData.role === "student" ? "active" : ""
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, role: "student", username: "" })
                  }
                >
                  <FaUserGraduate className="icon" />
                  Student
                </button>
              </div>

              <div className="form-fields-container">
                <div className="input-container">
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      type="email"
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder={
                        formData.role === "admin"
                          ? "Admin email"
                          : "Student email"
                      }
                      required
                    />
                  </div>
                </div>

                <div className="input-container">
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      id="password"
                      autocomplete="current-password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Enter password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="login-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner"></span>
                  ) : (
                    <>
                      <FaSignInAlt className="me-2" /> Login
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="login-footer">
              <p>
                <a href="#" target="blank">
                  Forgot password?
                </a>{" "}
                Contact your administrator
              </p>
              <p>© {new Date().getFullYear()} School Result System</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
