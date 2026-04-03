import pool from "../config/db.js";

export const getSubjects = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.subject_id AS id,
        s.subject_code AS code,
        s.subject_name AS name,
        s.semester,
        s.credits,
        ARRAY_AGG(d.department_name) AS departments,
        ARRAY_AGG(DISTINCT d.department_id)
        FILTER (WHERE d.department_id IS NOT NULL)
        AS department_ids
      FROM subjects s
      LEFT JOIN subject_departments sd ON s.subject_id = sd.subject_id
      LEFT JOIN departments d ON sd.department_id = d.department_id
      GROUP BY s.subject_id
      ORDER BY s.subject_code
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addSubject = async (req, res) => {
  try {
    const { code, name, semester, credits, departments } = req.body;
    // 1. Insert subject
    const subjectResult = await pool.query(
      `INSERT INTO subjects (subject_code, subject_name, semester, credits)
       VALUES ($1, $2, $3, $4)
       RETURNING subject_id`,
      [code, name, semester, credits],
    );

    const subjectId = subjectResult.rows[0].subject_id;

    // 2. Insert department mappings
    for (let dept of departments) {
      await pool.query(
        `INSERT INTO subject_departments (subject_id, department_id)
         VALUES (
           $1,
           (SELECT department_id FROM departments WHERE department_name=$2)
         )`,
        [subjectId, dept],
      );
    }

    res.status(201).json({ message: "Subject added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, semester, credits, departments } = req.body;

    // 1. Update subject
    await pool.query(
      `UPDATE subjects
       SET subject_code=$1, subject_name=$2, semester=$3, credits=$4
       WHERE subject_id=$5`,
      [code, name, semester, credits, id],
    );

    // 2. Delete old mappings
    await pool.query(`DELETE FROM subject_departments WHERE subject_id=$1`, [
      id,
    ]);

    // 3. Insert new mappings (IDs directly)
    if (departments && departments.length > 0) {
      const values = departments.map((_, i) => `($1, $${i + 2})`).join(",");

      await pool.query(
        `INSERT INTO subject_departments (subject_id, department_id)
         VALUES ${values}`,
        [id, ...departments],
      );
    }

    res.json({ message: "Subject updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM subjects
      WHERE subject_id=$1
    `,
      [id],
    );

    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSubjectsByDepartment = async (req, res) => {
  try {
    const dept = req.params.dept;          
    const semester = req.query.semester;  

    const result = await pool.query(
      `SELECT s.subject_code , s.subject_name
        FROM subjects s
        JOIN subject_departments sd 
          ON sd.subject_id = s.subject_id
        JOIN departments d 
          ON d.department_id = sd.department_id
        WHERE d.department_name = $1
        AND s.semester = $2;`,
      [dept, semester]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching subjects" });
  }
};

export const getSubjectsBySchoolFromDept = async (req, res) => {
  try {
    const { dept } = req.params;

    const result = await pool.query(
      `
      SELECT DISTINCT s.subject_id, s.subject_code, s.subject_name
      FROM subjects s
      JOIN subject_departments sd ON sd.subject_id = s.subject_id
      JOIN departments d ON d.department_id = sd.department_id
      WHERE d.school_name = (
        SELECT school_name FROM departments WHERE department_name = $1
      )
      ORDER BY s.subject_code ASC
      `,
      [dept],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching subjects by school:", err);
    res.status(500).json({ message: "Server error" });
  }
};
