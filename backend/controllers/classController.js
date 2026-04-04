import pool from "../config/db.js";

export const addClass = async (req, res) => {
  try {
    const { name, department_id, school } = req.body;

    const result = await pool.query(
      `
      INSERT INTO classes (class_name, department_id, school_name)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, department_id, school],
    );

    res.status(201).json({
      message: "Class added successfully",
      class: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department_id, school } = req.body;

    const result = await pool.query(
      `
      UPDATE classes
      SET
        class_name = $1,
        department_id = $2,
        school_name = $3
      WHERE class_id = $4
      RETURNING *
      `,
      [name, department_id, school, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({
      message: "Class updated successfully",
      class: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const studentCheck = await pool.query(
      `SELECT COUNT(*) FROM students WHERE class_id=$1`,
      [id],
    );

    if (studentCheck.rows[0].count > 0) {
      return res.status(400).json({
        message: "Cannot delete class. Students are assigned to this class.",
      });
    }

    await pool.query(`DELETE FROM classes WHERE class_id=$1`, [id]);

    res.json({
      message: "Class deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClasses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.class_id AS id,
        c.class_name AS name,
        c.department_id,
        d.department_name AS department,
        c.school_name AS school,

        COUNT(st.student_id) AS total_students

      FROM classes c
      LEFT JOIN departments d ON d.department_id = c.department_id
      LEFT JOIN students st ON st.class_id = c.class_id

      GROUP BY c.class_id, c.class_name,d.department_id, d.department_name, c.school_name
      ORDER BY c.class_name ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching classes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClassesBySchoolFromDept = async (req, res) => {
  try {
    const { dept } = req.params;

    const result = await pool.query(
      `
      SELECT class_id, class_name
      FROM classes
      WHERE school_name = (
        SELECT school_name FROM departments WHERE department_name = $1
      )
      ORDER BY class_name ASC
      `,
      [dept],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching classes by school:", err);
    res.status(500).json({ message: "Server error" });
  }
};