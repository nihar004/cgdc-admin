import React, { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  X,
  ArrowLeft,
  Users,
} from "lucide-react";

const UpdateResultsModal = ({ results, onClose }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const {
    updated,
    notFound,
    errors,
    updatedStudents,
    notFoundStudents,
    errorStudents,
  } = results;

  const tabs = [
    {
      key: "updated",
      label: "Successfully Updated",
      count: updated,
      color: "green",
      icon: CheckCircle,
      students: updatedStudents,
    },
    {
      key: "notFound",
      label: "Not Found",
      count: notFound,
      color: "yellow",
      icon: AlertCircle,
      students: notFoundStudents,
    },
    {
      key: "errors",
      label: "Update Errors",
      count: errors,
      color: "red",
      icon: XCircle,
      students: errorStudents,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: {
        bg: "bg-gradient-to-br from-emerald-50 to-green-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: "text-emerald-600",
        badge: "bg-emerald-100 text-emerald-800",
        accent: "bg-emerald-500",
        hover: "hover:from-emerald-100 hover:to-green-100",
      },
      yellow: {
        bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: "text-amber-600",
        badge: "bg-amber-100 text-amber-800",
        accent: "bg-amber-500",
        hover: "hover:from-amber-100 hover:to-yellow-100",
      },
      red: {
        bg: "bg-gradient-to-br from-rose-50 to-red-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: "text-rose-600",
        badge: "bg-rose-100 text-rose-800",
        accent: "bg-rose-500",
        hover: "hover:from-rose-100 hover:to-red-100",
      },
    };
    return colors[color];
  };

  const totalProcessed = updated + notFound + errors;

  return (
    <div className="fixed h-full inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 w-full max-w-3xl mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Update Results
            </h2>
            <p className="text-sm text-gray-500">
              {showDetails
                ? `Viewing ${activeTab?.label}`
                : "Summary of bulk update operation"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!showDetails ? (
            /* Summary View */
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Update Complete
                </h3>
                <p className="text-gray-600">
                  Processed{" "}
                  <span className="font-semibold text-purple-600">
                    {totalProcessed}
                  </span>{" "}
                  student records
                </p>
              </div>

              {/* Results Cards */}
              <div className="space-y-4">
                {tabs.map((tab) => {
                  const colors = getColorClasses(tab.color);
                  const Icon = tab.icon;

                  return (
                    <div
                      key={tab.key}
                      className={`${colors.bg} ${colors.border} ${colors.hover} border rounded-xl p-6 transition-all duration-200 hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center border-2 ${colors.border}`}
                          >
                            <Icon className={`h-6 w-6 ${colors.icon}`} />
                          </div>
                          <div>
                            <h4
                              className={`text-lg font-semibold ${colors.text}`}
                            >
                              {tab.label}
                            </h4>
                            <p className={`text-sm ${colors.text} opacity-75`}>
                              {tab.count === 0
                                ? "No students"
                                : tab.count === 1
                                  ? "1 student"
                                  : `${tab.count} students`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span
                            className={`${colors.badge} px-3 py-1 rounded-full text-sm font-medium`}
                          >
                            {tab.count}
                          </span>
                          {tab.count > 0 && (
                            <button
                              onClick={() => {
                                setActiveTab(tab);
                                setShowDetails(true);
                              }}
                              className={`${colors.text} hover:opacity-75 flex items-center space-x-2 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/50 transition-all duration-200`}
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Details View */
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => setShowDetails(false)}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium group transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to Summary</span>
              </button>

              {/* Details Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div
                  className={`${getColorClasses(activeTab.color).bg} px-6 py-4 border-b border-gray-200`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full ${getColorClasses(activeTab.color).accent} flex items-center justify-center`}
                    >
                      <activeTab.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-semibold ${getColorClasses(activeTab.color).text}`}
                      >
                        {activeTab.label}
                      </h3>
                      <p
                        className={`text-sm ${getColorClasses(activeTab.color).text} opacity-75`}
                      >
                        {activeTab.count}{" "}
                        {activeTab.count === 1 ? "student" : "students"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Student List */}
                <div className="max-h-80 overflow-y-auto">
                  {activeTab.students && activeTab.students.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {activeTab.students.map((student, index) => (
                        <div
                          key={index}
                          className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {student.first_name} {student.last_name}
                                </h4>
                                {activeTab.key === "updated" && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800">
                                    Updated
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    Registration:
                                  </span>{" "}
                                  {student.registration_number || "N/A"}
                                </p>
                                {student.branch && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Course:</span>{" "}
                                    {student.branch} • Batch{" "}
                                    {student.batch_year}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Status Messages */}
                            <div className="flex-shrink-0 ml-4">
                              {activeTab.key === "errors" && student.error && (
                                <div className="text-right">
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-rose-100 text-rose-800 mb-1">
                                    Error
                                  </span>
                                  <p className="text-xs text-rose-600 max-w-xs">
                                    {student.error}
                                  </p>
                                </div>
                              )}

                              {activeTab.key === "notFound" && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800">
                                  Not Found
                                </span>
                              )}

                              {activeTab.key === "updated" && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800">
                                  Success
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No students in this category
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!showDetails && (
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateResultsModal;
