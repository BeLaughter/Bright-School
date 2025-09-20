// src/components/AddUser.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";

import schoolLogo from "../assets/logo1.jpg";
import { auth, db } from "../firebase";
import "./AddUser.css";

function AddUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [program, setProgram] = useState(""); // ND or HND
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Default level
      let level = null;
      if (role === "student") {
        level = program === "HND" ? "300" : "100"; // 🔥 clean level string
      }

      // ✅ Save additional user info in Firestore (users collection)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        fullName,
        role,
        program: role === "student" ? program : null,
        level,
        createdAt: Timestamp.now(),
      });

      // ✅ If role is student, also create a student profile (using UID not email!)
      if (role === "student") {
        await setDoc(doc(db, "students", user.uid), {
          uid: user.uid,
          name: fullName,
          email,
          program, // ✅ program is stored here now
          level,
          course: "Computer Engineering", // default, can be updated later
          cgpa: 0.0,
          status: "active",
          createdAt: Timestamp.now(),
        });
      }

      setMessage("✅ User created successfully!");
      setEmail("");
      setPassword("");
      setRole("student");
      setFullName("");
      setProgram("");

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
            <h1>Abraham Adesanya Polytechnic</h1>
            <p>Result Management System</p>
          </div>
          <div className="login-illustration">
            <div className="book"></div>
            <div className="pencil"></div>
            <div className="ruler"></div>
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

              {role === "student" && (
                <div className="mb-3">
                  <label className="form-label">Program</label>
                  <select
                    className="form-select"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    required
                  >
                    <option value="">-- Select Program --</option>
                    <option value="ND">ND</option>
                    <option value="HND">HND</option>
                  </select>
                </div>
              )}

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
    </div>
  );
}

export default AddUser;
