import { useEffect, useState } from "react";
import {
  Building,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";

import {
  getCompaniesList,
  getCompanyDetails,
} from "../services/analyticsService";

export default function Companies({
  batchYear,
  selectedCompanyDetail,
  setSelectedCompanyDetail,
}) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const result = await getCompaniesList(batchYear);

        if (result.success) {
          setCompanies(result.data);
          setError(null);
        } else {
          throw new Error("Failed to fetch companies");
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [batchYear]);

  // Collective export function
  const handleExportAllCompanies = async () => {
    setExportLoading(true);
    try {
      const workbook = XLSX.utils.book_new();
      let companyIndex = 1;

      for (const company of companies) {
        try {
          const result = await getCompanyDetails(batchYear, company.id);

          if (result.success) {
            const detailData = result.data;

            // Create a unique sheet name (max 31 chars in Excel)
            const sheetName = `${companyIndex}. ${(detailData.company?.name || "Company").substring(0, 20)}`;

            // Company overview
            const companyInfo = [
              ["COMPANY INFORMATION"],
              ["Company Name", detailData.company?.name || "-"],
              ["Sector", detailData.company?.sector || "-"],
              ["Website", detailData.company?.websiteUrl || "-"],
              ["Office Address", detailData.company?.officeAddress || "-"],
              ["Work Locations", detailData.company?.workLocations || "-"],
              ["Glassdoor Rating", detailData.company?.glassdoorRating || "-"],
              [
                "Scheduled Visit",
                detailData.company?.scheduledVisit
                  ? new Date(
                      detailData.company.scheduledVisit
                    ).toLocaleDateString()
                  : "-",
              ],
              [
                "Bond Required",
                detailData.company?.bondRequired ? "Yes" : "No",
              ],
              [],
              ["ELIGIBILITY CRITERIA"],
              [
                "Min CGPA",
                detailData.company?.eligibilityCriteria?.minCgpa || "-",
              ],
              [
                "Min 10th %",
                detailData.company?.eligibilityCriteria?.min10th || "-",
              ],
              [
                "Min 12th %",
                detailData.company?.eligibilityCriteria?.min12th || "-",
              ],
              [
                "Max Backlogs",
                detailData.company?.eligibilityCriteria?.maxBacklogs
                  ? "Yes"
                  : "No",
              ],
              [],
              ["STATISTICS"],
              ["Total Eligible", detailData.eligibility?.totalEligible || 0],
              [
                "Total Ineligible",
                detailData.eligibility?.totalIneligible || 0,
              ],
              [
                "Total Registered",
                detailData.registration?.totalRegistered || 0,
              ],
              ["Total Placed", detailData.eligibility?.totalPlaced || 0],
            ];

            let currentRow = companyInfo.length + 2;

            // Add positions
            if (detailData.positions && detailData.positions.length > 0) {
              const positionsData = [["POSITIONS"]];
              const positionRows = detailData.positions.map((pos) => [
                pos.title,
                pos.jobType?.replace(/_/g, " ") || "-",
                pos.companyType?.replace(/_/g, " ") || "-",
                pos.hasRange
                  ? `${pos.package} - ${pos.packageEnd}`
                  : pos.package,
                pos.internshipStipend || "-",
                new Date(pos.roundsStartDate).toLocaleDateString(),
                new Date(pos.roundsEndDate).toLocaleDateString(),
                pos.totalSelected || 0,
                pos.isActive ? "Active" : "Inactive",
              ]);
              positionsData.push([
                "Position",
                "Job Type",
                "Company Type",
                "Package (LPA)",
                "Stipend",
                "Rounds Start",
                "Rounds End",
                "Selected",
                "Status",
              ]);
              positionsData.push(...positionRows);
              companyInfo.push(...positionsData);
            }

            // Add events
            if (
              detailData.events &&
              (detailData.events.shared?.length > 0 ||
                detailData.events.specific?.length > 0)
            ) {
              const allEvents = [
                ...(detailData.events.shared || []),
                ...(detailData.events.specific || []),
              ];
              const eventsData = [[], ["RECRUITMENT ROUNDS"]];
              const eventRows = allEvents.map((event) => {
                const getEventTypeLabel = (type) => {
                  const labels = {
                    pre_placement_talk: "Pre Placement Talk",
                    technical_mcq: "Technical MCQ",
                    technical_round_1: "Technical Round 1",
                    technical_round_2: "Technical Round 2",
                    hr_round: "HR Round",
                    group_discussion: "Group Discussion",
                    coding_test: "Coding Test",
                    final_round: "Final Round",
                  };
                  return labels[type] || type?.replace(/_/g, " ");
                };

                return [
                  event.roundNumber,
                  event.roundType?.charAt(0).toUpperCase() +
                    event.roundType?.slice(1),
                  event.title,
                  getEventTypeLabel(event.type),
                  new Date(event.date).toLocaleDateString(),
                  event.startTime || "-",
                  event.endTime || "-",
                  event.venue || "-",
                  event.mode || "-",
                  event.status?.charAt(0).toUpperCase() +
                    event.status?.slice(1),
                  event.attendance?.present || 0,
                  event.attendance?.absent || 0,
                  event.overallResults?.selected || 0,
                  event.overallResults?.rejected || 0,
                  event.overallResults?.pending || 0,
                ];
              });
              eventsData.push([
                "Round",
                "Type",
                "Event Title",
                "Event Type",
                "Date",
                "Start Time",
                "End Time",
                "Venue",
                "Mode",
                "Status",
                "Present",
                "Absent",
                "Selected",
                "Rejected",
                "Pending",
              ]);
              eventsData.push(...eventRows);
              companyInfo.push(...eventsData);
            }

            // Create sheet with all data
            const ws = XLSX.utils.aoa_to_sheet(companyInfo);
            ws["!cols"] = [
              { wch: 20 },
              { wch: 18 },
              { wch: 18 },
              { wch: 16 },
              { wch: 18 },
              { wch: 14 },
              { wch: 14 },
              { wch: 12 },
              { wch: 12 },
              { wch: 12 },
              { wch: 10 },
              { wch: 10 },
              { wch: 10 },
              { wch: 10 },
              { wch: 10 },
            ];
            XLSX.utils.book_append_sheet(workbook, ws, sheetName);
            companyIndex++;
          }
        } catch (err) {
          console.error(
            `Error fetching details for company ${company.id}:`,
            err
          );
        }
      }

      XLSX.writeFile(workbook, `all-companies-details-${Date.now()}.xlsx`);
    } catch (err) {
      console.error("Export error:", err);
      alert("Error exporting companies. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl border border-red-200 p-6 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <div>
          <h3 className="text-lg font-bold text-red-900">
            Error Loading Companies
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 text-center">
        <Building className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-blue-900">No Companies</h3>
        <p className="text-blue-700">No companies found for this batch.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Collective Export Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-end">
        <button
          onClick={handleExportAllCompanies}
          disabled={exportLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
        >
          {exportLoading ? (
            <>
              <div className="inline-block animate-spin">
                <div className="w-4 h-4 border-2 border-white border-t-green-200 rounded-full"></div>
              </div>
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export All Companies
            </>
          )}
        </button>
      </div>
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          batchYear={batchYear}
          selectedCompanyDetail={selectedCompanyDetail}
          setSelectedCompanyDetail={setSelectedCompanyDetail}
        />
      ))}
    </div>
  );
}

