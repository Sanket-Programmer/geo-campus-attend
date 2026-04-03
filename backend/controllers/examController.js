import pool from "../config/db.js";

export const getEligibilityReport = async (req, res) => {
  try {
    const { department_id, subject_id } = req.query;

    if (!department_id || !subject_id) {
      return res.status(400).json({ message: "department_id and subject_id required" });
    }

    const result = await pool.query(
      `
      SELECT
        st.student_id,
        st.name AS student_name,
        d.department_name,

        COUNT(DISTINCT ses.session_id) AS total_classes,

        COUNT(DISTINCT CASE 
          WHEN ar.status = 'present' THEN ses.session_id
        END) AS total_present,

        CASE 
          WHEN COUNT(DISTINCT ses.session_id) = 0 THEN 0
          ELSE ROUND(
            (COUNT(DISTINCT CASE WHEN ar.status = 'present' THEN ses.session_id END) * 100.0)
            / COUNT(DISTINCT ses.session_id),
            2
          )
        END AS percentage,

        CASE 
          WHEN COUNT(DISTINCT ses.session_id) = 0 THEN 'not-eligible'
          WHEN ROUND(
            (COUNT(DISTINCT CASE WHEN ar.status = 'present' THEN ses.session_id END) * 100.0)
            / COUNT(DISTINCT ses.session_id),
            2
          ) >= 75 THEN 'eligible'
          ELSE 'not-eligible'
        END AS eligibility

      FROM students st
      JOIN departments d ON d.department_id = st.department_id

      -- only students registered for this subject
      JOIN student_subjects ss 
        ON ss.student_id = st.student_id 
        AND ss.subject_id = $2

      -- sessions for this subject in this department
      LEFT JOIN attendance_sessions ses
        ON ses.subject_id = $2
        AND ses.class_id = st.class_id

      -- attendance record for that session + student
      LEFT JOIN attendance_records ar
        ON ar.session_id = ses.session_id
        AND ar.student_id = st.student_id

      WHERE st.department_id = $1

      GROUP BY st.student_id, st.name, d.department_name
      ORDER BY st.name ASC;
      `,
      [department_id, subject_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching eligibility report:", err);
    res.status(500).json({ message: "Server error" });
  }
};

