import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const createStudent = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      regd,
      name,
      email,
      password,
      phone,
      department_id,
      class_id,
      semester,
      subjectsRegistered,
    } = req.body;

    await client.query("BEGIN");

    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1,$2,'student')
       RETURNING user_id`,
      [email, password_hash]
    );

    const user_id = userResult.rows[0].user_id;

    // Create student
    const studentResult = await client.query(
      `INSERT INTO students
       (student_id, user_id, name, semester, phone, department_id, class_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING student_id`,
      [regd, user_id, name, semester, phone, department_id, class_id]
    );

    const student_id = studentResult.rows[0].student_id;

    // Register subjects
    if (subjectsRegistered && subjectsRegistered.length > 0) {
      const values = subjectsRegistered
        .map(
          (code, index) =>
            `($1,(SELECT subject_id FROM subjects WHERE subject_code=$${index + 2}))`
        )
        .join(",");

      const query = `
        INSERT INTO student_subjects (student_id, subject_id)
        VALUES ${values}
      `;

      await client.query(query, [student_id, ...subjectsRegistered]);
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Student created successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    client.release();
  }
};

export const getStudents = async (req, res) => {
  try {
    const { class: classId, subject: subjectId } = req.query;

    let query = `
      SELECT 
        s.student_id AS regd,
        s.name,
        u.email,
        s.phone,
        s.semester,
        u.password_hash,

        s.department_id,
        d.department_name AS dept,

        s.class_id,
        c.class_name AS classes

      FROM students s
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN departments d ON s.department_id = d.department_id
      LEFT JOIN classes c ON s.class_id = c.class_id
    `;

    const values = [];
    let conditions = [];

    if (classId) {
      values.push(classId);
      conditions.push(`s.class_id = $${values.length}`);
    }

    if (subjectId) {
      values.push(subjectId);
      conditions.push(`
        s.student_id IN (
          SELECT student_id FROM student_subjects 
          WHERE subject_id = $${values.length}
        )
      `);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY s.student_id`;

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching students" });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const studentResult = await pool.query(
      `
      SELECT 
        s.student_id AS regd,
        s.name,
        s.phone,
        s.semester,
        u.email,

        s.department_id,
        d.department_name AS dept,

        s.class_id,
        c.class_name AS classes

      FROM students s
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN departments d ON s.department_id = d.department_id
      LEFT JOIN classes c ON s.class_id = c.class_id
      WHERE s.student_id = $1
      `,
      [id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const subjectsResult = await pool.query(
      `
      SELECT sub.subject_code
      FROM student_subjects ss
      JOIN subjects sub ON ss.subject_id = sub.subject_id
      WHERE ss.student_id = $1
      `,
      [id]
    );

    const student = studentResult.rows[0];
    const subjectsRegistered = subjectsResult.rows.map((s) => s.subject_code);

    res.json({
      ...student,
      subjectsRegistered,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateStudent = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const {
      name,
      semester,
      phone,
      department_id,
      class_id,
      subjectsRegistered,
    } = req.body;

    await client.query("BEGIN");

    await client.query(
      `UPDATE students
       SET name=$1,
           semester=$2,
           phone=$3,
           department_id=$4,
           class_id=$5
       WHERE student_id=$6`,
      [name, semester, phone, department_id, class_id, id]
    );

    await client.query(`DELETE FROM student_subjects WHERE student_id=$1`, [id]);

    if (subjectsRegistered && subjectsRegistered.length > 0) {
      const values = subjectsRegistered
        .map(
          (code, index) =>
            `($1,(SELECT subject_id FROM subjects WHERE subject_code=$${index + 2}))`
        )
        .join(",");

      const query = `
        INSERT INTO student_subjects (student_id, subject_id)
        VALUES ${values}
      `;

      await client.query(query, [id, ...subjectsRegistered]);
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Student updated successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    client.release();
  }
};

export const deleteStudent = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const result = await client.query(
      `SELECT user_id FROM students WHERE student_id=$1`,
      [id],
    );

    const user_id = result.rows[0].user_id;

    await client.query(`DELETE FROM students WHERE student_id=$1`, [id]);

    await client.query(`DELETE FROM users WHERE user_id=$1`, [user_id]);

    await client.query("COMMIT");

    res.json({ message: "Student deleted" });
  } catch (error) {
    await client.query("ROLLBACK");

    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

export const getRegisteredSubjects = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // 1. Find student_id
    const studentRes = await pool.query(
      `SELECT student_id FROM students WHERE user_id = $1`,
      [user_id]
    );

    if (!studentRes.rows.length) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student_id = studentRes.rows[0].student_id;

    // 2. Fetch registered subjects
    const subjectRes = await pool.query(
      ` SELECT 
        sub.subject_id,
        sub.subject_code,
        sub.subject_name,
        sub.semester
      FROM student_subjects ss
      JOIN subjects sub ON ss.subject_id = sub.subject_id
      WHERE ss.student_id = $1
      ORDER BY sub.subject_code ASC
      `,
      [student_id]
    );

    res.json(subjectRes.rows);
  } catch (error) {
    console.error("Error fetching registered subjects:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubjectWiseAttendance = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // 1. Get student_id
    const studentRes = await pool.query(
      `SELECT student_id FROM students WHERE user_id = $1`,
      [user_id]
    );

    if (!studentRes.rows.length) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student_id = studentRes.rows[0].student_id;

    // 2. Get all registered subjects + attendance %
    const result = await pool.query(
      `
      SELECT 
        sub.subject_id,
        sub.subject_code,
        sub.subject_name,
        COUNT(ar.attendance_id) AS total_classes,
        COUNT(CASE WHEN ar.status = 'present' THEN 1 END) AS present_classes,
        COALESCE(
          ROUND(
            (COUNT(CASE WHEN ar.status = 'present' THEN 1 END)::decimal 
            / NULLIF(COUNT(ar.attendance_id), 0)) * 100
          , 2),
          0
        ) AS percentage
      FROM student_subjects ss
      JOIN subjects sub ON ss.subject_id = sub.subject_id
      LEFT JOIN attendance_sessions ats ON ats.subject_id = sub.subject_id
      LEFT JOIN attendance_records ar 
        ON ar.session_id = ats.session_id 
        AND ar.student_id = ss.student_id
      WHERE ss.student_id = $1
      GROUP BY sub.subject_id, sub.subject_code, sub.subject_name
      ORDER BY sub.subject_code ASC
      `,
      [student_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching subject wise attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};
