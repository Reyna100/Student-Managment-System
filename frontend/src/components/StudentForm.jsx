import { useState, useEffect } from 'react';
import axios from 'axios';

function StudentForm({ isOpen, onClose, getData, editStudent, showToast }) {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        dob: "",
        dept: "",
        skillset: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editStudent) {
            // Format ISO date string to YYYY-MM-DD for date input
            let formattedDob = "";
            if (editStudent.dob) {
                formattedDob = editStudent.dob.split("T")[0];
            }
            setForm({
                first_name: editStudent.first_name || "",
                last_name: editStudent.last_name || "",
                dob: formattedDob,
                dept: editStudent.dept || "",
                skillset: editStudent.skillset || ""
            });
        } else {
            setForm({
                first_name: "",
                last_name: "",
                dob: "",
                dept: "",
                skillset: ""
            });
        }
    }, [editStudent, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const todayDate = new Date().toISOString().split("T")[0];

    const submitForm = async (e) => {
        e.preventDefault();
        if (form.dob > todayDate) {
            if (showToast) showToast("Date of Birth cannot be in the future.", "error");
            return;
        }
        setIsSubmitting(true);
        try {
            if (editStudent) {
                const targetId = editStudent.id ?? editStudent.ID ?? editStudent.student_id ?? editStudent._id;
                if (!targetId) {
                    if (showToast) showToast("Invalid student ID. Cannot update record.", "error");
                    setIsSubmitting(false);
                    return;
                }
                await axios.put(`http://localhost:5000/students/${targetId}`, {
                    ...form,
                    id: targetId
                });
                if (showToast) showToast("Student details updated successfully!", "success");
            } else {
                await axios.post("http://localhost:5000/students", form);
                if (showToast) showToast("New student added successfully!", "success");
            }
            getData();
            onClose();
        } catch (err) {
            console.error("Error saving student details:", err);
            const errMsg = err.response?.data?.sqlMessage || err.response?.data?.message || err.message || "Failed to save student details.";
            if (showToast) showToast(`Failed: ${errMsg}`, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{editStudent ? "Edit Student Record" : "Add New Student"}</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={submitForm}>
                    <div className="modal-body">
                        <div className="student-form">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        className="form-input"
                                        placeholder="e.g. John"
                                        value={form.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        className="form-input"
                                        placeholder="e.g. Doe"
                                        value={form.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>Date of Birth *</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        className="form-input"
                                        value={form.dob}
                                        max={todayDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Department *</label>
                                    <select
                                        name="dept"
                                        className="form-select"
                                        value={form.dept}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="CSE">Computer Science (CSE)</option>
                                        <option value="ECE">Electronics (ECE)</option>
                                        <option value="Mech">Mechanical (Mech)</option>
                                        <option value="Civil">Civil Engineering</option>
                                        <option value="IT">Information Tech (IT)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Skillsets (comma separated)</label>
                                <input
                                    type="text"
                                    name="skillset"
                                    className="form-input"
                                    placeholder="e.g. React, Node.js, Python, SQL"
                                    value={form.skillset}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : (editStudent ? "Update Record" : "Save Student")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StudentForm;