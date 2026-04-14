import pool from "../config/db.js";
import ExcelJS from "exceljs";

const getMonthsList = (period) => {
  if (period === "Even (Jan-Jun)") {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  }
  return ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
};

const monthToNumber = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

export const getMonthlySummaryReport = async (req, res) => {
  try {
    const { department_id, semester, period } = req.query;

    if (!department_id || !semester || !period) {
      return res.status(400).json({ message: "Missing filters" });
    }

    const months = getMonthsList(period);

    const totalStudentsResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM students
      WHERE department_id = $1 AND semester = $2
      `,
      [department_id, semester],
    );

    const totalStudents = Number(totalStudentsResult.rows[0].total);

    const year = new Date().getFullYear();

    const reportData = [];

    for (let m of months) {
      const monthNum = monthToNumber[m];

      const monthDate = `${year}-${monthNum}-01`;

      const result = await pool.query(
        `
        SELECT 
          st.student_id,

          CASE 
            WHEN COUNT(ar.attendance_id) = 0 THEN 0
            ELSE ROUND(
              (SUM(CASE WHEN ar.status='present' THEN 1 ELSE 0 END) * 100.0)
              / COUNT(ar.attendance_id),
              2
            )
          END AS percentage

        FROM students st
        JOIN student_subjects ss ON ss.student_id = st.student_id
        JOIN subjects sub ON sub.subject_id = ss.subject_id

        JOIN attendance_sessions ses 
          ON ses.subject_id = sub.subject_id

        LEFT JOIN attendance_records ar
          ON ar.session_id = ses.session_id
          AND ar.student_id = st.student_id

        WHERE st.department_id = $1
          AND st.semester = $2
          AND DATE_TRUNC('month', ses.session_date) = DATE_TRUNC('month', $3::date)

        GROUP BY st.student_id
        `,
        [department_id, semester, monthDate],
      );

      const rows = result.rows;

      let eligible = 0;
      let sumAttendance = 0;

      rows.forEach((r) => {
        const perc = Number(r.percentage);
        sumAttendance += perc;
        if (perc >= 75) eligible++;
      });

      const avgAttendance =
        rows.length === 0 ? 0 : Math.round(sumAttendance / rows.length);

      reportData.push({
        month: m,
        total: totalStudents,
        eligible: eligible,
        notEligible: totalStudents - eligible,
        avgAttendance,
      });
    }

    const currentMonth = new Date().getMonth() + 1;
    const filteredReport = reportData.filter((r) => {
      const mn = Number(monthToNumber[r.month]);
      return mn < currentMonth;
    });

    res.json(filteredReport);
  } catch (err) {
    console.error("Error fetching monthly summary:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// export const exportMonthlyExcelReport = async (req, res) => {
//   try {
//     const { department_id, semester, month } = req.query;

//     if (!department_id || !semester || !month) {
//       return res.status(400).json({ message: "Missing filters" });
//     }

//     const year = new Date().getFullYear();
//     const monthDate = `${year}-${month}-01`;

//     const currentMonth = new Date().getMonth() + 1;
//     if (Number(month) >= currentMonth) {
//       return res.status(400).json({
//         message: "Report not available yet. Try after next month starts.",
//       });
//     }

//     // 1) Get all subjects for that department + semester
//     const subjectsResult = await pool.query(
//       `
//       SELECT s.subject_id, s.subject_code, s.subject_name
//       FROM subjects s
//       JOIN subject_departments sd 
//         ON sd.subject_id = s.subject_id
//       WHERE sd.department_id = $1
//         AND s.semester = $2
//       ORDER BY s.subject_code
//       `,
//       [department_id, semester]
//     );

//     const subjects = subjectsResult.rows;

//     if (subjects.length === 0) {
//       return res.status(404).json({ message: "No subjects found" });
//     }

//     // 2) Get all classes under this department
//     const classResult = await pool.query(
//       `
//       SELECT class_id, class_name
//       FROM classes
//       WHERE department_id = $1
//       ORDER BY class_name
//       `,
//       [department_id]
//     );

//     const classes = classResult.rows;

//     if (classes.length === 0) {
//       return res.status(404).json({ message: "No classes found" });
//     }

//     const workbook = new ExcelJS.Workbook();

//     // 3) Loop through each class and create separate sheet
//     for (const cls of classes) {
//       const class_id = cls.class_id;
//       const class_name = cls.class_name;

//       // Fetch students of this class
//       const studentsResult = await pool.query(
//         `
//         SELECT student_id, name
//         FROM students
//         WHERE department_id = $1
//           AND semester = $2
//           AND class_id = $3
//         ORDER BY name
//         `,
//         [department_id, semester, class_id]
//       );

//       const students = studentsResult.rows;

//       // If no students in class, skip sheet
//       if (students.length === 0) continue;

//       // Total conducted sessions per subject for this class
//       const conductedResult = await pool.query(
//         `
//         SELECT ses.subject_id, COUNT(*) AS total_conducted
//         FROM attendance_sessions ses
//         WHERE ses.subject_id = ANY($1::int[])
//           AND ses.class_id = $2
//           AND DATE_TRUNC('month', ses.session_date) = DATE_TRUNC('month', $3::date)
//         GROUP BY ses.subject_id
//         `,
//         [subjects.map((s) => s.subject_id), class_id, monthDate]
//       );

//       const conductedMap = {};
//       conductedResult.rows.forEach((r) => {
//         conductedMap[r.subject_id] = Number(r.total_conducted);
//       });

//       // Attendance per student per subject
//       const attendanceResult = await pool.query(
//         `
//         SELECT 
//           st.student_id,
//           ses.subject_id,
//           COUNT(ar.attendance_id) FILTER (WHERE ar.status = 'present') AS attended
//         FROM students st

//         JOIN student_subjects ss 
//           ON ss.student_id = st.student_id

//         JOIN attendance_sessions ses 
//           ON ses.subject_id = ss.subject_id
//           AND ses.class_id = st.class_id

//         LEFT JOIN attendance_records ar
//           ON ar.session_id = ses.session_id
//           AND ar.student_id = st.student_id

//         WHERE st.department_id = $1
//           AND st.semester = $2
//           AND st.class_id = $3
//           AND DATE_TRUNC('month', ses.session_date) = DATE_TRUNC('month', $4::date)

//         GROUP BY st.student_id, ses.subject_id
//         `,
//         [department_id, semester, class_id, monthDate]
//       );

//       const attendanceMap = {};
//       attendanceResult.rows.forEach((r) => {
//         const key = `${r.student_id}_${r.subject_id}`;
//         attendanceMap[key] = Number(r.attended);
//       });

//       // Create sheet
//       const sheet = workbook.addWorksheet(class_name);

//       // Header Row 1
//       const headerRow1 = ["Regd No.", "Student Name"];
//       subjects.forEach((s) =>
//         headerRow1.push(`${s.subject_code} (${s.subject_name})`)
//       );
//       sheet.addRow(headerRow1);

//       // Header Row 2
//       const headerRow2 = ["", "Total Conducted"];
//       subjects.forEach((s) => {
//         headerRow2.push(conductedMap[s.subject_id] || 0);
//       });
//       sheet.addRow(headerRow2);

//       // Student Rows
//       students.forEach((st) => {
//         const row = [st.student_id, st.name];

//         subjects.forEach((sub) => {
//           const key = `${st.student_id}_${sub.subject_id}`;
//           row.push(attendanceMap[key] || 0);
//         });

//         sheet.addRow(row);
//       });

//       // Styling
//       sheet.getRow(1).height = 25;
//       sheet.getRow(2).height = 22;

//       sheet.columns.forEach((col, index) => {
//         if (index === 1) col.width = 26;
//         else if (index === 2) col.width = 33;
//         else col.width = 28;
//       });

//       const header1 = sheet.getRow(1);
//       header1.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
//       header1.alignment = {
//         vertical: "middle",
//         horizontal: "center",
//         wrapText: true,
//       };
//       header1.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "1E40AF" },
//       };

//       const header2 = sheet.getRow(2);
//       header2.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
//       header2.alignment = {
//         vertical: "middle",
//         horizontal: "center",
//         wrapText: true,
//       };
//       header2.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "2563EB" },
//       };

//       sheet.eachRow((row, rowNumber) => {
//         row.eachCell((cell) => {
//           cell.alignment = {
//             vertical: "middle",
//             horizontal: "center",
//             wrapText: true,
//           };

//           cell.border = {
//             top: { style: "thin" },
//             left: { style: "thin" },
//             bottom: { style: "thin" },
//             right: { style: "thin" },
//           };
//         });

//         if (rowNumber >= 3) {
//           row.fill = {
//             type: "pattern",
//             pattern: "solid",
//             fgColor: { argb: rowNumber % 2 === 0 ? "F1F5F9" : "FFFFFF" },
//           };
//         }
//       });

//       sheet.getColumn(2).alignment = {
//         horizontal: "left",
//         vertical: "middle",
//         wrapText: true,
//       };

//       sheet.views = [{ state: "frozen", ySplit: 2 }];
//     }

//     if (workbook.worksheets.length === 0) {
//       return res.status(404).json({
//         message: "No student data found for any class.",
//       });
//     }

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=Monthly_Report_${month}.xlsx`
//     );

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (err) {
//     console.error("Error exporting excel:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const exportMonthlyExcelReport = async (req, res) => {
  try {
    const { department_id, semester, month } = req.query;

    if (!department_id || !semester || !month) {
      return res.status(400).json({ message: "Missing filters" });
    }

    const year = new Date().getFullYear();
    const monthDate = `${year}-${month}-01`;

    const currentMonth = new Date().getMonth() + 1;
    if (Number(month) >= currentMonth) {
      return res.status(400).json({
        message: "Report not available yet. Try after next month starts.",
      });
    }

    const subjectsResult = await pool.query(
      `
      SELECT s.subject_id, s.subject_code, s.subject_name
      FROM subjects s
      JOIN subject_departments sd 
        ON sd.subject_id = s.subject_id
      WHERE sd.department_id = $1
        AND s.semester = $2
      ORDER BY s.subject_code
      `,
      [department_id, semester],
    );

    const subjects = subjectsResult.rows;

    if (subjects.length === 0) {
      return res.status(404).json({ message: "No subjects found" });
    }

    const classResult = await pool.query(
      `
      SELECT class_id, class_name
      FROM classes
      WHERE department_id = $1
      ORDER BY class_name
      `,
      [department_id],
    );

    const classes = classResult.rows;

    if (classes.length === 0) {
      return res.status(404).json({ message: "No classes found" });
    }

    const workbook = new ExcelJS.Workbook();

    for (const cls of classes) {
      const class_id = cls.class_id;
      const class_name = cls.class_name;

      const studentsResult = await pool.query(
        `
        SELECT student_id, name
        FROM students
        WHERE department_id = $1
          AND semester = $2
          AND class_id = $3
        ORDER BY name
        `,
        [department_id, semester, class_id],
      );

      const students = studentsResult.rows;

      if (students.length === 0) continue;

      const conductedResult = await pool.query(
        `
        SELECT ses.subject_id, COUNT(*) AS total_conducted
        FROM attendance_sessions ses
        WHERE ses.subject_id = ANY($1::int[])
          AND ses.class_id = $2
          AND DATE_TRUNC('month', ses.session_date) = DATE_TRUNC('month', $3::date)
        GROUP BY ses.subject_id
        `,
        [subjects.map((s) => s.subject_id), class_id, monthDate],
      );

      const conductedMap = {};
      conductedResult.rows.forEach((r) => {
        conductedMap[r.subject_id] = Number(r.total_conducted);
      });

      const attendanceResult = await pool.query(
        `
        SELECT 
          st.student_id,
          ses.subject_id,
          COUNT(ar.attendance_id) FILTER (WHERE ar.status = 'present') AS attended
        FROM students st

        JOIN student_subjects ss 
          ON ss.student_id = st.student_id

        JOIN attendance_sessions ses 
          ON ses.subject_id = ss.subject_id
          AND ses.class_id = st.class_id

        LEFT JOIN attendance_records ar
          ON ar.session_id = ses.session_id
          AND ar.student_id = st.student_id

        WHERE st.department_id = $1
          AND st.semester = $2
          AND st.class_id = $3
          AND DATE_TRUNC('month', ses.session_date) = DATE_TRUNC('month', $4::date)

        GROUP BY st.student_id, ses.subject_id
        `,
        [department_id, semester, class_id, monthDate],
      );

      const attendanceMap = {};
      attendanceResult.rows.forEach((r) => {
        const key = `${r.student_id}_${r.subject_id}`;
        attendanceMap[key] = Number(r.attended);
      });

      const sheet = workbook.addWorksheet(class_name);

      const headerRow1 = ["Regd No.", "Student Name"];
      subjects.forEach((s) => {
        headerRow1.push(`${s.subject_code} (${s.subject_name})`);
        headerRow1.push("Attendance %");
      });
      sheet.addRow(headerRow1);

      const headerRow2 = ["", "Total Conducted"];
      subjects.forEach((s) => {
        headerRow2.push(conductedMap[s.subject_id] || 0);
        headerRow2.push(""); 
      });
      sheet.addRow(headerRow2);


      students.forEach((st) => {
        const row = [st.student_id, st.name];

        subjects.forEach((sub) => {
          const key = `${st.student_id}_${sub.subject_id}`;

          const attended = attendanceMap[key] || 0;
          const conducted = conductedMap[sub.subject_id] || 0;

          row.push(attended);

          if (conducted === 0) {
            row.push("N/A");
          } else {
            const percentage = Math.round((attended / conducted) * 100);
            row.push(`${percentage}%`);
          }
        });

        sheet.addRow(row);
      });

      sheet.getRow(1).height = 25;
      sheet.getRow(2).height = 22;

      sheet.columns.forEach((col, index) => {
        if (index === 1) col.width = 26; 
        else if (index === 2) col.width = 33; 
        else col.width = 28;
      });

      const header1 = sheet.getRow(1);
      header1.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
      header1.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      header1.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E40AF" },
      };

      const header2 = sheet.getRow(2);
      header2.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      header2.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      header2.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2563EB" },
      };

      sheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        if (rowNumber >= 3) {
          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: rowNumber % 2 === 0 ? "F1F5F9" : "FFFFFF" },
          };
        }
      });

      sheet.getColumn(2).alignment = {
        horizontal: "left",
        vertical: "middle",
        wrapText: true,
      };

      for (let r = 3; r <= sheet.rowCount; r++) {
        const row = sheet.getRow(r);

        for (let c = 4; c <= row.cellCount; c += 2) {
          const cell = row.getCell(c);

          if (typeof cell.value === "string" && cell.value.endsWith("%")) {
            const val = Number(cell.value.replace("%", ""));

            if (val < 75) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FCA5A5" },
              };

              cell.font = {
                bold: true,
                color: { argb: "7F1D1D" },
              };
            }
          }
        }
      }

      sheet.views = [{ state: "frozen", ySplit: 2 }];
    }

    if (workbook.worksheets.length === 0) {
      return res.status(404).json({
        message: "No student data found for any class.",
      });
    }

    const deptRes = await pool.query(
      `
      SELECT department_name
      FROM departments
      WHERE department_id = $1
  `,
      [department_id],
    );

    if (!deptRes.rows.length) {
      return res.status(404).json({ message: "Department not found" });
    }

    const deptName = deptRes.rows[0].department_name
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_");

    const semName = `${semester}Sem`.replace(/\s+/g, "");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Monthly_Report_${month}_${deptName}_${semName}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error exporting excel:", err);
    res.status(500).json({ message: "Server error" });
  }
};
