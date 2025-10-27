import {
  Send,
  Mail,
  Users,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Copy,
  Check,
} from "lucide-react";
import { useEmail } from "../../context/EmailContext";
import { useState } from "react";
import toast from "react-hot-toast";

const History = () => {
  const { logs, deleteLogs } = useEmail();
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this log?"
    );
    if (!shouldDelete) return;

    const deletePromise = deleteLogs(id);

    toast.promise(deletePromise, {
      loading: "Deleting log...",
      success: "Log deleted successfully",
      error: "Failed to delete log",
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (successful, failed) => {
    if (failed === 0) return "bg-slate-50 border-slate-200";
    if (successful === 0) return "bg-red-50 border-red-200";
    return "bg-yellow-50 border-yellow-200";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(id);
        toast.success("Copied to clipboard!", {
          duration: 1200,
          icon: "📋",
          style: {
            backgroundColor: "#F0FDF4",
            color: "#166534",
            border: "1px solid #BBF7D0",
          },
        });
        setTimeout(() => setCopiedId(null), 1200);
      })
      .catch(() => {
        toast.error("Failed to copy text");
      });
  };

  const MessageIdSection = ({ id, value, label }) => (
    <div className="bg-slate-100 backdrop-blur-sm rounded-lg p-3 hover:bg-slate-100 transition-colors">
      <p className="text-xs font-semibold text-slate-600 mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-mono text-slate-800 break-all flex-1 select-all">
          {value}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(value, id);
          }}
          className={`p-1.5 rounded-md transition-all duration-200 ${
            copiedId === id
              ? "bg-green-100 text-green-600"
              : "hover:bg-slate-200 text-slate-600"
          }`}
          title={copiedId === id ? "Copied!" : "Copy to clipboard"}
        >
          {copiedId === id ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  const CopyableText = ({ id, value, label }) => (
    <div className="bg-slate-100 backdrop-blur-sm rounded-lg p-3">
      <p className="text-xs font-semibold text-slate-600 mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-slate-800 break-all flex-1 select-all">
          {value}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(value, id);
          }}
          className={`p-1.5 rounded-md transition-all duration-200 ${
            copiedId === id
              ? "bg-green-100 text-green-600"
              : "hover:bg-slate-200 text-slate-600"
          }`}
          title={copiedId === id ? "Copied!" : "Copy to clipboard"}
        >
          {copiedId === id ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {logs && logs.length > 0 ? (
        logs.map((log) => (
          <div key={log.id} className="group">
            <div
              className={`rounded-xl border transition-all cursor-pointer hover:shadow-lg p-5 ${getStatusColor(
                log.total_successful || 0,
                log.total_failed || 0
              )}`}
              onClick={() => toggleExpand(log.id)}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title and Status */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base truncate">
                        {log.title}
                      </h3>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">
                        {log.total_recipients} recipient
                        {log.total_recipients !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {(log.total_successful || log.total_failed) && (
                      <>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-700">
                            {log.total_successful || 0} sent
                          </span>
                        </div>
                        {log.total_failed > 0 && (
                          <div className="flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="font-medium text-red-700">
                              {log.total_failed} failed
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {formatDate(log.sent_at)}
                    </div>

                    {log.message_id && (
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-mono text-gray-500">
                          {log.message_id.substring(0, 12)}...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Tag */}
                  {log.event_title && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        <Mail className="w-3 h-3" />
                        {log.event_title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(log.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === log.id && (
                <div className="mt-4 pt-4 border-t border-gray-300 space-y-4">
                  {/* Subject with copy button */}
                  <CopyableText
                    id={`subject-${log.id}`}
                    value={log.subject}
                    label="SUBJECT"
                  />

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500 text-xs font-medium mb-1">
                        SENDER
                      </p>
                      <p className="text-gray-900 break-all">
                        {log.sender_email}
                      </p>
                    </div>

                    {log.to_emails && log.to_emails.length > 0 && (
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-1">
                          TO
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {log.to_emails.map((email, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-sm text-sm"
                            >
                              {email}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {log.cc_emails && log.cc_emails.length > 0 && (
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-1">
                          CC
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {log.cc_emails.map((email, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                            >
                              {email}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message IDs */}
                  {(log.message_id || log.parent_message_id) && (
                    <div className="space-y-3">
                      {log.message_id && (
                        <MessageIdSection
                          id={`msg-${log.id}`}
                          value={log.message_id}
                          label="MESSAGE ID"
                        />
                      )}
                      {log.parent_message_id && (
                        <MessageIdSection
                          id={`parent-${log.id}`}
                          value={log.parent_message_id}
                          label="FOLLOW-UP OF"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16">
          <Send className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-medium">No emails sent yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Your email history will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default History;
