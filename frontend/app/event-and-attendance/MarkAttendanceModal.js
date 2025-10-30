import { useState, useEffect } from "react";
import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  Save,
  X,
  Clock,
  AlertTriangle,
  Edit,
  User,
} from "lucide-react";
import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const MarkAttendanceModal = ({ event, onClose, onAttendanceMarked }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonForChange, setReasonForChange] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    notMarked: 0,
  });
  const [eventStatus, setEventStatus] = useState(event?.status || "upcoming");
  const [positionDetails, setPositionDetails] = useState([]);
  const [roundInfo, setRoundInfo] = useState(null);

  const eventData = event;

  const getEventStatus = () => {
    if (!eventData?.date || !eventData?.time || !eventData?.endTime) {
      return "no_time";
    }

    const now = new Date();
    const eventDate = new Date(eventData.date);
    const startTime = new Date(
      `${eventData.date}T${convertTo24Hour(eventData.time)}`
    );
    const endTime = new Date(
      `${eventData.date}T${convertTo24Hour(eventData.endTime)}`
    );

    if (now < startTime) return "upcoming";
    if (now >= startTime && now <= endTime) return "ongoing";
    if (now > endTime) return "completed";

    return "upcoming";
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}:00`;
  };

  const canMarkAttendance = eventStatus === "ongoing";
  const isEditMode = eventStatus === "completed";

  const fetchStudentData = async () => {
    if (!event?.id) {
      console.error("No event ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const queryParams =
        event.position_ids && event.position_ids.length > 0
          ? `?positionIds=${event.position_ids.join(",")}`
          : "";

      const response = await axios.get(
        `${backendUrl}/events/${event.id}/eligibleStudents${queryParams}`
      );

      if (response.data.success) {
        const studentData = response.data.data.students || [];
        setStudents(studentData);

        if (response.data.data.roundNumber) {
          setRoundInfo({
            roundNumber: response.data.data.roundNumber,
            filteredByPositions: response.data.data.filteredByPositions,
            totalCount: response.data.data.totalCount,
          });
        }

        const initialAttendance = {};

        studentData.forEach((student) => {
          initialAttendance[student.id] = {
            status: "absent",
            check_in_time: null,
            reason_for_change: null,
          };
        });

        if (event.attendance && event.attendance.length > 0) {
          event.attendance.forEach((record) => {
            if (initialAttendance[record.studentId]) {
              initialAttendance[record.studentId] = {
                status: record.status,
                check_in_time: record.checkInTime,
                reason_for_change: record.reason_for_change || null,
              };
            }
          });
        }

        setAttendance(initialAttendance);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert(
        error.response?.data?.message || "Failed to fetch eligible students"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPositionDetails = async () => {
    if (!event?.id || !event?.position_ids || event.position_ids.length === 0) {
      return;
    }

    try {
      const response = await axios.get(
        `${backendUrl}/events/positions/by-ids?ids=${event.position_ids.join(",")}`
      );

      if (response.data.success) {
        setPositionDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching position details:", error);
    }
  };

  useEffect(() => {
    if (event?.id) {
      setEventStatus(event.status || "upcoming");
      fetchStudentData();
      fetchPositionDetails();
    }
  }, [event?.id]);

  useEffect(() => {
    const newStats = {
      total: students.length,
      present: 0,
      absent: 0,
      late: 0,
      notMarked: 0,
    };

    Object.values(attendance).forEach((record) => {
      if (record.status === "present") newStats.present++;
      else if (record.status === "absent") newStats.absent++;
      else if (record.status === "late") newStats.late++;
      else newStats.notMarked++;
    });

    setStats(newStats);
  }, [attendance, students]);

  const handleSave = async () => {
    if (!event?.id) {
      alert("Event ID is missing");
      return;
    }

    try {
      setSaving(true);

      if (isEditMode) {
        const records = [];

        Object.entries(attendance).forEach(([studentId, record]) => {
          if (record.reason_for_change) {
            records.push({
              studentId: parseInt(studentId),
              status: record.status,
              reasonForChange: record.reason_for_change,
            });
          }
        });

        if (records.length === 0) {
          alert("No changes to save");
          setSaving(false);
          return;
        }

        const response = await axios.put(
          `${backendUrl}/events/${event.id}/attendance`,
          {
            records: records,
          }
        );

        if (response.data.success) {
          const { updatedCount, errorsCount, errors } = response.data;

          if (errorsCount > 0) {
            console.log("Update errors:", errors);
            alert(
              `Updated ${updatedCount} records successfully. ${errorsCount} errors occurred.`
            );
          } else {
            alert(
              `Successfully updated attendance for ${updatedCount} students.`
            );
          }
        }
      } else {
        const statusGroups = {
          present: [],
          late: [],
          absent: [],
        };

        Object.entries(attendance).forEach(([studentId, record]) => {
          const student = students.find((s) => s.id === parseInt(studentId));
          if (!student || !student.registration_number) return;

          if (statusGroups[record.status]) {
            statusGroups[record.status].push(student.registration_number);
          }
        });

        const apiCalls = [];

        Object.entries(statusGroups).forEach(([status, regNumbers]) => {
          if (regNumbers.length > 0) {
            apiCalls.push(
              axios.post(`${backendUrl}/events/${event.id}/attendance`, {
                registration_numbers: regNumbers,
                status: status,
              })
            );
          }
        });

        if (apiCalls.length === 0) {
          alert("No attendance to mark");
          setSaving(false);
          return;
        }

        const results = await Promise.all(apiCalls);

        let totalMarked = 0;
        let totalErrors = 0;
        let allErrors = [];

        results.forEach((response) => {
          if (response.data.success) {
            totalMarked += response.data.summary.marked;
            totalErrors += response.data.summary.failed;
            if (response.data.errors) {
              allErrors = [...allErrors, ...response.data.errors];
            }
          }
        });

        if (totalErrors > 0) {
          console.log("Marking errors:", allErrors);
          alert(
            `Marked ${totalMarked} students successfully. ${totalErrors} errors occurred.`
          );
        } else {
          alert(`Successfully marked attendance for ${totalMarked} students.`);
        }
      }

      onAttendanceMarked?.();
      onClose();
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert(error.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const confirmChangeWithReason = () => {
    if (!reasonForChange.trim()) {
      alert("Please provide a reason for this change");
      return;
    }

    if (pendingChange) {
      setAttendance((prev) => ({
        ...prev,
        [pendingChange.studentId]: {
          ...prev[pendingChange.studentId],
          status: pendingChange.status,
          check_in_time:
            pendingChange.status === "present"
              ? new Date().toISOString()
              : prev[pendingChange.studentId]?.check_in_time || null,
          reason_for_change: reasonForChange.trim(),
        },
      }));
    }

    setShowReasonModal(false);
    setReasonForChange("");
    setPendingChange(null);
  };

  const handleAttendanceUpdate = (studentId, status) => {
    if (isEditMode) {
      setPendingChange({ studentId, status });
      setShowReasonModal(true);
    } else if (canMarkAttendance) {
      setAttendance((prev) => ({
        ...prev,
        [studentId]: {
          status,
          check_in_time: status === "present" ? new Date().toISOString() : null,
          reason_for_change: null,
        },
      }));
    } else {
      alert("Attendance can only be marked when event is ongoing or completed");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.registration_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollment_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getStatusMessage = () => {
    switch (eventStatus) {
      case "upcoming":
        return {
          message:
            "This event hasn't started yet. Click 'Start Event' to begin marking attendance.",
          color: "text-amber-700 bg-amber-50 border-amber-200",
          icon: <Clock className="h-4 w-4" />,
        };
      case "ongoing":
        return {
          message: "Event is ongoing. You can mark attendance now.",
          color: "text-green-700 bg-green-50 border-green-200",
          icon: <CheckCircle className="h-4 w-4" />,
        };
      case "completed":
        return {
          message:
            "Event has ended. Changes require a reason and will be logged.",
          color: "text-blue-700 bg-blue-50 border-blue-200",
          icon: <Edit className="h-4 w-4" />,
        };
      default:
        return {
          message: "Event status unknown.",
          color: "text-gray-700 bg-gray-50 border-gray-200",
          icon: <AlertTriangle className="h-4 w-4" />,
        };
    }
  };

  const statusInfo = getStatusMessage();

  const updateEventStatus = async (newStatus) => {
    if (!event?.id) {
      alert("Event ID is missing");
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/events/${event.id}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        setEventStatus(newStatus);
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.response?.data?.message || "Failed to update event status");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-full w-full p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl mx-auto my-8">
            <div className="bg-slate-900 px-6 py-5 text-white rounded-t-xl relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    {isEditMode ? "Edit Attendance" : "Mark Attendance"}
                  </h2>
                  <div className="space-y-1">
                    <p className="text-slate-200 font-medium">
                      {eventData?.title}
                    </p>
                    <p className="text-slate-300 text-sm">
                      {eventData?.company}
                      {eventData?.positionTitle &&
                        ` • ${eventData?.positionTitle}`}
                    </p>
                    {eventData?.type === "company_round" &&
                      eventData?.roundNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded">
                            Round {eventData.roundNumber}
                          </span>
                          {eventData?.roundType && (
                            <span className="text-slate-300">
                              {eventData.roundType}
                            </span>
                          )}
                        </div>
                      )}
                    {positionDetails.length > 0 && (
                      <div className="text-slate-300 text-sm mt-2">
                        <span className="font-medium">Positions: </span>
                        {positionDetails
                          .map((p) => p.position_title)
                          .join(", ")}
                      </div>
                    )}
                    <div className="text-slate-400 text-sm flex items-center gap-4">
                      <span>
                        {eventData?.date &&
                          new Date(eventData.date).toLocaleDateString()}
                      </span>
                      <span>
                        {eventData?.time} - {eventData?.endTime}
                      </span>
                      <span>{eventData?.venue}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => updateEventStatus("ongoing")}
                  disabled={eventStatus !== "upcoming"}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    eventStatus === "ongoing"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  } disabled:opacity-50`}
                >
                  Start Event
                </button>
                <button
                  onClick={() => updateEventStatus("completed")}
                  disabled={eventStatus !== "ongoing"}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    eventStatus === "completed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  } disabled:opacity-50`}
                >
                  End Event
                </button>
              </div>
            </div>

            <div
              className={`mx-6 mt-6 p-4 rounded-lg border ${statusInfo.color} flex items-start gap-3`}
            >
              {statusInfo.icon}
              <p className="text-sm font-medium flex-1">{statusInfo.message}</p>
            </div>

            <div className="mx-6 mt-4 p-4 rounded-lg bg-orange-50 border border-orange-200 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="text-sm text-orange-700">
                <p className="font-medium mb-1">Important Note</p>
                <p>
                  Students are marked as absent by default. Only mark present
                  for those who attended.
                </p>
              </div>
            </div>

            {roundInfo && eventData?.type === "company_round" && (
              <div className="mx-6 mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-2">Round Information</p>
                  <div className="space-y-1">
                    <p>• Round Number: {roundInfo.roundNumber}</p>
                    <p>• Eligible Students: {roundInfo.totalCount}</p>
                    {roundInfo.roundNumber === 1 ? (
                      <p>
                        • Source: Students who applied via registration forms
                      </p>
                    ) : (
                      <p>
                        • Source: Students selected from Round{" "}
                        {roundInfo.roundNumber - 1}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-5 gap-4 p-6 bg-slate-50 border-y border-slate-200 mt-6">
              <StatCard title="Total" value={stats.total} />
              <StatCard title="Present" value={stats.present} color="green" />
              <StatCard title="Late" value={stats.late} color="amber" />
              <StatCard title="Absent" value={stats.absent} color="red" />
              <StatCard
                title="Not Marked"
                value={stats.notMarked}
                color="gray"
              />
            </div>

            <div className="p-6 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by registration number, enrollment number, or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="p-6">
              {!canMarkAttendance && !isEditMode ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Clock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-700 mb-2">
                      Attendance marking is not available yet
                    </h3>
                    <p className="text-slate-500">
                      Please wait for the event to start
                    </p>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      attendance={attendance[student.id]}
                      onUpdate={handleAttendanceUpdate}
                      isEditMode={isEditMode}
                      canMarkAttendance={canMarkAttendance || isEditMode}
                    />
                  ))}

                  {(canMarkAttendance || isEditMode) && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        <Save className="h-5 w-5 mr-2" />
                        {saving
                          ? "Saving..."
                          : isEditMode
                            ? "Update Attendance"
                            : "Save Attendance"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReasonModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 overflow-y-auto">
          <div className="min-h-full w-full p-4 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Reason for Change Required
                </h3>
                <p className="text-slate-600 mb-4">
                  Since the event has ended, please provide a reason for this
                  attendance change:
                </p>
                <textarea
                  value={reasonForChange}
                  onChange={(e) => setReasonForChange(e.target.value)}
                  placeholder="e.g., Late submission due to technical issues, Student provided valid excuse, etc."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  rows={4}
                />
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowReasonModal(false);
                      setReasonForChange("");
                      setPendingChange(null);
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmChangeWithReason}
                    disabled={!reasonForChange.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Confirm Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const StatCard = ({ title, value, color = "blue" }) => {
  const colorClasses = {
    green: "text-green-600 bg-green-50 border-green-200",
    amber: "text-amber-600 bg-amber-50 border-amber-200",
    red: "text-red-600 bg-red-50 border-red-200",
    gray: "text-slate-600 bg-slate-50 border-slate-200",
    blue: "text-blue-600 bg-blue-50 border-blue-200",
  };

  return (
    <div
      className={`p-4 rounded-lg border ${colorClasses[color] || colorClasses.blue}`}
    >
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium opacity-80">{title}</div>
    </div>
  );
};

const StudentCard = ({
  student,
  attendance,
  onUpdate,
  isEditMode,
  canMarkAttendance,
}) => (
  <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
          <User className="h-6 w-6 text-slate-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-lg">
            {student.full_name}
          </h3>
          <div className="text-sm text-slate-500 mt-1 flex items-center gap-4">
            <span>Reg: {student.registration_number}</span>
            <span>Enr: {student.enrollment_number}</span>
            <span>
              {student.department} {student.batch_year}
            </span>
          </div>
          {attendance?.check_in_time && (
            <div className="text-sm text-slate-600 mt-1">
              <Clock className="h-3 w-3 inline mr-1" />
              Check-in: {attendance.check_in_time}
            </div>
          )}
          {attendance?.reason_for_change && (
            <div className="text-sm text-blue-600 mt-2 p-2 bg-blue-50 rounded">
              <span className="font-medium">Reason:</span>{" "}
              {attendance.reason_for_change}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <AttendanceButton
          status="present"
          currentStatus={attendance?.status}
          onClick={() => onUpdate(student.id, "present")}
          disabled={!canMarkAttendance}
          icon={<CheckCircle className="h-4 w-4 mr-2" />}
          label="Present"
        />
        <AttendanceButton
          status="late"
          currentStatus={attendance?.status}
          onClick={() => onUpdate(student.id, "late")}
          disabled={!canMarkAttendance}
          icon={<Clock className="h-4 w-4 mr-2" />}
          label="Late"
        />
        <AttendanceButton
          status="absent"
          currentStatus={attendance?.status}
          onClick={() => onUpdate(student.id, "absent")}
          disabled={!canMarkAttendance}
          icon={<XCircle className="h-4 w-4 mr-2" />}
          label="Absent"
        />
      </div>
    </div>
  </div>
);

const AttendanceButton = ({
  status,
  currentStatus,
  onClick,
  disabled,
  icon,
  label,
}) => {
  const isSelected = currentStatus === status;

  const baseClasses =
    "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all";
  const statusClasses = {
    present: isSelected
      ? "bg-green-100 text-green-700 border-2 border-green-300 shadow-sm"
      : "bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-green-600 border border-slate-200",
    late: isSelected
      ? "bg-amber-100 text-amber-700 border-2 border-amber-300 shadow-sm"
      : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-600 border border-slate-200",
    absent: isSelected
      ? "bg-red-100 text-red-700 border-2 border-red-300 shadow-sm"
      : "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${statusClasses[status]} ${disabledClasses}`}
    >
      {icon}
      {label}
    </button>
  );
};

export default MarkAttendanceModal;
