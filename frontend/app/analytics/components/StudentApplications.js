import {
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Utility functions
const getStatusBadge = (status) => {
  const badges = {
    selected: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Selected",
    },
    rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
    not_eligible: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      label: "Not Eligible",
    },
    in_progress: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "In Progress",
    },
    offer_received: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Offer Received",
    },
    offer_accepted: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      label: "Accepted",
    },
  };
  return badges[status] || null;
};

const getEventTypeLabel = (type) => {
  const labels = {
    pre_placement_talk: "Pre-Placement Talk",
    online_assessment: "Online Assessment",
    coding_test: "Coding Test",
    aptitude_test: "Aptitude Test",
    technical_round_1: "Technical Round 1",
    technical_round_2: "Technical Round 2",
    technical_round_3: "Technical Round 3",
    group_discussion: "Group Discussion",
    hr_round: "HR Round",
    final_round: "Final Round",
  };
  return labels[type] || type.replace(/_/g, " ");
};

export default function StudentApplications({
  applications,
  expandedStudentCompany,
  setExpandedStudentCompany,
}) {
  // Transform applications
  const transformedApplications = applications.map((app) => {
    // Safety checks
    if (!app.rounds || !Array.isArray(app.rounds)) {
      return createEmptyApplication(app);
    }

    // Find rejection point
    let rejectionIndex = -1;
    app.rounds.forEach((round, idx) => {
      if (round.resultStatus === "rejected") {
        rejectionIndex = idx;
      }
    });

    // Build journey with all rounds
    const journey = app.rounds.map((round, idx) => {
      let status = "pending";

      // If rejected in previous round, mark as not eligible
      if (rejectionIndex !== -1 && idx > rejectionIndex) {
        status = "not_eligible";
      } else if (round.resultStatus === "selected") {
        status = "selected";
      } else if (round.resultStatus === "rejected") {
        status = "rejected";
      } else if (round.resultStatus === null) {
        status = "pending";
      }

      return {
        type: round.eventType,
        date: round.eventDate,
        status: status,
        title: round.eventTitle,
        roundNumber: round.roundNumber,
      };
    });

    // Overall status
    let overallStatus = "in_progress";
    if (app.isAcceptedOffer) {
      overallStatus = "offer_accepted";
    } else if (app.finalStatus === "selected") {
      overallStatus = "offer_received";
    } else if (rejectionIndex !== -1) {
      overallStatus = "rejected";
    }

    const mainPosition = (app.positions && app.positions[0]) || {
      positionTitle: "N/A",
      package: 0,
    };

    return {
      company: app.companyName,
      sector: app.sector,
      position: mainPosition.positionTitle,
      appliedDate: new Date(app.firstInteractionDate).toLocaleDateString(
        "en-IN",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      ),
      status: overallStatus,
      package: mainPosition.package,
      packageRange: mainPosition.hasRange
        ? `${mainPosition.package} - ${mainPosition.packageEnd}`
        : null,
      events: journey,
      rejectionIndex: rejectionIndex,
      positions: app.positions || [],
    };
  });

  // Sort applications
  const sorted = [...transformedApplications].sort((a, b) => {
    if (a.status === "offer_accepted") return -1;
    if (b.status === "offer_accepted") return 1;
    if (a.status === "offer_received") return -1;
    if (b.status === "offer_received") return 1;
    return 0;
  });

  return (
    <div className="space-y-4">
      {sorted.map((app, idx) => (
        <ApplicationCard
          key={idx}
          app={app}
          idx={idx}
          isExpanded={expandedStudentCompany === idx}
          onToggle={() =>
            setExpandedStudentCompany(
              expandedStudentCompany === idx ? null : idx
            )
          }
        />
      ))}
    </div>
  );
}

function createEmptyApplication(app) {
  const mainPosition = (app.positions && app.positions[0]) || {
    positionTitle: "N/A",
    package: 0,
  };
  return {
    company: app.companyName,
    sector: app.sector,
    position: mainPosition.positionTitle,
    appliedDate: new Date(app.firstInteractionDate).toLocaleDateString(
      "en-IN",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    ),
    status: "in_progress",
    package: mainPosition.package,
    packageRange: null,
    events: [],
    rejectionIndex: -1,
    positions: app.positions || [],
  };
}

