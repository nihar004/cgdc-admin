import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  GraduationCap,
  Star,
  Play,
  CheckCircle,
  AlertCircle,
  Mic,
  Trash2,
  Edit,
} from "lucide-react";
import { useState } from "react";
import DeleteEventModal from "./DeleteEventModal"; // Adjust the import path as necessary

const getEventTypeConfig = (eventType) => {
  const configs = {
    workshop: {
      icon: GraduationCap,
      color: "bg-purple-100 text-purple-600",
      label: "Workshop",
    },
    seminar: {
      icon: Mic,
      color: "bg-blue-100 text-blue-600",
      label: "Seminar",
    },
    company_visit: {
      icon: Building2,
      color: "bg-green-100 text-green-600",
      label: "Company Visit",
    },
    aptitude_test: {
      icon: Star,
      color: "bg-amber-100 text-amber-600",
      label: "Aptitude Test",
    },
    technical_round: {
      icon: Users,
      color: "bg-pink-100 text-pink-600",
      label: "Technical Round",
    },
    hr_round: {
      icon: Users,
      color: "bg-pink-100 text-pink-600",
      label: "HR Round",
    },
    group_discussion: {
      icon: Users,
      color: "bg-teal-100 text-teal-600",
      label: "Group Discussion",
    },
    other: {
      icon: Calendar,
      color: "bg-gray-100 text-gray-600",
      label: "Other",
    },
  };

  return configs[eventType] || configs.other;
};

function EventCard({
  event,
  setSelectedEvent,
  setEditingEvent,
  fetchEvents,
  onAttendanceClick,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle view details - now the event already has attendance data
  const handleViewDetails = () => {
    // Transform the event data to match the expected format for the modal
    const eventWithStudents = {
      ...event,
      students: event.attendance, // attendance array becomes students array for the modal
      attendanceRate: event.attendanceRate,
    };
    setSelectedEvent(eventWithStudents);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return { color: "bg-green-100 text-green-700", icon: CheckCircle };
      case "ongoing":
        return { color: "bg-blue-100 text-blue-700", icon: Play };
      case "upcoming":
        return { color: "bg-yellow-100 text-yellow-700", icon: AlertCircle };
      default:
        return { color: "bg-gray-100 text-gray-700", icon: AlertCircle };
    }
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-amber-600";
    return "text-red-500";
  };

  const statusConfig = getStatusConfig(event.status);
  const StatusIcon = statusConfig.icon;
  const eventTypeConfig = getEventTypeConfig(event.event_type);
  const EventTypeIcon = eventTypeConfig.icon;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatSpecializations = (specs) => {
    if (!specs || specs.length === 0) return "All";
    if (Array.isArray(specs)) {
      return specs.join(", ");
    }
    return specs.replace(/[{}]/g, "").split(",").join(", ");
  };

  const formatYears = (years) => {
    if (!years || years.length === 0) return "All";
    return years.join(", ");
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div className={`p-2 rounded-lg ${eventTypeConfig.color}`}>
                <EventTypeIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {event.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${eventTypeConfig.color}`}
                  >
                    {eventTypeConfig.label}
                  </span>
                  {event.roundType && event.type === "company_round" && (
                    <p className="text-sm text-gray-600 capitalize">
                      Round:{" "}
                      <span className="font-medium">{event.roundType}</span>
                    </p>
                  )}
                  {event.isMandatory && (
                    <Star className="h-4 w-4 text-amber-500 fill-current flex-shrink-0" />
                  )}
                </div>

                {event.company && (
                  <p className="text-blue-600 font-medium text-sm mb-1">
                    {event.company}
                  </p>
                )}
                {event.positions &&
                  event.positions.length > 0 &&
                  event.type === "company_round" && (
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      <span className="text-sm text-gray-500">Positions:</span>
                      {event.positions.map((position) => (
                        <span
                          key={position.id}
                          className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                        >
                          {position.title}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} flex-shrink-0`}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span className="text-gray-600">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-gray-600">
                {event.time}
                {event.endTime && ` - ${event.endTime}`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3 text-gray-400" />
              <span className="text-gray-600">
                {event.venue} {event.mode && `(${event.mode})`}
              </span>
            </div>
            {event.speakerDetails && event.speakerDetails.speaker && (
              <div className="text-xs flex items-center space-x-2">
                <Mic className="h-3 w-3 text-gray-400" />
                <span className="text-gray-500">Speaker: </span>
                <span className="text-gray-700 font-medium">
                  {event.speakerDetails.speaker}
                </span>
                {event.speakerDetails.designation && (
                  <>
                    <span className="text-gray-400 mx-1">•</span>
                    <span className="text-gray-600">
                      {event.speakerDetails.designation}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Target Criteria*/}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-gray-500">Specializations: </span>
                  <span className="text-gray-700 font-medium">
                    {formatSpecializations(event.targetSpecializations)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Years: </span>
                  <span className="text-gray-700 font-medium">
                    {formatYears(event.targetAcademicYears)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Summary - Now using real data from API */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {event.totalStudents || 0}
                </div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {event.attendedStudents || 0}
                </div>
                <div className="text-xs text-gray-500">Present</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-500">
                  {event.absentStudents || 0}
                </div>
                <div className="text-xs text-gray-500">Absent</div>
              </div>
              <div>
                <div
                  className={`text-lg font-bold ${getAttendanceColor(
                    event.attendanceRate || 0
                  )}`}
                >
                  {event.attendanceRate || 0}%
                </div>
                <div className="text-xs text-gray-500">Rate</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleViewDetails}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                >
                  <Users className="h-3 w-3 mr-1" />
                  View Attendance
                </button>
                <button
                  onClick={onAttendanceClick}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Mark Attendance
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* Add Modals */}
      <DeleteEventModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        event={event}
        isDeleting={isDeleting}
        onEventDeleted={fetchEvents}
      />
    </>
  );
}

export default EventCard;
