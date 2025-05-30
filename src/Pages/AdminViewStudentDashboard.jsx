import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";

function AdminViewStudentDashboard() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editCourses, setEditCourses] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const studentRef = doc(db, "students", id);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          const data = studentSnap.data();
          setStudent(data);
          // Prepare editable courses state with scores as strings
          setEditCourses(
            data.courses
              ? data.courses.map((c) => ({
                  code: c.code,
                  title: c.title,
                  score: c.score !== undefined ? c.score.toString() : "",
                }))
              : []
          );
        } else {
          setError("Student not found.");
        }
      } catch (err) {
        setError("Error fetching student data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleScoreChange = (index, value) => {
    // Only allow numbers or empty string
    if (/^\d*$/.test(value)) {
      setEditCourses((prev) => {
        const newCourses = [...prev];
        newCourses[index].score = value;
        return newCourses;
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Validate scores are numbers or empty
      for (const course of editCourses) {
        if (course.score !== "" && isNaN(Number(course.score))) {
          setError("Scores must be numeric values.");
          setIsSaving(false);
          return;
        }
      }

      // Prepare updated courses with scores as numbers or null
      const updatedCourses = editCourses.map((c) => ({
        code: c.code,
        title: c.title,
        score: c.score === "" ? null : Number(c.score),
      }));

      // Update Firestore
      const studentRef = doc(db, "students", id);
      await updateDoc(studentRef, { courses: updatedCourses });

      // Update local state
      setStudent((prev) => ({ ...prev, courses: updatedCourses }));
      setSuccessMsg("Scores updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save updates. Please try again.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard d-flex">
        <Sidebar />
        <main className="main-content p-4">
          <div className="spinner-border text-primary" role="status" />
          <p>Loading student data...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard d-flex">
        <Sidebar />
        <main className="main-content p-4">
          <h3>{error}</h3>
          <Link to="/admindashboard" className="btn btn-primary mt-3">
            Back to Admin Dashboard
          </Link>
        </main>
      </div>
    );
  }

  if (!student) {
    return null; // Shouldn't happen, but just in case
  }

  // Render all fields dynamically except courses (which is handled separately)
  const studentFields = Object.entries(student).filter(
    ([key]) => key !== "courses"
  );

  return (
    <div className="admin-dashboard d-flex">
      <Sidebar />
      <main className="main-content p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{student.name}'s Profile & Scores</h2>
          <Link to="/admindashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            {studentFields.map(([key, value]) => (
              <p key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                {value !== undefined && value !== null
                  ? value.toString()
                  : "N/A"}
              </p>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4>Courses & Editable Scores</h4>
            <button
              className="btn btn-success btn-sm"
              onClick={handleSave}
              disabled={isSaving}
              title="Save edited scores"
            >
              {isSaving ? "Saving..." : "Save Scores"}
            </button>
          </div>
          <div className="card-body">
            {editCourses.length > 0 ? (
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Score (editable)</th>
                  </tr>
                </thead>
                <tbody>
                  {editCourses.map((course, index) => (
                    <tr key={course.code + index}>
                      <td>{course.code}</td>
                      <td>{course.title}</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={course.score}
                          onChange={(e) =>
                            handleScoreChange(index, e.target.value)
                          }
                          placeholder="Enter score"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No course data available for this student.</p>
            )}
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="alert alert-success mt-3" role="alert">
                {successMsg}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminViewStudentDashboard;