function ApplicationCard({ app, idx, isExpanded, onToggle }) {
  const statusBadge = getStatusBadge(app.status);
  const clearedRounds = app.events.filter(
    (e) => e.status === "selected"
  ).length;
  const totalRounds = app.events.length;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border transition-all ${
        app.status === "offer_accepted"
          ? "border-purple-200 ring-2 ring-purple-100"
          : "border-gray-100"
      } p-6 hover:shadow-md`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900">{app.company}</h3>
            {app.status === "offer_accepted" && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                ✓ ACCEPTED
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{app.position}</p>
          <p className="text-xs text-gray-500 mt-2">
            Applied: {app.appliedDate}
          </p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          {statusBadge && (
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}
            >
              {statusBadge.label}
            </span>
          )}
          {app.package && (
            <p className="text-lg font-bold text-emerald-600">
              ₹{app.packageRange || app.package} LPA
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {totalRounds > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">
              Progress: {clearedRounds}/{totalRounds} rounds cleared
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${
                app.status === "rejected"
                  ? "bg-red-500"
                  : app.status === "offer_accepted"
                    ? "bg-purple-500"
                    : app.status === "offer_received"
                      ? "bg-emerald-500"
                      : "bg-blue-500"
              }`}
              style={{ width: `${(clearedRounds / totalRounds) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            View All Rounds
          </>
        )}
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          {/* Position Details */}
          {app.positions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-3">
                Position Applied
              </h4>
              {app.positions.map((pos, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {pos.positionTitle}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">
                        {pos.jobType.replace(/_/g, " ")}
                      </p>
                    </div>
                    <p className="font-bold text-emerald-600">
                      ₹
                      {pos.hasRange
                        ? `${pos.package} - ${pos.packageEnd}`
                        : pos.package}{" "}
                      LPA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All Rounds */}
          {app.events.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gray-300"></div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  All Rounds
                </span>
                <div className="h-px flex-1 bg-gray-300"></div>
              </div>

              <div className="space-y-3">
                {app.events.map((event, eventIdx) => {
                  const isNotEligible = event.status === "not_eligible";
                  const isRejected = event.status === "rejected";
                  const isSelected = event.status === "selected";
                  const isPending = event.status === "pending";
                  const showConnector =
                    eventIdx < app.events.length - 1 && !isRejected;

                  return (
                    <div key={eventIdx}>
                      <div
                        className={`flex items-start gap-4 p-4 rounded-lg border ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-200"
                            : isRejected
                              ? "bg-red-50 border-red-200"
                              : isNotEligible
                                ? "bg-gray-50 border-gray-300"
                                : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex flex-col items-center pt-1">
                          {isSelected && (
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                          )}
                          {isRejected && (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                          {isPending && (
                            <Clock className="w-6 h-6 text-blue-600" />
                          )}
                          {isNotEligible && (
                            <Ban className="w-6 h-6 text-gray-400" />
                          )}

                          {showConnector && (
                            <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-gray-900">
                                Round {event.roundNumber}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="font-semibold text-gray-700">
                                {getEventTypeLabel(event.type)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                              {new Date(event.date).toLocaleDateString(
                                "en-IN",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{event.title}</p>
                          {isNotEligible && (
                            <p className="text-xs text-gray-500 mt-1 italic">
                              Not eligible due to previous rejection
                            </p>
                          )}
                        </div>

                        <div>
                          {getStatusBadge(event.status) && (
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${getStatusBadge(event.status).bg} ${getStatusBadge(event.status).text}`}
                            >
                              {getStatusBadge(event.status).label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Final Status Messages */}
              {app.status === "offer_accepted" && (
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border-2 border-purple-200 mt-4">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-bold text-purple-900">
                      Offer Accepted! 🎉
                    </p>
                    <p className="text-sm text-purple-700">
                      Successfully accepted this position
                    </p>
                  </div>
                </div>
              )}

              {app.status === "offer_received" && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200 mt-4">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-bold text-emerald-900">
                      Offer Received! 🎊
                    </p>
                    <p className="text-sm text-emerald-700">
                      Congratulations on your offer!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
