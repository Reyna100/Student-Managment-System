import './App.css';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [details, setDetails] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [toast, setToast] = useState(null);

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/students");
      setDetails(response.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      showToast("Cannot connect to server (Port 5000). Please verify MySQL database connection.", "error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleOpenAdd = () => {
    setEditStudent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditStudent(student);
    setIsFormOpen(true);
  };

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="header-card">
        <div className="header-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">Student Management System</h1>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleOpenAdd}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Student
          </button>
        </div>
      </header>

      {/* Control Toolbar */}
      <section className="toolbar-card">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by student name, department, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setSearchQuery('')}
            >
              &times;
            </button>
          )}
        </div>

        <div className="filter-group">
          <button
            className={`filter-pill ${selectedDept === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedDept('ALL')}
          >
            All Departments
          </button>
          <button
            className={`filter-pill ${selectedDept === 'CSE' ? 'active' : ''}`}
            onClick={() => setSelectedDept('CSE')}
          >
            CSE
          </button>
          <button
            className={`filter-pill ${selectedDept === 'ECE' ? 'active' : ''}`}
            onClick={() => setSelectedDept('ECE')}
          >
            ECE
          </button>
          <button
            className={`filter-pill ${selectedDept === 'MECH' ? 'active' : ''}`}
            onClick={() => setSelectedDept('MECH')}
          >
            Mech
          </button>
        </div>
      </section>

      {/* Main Table Component */}
      <main>
        <StudentList
          details={details}
          onEdit={handleOpenEdit}
          getData={getData}
          searchQuery={searchQuery}
          selectedDept={selectedDept}
          showToast={showToast}
        />
      </main>

      {/* Add / Edit Student Modal */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        getData={getData}
        editStudent={editStudent}
        showToast={showToast}
      />

      {/* Notification Toast */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === 'success' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
