import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  FaEye,
  FaSearch,
  FaUserPlus,
  FaFileExport,
  FaFilter,
  FaChartLine,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import StudentModal from "../components/StudentModal";

function Dashboard() {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const data = [
        {
          id: 1,
          name: "Mathematics Final Exam",
          class: "Grade 12 Science",
          number: "John Smith",
          percentage: 85.0,
          address: "123 Main St",
          status: "Passed",
          points: "A",
        },
        {
          id: 2,
          name: "Physics Midterm",
          class: "Grade 12 Science",
          number: "Sarah Johnson",
          percentage: 92.5,
          address: "456 Oak Ave",
          status: "Passed",
          points: "A+",
        },
        {
          id: 3,
          name: "Chemistry Final",
          class: "Grade 12 Science",
          number: "Michael Brown",
          percentage: 78.3,
          address: "789 Pine Rd",
          status: "Passed",
          points: "B+",
        },
        {
          id: 4,
          name: "Biology Exam",
          class: "Grade 11 Science",
          number: "Emily Davis",
          percentage: 65.2,
          address: "321 Elm St",
          status: "Passed",
          points: "C+",
        },
        {
          id: 5,
          name: "English Literature",
          class: "Grade 12 Arts",
          number: "David Wilson",
          percentage: 88.9,
          address: "654 Maple Dr",
          status: "Passed",
          points: "A",
        },
        {
          id: 6,
          name: "History Final",
          class: "Grade 12 Arts",
          number: "Jessica Lee",
          percentage: 72.4,
          address: "987 Cedar Ln",
          status: "Passed",
          points: "B",
        },
        {
          id: 7,
          name: "Computer Science",
          class: "Grade 12 Science",
          number: "Daniel Miller",
          percentage: 95.0,
          address: "135 Birch Blvd",
          status: "Passed",
          points: "A+",
        },
        {
          id: 8,
          name: "Mathematics Quiz",
          class: "Grade 11 Science",
          number: "Olivia Taylor",
          percentage: 58.6,
          address: "246 Willow Way",
          status: "Passed",
          points: "D+",
        },
        {
          id: 9,
          name: "Physics Lab Exam",
          class: "Grade 12 Science",
          number: "Robert Anderson",
          percentage: 81.2,
          address: "369 Spruce Ct",
          status: "Passed",
          points: "A-",
        },
        {
          id: 10,
          name: "Chemistry Quiz",
          class: "Grade 11 Science",
          number: "Sophia Martinez",
          percentage: 90.5,
          address: "579 Redwood Pl",
          status: "Passed",
          points: "A",
        },
        {
          id: 11,
          name: "Geography Test",
          class: "Grade 10",
          number: "William Thomas",
          percentage: 75.8,
          address: "864 Palm St",
          status: "Passed",
          points: "B",
        },
        {
          id: 12,
          name: "Art History",
          class: "Grade 11 Arts",
          number: "Emma Garcia",
          percentage: 82.3,
          address: "753 Aspen Ave",
          status: "Passed",
          points: "A-",
        },
        {
          id: 13,
          name: "Physical Education",
          class: "Grade 10",
          number: "James Rodriguez",
          percentage: 91.0,
          address: "159 Oak Ln",
          status: "Passed",
          points: "A",
        },
        {
          id: 14,
          name: "Economics Final",
          class: "Grade 12 Commerce",
          number: "Isabella Hernandez",
          percentage: 68.9,
          address: "357 Pine Blvd",
          status: "Passed",
          points: "C+",
        },
        {
          id: 15,
          name: "Business Studies",
          class: "Grade 11 Commerce",
          number: "Alexander Lopez",
          percentage: 77.5,
          address: "486 Cedar Dr",
          status: "Passed",
          points: "B+",
        },
        {
          id: 16,
          name: "French Language",
          class: "Grade 10",
          number: "Mia Gonzalez",
          percentage: 84.2,
          address: "624 Maple Ct",
          status: "Passed",
          points: "A-",
        },
        {
          id: 17,
          name: "Music Theory",
          class: "Grade 11 Arts",
          number: "Ethan Wilson",
          percentage: 89.7,
          address: "951 Birch Way",
          status: "Passed",
          points: "A",
        },
        {
          id: 18,
          name: "Algebra Test",
          class: "Grade 9",
          number: "Charlotte Perez",
          percentage: 62.3,
          address: "283 Willow Pl",
          status: "Passed",
          points: "C",
        },
        {
          id: 19,
          name: "Geometry Exam",
          class: "Grade 10",
          number: "Benjamin Turner",
          percentage: 71.8,
          address: "417 Redwood Rd",
          status: "Passed",
          points: "B-",
        },
        {
          id: 20,
          name: "Literature Final",
          class: "Grade 12 Arts",
          number: "Amelia Phillips",
          percentage: 93.5,
          address: "532 Spruce St",
          status: "Passed",
          points: "A+",
        },
      ];

      setResults(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const filteredResults = results.filter(
    (result) =>
      (filterClass === "All" || result.class === filterClass) &&
      (result.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const classOptions = [
    "All",
    ...new Set(results.map((result) => result.class)),
  ];

  const openStudentDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const exportToExcel = () => {
    alert("Exporting data to Excel...");
  };

  // New logout handler using navigate
  const handleLogout = () => {
    // TODO: add any signOut logic here if you want

    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="dashboard-container">
      {/* Pass handleLogout to Sidebar */}
      <Sidebar onLogout={handleLogout} />

      <div className="main-content">
        <div className="dashboard-header">
          <h1>Result Management Dashboard</h1>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <FaUserPlus className="me-2" /> Add Student
            </button>
            <button className="btn btn-success" onClick={exportToExcel}>
              <FaFileExport className="me-2" /> Export
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Students</h3>
              <p>{results.length}</p>
              <div className="icon-bg">
                <FaChartLine />
              </div>
            </div>
            <div className="stat-card">
              <h3>Pass Rate</h3>
              <p>92%</p>
              <div className="icon-bg">
                <FaChartLine />
              </div>
            </div>
            <div className="stat-card">
              <h3>Top Class</h3>
              <p>Grade 12 Science</p>
              <div className="icon-bg">
                <FaChartLine />
              </div>
            </div>
          </div>

          <div className="data-section">
            <div className="section-header">
              <h2>Student Results</h2>
              <div className="data-actions">
                <div className="search-filter">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search results..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="input-group ms-2">
                    <span className="input-group-text">
                      <FaFilter />
                    </span>
                    <select
                      className="form-select"
                      value={filterClass}
                      onChange={(e) => setFilterClass(e.target.value)}
                    >
                      {classOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Exam Name</th>
                    <th>Class</th>
                    <th>Student</th>
                    <th>Percentage</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Grade</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No results found.
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((student) => (
                      <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.class}</td>
                        <td>{student.number}</td>
                        <td>{student.percentage}%</td>
                        <td>{student.address}</td>
                        <td>{student.status}</td>
                        <td>{student.points}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => openStudentDetails(student)}
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />
    </div>
  );
}

export default Dashboard;
