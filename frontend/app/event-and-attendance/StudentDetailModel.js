import { XCircle, CheckCircle, AlertCircle, Clock, User } from "lucide-react";
import * as XLSX from "xlsx";

// Student View Modal for Event Attendance
function StudentDetailModel({ selectedEvent, setSelectedEvent }) {
  const getAttendanceStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "late":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "registered":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "present":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "absent":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "late":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "registered":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleExport = () => {
    try {
      // Prepare data for export - only attendance related information
      const exportData = selectedEvent.students.map((student) => ({
        "Student Name": student.name,
        "Registration Number": student.registrationNumber,
        "Enrollment Number": student.enrollmentNumber,
        Department: student.department,
        "Batch Year": student.batchYear,
        Status:
          student.status.charAt(0).toUpperCase() + student.status.slice(1),
        "Check-in Time": student.checkInTime || "-",
        Reason: student.reasonForChange || "NULL",
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      ws["!cols"] = [
        { wch: 25 }, // Student Name
        { wch: 15 }, // Registration Number
        { wch: 15 }, // Enrollment Number
        { wch: 20 }, // Department
        { wch: 10 }, // Batch Year
        { wch: 10 }, // Status
        { wch: 15 }, // Check-in Time
        { wch: 30 }, // Reason
      ];

      // Create workbook and add the sheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");

      // Generate filename with current date
      const fileName = `attendance_${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export attendance data");
    }
  };

  if (!selectedEvent || !selectedEvent.students) {
    return null;
  }

  const presentCount = selectedEvent.students.filter(
    (s) => s.status === "present"
  ).length;
  const absentCount = selectedEvent.students.filter(
    (s) => s.status === "absent"
  ).length;
  const lateCount = selectedEvent.students.filter(
    (s) => s.status === "late"
  ).length;
  const registeredCount = selectedEvent.students.filter(
    (s) => s.status === "registered"
  ).length;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-7xl shadow-lg rounded-md bg-white mb-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Student Attendance - {selectedEvent.title}
            </h3>
            {selectedEvent.company && (
              <p className="text-sm text-blue-600 font-medium mt-1">
                {selectedEvent.company}
              </p>
            )}
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setSelectedEvent(null)}
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Event Details Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Date: </span>
              <span className="text-gray-900">
                {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Time: </span>
              <span className="text-gray-900">
                {selectedEvent.time}
                {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Venue: </span>
              <span className="text-gray-900">
                {selectedEvent.venue}
                {selectedEvent.mode && ` (${selectedEvent.mode})`}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Status: </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  selectedEvent.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : selectedEvent.status === "ongoing"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {selectedEvent.status.charAt(0).toUpperCase() +
                  selectedEvent.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {selectedEvent.students.length}
            </div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {presentCount}
            </div>
            <div className="text-sm text-gray-600">Present</div>
          </div>
          <div className="bg-white border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <div className="text-sm text-gray-600">Absent</div>
          </div>
          {lateCount > 0 && (
            <div className="bg-white border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {lateCount}
              </div>
              <div className="text-sm text-gray-600">Late</div>
            </div>
          )}
          {registeredCount > 0 && (
            <div className="bg-white border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {registeredCount}
              </div>
              <div className="text-sm text-gray-600">Registered</div>
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div
              className={`text-2xl font-bold ${
                selectedEvent.attendanceRate >= 90
                  ? "text-green-600"
                  : selectedEvent.attendanceRate >= 75
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {selectedEvent.attendanceRate || 0}%
            </div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason for Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedEvent.students.map((student) => (
                <tr
                  key={
                    student.id ||
                    `${student.registrationNumber}-${student.enrollmentNumber}`
                  }
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.registrationNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.enrollmentNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.department}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.batchYear}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(student.status)}>
                      <div className="flex items-center space-x-1">
                        {getAttendanceStatusIcon(student.status)}
                        <span key={`status-${student.id}-${student.status}`}>
                          {student.status.charAt(0).toUpperCase() +
                            student.status.slice(1)}
                        </span>
                      </div>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.checkInTime || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {student.reasonForChange ? (
                        <span className="text-blue-600 font-medium">
                          {student.reasonForChange}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">
                          Not excused
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {selectedEvent.students.length} students • Present:{" "}
            {presentCount} • Absent: {absentCount}
            {lateCount > 0 && ` • Late: ${lateCount}`}
            {registeredCount > 0 && ` • Registered: ${registeredCount}`}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Export Attendance
            </button>
            <button
              onClick={() => setSelectedEvent(null)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailModel;
