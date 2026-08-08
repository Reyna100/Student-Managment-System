import { useState } from 'react';
import axios from 'axios';

function StudentList({ details, onEdit, getData, searchQuery, selectedDept, showToast }) {
    const [deletingStudent, setDeletingStudent] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter students based on search query and department filter
    const filteredDetails = details.filter((student) => {
        const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
        const dept = (student.dept || '').toLowerCase();
        const skillset = (student.skillset || '').toLowerCase();
        const query = searchQuery.toLowerCase();

        const matchesQuery = fullName.includes(query) || dept.includes(query) || skillset.includes(query);
        const matchesDept = selectedDept === 'ALL' || (student.dept && student.dept.toUpperCase() === selectedDept.toUpperCase());

        return matchesQuery && matchesDept;
    });

    const getDeptBadgeClass = (dept) => {
        if (!dept) return 'dept-badge default';
        const d = dept.toUpperCase();
        if (d.includes('CSE')) return 'dept-badge cse';
        if (d.includes('ECE')) return 'dept-badge ece';
        if (d.includes('MECH')) return 'dept-badge mech';
        return 'dept-badge default';
    };

    const formatDob = (dobString) => {
        if (!dobString) return 'N/A';
        const cleanDate = dobString.split('T')[0];
        const [year, month, day] = cleanDate.split('-');
        if (!year || !month || !day) return cleanDate;
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (isNaN(dateObj.getTime())) return cleanDate;
        return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleDelete = async () => {
        if (!deletingStudent) return;
        setIsDeleting(true);
        try {
            const targetId = deletingStudent.id ?? deletingStudent.ID ?? deletingStudent.student_id ?? deletingStudent._id;
            if (!targetId) {
                if (showToast) showToast("Invalid student ID. Cannot delete record.", "error");
                setIsDeleting(false);
                return;
            }
            await axios.delete(`http://localhost:5000/students/${targetId}`);
            if (showToast) showToast(`Student ${deletingStudent.first_name} deleted successfully`, "success");
            getData();
            setDeletingStudent(null);
        } catch (err) {
            console.error("Error deleting student:", err);
            const errMsg = err.response?.data?.sqlMessage || err.response?.data?.message || err.message || "Failed to delete student record.";
            if (showToast) showToast(`Failed: ${errMsg}`, "error");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="table-card">
            <div className="table-header-title">
                <h3>Student Records</h3>
                <span className="student-count-badge">
                    Showing {filteredDetails.length} of {details.length} Records
                </span>
            </div>

            <div className="table-responsive">
                {filteredDetails.length > 0 ? (
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Student Details</th>
                                <th>Date of Birth</th>
                                <th>Department</th>
                                <th>Skillset</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDetails.map((student, index) => {
                                const studentId = student.id ?? student.ID ?? student.student_id ?? index;
                                const initials = `${student.first_name?.[0] || ''}${student.last_name?.[0] || ''}`;
                                const skillsArray = student.skillset
                                    ? student.skillset.split(',').map((s) => s.trim()).filter(Boolean)
                                    : [];

                                return (
                                    <tr key={studentId}>
                                        <td>
                                            <div className="student-profile">
                                                <div className="avatar-circle">
                                                    {initials || '?'}
                                                </div>
                                                <div className="student-name-group">
                                                    <span className="student-full-name">
                                                        {student.first_name} {student.last_name}
                                                    </span>
                                                    <span className="student-id">ID: #{studentId}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ color: 'var(--text-secondary)' }}>
                                                {formatDob(student.dob)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={getDeptBadgeClass(student.dept)}>
                                                {student.dept || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="skills-container">
                                                {skillsArray.length > 0 ? (
                                                    skillsArray.map((skill, idx) => (
                                                        <span key={idx} className="skill-chip">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                        None listed
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button
                                                    className="btn-icon-action edit"
                                                    title="Edit Student"
                                                    onClick={() => onEdit(student)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="btn-icon-action delete"
                                                    title="Delete Student"
                                                    onClick={() => setDeletingStudent(student)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        <line x1="10" y1="11" x2="10" y2="17" />
                                                        <line x1="14" y1="11" x2="14" y2="17" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <h4>No student records found</h4>
                        <p>Try adjusting your search criteria or add a new student.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deletingStudent && (
                <div className="modal-backdrop" onClick={() => setDeletingStudent(null)}>
                    <div className="modal-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Deletion</h3>
                            <button className="btn-close" onClick={() => setDeletingStudent(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="delete-confirm-box">
                                <div className="warning-icon-wrapper">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                        <line x1="12" y1="9" x2="12" y2="13" />
                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                    </svg>
                                </div>
                                <h4>Delete Student Record?</h4>
                                <p className="delete-confirm-text">
                                    Are you sure you want to delete <span className="student-highlight-name">{deletingStudent.first_name} {deletingStudent.last_name}</span>? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setDeletingStudent(null)}>
                                Cancel
                            </button>
                            <button className="btn-danger" onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? "Deleting..." : "Delete Record"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentList;