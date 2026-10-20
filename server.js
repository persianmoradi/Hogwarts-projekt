// =====================================================================
//  HOGWARTS COURSE MANAGEMENT SYSTEM - backend (Express + PostgreSQL)
// =====================================================================
//
//  Oversigt over endpoints:
//
//    HOUSES      GET /houses                         GET /houses/:id
//    TEACHERS    GET /teachers   POST /teachers      GET/PUT/DELETE /teachers/:id
//    STUDENTS    GET /students   POST /students      GET/PUT/DELETE /students/:id
//    COURSES     GET /courses    POST /courses       GET/PUT/DELETE /courses/:id
//                PUT /courses/:id/teacher            (skift teacher)
//
//                POST /courses/:id/students          (tilføj student til course)
//                DELETE /courses/:id/students/:studentId  (fjern student fra course)
//
//  Statuskoder der bruges:
//    200 OK  |  201 Created  |  400 Mangler data  |  404 Findes ikke  |  409 Findes allerede  |  500 Databasefejl
// =====================================================================


// --------------------- OPSÆTNING ---------------------

const express = require("express");
const app = express();
const port = 3000;
const pool = require("./db"); // forbindelsen til PostgreSQL (se db.js og .env)

app.use(express.json()); // gør at vi kan læse JSON i req.body (POST og PUT)


// =====================================================================
//  HOUSES  (kun læsning - de fire houses ligger fast i databasen)
//  Tabel: houses (id, name, colors, founder)
// =====================================================================

