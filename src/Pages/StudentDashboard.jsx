import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

const StudentDashboard = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noStudentData, setNoStudentData] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const courseCodeRef = useRef();
  const courseTitleRef = useRef();

  const calculateCGPA = (courseList) => {
    if (courseList.length === 0) return 0.0;
    const total = courseList.reduce(
      (sum, course) => sum + course.score / 20,
      0
    );
    return parseFloat((total / courseList.length).toFixed(2));
  };

  const fetchStudentData = async (user) => {
    try {
      const studentRef = doc(db, "students", user.uid);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        // Create new student doc with email included
        const defaultProfile = {
          name: user.displayName || user.email?.split("@")[0] || "New Student",
          email: user.email || "", // <-- Save email here
          course: "Computer Engineering",
          level: "100",
          cgpa: 0.0,
          status: "active", // Default status
        };
        await setDoc(studentRef, defaultProfile);
        setStudentInfo(defaultProfile);
        setCourses([]);
        return;
      }

      const profileData = studentSnap.data();

      // Update profile if any required fields including email are missing
      if (
        !profileData.name ||
        !profileData.course ||
        !profileData.status ||
        !profileData.email // <-- check email presence
      ) {
        const updatedProfile = {
          ...profileData,
          name:
            profileData.name ||
            user.displayName ||
            user.email?.split("@")[0] ||
            "New Student",
          email: profileData.email || user.email || "", // <-- update email if missing
          course: profileData.course || "Computer Engineering",
          status: profileData.status || "active",
        };
        await setDoc(studentRef, updatedProfile);
        Object.assign(profileData, updatedProfile);
      }

      const coursesRef = collection(db, "students", user.uid, "courses");
      const courseSnap = await getDocs(coursesRef);
      const courseList = courseSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const cgpa = calculateCGPA(courseList);
      if (profileData.cgpa !== cgpa) {
        await setDoc(studentRef, { ...profileData, cgpa });
        profileData.cgpa = cgpa;
      }

      setStudentInfo(profileData);
      setCourses(courseList);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setNoStudentData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchStudentData(user);
      } else {
        setLoading(false);
        setNoStudentData(true);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (noStudentData) {
      const timeout = setTimeout(() => {
        navigate("/");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [noStudentData, navigate]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const code = courseCodeRef.current.value.trim();
    const title = courseTitleRef.current.value.trim();
    const score = 0;

    if (!code || !title) {
      alert("Please provide valid course code and title.");
      return;
    }

    try {
      const courseRef = collection(db, "students", user.uid, "courses");
      await addDoc(courseRef, { code, title, score });

      fetchStudentData(user);

      courseCodeRef.current.value = "";
      courseTitleRef.current.value = "";
    } catch (err) {
      console.error("Error adding course:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (loading) return <p className="text-center mt-4">Loading dashboard...</p>;
  if (!studentInfo)
    return (
      <p className="text-center mt-4">
        No student data found. Redirecting to home in 5 seconds...
      </p>
    );

  return (
    <div className="student-dashboard d-flex">
      <Sidebar />
      <main className="main-content container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>
            Welcome,{" "}
            {user?.displayName || user?.email?.split("@")[0] || "Student"}
          </h2>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>

        <div className="card p-3 mb-4 shadow-sm">
          <div className="d-flex align-items-center mb-3">
            <FaUserGraduate
              size={28}
              className="me-2"
              style={{
                color: studentInfo.status === "active" ? "green" : "red",
              }}
            />
            <span
              className={`fw-bold ${
                studentInfo.status === "active" ? "text-success" : "text-danger"
              }`}
            >
              Status: {studentInfo.status}
            </span>
          </div>
          <p>
            <strong>Name:</strong> {studentInfo.name}
          </p>
          <p>
            <strong>Course:</strong> {studentInfo.course}
          </p>
          <p>
            <strong>Level:</strong> {studentInfo.level}
          </p>
          <p>
            <strong>CGPA:</strong> {studentInfo.cgpa}
          </p>
          <p>
            <strong>Email:</strong> {studentInfo.email}
          </p>
        </div>

        <form onSubmit={handleAddCourse} className="card p-3 mb-4 shadow-sm">
          <h4 className="mb-3">Add New Course</h4>
          <input
            ref={courseCodeRef}
            className="form-control mb-2"
            placeholder="Course Code"
            required
          />
          <input
            ref={courseTitleRef}
            className="form-control mb-3"
            placeholder="Course Title"
            required
          />
          <button type="submit" className="btn btn-info text-white">
            Add Course
          </button>
        </form>

        <h4 className="mb-3">Courses Completed</h4>
        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Course Code</th>
                <th>Title</th>
                <th>Score</th>
                <th>CGPA Equivalent</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.code}</td>
                  <td>{course.title}</td>
                  <td>{course.score}</td>
                  <td>{(course.score / 20).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
