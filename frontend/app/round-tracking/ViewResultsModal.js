"use client";

import { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  Building2,
  Briefcase,
  Search,
} from "lucide-react";
import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const ViewResultsModal = ({
  eventId,
  positionId,
  onClose,
  companyName,
  positionTitle,
}) => {
  const [eventDetails, setEventDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedResults, setEditedResults] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    resultStatus: "all",
  });

  useEffect(() => {
    fetchEventDetails();
    fetchStudents();
  }, [eventId, positionId]);

  useEffect(() => {
    applyFilters();
  }, [students, filters]);

  const fetchEventDetails = async () => {
    try {
      const queryParams = positionId ? `?positionId=${positionId}` : "";
      const { data } = await axios.get(
        `${backendUrl}/round-tracking/events/${eventId}/details${queryParams}`
      );

      if (data.success) {
        setEventDetails(data.data);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError("Failed to load event details");
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        status: "applied",
      });

      if (positionId) {
        queryParams.append("positionId", positionId);
      }

      const { data } = await axios.get(
        `${backendUrl}/round-tracking/events/${eventId}/students?${queryParams}`
      );

      if (data.success) {
        setStudents(data.students || []);
        // Initialize edited results
        const initialResults = {};
        data.students.forEach((student) => {
          initialResults[student.id] = student.result_status || "pending";
        });
        setEditedResults(initialResults);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...students];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchLower) ||
          student.registration_number.toLowerCase().includes(searchLower) ||
          student.enrollment_number?.toLowerCase().includes(searchLower)
      );
    }

    // Result status filter
    if (filters.resultStatus !== "all") {
      filtered = filtered.filter((student) => {
        const status = editMode
          ? editedResults[student.id]
          : student.result_status || "pending";
        return status === filters.resultStatus;
      });
    }

    setFilteredStudents(filtered);
  };

  const handleResultChange = (studentId, newStatus) => {
    setEditedResults((prev) => ({
      ...prev,
      [studentId]: newStatus,
    }));
  };

  const handleBulkAction = (action) => {
    const newResults = { ...editedResults };
    filteredStudents.forEach((student) => {
      newResults[student.id] = action;
    });
    setEditedResults(newResults);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "selected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle size={12} className="mr-1" />
            Selected
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
    }
  };

  const exportToCSV = () => {
    const csvData = filteredStudents.map((student) => ({
      Registration: student.registration_number,
      Name: student.name,
      Department: student.department,
      Branch: student.branch,
      CGPA: student.cgpa,
      Attendance: student.attendance_status || "N/A",
      Result: editMode
        ? editedResults[student.id]
        : student.result_status || "pending",
    }));

    const headers = Object.keys(csvData[0]).join(",");
    const rows = csvData.map((row) => Object.values(row).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `event_${eventId}_results.csv`;
    a.click();
  };

  const getCountsByPosition = () => {
    if (!eventDetails?.counts_per_position) return null;
    const positionData = Object.values(eventDetails.counts_per_position)[0];
    return positionData;
  };

  const counts = getCountsByPosition();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        {/* Everything in one scrollable container */}
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {eventDetails?.title}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building2 size={14} />
                    <span>{companyName}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Briefcase size={14} />
                    <span>{positionTitle}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">Date & Time</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {eventDetails?.event_date
                    ? new Date(eventDetails.event_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
                {eventDetails?.start_time && (
                  <p className="text-sm text-gray-600">
                    {eventDetails.start_time.slice(0, 5)}
                    {eventDetails.end_time &&
                      ` - ${eventDetails.end_time.slice(0, 5)}`}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">Venue</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {eventDetails?.venue || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  {eventDetails?.mode?.toUpperCase() || "OFFLINE"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Users size={16} />
                  <span className="text-sm font-medium">Round Number</span>
                </div>
                <p className="text-gray-900 font-semibold text-2xl">
                  {eventDetails?.round_number || 1}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    eventDetails?.status === "completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : eventDetails?.status === "ongoing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {eventDetails?.status?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Stats Cards */}
            {counts && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {eventDetails?.round_number === 1 && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-600 font-medium">Applied</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {counts.applied || 0}
                    </p>
                  </div>
                )}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium">
                    Eligible
                  </p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">
                    {counts.eligible || 0}
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-sm text-amber-600 font-medium">Attended</p>
                  <p className="text-2xl font-bold text-amber-900 mt-1">
                    {counts.attended || 0}
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <p className="text-sm text-emerald-600 font-medium">
                    Qualified
                  </p>
                  <p className="text-2xl font-bold text-emerald-900 mt-1">
                    {counts.qualified || 0}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Filters and Bulk Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.resultStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, resultStatus: e.target.value })
                  }
                >
                  <option value="all">All Results</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>

                {editMode && (
                  <div className="flex items-center gap-2 border-l pl-3">
                    <span className="text-sm text-gray-600">Bulk:</span>
                    <button
                      onClick={() => handleBulkAction("selected")}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors text-sm"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => handleBulkAction("rejected")}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                    >
                      Reject All
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredStudents.length} of {students.length} students
              {editMode && (
                <span className="ml-2 text-emerald-600 font-medium">
                  •{" "}
                  {
                    Object.values(editedResults).filter((r) => r === "selected")
                      .length
                  }{" "}
                  selected
                </span>
              )}
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CGPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.enrollment_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.registration_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.department}
                        <div className="text-xs text-gray-500">
                          {student.branch}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.cgpa
                          ? parseFloat(student.cgpa).toFixed(2)
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.attendance_status === "present" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Present
                          </span>
                        )}
                        {student.attendance_status === "absent" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Absent
                          </span>
                        )}
                        {student.attendance_status === "late" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Late
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editMode ? (
                          <select
                            value={editedResults[student.id] || "pending"}
                            onChange={(e) =>
                              handleResultChange(student.id, e.target.value)
                            }
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="selected">Selected</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        ) : (
                          getStatusBadge(student.result_status || "pending")
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Students Found
                </h3>
                <p className="text-gray-500">
                  {filters.search || filters.resultStatus !== "all"
                    ? "Try adjusting your filters"
                    : "No students have applied for this round yet"}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredStudents.length} of {students.length} students
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Export Results
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResultsModal;
