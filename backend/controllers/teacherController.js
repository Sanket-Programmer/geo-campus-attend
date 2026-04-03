import pool from "../config/db.js";
import bcrypt from "bcrypt";

// CREATE TEACHER
export const createTeacher = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      id,
      name,
      email,
      phone,
      designation,
      dept,
      password,
      subjectsAssigned,
      assignedClass,
    } = req.body;

    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(password || "default@123", 10);

    // create user
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1,$2,'teacher')
       RETURNING user_id`,
      [email, hashedPassword],
    );

    const user_id = userResult.rows[0].user_id;

    // create teacher
    const teacherResult = await client.query(
      `INSERT INTO teachers (teacher_id, user_id, name, phone, designation, department_id)
   VALUES ($1,$2,$3,$4,$5,
     (SELECT department_id FROM departments WHERE department_name=$6)
   )
   RETURNING teacher_id`,
      [id, user_id, name, phone, designation, dept],
    );

    const teacher_id = teacherResult.rows[0].teacher_id;

    // assign subjects + classes
    if (subjectsAssigned?.length > 0 && assignedClass?.length > 0) {
      const values = [];
      let index = 1;

      subjectsAssigned.forEach((sub) => {
        assignedClass.forEach((cls) => {
          values.push(
            `(
              $${index++},
              (SELECT subject_id FROM subjects WHERE subject_code=$${index++}),
              (SELECT class_id FROM classes WHERE class_name=$${index++})
            )`,
          );
        });
      });

      const params = [];

      subjectsAssigned.forEach((sub) => {
        assignedClass.forEach((cls) => {
          params.push(teacher_id, sub, cls);
        });
      });

      const query = `
        INSERT INTO teacher_subjects (teacher_id,subject_id,class_id)
        VALUES ${values.join(",")}
      `;

      await client.query(query, params);
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Teacher created successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");

    res.status(500).json({
      message: err.message,
    });
  } finally {
    client.release();
  }
};

/* ============================= */
/* GET ALL TEACHERS */
/* ============================= */

export const getTeachers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.teacher_id AS id,
        t.name,
        u.email,
        t.phone,
        t.designation,
        d.department_name AS dept,

        ARRAY(
          SELECT DISTINCT c.class_name
          FROM teacher_subjects ts
          JOIN classes c
          ON ts.class_id = c.class_id
          WHERE ts.teacher_id = t.teacher_id
        ) AS "assignedClass",

        ARRAY(
          SELECT DISTINCT s.subject_code
          FROM teacher_subjects ts
          JOIN subjects s
          ON ts.subject_id = s.subject_id
          WHERE ts.teacher_id = t.teacher_id
        ) AS "subjectsAssigned"

      FROM teachers t
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN departments d ON t.department_id = d.department_id
      ORDER BY t.teacher_id
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================= */
/* GET TEACHER BY ID */
/* ============================= */

export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        t.teacher_id AS id,
        t.name,
        u.email,
        t.phone,
        t.designation,
        d.department_name AS dept,

        ARRAY(
          SELECT s.subject_code
          FROM teacher_subjects ts
          JOIN subjects s
          ON ts.subject_id=s.subject_id
          WHERE ts.teacher_id=t.teacher_id
        ) AS "subjectsAssigned",

        ARRAY(
          SELECT c.class_name
          FROM teacher_subjects ts
          JOIN classes c
          ON ts.class_id=c.class_id
          WHERE ts.teacher_id=t.teacher_id
        ) AS "assignedClass"

      FROM teachers t
      JOIN users u ON t.user_id=u.user_id
      LEFT JOIN departments d ON t.department_id=d.department_id
      WHERE t.teacher_id=$1
    `,
      [id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTeacher = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    let {
      name,
      email,
      phone,
      designation,
      dept,
      subjectsAssigned,
      assignedClass,
    } = req.body;

    await client.query("BEGIN");

    // 1 Update teacher details
    await client.query(
      `
      UPDATE teachers
      SET
        name=$1,
        phone=$2,
        designation=$3,
        department_id=(SELECT department_id FROM departments WHERE department_name=$4)
      WHERE teacher_id=$5
      `,
      [name, phone, designation, dept, id],
    );

    // 2 Update user email
    await client.query(
      `
      UPDATE users
      SET email=$1
      WHERE user_id=(SELECT user_id FROM teachers WHERE teacher_id=$2)
      `,
      [email, id],
    );

    // 3 Delete old mappings
    await client.query(`DELETE FROM teacher_subjects WHERE teacher_id=$1`, [id]);

    // 4 Remove duplicates
    subjectsAssigned = [...new Set(subjectsAssigned || [])];
    assignedClass = [...new Set(assignedClass || [])];

    // 5 Insert new mappings (subject x class)
    if (subjectsAssigned.length > 0 && assignedClass.length > 0) {
      const values = [];
      const params = [];
      let paramIndex = 1;

      for (let sub of subjectsAssigned) {
        for (let cls of assignedClass) {
          values.push(`(
            $${paramIndex++},
            (SELECT subject_id FROM subjects WHERE subject_code=$${paramIndex++}),
            (SELECT class_id FROM classes WHERE class_name=$${paramIndex++})
          )`);

          params.push(id, sub, cls);
        }
      }

      const insertQuery = `
        INSERT INTO teacher_subjects (teacher_id, subject_id, class_id)
        VALUES ${values.join(",")}
        ON CONFLICT (teacher_id, subject_id, class_id) DO NOTHING
      `;

      await client.query(insertQuery, params);
    }

    await client.query("COMMIT");
    res.json({ message: "Teacher updated successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Update Teacher Error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

export const deleteTeacher = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const result = await client.query(
      `SELECT user_id FROM teachers WHERE teacher_id=$1`,
      [id],
    );

    const user_id = result.rows[0].user_id;

    await client.query(`DELETE FROM teachers WHERE teacher_id=$1`, [id]);

    await client.query(`DELETE FROM users WHERE user_id=$1`, [user_id]);

    await client.query("COMMIT");

    res.json({ message: "Teacher deleted" });
  } catch (error) {
    await client.query("ROLLBACK");

    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

export const getTeacherAssignments = async (req, res) => {
  try {
    const userId = req.user.user_id;
    // get teacher_id
    const teacher = await pool.query(
      `SELECT teacher_id FROM teachers WHERE user_id=$1`,
      [userId]
    );

    if (teacher.rows.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const teacherId = teacher.rows[0].teacher_id;

    const result = await pool.query(
      `
      SELECT 
        ts.subject_id,
        s.subject_name AS subject_name,
        s.subject_code AS subject_code,
        ts.class_id,
        c.class_name AS class_name,
        s.semester
      FROM teacher_subjects ts
      JOIN subjects s ON ts.subject_id = s.subject_id
      JOIN classes c ON ts.class_id = c.class_id
      WHERE ts.teacher_id = $1
      `,
      [teacherId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};