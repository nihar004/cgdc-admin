import { useState } from "react";
import { Eye, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react";
import ResultUploadModal from "./ResultUploadModal";

const RoundsTable = ({ events, positionId, companyName, positionTitle }) => {
  const [selectedStudents, setSelectedStudents] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleQualifiedToggle = (eventId, studentId) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [studentId]: !prev[eventId]?.[studentId],
      },
    }));
  };

  const handleBulkUpload = (eventId) => {
    setSelectedEvent(eventId);
    setShowUploadModal(true);
  };

  const getEventStatusIcon = (event) => {
    if (event.status === "completed")
      return <CheckCircle size={16} className="text-green-600" />;
    if (event.status === "ongoing")
      return <Clock size={16} className="text-blue-600" />;
    return <AlertCircle size={16} className="text-gray-400" />;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Round Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Eligible
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attended
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qualified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event, index) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {event.title}
                        </span>
                        {getEventStatusIcon(event)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {event.event_date &&
                          new Date(event.event_date).toLocaleDateString()}
                        {event.venue && ` • ${event.venue}`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.eligible_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.applied_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.attended_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  {event.qualified_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    onClick={() => {
                      /* Handle view details */
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button
                    className="text-green-600 hover:text-green-900 inline-flex items-center"
                    onClick={() => handleBulkUpload(event.id)}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Results
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUploadModal && (
        <ResultUploadModal
          eventId={selectedEvent}
          onClose={() => setShowUploadModal(false)}
          companyName={companyName}
          positionTitle={positionTitle}
        />
      )}
    </>
  );
};

export default RoundsTable;
