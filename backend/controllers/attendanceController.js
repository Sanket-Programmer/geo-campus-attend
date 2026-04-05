import pool from "../config/db.js";

export const startSession = async (req, res) => {
  try {
    const {
      subject_id,
      class_id,
      latitude,
      longitude,
      radius,
      geolocation_enabled,
    } = req.body;

    const user_id = req.user.user_id;

    const teacherRes = await pool.query(
      `SELECT teacher_id FROM teachers WHERE user_id = $1`,
      [user_id],
    );

    if (teacherRes.rows.length === 0) {
      return res.status(400).json({
        message: "Teacher not found for this user_id",
      });
    }

    const teacher_id = teacherRes.rows[0].teacher_id;

    const result = await pool.query(
      `INSERT INTO attendance_sessions
      (teacher_id, subject_id, class_id, session_date, start_time, latitude, longitude, radius, geolocation_enabled)
      VALUES ($1,$2,$3,CURRENT_DATE AT TIME ZONE 'Asia/Kolkata',CURRENT_TIMESTAMP,$4,$5,$6,$7)
      RETURNING *`,
      [
        teacher_id,
        subject_id,
        class_id,
        latitude,
        longitude,
        radius || 50,
        geolocation_enabled,
      ],
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getActiveSession = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.session_id,
        s.start_time,
        s.latitude,
        s.longitude,
        s.radius,
        s.geolocation_enabled,

        sub.subject_name,
        sub.subject_code,

        c.class_name,

        t.teacher_id,
        u.email AS teacher_email,
        t.name AS teacher_name

      FROM attendance_sessions s
      JOIN subjects sub ON s.subject_id = sub.subject_id
      JOIN classes c ON s.class_id = c.class_id
      JOIN teachers t ON s.teacher_id = t.teacher_id
      JOIN users u ON t.user_id = u.user_id

      WHERE s.status='active' AND s.geolocation_enabled = true
      ORDER BY s.start_time DESC
      LIMIT 1
    `);

    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const markAttendance = async (req, res) => {
  try {
    const { session_id } = req.body;
    const user_id = req.user.user_id;

    const studentRes = await pool.query(
      `SELECT student_id FROM students WHERE user_id = $1`,
      [user_id],
    );

    const student_id = studentRes.rows[0].student_id;

    const already = await pool.query(
      `SELECT * FROM attendance_records 
       WHERE session_id = $1 AND student_id = $2`,
      [session_id, student_id],
    );

    if (already.rows.length > 0) {
      return res.status(400).json({
        message: "Attendance already marked",
      });
    }

    await pool.query(
      `INSERT INTO attendance_records
       (session_id, student_id, status, method)
       VALUES ($1,$2,'present','geolocation')`,
      [session_id, student_id,],
    );

    res.json({ message: "Attendance marked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSessionStudents = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await pool.query(
      `SELECT
         s.student_id AS id,
         s.name,
         ar.status,
         ar.marked_time AS time
       FROM attendance_records ar
       JOIN students s ON ar.student_id = s.student_id
       WHERE ar.session_id = $1`,
      [sessionId],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sessionRes = await pool.query(
      `SELECT class_id, subject_id, geolocation_enabled
       FROM attendance_sessions 
       WHERE session_id = $1`,
      [sessionId],
    );

    if (!sessionRes.rows.length) {
      return res.status(404).json({ message: "Session not found" });
    }

    const { class_id, subject_id, geolocation_enabled } = sessionRes.rows[0];

    const sessionMethod = geolocation_enabled ? "geolocation" : "manual";

    const subjectRes = await pool.query(
      `SELECT semester 
       FROM subjects 
       WHERE subject_id = $1`,
      [subject_id],
    );

    if (!subjectRes.rows.length) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const semester = subjectRes.rows[0].semester;

    await pool.query(
      `INSERT INTO attendance_records (session_id, student_id, status, method)
       SELECT 
         $1,
         st.student_id,
         'absent',
         $4
       FROM students st
       WHERE st.class_id = $2
       AND st.semester = $3
       AND NOT EXISTS (
         SELECT 1 
         FROM attendance_records ar
         WHERE ar.session_id = $1
         AND ar.student_id = st.student_id
       )`,
      [sessionId, class_id, semester, sessionMethod],
    );

    const updateRes = await pool.query(
      `UPDATE attendance_sessions
       SET status = 'completed',
           end_time = NOW()
       WHERE session_id = $1
       RETURNING *`,
      [sessionId],
    );

    res.json({
      message: "Session ended & attendance finalized",
      session: updateRes.rows[0],
    });
  } catch (err) {
    console.error("End Session Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const editAttendance = async (req, res) => {
  try {
    const { attendance_id, status } = req.body;

    const user_id = req.user.user_id;

    const teacherRes = await pool.query(
      `SELECT teacher_id FROM teachers WHERE user_id=$1`,
      [user_id],
    );

    if (!teacherRes.rows.length) {
      return res.status(400).json({ message: "Teacher not found" });
    }

    const old = await pool.query(
      `SELECT status FROM attendance_records WHERE attendance_id=$1`,
      [attendance_id],
    );

    if (!old.rows.length) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    await pool.query(
      `UPDATE attendance_records
       SET status=$1,
           edited=true,
           edited_by=$2,
           edited_at=NOW()
       WHERE attendance_id=$3`,
      [status, user_id, attendance_id],
    );

    await pool.query(
      `INSERT INTO attendance_edit_history
       (attendance_id, old_status, new_status, edited_by)
       VALUES ($1,$2,$3,$4)`,
      [attendance_id, old.rows[0].status, status, user_id],
    );

    res.json({ message: "Attendance updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSessionHistory = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const teacherRes = await pool.query(
      `SELECT teacher_id FROM teachers WHERE user_id = $1`,
      [user_id],
    );

    if (!teacherRes.rows.length) {
      return res.status(400).json({ message: "Teacher not found" });
    }

    const teacher_id = teacherRes.rows[0].teacher_id;

    const result = await pool.query(
      `SELECT 
         s.session_id AS id,
         sub.subject_name AS subject,
         sub.subject_code AS code,
         c.class_name AS class_name, 
         s.session_date AS date,
         s.start_time,
         s.end_time,
         s.geolocation_enabled AS geo,

         COUNT(ar.*) FILTER (WHERE ar.status='present') AS present,

         (
           SELECT COUNT(*) 
           FROM students st
           WHERE st.class_id = s.class_id
           AND st.semester = sub.semester
         ) AS total

       FROM attendance_sessions s
       JOIN subjects sub ON s.subject_id = sub.subject_id
       JOIN classes c ON s.class_id = c.class_id 
       LEFT JOIN attendance_records ar 
         ON s.session_id = ar.session_id

       WHERE s.teacher_id = $1

       GROUP BY 
         s.session_id, 
         sub.subject_name, 
         s.class_id, 
         c.class_name, 
         sub.semester,
         sub.subject_code

       ORDER BY s.start_time DESC`,
      [teacher_id],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSessionDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const sessionRes = await pool.query(
      `SELECT 
         s.session_id AS id,
         c.class_name
       FROM attendance_sessions s
       JOIN classes c ON s.class_id = c.class_id
       WHERE s.session_id = $1`,
      [id],
    );

    const students = await pool.query(
      `SELECT
         ar.attendance_id,
         s.student_id as id,
         s.name,
         ar.status,
         ar.marked_time AS time
       FROM attendance_records ar
       JOIN students s ON ar.student_id = s.student_id
       WHERE ar.session_id = $1`,
      [id],
    );

    res.json({
      id: id,
      class_name: sessionRes.rows[0]?.class_name || "N/A",
      students: students.rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markManualBulk = async (req, res) => {
  try {
    const { session_id, records } = req.body;

    for (const r of records) {
      await pool.query(
        `INSERT INTO attendance_records
        (session_id, student_id, status, method)
        VALUES ($1,$2,$3,'manual')
        ON CONFLICT (session_id, student_id)
        DO UPDATE SET status = EXCLUDED.status`,
        [session_id, r.student_id, r.status],
      );
    }

    res.json({ message: "Manual attendance saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const verifyAttendance = async (req, res) => {
  try {
    const { session_id, latitude, longitude } = req.body;
    const user_id = req.user.user_id;

    const studentRes = await pool.query(
      `SELECT student_id, class_id, semester 
       FROM students WHERE user_id = $1`,
      [user_id],
    );

    if (!studentRes.rows.length) {
      return res.status(400).json({ message: "Student not found" });
    }

    const student = studentRes.rows[0];

    const sessionRes = await pool.query(
      `SELECT * FROM attendance_sessions WHERE session_id = $1`,
      [session_id],
    );

    if (!sessionRes.rows.length) {
      return res.status(404).json({ message: "Session not found" });
    }

    const session = sessionRes.rows[0];

    if (student.class_id !== session.class_id) {
      return res.status(403).json({ message: "Wrong class" });
    }

    const subjectRes = await pool.query(
      `SELECT semester FROM subjects WHERE subject_id = $1`,
      [session.subject_id],
    );

    const subjectSemester = subjectRes.rows[0].semester;

    if (student.semester !== subjectSemester) {
      return res.status(403).json({ message: "Wrong semester" });
    }

    let distance = 0;
    if (session.geolocation_enabled) {
      distance = getDistance(
        session.latitude,
        session.longitude,
        latitude,
        longitude,
      );

      if (distance > session.radius) {
        return res.status(400).json({
          message: "Outside allowed range",
          distance,
        });
      }
    }

    console.log("Student position:", latitude, longitude);
    console.log("Session position:", session.latitude, session.longitude);
    console.log(
      "Distance:",
      getDistance(session.latitude, session.longitude, latitude, longitude),
    );


    res.json({
      message: "Verified",
      distance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkAttendanceStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const user_id = req.user.user_id;

    const studentRes = await pool.query(
      `SELECT student_id FROM students WHERE user_id=$1`,
      [user_id],
    );

    const student_id = studentRes.rows[0].student_id;

    const result = await pool.query(
      `SELECT * FROM attendance_records 
       WHERE session_id=$1 
       AND student_id=$2 
       AND status='present'`,
      [sessionId, student_id],
    );

    res.json({
      marked: result.rows.length > 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStudentAttendanceHistory = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { subject = "all", month, year } = req.query;

    const studentRes = await pool.query(
      `SELECT student_id FROM students WHERE user_id = $1`,
      [user_id],
    );

    if (!studentRes.rows.length) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student_id = studentRes.rows[0].student_id;

    const currentDate = new Date();
    const selectedMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const selectedYear = year ? parseInt(year) : currentDate.getFullYear();

    let query = `
      SELECT 
        ar.attendance_id,
        ar.status,
        ar.method,
        ar.marked_time,
        ar.edited,
        sub.subject_code,
        sub.subject_name
      FROM attendance_records ar
      JOIN attendance_sessions ats ON ar.session_id = ats.session_id
      JOIN subjects sub ON ats.subject_id = sub.subject_id
      WHERE ar.student_id = $1
      AND EXTRACT(MONTH FROM ar.marked_time) = $2
      AND EXTRACT(YEAR FROM ar.marked_time) = $3
    `;

    let values = [student_id, selectedMonth, selectedYear];

    if (subject !== "all") {
      query += ` AND sub.subject_code = $4 `;
      values.push(subject);
    }

    query += ` ORDER BY ar.marked_time DESC LIMIT 100`;

    const historyRes = await pool.query(query, values);

    res.json(historyRes.rows);
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentSubjectWiseAttendance = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const studentRes = await pool.query(
      `SELECT student_id, class_id FROM students WHERE user_id = $1`,
      [user_id],
    );

    if (!studentRes.rows.length) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student_id = studentRes.rows[0].student_id;
    const class_id = studentRes.rows[0].class_id;

    const result = await pool.query(
      `
      SELECT 
        sub.subject_id,
        sub.subject_code,
        sub.subject_name,

        COUNT(DISTINCT ats.session_id) AS total_classes,

        COUNT(CASE WHEN ar.status = 'present' THEN 1 END) AS attended_classes,

        COALESCE(
          ROUND(
            (COUNT(CASE WHEN ar.status = 'present' THEN 1 END)::decimal
            / NULLIF(COUNT(DISTINCT ats.session_id), 0)) * 100
          , 2),
          0
        ) AS attendance_percentage

      FROM student_subjects ss
      JOIN subjects sub 
        ON ss.subject_id = sub.subject_id

      LEFT JOIN attendance_sessions ats 
        ON ats.subject_id = sub.subject_id
        AND ats.status = 'completed'
        AND ats.class_id = $2  

      LEFT JOIN attendance_records ar
        ON ar.session_id = ats.session_id
        AND ar.student_id = ss.student_id

      WHERE ss.student_id = $1

      GROUP BY sub.subject_id, sub.subject_code, sub.subject_name
      ORDER BY sub.subject_code ASC
      `,
      [student_id, class_id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching subject wise attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentMonthlyAttendance = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const currentYear = new Date().getFullYear();

    const studentRes = await pool.query(
      `SELECT student_id FROM students WHERE user_id = $1`,
      [user_id],
    );

    if (!studentRes.rows.length) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student_id = studentRes.rows[0].student_id;

    const result = await pool.query(
      `
      SELECT 
        EXTRACT(MONTH FROM ats.end_time) AS month_number,
        COUNT(CASE WHEN ar.status = 'present' THEN 1 END) AS present,
        COUNT(CASE WHEN ar.status = 'absent' THEN 1 END) AS absent
      FROM attendance_records ar
      JOIN attendance_sessions ats ON ar.session_id = ats.session_id
      WHERE ar.student_id = $1
      AND ats.status = 'completed'
      AND EXTRACT(YEAR FROM ats.end_time) = $2
      GROUP BY month_number
      ORDER BY month_number ASC
      `,
      [student_id, currentYear],
    );

    const monthMap = {};
    result.rows.forEach((row) => {
      monthMap[Number(row.month_number)] = {
        present: Number(row.present),
        absent: Number(row.absent),
      };
    });

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const finalData = months.map((monthName, index) => {
      const monthNumber = index + 1;

      const present = monthMap[monthNumber]?.present || 0;
      const absent = monthMap[monthNumber]?.absent || 0;

      const total_classes = present + absent;

      const percentage =
        total_classes === 0 ? 0 : ((present / total_classes) * 100).toFixed(2);

      return {
        month: monthName,
        present,
        absent,
        total_classes,
        percentage: Number(percentage),
      };
    });

    res.json(finalData);
  } catch (err) {
    console.error("Error fetching monthly attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTeacherEligibilityReport = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { class_id = "all", subject_id = "all" } = req.query;

    const teacherRes = await pool.query(
      `SELECT teacher_id FROM teachers WHERE user_id = $1`,
      [user_id]
    );

    if (!teacherRes.rows.length) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const teacher_id = teacherRes.rows[0].teacher_id;

    let query = `
      SELECT 
        st.student_id,
        st.name AS student_name,

        COUNT(ar.attendance_id) AS total_conducted,
        COUNT(CASE WHEN ar.status = 'present' THEN 1 END) AS total_present,
        COUNT(CASE WHEN ar.status = 'absent' THEN 1 END) AS total_absent,

        COALESCE(
          ROUND(
            (COUNT(CASE WHEN ar.status = 'present' THEN 1 END)::decimal 
            / NULLIF(COUNT(ar.attendance_id), 0)) * 100
          , 2),
          0
        ) AS overall_percentage

      FROM students st

      JOIN attendance_records ar ON ar.student_id = st.student_id
      JOIN attendance_sessions ats ON ats.session_id = ar.session_id
      JOIN subjects sub ON sub.subject_id = ats.subject_id

      WHERE ats.status = 'completed'
      AND ats.teacher_id = $1
    `;

    let values = [teacher_id];
    let paramIndex = 2;

    if (class_id !== "all") {
      query += ` AND st.class_id = $${paramIndex}`;
      values.push(class_id);
      paramIndex++;
    }

    if (subject_id !== "all") {
      query += ` AND ats.subject_id = $${paramIndex}`;
      values.push(subject_id);
      paramIndex++;
    }

    query += `
      GROUP BY st.student_id, st.name
      ORDER BY st.name ASC
    `;

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching teacher eligibility report:", err);
    res.status(500).json({ message: err.message });
  }
};
