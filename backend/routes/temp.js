// POST /events/:eventId/upload-csv - Upload CSV and update round results
// routes.post("/events/:eventId/upload-csv", async (req, res) => {
//   const client = await db.connect();

//   try {
//     const { eventId } = req.params;
//     const { csvData } = req.body;

//     if (!csvData || !Array.isArray(csvData)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid CSV data format",
//       });
//     }

//     // Extract registration numbers from CSV data
//     const registrationNumbers = csvData
//       .map((row) => {
//         if (typeof row === "string") return row.trim();
//         if (row.registration_number) return row.registration_number.trim();
//         if (row.reg_number) return row.reg_number.trim();
//         return null;
//       })
//       .filter(Boolean);

//     if (registrationNumbers.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No valid registration numbers found in CSV",
//       });
//     }

//     await client.query("BEGIN");

//     // Validate registration numbers against database
//     const validStudentsQuery = `
//       SELECT id, registration_number, offers_received
//       FROM students
//       WHERE registration_number = ANY($1::text[])
//     `;
//     const validResult = await client.query(validStudentsQuery, [
//       registrationNumbers,
//     ]);
//     const validStudents = validResult.rows;

//     const validRegistrationNumbers = validStudents.map(
//       (s) => s.registration_number
//     );
//     const invalidNumbers = registrationNumbers.filter(
//       (num) => !validRegistrationNumbers.includes(num)
//     );

//     if (invalidNumbers.length > 0) {
//       await client.query("ROLLBACK");
//       return res.status(400).json({
//         success: false,
//         message: "Invalid registration numbers found in CSV",
//         invalidNumbers,
//         validCount: validRegistrationNumbers.length,
//         invalidCount: invalidNumbers.length,
//       });
//     }

//     // Fetch event details to check if last round
//     const eventQuery = `
//       SELECT id, round_number, round_type, company_id, position_id
//       FROM events
//       WHERE id = $1
//     `;
//     const eventResult = await client.query(eventQuery, [eventId]);
//     if (eventResult.rows.length === 0) {
//       await client.query("ROLLBACK");
//       return res
//         .status(404)
//         .json({ success: false, message: "Event not found" });
//     }
//     const event = eventResult.rows[0];
//     const isLastRound = event.round_type === "last";

//     // Fetch all students who attended the event
//     const attendedStudentsQuery = `
//       SELECT s.id, s.registration_number, s.offers_received
//       FROM students s
//       JOIN event_attendance ea ON s.id = ea.student_id
//       WHERE ea.event_id = $1 AND ea.status = 'present'
//     `;
//     const attendedResult = await client.query(attendedStudentsQuery, [eventId]);
//     const attendedStudents = attendedResult.rows;
//     const studentMap = Object.fromEntries(
//       attendedStudents.map((s) => [s.registration_number, s.id])
//     );

//     // Fetch existing round results
//     const existingResultsQuery = `
//       SELECT student_id, result_status
//       FROM student_round_results
//       WHERE event_id = $1
//     `;
//     const existingResultsResult = await client.query(existingResultsQuery, [
//       eventId,
//     ]);
//     const existingSelectedStudentIds = existingResultsResult.rows
//       .filter((r) => r.result_status === "selected")
//       .map((r) => r.student_id);

//     // Determine newly selected and removed students
//     const newSelectedStudentIds = validRegistrationNumbers
//       .map((regNum) => studentMap[regNum])
//       .filter(Boolean);

//     const studentsToAddOffer = newSelectedStudentIds.filter(
//       (id) => !existingSelectedStudentIds.includes(id)
//     );
//     const studentsToRemoveOffer = existingSelectedStudentIds.filter(
//       (id) => !newSelectedStudentIds.includes(id)
//     );

//     let selectedCount = 0;
//     let rejectedCount = 0;

//     // Mark selected students
//     for (const studentId of newSelectedStudentIds) {
//       await client.query(
//         `
//         INSERT INTO student_round_results (student_id, event_id, result_status, created_at, updated_at)
//         VALUES ($1, $2, 'selected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
//         ON CONFLICT (student_id, event_id)
//         DO UPDATE SET result_status = 'selected', updated_at = CURRENT_TIMESTAMP
//         `,
//         [studentId, eventId]
//       );
//       selectedCount++;
//     }

//     // Mark non-selected students as rejected
//     const nonSelectedStudentIds = attendedStudents
//       .map((s) => s.id)
//       .filter((id) => !newSelectedStudentIds.includes(id));

//     if (nonSelectedStudentIds.length > 0) {
//       const placeholders = nonSelectedStudentIds
//         .map((_, i) => `$${i + 2}`)
//         .join(",");
//       await client.query(
//         `
//         INSERT INTO student_round_results (student_id, event_id, result_status, created_at, updated_at)
//         VALUES ${nonSelectedStudentIds
//           .map(
//             (_, i) =>
//               `($${
//                 i + 2
//               }, $1, 'rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
//           )
//           .join(",")}
//         ON CONFLICT (student_id, event_id)
//         DO UPDATE SET result_status = 'rejected', updated_at = CURRENT_TIMESTAMP
//         `,
//         [eventId, ...nonSelectedStudentIds]
//       );
//       rejectedCount = nonSelectedStudentIds.length;
//     }

//     // 1️⃣ Add campus offers for newly selected students if last round
//     if (isLastRound && event.company_id && event.position_id) {
//       for (const studentId of studentsToAddOffer) {
//         await addCampusOffer(
//           studentId,
//           event.company_id,
//           event.position_id,
//           {}
//         );
//       }
//     }

//     // 2️⃣ Remove campus offers for students deselected in last round
//     if (isLastRound && studentsToRemoveOffer.length > 0) {
//       for (const studentId of studentsToRemoveOffer) {
//         const student = attendedStudents.find((s) => s.id === studentId);
//         if (!student || !Array.isArray(student.offers_received)) continue;

//         const updatedOffers = student.offers_received.filter(
//           (o) =>
//             !(
//               o.source === "campus" &&
//               o.company_id === event.company_id &&
//               o.position_id === event.position_id
//             )
//         );

//         await client.query(
//           `UPDATE students
//            SET offers_received = $1, updated_at = CURRENT_TIMESTAMP
//            WHERE id = $2`,
//           [JSON.stringify(updatedOffers), studentId]
//         );
//       }
//     }

//     // Update event status to completed
//     await client.query(
//       `UPDATE events SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
//       [eventId]
//     );

//     await client.query("COMMIT");

//     res.json({
//       success: true,
//       message: "CSV processed successfully and results updated",
//       data: {
//         eventId: parseInt(eventId),
//         totalAttended: attendedStudents.length,
//         selectedCount,
//         rejectedCount,
//         method: "csv",
//         isLastRound,
//       },
//     });
//   } catch (error) {
//     await client.query("ROLLBACK");
//     console.error("Error processing CSV upload:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to process CSV upload",
//       error: error.message,
//     });
//   } finally {
//     client.release();
//   }
// });