function CompanyCard({
  company,
  batchYear,
  selectedCompanyDetail,
  setSelectedCompanyDetail,
}) {
  const isExpanded = selectedCompanyDetail === company.id;
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const handleToggleDetails = async () => {
    if (isExpanded) {
      setSelectedCompanyDetail(null);
      setDetailData(null);
    } else {
      // Fetch detailed data
      try {
        setDetailLoading(true);
        setDetailError(null);
        const result = await getCompanyDetails(batchYear, company.id);
        if (result.success) {
          setDetailData(result.data);
        } else {
          setDetailError("Failed to load company details");
        }
      } catch (err) {
        console.error("Error:", err);
        setDetailError(err.message);
      } finally {
        setDetailLoading(false);
      }
      setSelectedCompanyDetail(company.id);
    }
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      pre_placement_talk: "Pre Placement Talk",
      technical_mcq: "Technical MCQ",
      technical_round_1: "Technical Round 1",
      technical_round_2: "Technical Round 2",
      hr_round: "HR Round",
      group_discussion: "Group Discussion",
      coding_test: "Coding Test",
      final_round: "Final Round",
    };
    return labels[type] || type?.replace(/_/g, " ");
  };

  // Helper function to organize events by rounds
  const organizeEventsByRound = (events) => {
    if (!events) return [];

    // Combine shared and specific events
    const allEvents = [...(events.shared || []), ...(events.specific || [])];

    // Sort by roundNumber, then by date
    const sortedEvents = allEvents.sort((a, b) => {
      if (a.roundNumber !== b.roundNumber) {
        return a.roundNumber - b.roundNumber;
      }
      return new Date(a.date) - new Date(b.date);
    });

    // Group by roundNumber
    const roundMap = {};
    sortedEvents.forEach((event) => {
      const roundKey = event.roundNumber;
      if (!roundMap[roundKey]) {
        roundMap[roundKey] = {
          roundNumber: event.roundNumber,
          roundType: event.roundType,
          events: [],
        };
      }
      roundMap[roundKey].events.push(event);
    });

    // Return as array sorted by roundNumber
    return Object.values(roundMap).sort(
      (a, b) => a.roundNumber - b.roundNumber
    );
  };

  // Export company details to Excel
  const handleExportDetails = () => {
    if (!detailData) return;

    const workbook = XLSX.utils.book_new();

    // Sheet 1: Company Overview
    const companyData = [
      {
        Field: "Company Name",
        Value: detailData.company?.name || "-",
      },
      {
        Field: "Sector",
        Value: detailData.company?.sector || "-",
      },
      {
        Field: "Website",
        Value: detailData.company?.websiteUrl || "-",
      },
      {
        Field: "Office Address",
        Value: detailData.company?.officeAddress || "-",
      },
      {
        Field: "Work Locations",
        Value: detailData.company?.workLocations || "-",
      },
      {
        Field: "Glassdoor Rating",
        Value: detailData.company?.glassdoorRating || "-",
      },
      {
        Field: "Scheduled Visit",
        Value: detailData.company?.scheduledVisit
          ? new Date(detailData.company.scheduledVisit).toLocaleDateString()
          : "-",
      },
      {
        Field: "Bond Required",
        Value: detailData.company?.bondRequired ? "Yes" : "No",
      },
      {
        Field: "",
        Value: "",
      },
      {
        Field: "ELIGIBILITY CRITERIA",
        Value: "",
      },
      {
        Field: "Min CGPA",
        Value: detailData.company?.eligibilityCriteria?.minCgpa || "-",
      },
      {
        Field: "Min 10th Percentage",
        Value: detailData.company?.eligibilityCriteria?.min10th || "-",
      },
      {
        Field: "Min 12th Percentage",
        Value: detailData.company?.eligibilityCriteria?.min12th || "-",
      },
      {
        Field: "Max Backlogs",
        Value: detailData.company?.eligibilityCriteria?.maxBacklogs
          ? "Yes"
          : "No",
      },
      {
        Field: "Allowed Specializations",
        Value:
          detailData.company?.eligibilityCriteria?.allowedSpecializations ||
          "-",
      },
    ];

    const companySheet = XLSX.utils.json_to_sheet(companyData);
    companySheet["!cols"] = [{ wch: 25 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(workbook, companySheet, "Company Info");

    // Sheet 2: Eligibility & Registration
    const eligibilityData = [
      {
        Metric: "Total Eligible",
        Count: detailData.eligibility?.totalEligible || 0,
      },
      {
        Metric: "Total Ineligible",
        Count: detailData.eligibility?.totalIneligible || 0,
      },
      {
        Metric: "Total Registered",
        Count: detailData.registration?.totalRegistered || 0,
      },
      {
        Metric: "Total Placed",
        Count: detailData.eligibility?.totalPlaced || 0,
      },
    ];

    const eligibilitySheet = XLSX.utils.json_to_sheet(eligibilityData);
    eligibilitySheet["!cols"] = [{ wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, eligibilitySheet, "Eligibility");

    // Sheet 3: Positions
    if (detailData.positions && detailData.positions.length > 0) {
      const positionsData = detailData.positions.map((pos) => ({
        "Position Title": pos.title,
        "Job Type": pos.jobType?.replace(/_/g, " ") || "-",
        "Company Type": pos.companyType?.replace(/_/g, " ") || "-",
        "Package (LPA)": pos.hasRange
          ? `${pos.package} - ${pos.packageEnd}`
          : pos.package,
        "Internship Stipend": pos.internshipStipend || "-",
        "Rounds Start": new Date(pos.roundsStartDate).toLocaleDateString(),
        "Rounds End": new Date(pos.roundsEndDate).toLocaleDateString(),
        "Total Selected": pos.totalSelected || 0,
        Status: pos.isActive ? "Active" : "Inactive",
      }));

      const positionsSheet = XLSX.utils.json_to_sheet(positionsData);
      positionsSheet["!cols"] = [
        { wch: 22 },
        { wch: 18 },
        { wch: 16 },
        { wch: 18 },
        { wch: 18 },
        { wch: 14 },
        { wch: 14 },
        { wch: 14 },
        { wch: 12 },
      ];
      XLSX.utils.book_append_sheet(workbook, positionsSheet, "Positions");
    }

    // Sheet 4: Events/Rounds Summary
    if (
      detailData.events &&
      (detailData.events.shared?.length > 0 ||
        detailData.events.specific?.length > 0)
    ) {
      const allEvents = [
        ...(detailData.events.shared || []),
        ...(detailData.events.specific || []),
      ];
      const eventsData = allEvents.map((event) => ({
        "Round Number": event.roundNumber,
        "Round Type":
          event.roundType?.charAt(0).toUpperCase() + event.roundType?.slice(1),
        "Event Title": event.title,
        "Event Type": getEventTypeLabel(event.type),
        Date: new Date(event.date).toLocaleDateString(),
        "Start Time": event.startTime || "-",
        "End Time": event.endTime || "-",
        Venue: event.venue || "-",
        Mode: event.mode || "-",
        Status: event.status?.charAt(0).toUpperCase() + event.status?.slice(1),
        Present: event.attendance?.present || 0,
        Absent: event.attendance?.absent || 0,
        Selected: event.overallResults?.selected || 0,
        Rejected: event.overallResults?.rejected || 0,
        Pending: event.overallResults?.pending || 0,
        Positions:
          detailData.positions
            ?.filter((pos) => event.positionIds?.includes(pos.id))
            .map((pos) => pos.title)
            .join(", ") || "-",
      }));

      const eventsSheet = XLSX.utils.json_to_sheet(eventsData);
      eventsSheet["!cols"] = [
        { wch: 12 },
        { wch: 14 },
        { wch: 22 },
        { wch: 18 },
        { wch: 14 },
        { wch: 12 },
        { wch: 12 },
        { wch: 14 },
        { wch: 12 },
        { wch: 12 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 30 },
      ];
      XLSX.utils.book_append_sheet(workbook, eventsSheet, "Recruitment Rounds");
    }

    // Write file
    XLSX.writeFile(
      workbook,
      `${detailData.company?.name || "company"}-details-${Date.now()}.xlsx`
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              {company.name || company.company}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{company.sector}</p>
            {company.scheduledVisit && (
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Visit: {new Date(company.scheduledVisit).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && detailData && !detailLoading && (
            <button
              onClick={handleExportDetails}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Export Details
            </button>
          )}
          <button
            onClick={handleToggleDetails}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <>
                Hide Details <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                View Details <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {company.totalEligible || 0}
          </div>
          <div className="text-xs text-gray-600">Eligible</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {company.totalRegistered || 0}
          </div>
          <div className="text-xs text-gray-600">Registered</div>
        </div>
        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
          <div className="text-2xl font-bold text-emerald-600">
            {company.totalSelected || 0}
          </div>
          <div className="text-xs text-gray-600">Selected</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">
            {company.totalPlaced || 0}
          </div>
          <div className="text-xs text-gray-600">Placed</div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-6 space-y-4 border-t pt-6">
          {detailLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin">
                <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-600 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Loading details...</p>
            </div>
          )}

          {detailError && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{detailError}</p>
            </div>
          )}

          {detailData && !detailLoading && (
            <>
              {/* Positions */}
              {detailData.positions && detailData.positions.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Positions
                  </h4>
                  <div className="space-y-3">
                    {detailData.positions.map((position) => (
                      <div
                        key={position.id}
                        className="bg-white p-4 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              {position.title}
                            </h5>
                            <p className="text-xs text-gray-600 mt-1">
                              {position.jobType?.replace(/_/g, " ")} •{" "}
                              {position.companyType?.replace(/_/g, " ")}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-600">
                              ₹{position.package}
                              {position.hasRange
                                ? ` - ₹${position.packageEnd}`
                                : ""}{" "}
                              LPA
                            </div>
                          </div>
                        </div>
                        {position.roundsStartDate && (
                          <p className="text-xs text-gray-600 mt-2">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(
                              position.roundsStartDate
                            ).toLocaleDateString()}{" "}
                            to{" "}
                            {new Date(
                              position.roundsEndDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Events - Organized by Rounds */}
              {detailData.events &&
                (detailData.events.shared?.length > 0 ||
                  detailData.events.specific?.length > 0) && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Recruitment Rounds
                    </h4>
                    <div className="space-y-6">
                      {organizeEventsByRound(detailData.events).map(
                        (round, roundIdx) => (
                          <div key={roundIdx} className="space-y-3">
                            {/* Round Header */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                Round {round.roundNumber} -{" "}
                                {round.roundType?.charAt(0).toUpperCase() +
                                  round.roundType?.slice(1)}
                              </div>
                            </div>

                            {/* Events in this round */}
                            <div className="space-y-2 ml-4">
                              {round.events.map((event, eventIdx) => (
                                <div
                                  key={event.id}
                                  className="bg-white p-4 rounded-lg border border-gray-100"
                                >
                                  <div className="flex gap-4">
                                    <div className="flex flex-col items-center flex-shrink-0">
                                      <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
                                      {eventIdx < round.events.length - 1 && (
                                        <div className="w-0.5 h-12 bg-blue-200 mt-1"></div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between mb-1">
                                        <div>
                                          <h5 className="font-semibold text-gray-900">
                                            {event.title}
                                          </h5>

                                          {/* event type and positions on the same line */}
                                          <div className="flex items-center flex-wrap gap-2 mt-1 text-xs text-gray-600">
                                            <span>
                                              {getEventTypeLabel(event.type)}
                                            </span>

                                            {event.positionIds &&
                                              event.positionIds.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                  {detailData.positions
                                                    ?.filter((pos) =>
                                                      event.positionIds.includes(
                                                        pos.id
                                                      )
                                                    )
                                                    .map((pos) => (
                                                      <span
                                                        key={pos.id}
                                                        className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded text-xs"
                                                      >
                                                        {pos.title}
                                                      </span>
                                                    ))}
                                                </div>
                                              )}
                                          </div>
                                        </div>

                                        <span
                                          className={`text-xs font-medium px-2 py-1 rounded capitalize ${
                                            event.status === "completed"
                                              ? "bg-green-100 text-green-700"
                                              : event.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100 text-gray-700"
                                          }`}
                                        >
                                          {event.status}
                                        </span>
                                      </div>

                                      <p className="text-xs text-gray-600 mb-3">
                                        {new Date(
                                          event.date
                                        ).toLocaleDateString()}{" "}
                                        • {event.startTime || "N/A"}
                                        {event.venue && ` • ${event.venue}`}
                                      </p>

                                      {/* Attendance and Results */}
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {event.attendance && (
                                          <>
                                            <div className="text-xs bg-green-50 p-2 rounded border border-green-200">
                                              <span className="text-gray-600">
                                                Present:
                                              </span>
                                              <span className="font-semibold text-green-700 ml-1">
                                                {event.attendance.present}
                                              </span>
                                            </div>
                                            <div className="text-xs bg-red-50 p-2 rounded border border-red-200">
                                              <span className="text-gray-600">
                                                Absent:
                                              </span>
                                              <span className="font-semibold text-red-700 ml-1">
                                                {event.attendance.absent}
                                              </span>
                                            </div>
                                          </>
                                        )}
                                        {event.overallResults && (
                                          <>
                                            <div className="text-xs bg-emerald-50 p-2 rounded border border-emerald-200">
                                              <span className="text-gray-600">
                                                Selected:
                                              </span>
                                              <span className="font-semibold text-emerald-700 ml-1">
                                                {event.overallResults.selected}
                                              </span>
                                            </div>
                                            <div className="text-xs bg-orange-50 p-2 rounded border border-orange-200">
                                              <span className="text-gray-600">
                                                Rejected:
                                              </span>
                                              <span className="font-semibold text-orange-700 ml-1">
                                                {event.overallResults.rejected}
                                              </span>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
