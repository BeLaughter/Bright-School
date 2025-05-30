import { useState, useEffect } from "react";
import { FaTimes, FaPrint, FaTrash } from "react-icons/fa";

function StudentModal({ isOpen, onClose, student, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    name: "",
    class: "Grade 12 Science",
    studentName: "",
    percentage: "",
    address: "",
    grade: "A",
  });

  // Corrected: useEffect instead of useState for form data setup
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        class: student.class || "Grade 12 Science",
        studentName: student.studentName || "",
        percentage: student.percentage || "",
        address: student.address || "",
        grade: student.grade || "A",
      });
    } else {
      setFormData({
        name: "",
        class: "Grade 12 Science",
        studentName: "",
        percentage: "",
        address: "",
        grade: "A",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const percentage = parseFloat(formData.percentage);
    const grade = calculateGrade(percentage);

    const studentData = {
      ...formData,
      percentage,
      grade,
      status: percentage >= 50 ? "Passed" : "Failed",
      id: student?.id,
    };

    onSave(studentData);
    onClose(); // Automatically close modal after saving
  };

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 85) return "A";
    if (percentage >= 80) return "A-";
    if (percentage >= 75) return "B+";
    if (percentage >= 70) return "B";
    if (percentage >= 65) return "B-";
    if (percentage >= 60) return "C+";
    if (percentage >= 50) return "C";
    return "F";
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="student-modal">
        <div className="modal-header">
          <h3>{student ? "Student Details" : "Add New Student"}</h3>
          <button onClick={onClose} className="close-btn">
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Exam Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Class</label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
              >
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11 Science">Grade 11 Science</option>
                <option value="Grade 12 Science">Grade 12 Science</option>
                <option value="Grade 11 Arts">Grade 11 Arts</option>
                <option value="Grade 12 Arts">Grade 12 Arts</option>
              </select>
            </div>

            <div className="form-group">
              <label>Student Name</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Score (%)</label>
              <input
                type="number"
                name="percentage"
                value={formData.percentage}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>

            {student && (
              <div className="form-group">
                <label>Grade</label>
                <input
                  type="text"
                  value={calculateGrade(parseFloat(formData.percentage))}
                  readOnly
                />
              </div>
            )}

            <div className="modal-footer">
              {student && (
                <>
                  <button
                    type="button"
                    className="btn-print"
                    onClick={() => alert("Print functionality would go here")}
                  >
                    <FaPrint className="me-2" /> Print Report
                  </button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this student?"
                        )
                      ) {
                        onDelete(student.id);
                        onClose(); // Close modal after delete
                      }
                    }}
                  >
                    <FaTrash className="me-2" /> Delete
                  </button>
                </>
              )}
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-save">
                {student ? "Update" : "Save"} Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentModal;
