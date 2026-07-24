import { useState } from 'react'
import axios from 'axios';

function StudentForm() {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        dob: "",
        dept: "",
        skillset: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/students", form);
            alert("Student detail saved");
        } catch (err) {
            console.log(err);
        }
        setForm({
            first_name: "",
            last_name: "",
            dob: "",
            dept: "",
            skillset: ""
        });
    };

    return (
        <>
            <form onSubmit={submitForm}>
                <label>First name:</label>
                <input type='text' name="first_name" value={form.first_name} onChange={handleChange} />
                <br />
                <label>Last name:</label>
                <input type='text' name="last_name" value={form.last_name} onChange={handleChange} />
                <br />
                <label>DOB:</label>
                <input type='date' name='dob' value={form.dob} onChange={handleChange} />
                <br />
                <label>Department:</label>
                <select name="dept" value={form.dept} onChange={handleChange}>
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="Mech">Mech</option>
                </select>
                <br />
                <label>Skillset:</label>
                <input type='text' name='skillset' value={form.skillset} onChange={handleChange}></input>
                <br />
                <button type="submit">Submit</button>
            </form>
        </>
    );
}

export default StudentForm;