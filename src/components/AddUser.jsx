// src/components/AddUser.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";

import schoolLogo from "../assets/logo.webp";
import { auth, db } from "../firebase"; // Adjust path as needed
import "./AddUser.css"; // Import the custom CSS

function AddUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear old messages

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        fullName,
        role,
        createdAt: Timestamp.now(),
      });

      setMessage("✅ User created successfully!");
      setEmail("");
      setPassword("");
      setRole("student");
      setFullName("");

      // If you want a delay before redirect, you can replace above with:
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setMessage("❌ Email already in use. Try another.");
      } else {
        setMessage(`❌ ${error.message}`);
      }
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
      </div>
      <div className="login-form-container">
        <div className="add-user-container">
          <h2 className="text-center mb-4">Add New User</h2>
          <form onSubmit={handleSubmit} className="add-user-form">
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Add User
            </button>
            <div className="login-footer">
              <p>
                <Link to="/" className="">
                  login
                </Link>
              </p>
            </div>

            {message && (
              <div className="alert mt-3 text-center" role="alert">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
