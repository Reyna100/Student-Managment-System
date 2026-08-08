const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "reyna_at#100",
    database: "student_db"
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
        return;
    }
    console.log("MySQL Connected");
});

app.get("/students", (req, res) => {

    const sql = "SELECT * FROM students ORDER BY id";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching students:", err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

app.post("/students", (req, res) => {

    const { first_name, last_name, dob, dept, skillset } = req.body;
    const dobValue = dob ? dob.split("T")[0] : null;

    const sql =
        "INSERT INTO students(first_name,last_name,dob,dept,skillset) VALUES(?,?,?,?,?)";

    db.query(sql, [first_name, last_name, dobValue, dept, skillset],
        (err, result) => {
            if (err) {
                console.error("Error inserting student:", err);
                return res.status(500).json(err);
            }
            res.json({
                message: "Student Added Successfully"
            });
        }
    );
});

// PUT endpoint supporting both /students/:id and /students
const handleUpdateStudent = (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    const { first_name, last_name, dob, dept, skillset } = req.body;
    const dobValue = dob ? dob.split("T")[0] : null;

    if (!id) {
        return res.status(400).json({ message: "Student ID is required for update." });
    }

    const sql =
        "UPDATE students SET first_name=?, last_name=?, dob=?, dept=?, skillset=? WHERE id=?";

    db.query(sql, [first_name, last_name, dobValue, dept, skillset, id],
        (err, result) => {
            if (err) {
                console.error("Error updating student:", err);
                return res.status(500).json(err);
            }
            res.json({
                message: "Student Updated Successfully",
                affectedRows: result.affectedRows
            });
        }
    );
};

app.put("/students/:id", handleUpdateStudent);
app.put("/students", handleUpdateStudent);

// DELETE endpoint supporting both /students/:id and /students
const handleDeleteStudent = (req, res) => {
    const id = req.params.id || req.query.id || (req.body && req.body.id);

    if (!id) {
        return res.status(400).json({ message: "Student ID is required for deletion." });
    }

    const sql = "DELETE FROM students WHERE id=?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting student:", err);
            return res.status(500).json(err);
        }
        res.json({
            message: "Student Deleted Successfully",
            affectedRows: result.affectedRows
        });
    });
};

app.delete("/students/:id", handleDeleteStudent);
app.delete("/students", handleDeleteStudent);

app.listen(5000, () => {
    console.log("Server Running on Port 5000");
});