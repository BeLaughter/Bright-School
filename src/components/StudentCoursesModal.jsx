import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function StudentCoursesModal({ isOpen, onClose, student }) {
  const [courses, setCourses] = useState([]);
  const [studentInfo, setStudentInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!student?.id) return;

      setStudentInfo({
        name: student.name || "",
        level: student.level || "",
        cgpa: student.cgpa || 0,
        email: student.email || "",
      });

      try {
        const snapshot = await getDocs(
          collection(db, "students", student.id, "courses")
        );
        const fetchedCourses = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(fetchedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    if (student) {
      fetchData();
    }
  }, [student]);

  const handleScoreChange = (index, newScore) => {
    const updated = [...courses];
    updated[index].score = newScore;
    setCourses(updated);
  };

  const handleLevelChange = (e) => {
    setStudentInfo((prev) => ({
      ...prev,
      level: e.target.value,
    }));
  };

  const calculateCGPA = () => {
    if (courses.length === 0) return 0;
    const totalScore = courses.reduce(
      (acc, c) => acc + Number(c.score || 0),
      0
    );
    return parseFloat((totalScore / courses.length / 20).toFixed(2)); // /20 to scale to 5.0
  };

  const handleSave = async () => {
    if (!student?.id) return;

    try {
      const batch = writeBatch(db);
      const studentRef = doc(db, "students", student.id);

      courses.forEach((course) => {
        const courseRef = doc(db, "students", student.id, "courses", course.id);
        batch.update(courseRef, { score: course.score });
      });

      const newCGPA = calculateCGPA();

      // Update both CGPA and level
      batch.update(studentRef, {
        cgpa: newCGPA,
        level: studentInfo.level,
      });

      await batch.commit();
      alert("Courses and student level updated successfully.");
      onClose();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to update.");
    }
  };

  if (!student) return null;

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Courses & Info for {studentInfo.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h5 className="mb-3">Student Details</h5>
        <Form>
          <Row>
            <Col md={6}>
              <strong>Name:</strong> {studentInfo.name}
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <strong>Level</strong>
                </Form.Label>
                <Form.Select
                  value={studentInfo.level}
                  onChange={handleLevelChange}
                >
                  <option value="">Select Level</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <strong>CGPA:</strong> {calculateCGPA()}
            </Col>
            <Col md={6}>
              <strong>Email:</strong> {studentInfo.email}
            </Col>
          </Row>
        </Form>

        <hr />

        <h5 className="mb-3">Courses</h5>
        {courses.length === 0 ? (
          <p>No courses found for this student.</p>
        ) : (
          <Form>
            {courses.map((course, index) => (
              <Form.Group key={course.id || index} className="mb-3">
                <Form.Label>
                  <strong>{course.title}</strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={course.score || 0}
                  onChange={(e) =>
                    handleScoreChange(index, Number(e.target.value))
                  }
                  min={0}
                  max={100}
                />
              </Form.Group>
            ))}
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={courses.length === 0}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StudentCoursesModal;
