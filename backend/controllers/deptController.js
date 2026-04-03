import pool from "../config/db.js";

export const getDepartmentDetails = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.department_id,
        d.department_name,
        d.school_name,

        COUNT(DISTINCT st.student_id) AS total_students,
        COUNT(DISTINCT t.teacher_id) AS total_teachers,
        COUNT(DISTINCT sd.subject_id) AS total_subjects,
        COUNT(DISTINCT c.class_id) AS total_classes

      FROM departments d

      LEFT JOIN students st ON st.department_id = d.department_id
      LEFT JOIN teachers t ON t.department_id = d.department_id
      LEFT JOIN subject_departments sd ON sd.department_id = d.department_id
      LEFT JOIN classes c ON c.department_id = d.department_id

      GROUP BY d.department_id, d.department_name, d.school_name
      ORDER BY d.department_name ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching department details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDepartmentsWithSubjects = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.department_id,
        d.department_name,
        d.school_name,

        s.subject_id,
        s.subject_code,
        s.subject_name,
        s.semester,
        s.credits

      FROM departments d
      LEFT JOIN subject_departments sd 
        ON sd.department_id = d.department_id
      LEFT JOIN subjects s 
        ON s.subject_id = sd.subject_id

      ORDER BY d.department_name ASC, s.subject_code ASC;
    `);

    const departmentsMap = {};

    result.rows.forEach((row) => {
      if (!departmentsMap[row.department_id]) {
        departmentsMap[row.department_id] = {
          department_id: row.department_id,
          department_name: row.department_name,
          school_name: row.school_name,
          subjects: [],
        };
      }

      // push subject only if exists
      if (row.subject_id) {
        departmentsMap[row.department_id].subjects.push({
          subject_id: row.subject_id,
          subject_code: row.subject_code,
          subject_name: row.subject_name,
          semester: row.semester,
          credits: row.credits,
        });
      }
    });

    res.json(Object.values(departmentsMap));
  } catch (err) {
    console.error("Error fetching departments with subjects:", err);
    res.status(500).json({ message: "Server error" });
  }
};