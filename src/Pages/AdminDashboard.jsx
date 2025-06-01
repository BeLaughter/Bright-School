import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  FaUserPlus,
  FaFileExport,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import StudentCoursesModal from "../components/StudentCoursesModal";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState("list");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const adminRef = doc(db, "admins", currentUser.uid);
          const docSnap = await getDoc(adminRef);

          if (docSnap.exists()) {
            const fullName = docSnap.data().fullName || currentUser.email;
            setUser({ ...currentUser, fullName });
          } else {
            setUser({ ...currentUser, fullName: currentUser.email });
          }
        } catch (error) {
          console.error("Error fetching admin details:", error);
          setUser({ ...currentUser, fullName: currentUser.email });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "students"));
      const studentsData = snapshot.docs.map((docSnap) => {
        const studentData = docSnap.data();
        let email = studentData.email || "No Email";
        return {
          id: docSnap.id,
          ...studentData,
          email,
          status: studentData.status || "active",
        };
      });

      const sortedStudents = studentsData.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setStudents(sortedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Error loading students data.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesLevel = filterLevel === "All" || student.level === filterLevel;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      student.name?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.level?.toLowerCase().includes(searchLower);
    return matchesLevel && matchesSearch;
  });

  const levelOptions = ["All", ...new Set(students.map((s) => s.level))];

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteDoc(doc(db, "students", id));
        setStudents((prev) => prev.filter((student) => student.id !== id));
      } catch (error) {
        console.error("Failed to delete student:", error);
        alert("Failed to delete student. Please try again.");
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      const student = students.find((s) => s.id === id);
      if (!student) return;
      const newStatus = student.status === "active" ? "inactive" : "active";
      const studentRef = doc(db, "students", id);
      await updateDoc(studentRef, { status: newStatus });
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update student status. Please try again.");
    }
  };

  return (
    <div className="admin-dashboard d-flex">
      <Sidebar />
      <main className="main-content flex-grow-1 p-4">
        <header className="dashboard-header mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <h1 className="mb-3 mb-md-0">Admin Dashboard</h1>
          <div className="header-actions d-flex gap-2 flex-wrap">
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/adduser")}
            >
              <FaUserPlus /> Add User
            </button>
            <button
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={() => alert("Export functionality not implemented")}
            >
              <FaFileExport /> Export Data
            </button>

            <div className="btn-group" role="group">
              <button
                className={`btn btn-sm ${
                  currentView === "list"
                    ? "btn-primary text-dark"
                    : "btn-outline-primary text-dark"
                }`}
                onClick={() => setCurrentView("list")}
              >
                List
              </button>
              <button
                className={`btn btn-sm ${
                  currentView === "grid"
                    ? "btn-primary text-dark"
                    : "btn-outline-primary text-dark"
                }`}
                onClick={() => setCurrentView("grid")}
              >
                Grid
              </button>
            </div>

            <button
              className="btn btn-danger btn-sm d-flex align-items-center gap-2"
              onClick={onLogout}
              title="Logout"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        {user && user.fullName && (
          <div className="mb-3 fs-5 fw-semibold text-dark">
            Welcome to Admin Dashboard,{" "}
            <span className="text-primary text-uppercase">{user.fullName}</span>
          </div>
        )}

        <div className="controls d-flex align-items-center my-3 flex-wrap gap-3">
          <div className="input-group" style={{ maxWidth: 300 }}>
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter input-group" style={{ maxWidth: 150 }}>
            <span className="input-group-text">
              <FaFilter />
            </span>
            <select
              className="form-select"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              {levelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="loading text-center my-5">
            <div className="spinner-border" role="status" />
            <p>Loading student data...</p>
          </div>
        ) : currentView === "list" ? (
          <div className="students-table table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>S/N</th>
                  <th>Student Name</th>
                  <th>Level</th>
                  <th>Email</th>
                  <th>CGPA</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.level}</td>
                    <td>{student.email}</td>
                    <td>{student.cgpa ?? "N/A"}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          student.status === "active"
                            ? "btn-success"
                            : "btn-danger"
                        }`}
                        onClick={() => toggleStatus(student.id)}
                      >
                        {student.status}
                      </button>
                    </td>
                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsCoursesModalOpen(true);
                        }}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteStudent(student.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="students-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="student-card col">
                <div className="card h-100 shadow-sm rounded-3 border border-light-subtle">
                  <div className="card-body d-flex flex-column gap-2">
                    <h5 className="card-title fw-semibold text-primary">
                      {student.name}
                    </h5>
                    <div>
                      <strong>Level:</strong> {student.level}
                    </div>
                    <div>
                      <strong>Email:</strong> {student.email}
                    </div>
                    <div>
                      <strong>CGPA:</strong> {student.cgpa ?? "N/A"}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${
                          student.status === "active"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {student.status}
                      </span>
                    </div>
                    <div className="card-footer d-flex justify-content-end gap-2 mt-auto border-0 bg-transparent">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsCoursesModalOpen(true);
                        }}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteStudent(student.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <StudentCoursesModal
          isOpen={isCoursesModalOpen}
          onClose={() => {
            setIsCoursesModalOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
        />
      </main>
    </div>
  );
}

export default AdminDashboard;
