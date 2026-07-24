const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
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
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

app.post("/students", (req, res) => {

    const { first_name, last_name, dob, dept, skillset } = req.body;

    const sql =
        "INSERT INTO students(first_name,last_name,dob,dept,skillset) VALUES(?,?,?,?,?)";

    db.query(sql, [first_name, last_name, dob, dept, skillset],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json({
                message: "Student Added Successfully"
            });
        }
    );
});

app.listen(5000, () => {
    console.log("Server Running on Port 5000");
});