// GET /houses - hent alle houses
app.get("/houses", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM houses");
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// GET /houses/:id - hent ét house
app.get("/houses/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM houses WHERE id = $1", [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ message: "House not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});


// =====================================================================
//  TEACHERS  (fuld CRUD)
//  Tabel: teachers (id, name, house_id)
// =====================================================================

// GET /teachers - hent alle teachers
app.get("/teachers", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM teachers");
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// GET /teachers/:id - hent én teacher
app.get("/teachers/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM teachers WHERE id = $1", [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ message: "Teacher not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// POST /teachers - opret en teacher
// Body: { "name": "...", "house_id": 1 }
app.post("/teachers", async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({ message: "name is required" });
        }
        const result = await pool.query("INSERT INTO teachers (name, house_id) VALUES ($1, $2) RETURNING *", [req.body.name, req.body.house_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// PUT /teachers/:id - opdater en teacher
// Body: { "name": "...", "house_id": 1 }
app.put("/teachers/:id", async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({ message: "name is required" });
        }
        const result = await pool.query("UPDATE teachers SET name = $1, house_id = $2 WHERE id = $3 RETURNING *", [req.body.name, req.body.house_id, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ message: "Teacher not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// DELETE /teachers/:id - slet en teacher
app.delete("/teachers/:id", async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM teachers WHERE id = $1", [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).send({ message: "Teacher not found" });
        }
        res.status(200).send({ message: "Teacher deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});


// =====================================================================
//  STUDENTS  (fuld CRUD)
//  Tabel: students (id, name, year, house_id)
// =====================================================================

// GET /students - hent alle students
app.get("/students", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM students");
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// GET /students/:id - hent én student
app.get("/students/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM students WHERE id = $1", [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ message: "Student not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// POST /students - opret en student
// Body: { "name": "...", "year": 1, "house_id": 1 }
app.post("/students", async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({ message: "name is required" });
        }
        const result = await pool.query("INSERT INTO students (name, year, house_id) VALUES ($1, $2, $3) RETURNING *", [req.body.name, req.body.year, req.body.house_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// PUT /students/:id - opdater en student
// Body: { "name": "...", "year": 1, "house_id": 1 }
app.put("/students/:id", async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({ message: "name is required" });
        }
        const result = await pool.query("UPDATE students SET name = $1, year = $2, house_id = $3 WHERE id = $4 RETURNING *", [req.body.name, req.body.year, req.body.house_id, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ message: "Student not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// DELETE /students/:id - slet en student
app.delete("/students/:id", async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM students WHERE id = $1", [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).send({ message: "Student not found" });
        }
        res.status(200).send({ message: "Student deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});


// =====================================================================
//  COURSES  (CRUD + skift af teacher)
//  Tabel: courses (id, name, teacher_id)
//  Relation: mange courses -> én teacher (via teacher_id)
// =====================================================================

// GET /courses - hent alle courses
app.get("/courses", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM courses");
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// GET /courses/:id - hent ét course, inkl. navnet på dets teacher og listen af students
// LEFT JOIN: et course uden teacher bliver stadig vist (teacher_name er så null)
// Students hentes gennem koblingstabellen course_students (tom liste hvis ingen)
app.get("/courses/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT courses.id, courses.name, courses.teacher_id, teachers.name AS teacher_name " +
            "FROM courses LEFT JOIN teachers ON courses.teacher_id = teachers.id " +
            "WHERE courses.id = $1",
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send({ message: "Course not found" });
        }
        const students = await pool.query(
            "SELECT students.id, students.name " +
            "FROM course_students JOIN students ON course_students.student_id = students.id " +
            "WHERE course_students.course_id = $1",
            [req.params.id]
        );
        const course = result.rows[0];
        course.students = students.rows;
        res.status(200).json(course);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// POST /courses - opret et course
// Body: { "name": "...", "teacher_id": 1 }
app.post("/courses", async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({ message: "name is required" });
        }
        const result = await pool.query("INSERT INTO courses (name, teacher_id) VALUES ($1, $2) RETURNING *", [req.body.name, req.body.teacher_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// PUT /courses/:id - ændr kun navnet på et course
// Body: { "name": "..." }
// (teacher skiftes med PUT /courses/:id/teacher herunder)
app.put("/courses/:id", async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({ message: "name is required" });
        }
        const result = await pool.query("UPDATE courses SET name = $1 WHERE id = $2 RETURNING *", [req.body.name, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ message: "Course not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// DELETE /courses/:id - slet et course
app.delete("/courses/:id", async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM courses WHERE id = $1", [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).send({ message: "Course not found" });
        }
        res.status(200).send({ message: "Course deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// PUT /courses/:id/teacher - skift teacher på et course
// Body: { "teacher_id": 2 }
// Tjekker først at teacheren findes, ellers 404
app.put("/courses/:id/teacher", async (req, res) => {
    try {
        if (!req.body.teacher_id) {
            return res.status(400).send({ message: "teacher_id is required" });
        }
        const teacher = await pool.query("SELECT id FROM teachers WHERE id = $1", [req.body.teacher_id]);
        if (teacher.rows.length === 0) {
            return res.status(404).send({ message: "Teacher not found" });
        }
        const result = await pool.query("UPDATE courses SET teacher_id = $1 WHERE id = $2 RETURNING *", [req.body.teacher_id, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ message: "Course not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// =====================================================================
//  COURSES <-> STUDENTS  (mange-til-mange via koblingstabellen)
//  Tabel: course_students (course_id, student_id)
//  Primærnøglen (course_id, student_id) forhindrer dubletter
// =====================================================================

// POST /courses/:id/students - tilføj en student til et course
// Body: { "student_id": 3 }
// 400 hvis student_id mangler, 404 hvis course/student ikke findes, 409 hvis studenten allerede er på course
app.post("/courses/:id/students", async (req, res) => {
    try {
        if (!req.body.student_id) {
            return res.status(400).send({ message: "student_id is required" });
        }
        const course = await pool.query("SELECT id FROM courses WHERE id = $1", [req.params.id]);
        if (course.rows.length === 0) {
            return res.status(404).send({ message: "Course not found" });
        }
        const student = await pool.query("SELECT id FROM students WHERE id = $1", [req.body.student_id]);
        if (student.rows.length === 0) {
            return res.status(404).send({ message: "Student not found" });
        }
        const result = await pool.query("INSERT INTO course_students (course_id, student_id) VALUES ($1, $2) RETURNING *", [req.params.id, req.body.student_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === "23505") { // 23505 = unique violation (primærnøglen findes allerede)
            return res.status(409).send({ message: "Student already in course" });
        }
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});

// DELETE /courses/:id/students/:studentId - fjern en student fra et course
// (studenten slettes ikke - kun koblingen til course'et)
app.delete("/courses/:id/students/:studentId", async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM course_students WHERE course_id = $1 AND student_id = $2", [req.params.id, req.params.studentId]);
        if (result.rowCount === 0) {
            return res.status(404).send({ message: "Student is not in this course" });
        }
        res.status(200).send({ message: "Student removed from course" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error connecting to database" });
    }
});


// =====================================================================
//  START SERVEREN
// =====================================================================

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
