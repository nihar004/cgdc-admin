import { useState, useCallback } from "react";
import axios from "axios";
import {
  Eye,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import ResultUploadModal from "./ResultUploadModal";

const RoundsTable = ({
  events,
  positionId,
  companyName,
  positionTitle,
  onUpdate,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBulkUpload = (eventId) => {
    setSelectedEvent(eventId);
    setShowUploadModal(true);
  };

  const handleResultsUpdated = useCallback(() => {
    onUpdate?.();
  }, [onUpdate]);

  const getEventStatusIcon = (event) => {
    if (event.status === "completed")
      return <CheckCircle size={14} className="text-emerald-500" />;
    if (event.status === "ongoing")
      return <Clock size={14} className="text-blue-500" />;
    return <AlertCircle size={14} className="text-slate-400" />;
  };

  const getRoundTypeBadge = (roundType) => {
    const types = {
      technical: "bg-purple-50 text-purple-700 border-purple-200",
      hr: "bg-emerald-50 text-emerald-700 border-emerald-200",
      aptitude: "bg-blue-50 text-blue-700 border-blue-200",
      gd: "bg-orange-50 text-orange-700 border-orange-200",
      interview: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
    return types[roundType] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  const calculatePercentage = (numerator, denominator) => {
    if (!denominator || denominator === 0) return "0";
    return Math.round((numerator / denominator) * 100);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Round Details
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  Eligible
                </div>
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                <div className="flex items-center gap-1">
                  <TrendingUp size={12} />
                  Applied
                </div>
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Attended
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Qualified
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {events.map((event, index) => (
              <tr
                key={event.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {event.title}
                        </h3>
                        {getEventStatusIcon(event)}
                      </div>
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded border font-medium ${getRoundTypeBadge(
                          event.round_type
                        )}`}
                      >
                        {event.round_type?.toUpperCase()}
                      </span>
                      <div className="mt-1.5 space-y-0.5">
                        {event.event_date && (
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <Calendar size={11} className="text-slate-400" />
                            <span>
                              {new Date(event.event_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        )}
                        {event.venue && (
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <MapPin size={11} className="text-slate-400" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-semibold text-slate-900">
                    {event.eligible_count || 0}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-blue-600">
                      {event.applied_count || 0}
                    </div>
                    <div className="text-xs text-slate-500">
                      {calculatePercentage(
                        event.applied_count,
                        event.eligible_count
                      )}
                      %
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-amber-600">
                      {event.attended_count || 0}
                    </div>
                    <div className="text-xs text-slate-500">
                      {calculatePercentage(
                        event.attended_count,
                        event.applied_count
                      )}
                      %
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-emerald-600">
                      {event.qualified_count || 0}
                    </div>
                    <div className="text-xs text-slate-500">
                      {calculatePercentage(
                        event.qualified_count,
                        event.attended_count
                      )}
                      %
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors border border-blue-200"
                      onClick={() => {
                        /* Handle view details */
                      }}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View
                    </button>
                    <button
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded hover:bg-emerald-700 transition-colors"
                      onClick={() => handleBulkUpload(event.id)}
                    >
                      <Upload className="h-3.5 w-3.5 mr-1" />
                      Upload
                    </button>
                  </div>
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
          onResultsUpdated={handleResultsUpdated}
        />
      )}
    </>
  );
};

export default RoundsTable;
