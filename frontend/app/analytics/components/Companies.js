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
          if (!result.success) continue;

          const detailData = result.data;

          const sheetName = `${companyIndex}. ${(detailData.company?.name || "Company").substring(0, 20)}`;
          const sheetData = [];

          // --- COMPANY INFO ---
          sheetData.push(["COMPANY INFORMATION"]);
          sheetData.push(["Company Name", detailData.company?.name || "-"]);
          sheetData.push(["Sector", detailData.company?.sector || "-"]);
          sheetData.push(["Website", detailData.company?.websiteUrl || "-"]);
          sheetData.push([
            "Office Address",
            detailData.company?.officeAddress || "-",
          ]);
          sheetData.push([
            "Work Locations",
            detailData.company?.workLocations || "-",
          ]);
          sheetData.push([
            "Glassdoor Rating",
            detailData.company?.glassdoorRating || "-",
          ]);
          sheetData.push([
            "Scheduled Visit",
            detailData.company?.scheduledVisit
              ? new Date(detailData.company.scheduledVisit).toLocaleDateString()
              : "-",
          ]);
          sheetData.push([
            "Bond Required",
            detailData.company?.bondRequired ? "Yes" : "No",
          ]);
          sheetData.push([]);

          // --- ELIGIBILITY CRITERIA ---
          sheetData.push(["ELIGIBILITY CRITERIA"]);
          sheetData.push([
            "Min CGPA",
            detailData.company?.eligibilityCriteria?.minCgpa || "-",
          ]);
          sheetData.push([
            "Min 10th %",
            detailData.company?.eligibilityCriteria?.min10th || "-",
          ]);
          sheetData.push([
            "Min 12th %",
            detailData.company?.eligibilityCriteria?.min12th || "-",
          ]);
          sheetData.push([
            "Max Backlogs",
            detailData.company?.eligibilityCriteria?.maxBacklogs ? "Yes" : "No",
          ]);
          sheetData.push([
            "Allowed Specializations",
            detailData.company?.eligibilityCriteria?.allowedSpecializations ||
              "-",
          ]);
          sheetData.push([]);

          // --- STATISTICS ---
          sheetData.push(["STATISTICS"]);
          sheetData.push([
            "Total Eligible",
            detailData.eligibility?.totalEligible || 0,
          ]);
          sheetData.push([
            "Total Ineligible",
            detailData.eligibility?.totalIneligible || 0,
          ]);
          sheetData.push([
            "Total Registered",
            detailData.registration?.totalRegistered || 0,
          ]);
          sheetData.push([
            "Total Placed",
            detailData.eligibility?.totalPlaced || 0,
          ]);
          sheetData.push([]);

          // --- POSITIONS TABLE ---
          if (detailData.positions?.length > 0) {
            sheetData.push(["POSITIONS"]);
            sheetData.push([
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

            detailData.positions.forEach((pos) => {
              sheetData.push([
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
            });
            sheetData.push([]);
          }

          // --- ROUNDS TABLE POSITION WISE ---
          if (detailData.positions?.length > 0) {
            detailData.positions.forEach((pos) => {
              const positionEvents = [
                ...(detailData.events.shared || []),
                ...(detailData.events.specific || []),
              ].filter((e) => e.positionIds?.includes(pos.id));

              if (positionEvents.length > 0) {
                sheetData.push([`${pos.title} - Recruitment Rounds`]);
                sheetData.push([
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

                positionEvents.forEach((event) => {
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

                  sheetData.push([
                    event.roundNumber,
                    event.roundType?.replace(/_/g, " ") || "-",
                    event.title,
                    getEventTypeLabel(event.type),
                    new Date(event.date).toLocaleDateString(),
                    event.startTime || "-",
                    event.endTime || "-",
                    event.venue || "-",
                    event.mode || "-",
                    event.status?.replace(/_/g, " ") || "-",
                    event.attendance?.present || 0,
                    event.attendance?.absent || 0,
                    event.overallResults?.selected || 0,
                    event.overallResults?.rejected || 0,
                    event.overallResults?.pending || 0,
                  ]);
                });
                sheetData.push([]);
              }
            });
          }

          // --- Create sheet ---
          const ws = XLSX.utils.aoa_to_sheet(sheetData);

          // Column widths
          ws["!cols"] = [
            { wch: 25 }, // Column A - Labels/Headers
            { wch: 20 }, // Column B
            { wch: 18 }, // Column C
            { wch: 18 }, // Column D
            { wch: 15 }, // Column E
            { wch: 15 }, // Column F
            { wch: 15 }, // Column G
            { wch: 12 }, // Column H
            { wch: 12 }, // Column I
            { wch: 15 }, // Column J
            { wch: 12 }, // Column K
            { wch: 12 }, // Column L
            { wch: 12 }, // Column M
            { wch: 12 }, // Column N
            { wch: 12 }, // Column O
          ];

          // Apply comprehensive styling
          const range = XLSX.utils.decode_range(ws["!ref"]);

          for (let R = 0; R <= range.e.r; ++R) {
            for (let C = 0; C <= range.e.c; ++C) {
              const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
              if (!ws[cellAddress]) continue;

              const cell = ws[cellAddress];
              const cellValue = cell.v;

              // Initialize cell style
              if (!cell.s) cell.s = {};

              // Section Headers (COMPANY INFORMATION, ELIGIBILITY CRITERIA, etc.)
              if (
                C === 0 &&
                typeof cellValue === "string" &&
                (cellValue.includes("COMPANY INFORMATION") ||
                  cellValue.includes("ELIGIBILITY CRITERIA") ||
                  cellValue.includes("STATISTICS") ||
                  cellValue === "POSITIONS" ||
                  cellValue.includes("- Recruitment Rounds"))
              ) {
                cell.s = {
                  font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
                  fill: { fgColor: { rgb: "1F4E78" } }, // Dark Blue
                  alignment: { horizontal: "center", vertical: "center" },
                  border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                  },
                };

                // Merge cells for section headers
                if (!ws["!merges"]) ws["!merges"] = [];
                ws["!merges"].push({
                  s: { r: R, c: 0 },
                  e: { r: R, c: Math.max(8, range.e.c) },
                });
              }
              // Table Headers (Position, Round, etc.)
              else if (
                typeof cellValue === "string" &&
                (cellValue === "Position" ||
                  cellValue === "Round" ||
                  cellValue === "Job Type" ||
                  cellValue === "Company Type")
              ) {
                cell.s = {
                  font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
                  fill: { fgColor: { rgb: "4472C4" } }, // Medium Blue
                  alignment: {
                    horizontal: "center",
                    vertical: "center",
                    wrapText: true,
                  },
                  border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                  },
                };
              }
              // Label cells (first column in info sections)
              else if (
                C === 0 &&
                typeof cellValue === "string" &&
                cellValue !== "" &&
                !cellValue.includes("INFORMATION") &&
                !cellValue.includes("CRITERIA") &&
                !cellValue.includes("STATISTICS") &&
                !cellValue.includes("POSITIONS") &&
                !cellValue.includes("Rounds")
              ) {
                cell.s = {
                  font: { bold: true, sz: 10, color: { rgb: "1F4E78" } },
                  fill: { fgColor: { rgb: "D9E2F3" } }, // Light Blue
                  alignment: { horizontal: "left", vertical: "center" },
                  border: {
                    top: { style: "thin", color: { rgb: "CCCCCC" } },
                    bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                    left: { style: "thin", color: { rgb: "CCCCCC" } },
                    right: { style: "thin", color: { rgb: "CCCCCC" } },
                  },
                };
              }
              // Value cells (second column in info sections and table data)
              else if (cellValue !== "" && cellValue !== undefined) {
                // Determine if it's a data row in a table
                const isTableData =
                  R > 0 &&
                  ws[XLSX.utils.encode_cell({ r: R - 1, c: C })] &&
                  (ws[XLSX.utils.encode_cell({ r: R - 1, c: 0 })]?.v ===
                    "Position" ||
                    ws[XLSX.utils.encode_cell({ r: R - 1, c: 0 })]?.v ===
                      "Round");

                cell.s = {
                  font: { sz: 10, color: { rgb: "000000" } },
                  fill: {
                    fgColor: {
                      rgb: isTableData && R % 2 === 0 ? "F2F2F2" : "FFFFFF",
                    },
                  },
                  alignment: {
                    horizontal: C === 0 ? "left" : "center",
                    vertical: "center",
                    wrapText: true,
                  },
                  border: {
                    top: { style: "thin", color: { rgb: "E0E0E0" } },
                    bottom: { style: "thin", color: { rgb: "E0E0E0" } },
                    left: { style: "thin", color: { rgb: "E0E0E0" } },
                    right: { style: "thin", color: { rgb: "E0E0E0" } },
                  },
                };

                // Highlight specific values
                if (typeof cellValue === "string") {
                  if (cellValue === "Active") {
                    cell.s.fill = { fgColor: { rgb: "C6EFCE" } }; // Green
                    cell.s.font.color = { rgb: "006100" };
                  } else if (cellValue === "Inactive") {
                    cell.s.fill = { fgColor: { rgb: "FFC7CE" } }; // Red
                    cell.s.font.color = { rgb: "9C0006" };
                  } else if (cellValue === "Yes") {
                    cell.s.font.color = { rgb: "0070C0" };
                    cell.s.font.bold = true;
                  }
                }

                // Highlight numbers
                if (typeof cellValue === "number" && cellValue > 0) {
                  cell.s.font.bold = true;
                  cell.s.font.color = { rgb: "0070C0" };
                }
              }
            }
          }

          // Add row height for better readability
          ws["!rows"] = Array(range.e.r + 1)
            .fill(null)
            .map((_, idx) => {
              const firstCell = ws[XLSX.utils.encode_cell({ r: idx, c: 0 })];
              if (firstCell && typeof firstCell.v === "string") {
                if (
                  firstCell.v.includes("INFORMATION") ||
                  firstCell.v.includes("CRITERIA") ||
                  firstCell.v.includes("STATISTICS") ||
                  firstCell.v.includes("POSITIONS") ||
                  firstCell.v.includes("Rounds")
                ) {
                  return { hpt: 25 }; // Section headers taller
                }
                if (firstCell.v === "Position" || firstCell.v === "Round") {
                  return { hpt: 20 }; // Table headers
                }
              }
              return { hpt: 18 }; // Default row height
            });

          XLSX.utils.book_append_sheet(workbook, ws, sheetName);
          companyIndex++;
        } catch (err) {
          console.error(
            `Error fetching details for company ${company.id}:`,
            err
          );
        }
      }

      // Write file with proper settings
      XLSX.writeFile(workbook, `all-companies-details-${Date.now()}.xlsx`, {
        bookType: "xlsx",
        bookSST: false,
        type: "binary",
      });
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

    // --- Sheet 1: Company Overview ---
    const companyData = [
      { Field: "Company Name", Value: detailData.company?.name || "-" },
      { Field: "Sector", Value: detailData.company?.sector || "-" },
      { Field: "Website", Value: detailData.company?.websiteUrl || "-" },
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
      { Field: "", Value: "" },
      { Field: "ELIGIBILITY CRITERIA", Value: "" },
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
        Value: detailData.company?.eligibilityCriteria?.maxBacklogs || "-",
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

    // --- Sheet 2: Eligibility & Registration ---
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

    // --- Sheet 3: Positions ---
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

    // --- Sheet 4+: Events per Position ---
    if (detailData.positions && detailData.positions.length > 0) {
      detailData.positions.forEach((pos) => {
        const positionEvents = [
          ...(detailData.events.shared || []),
          ...(detailData.events.specific || []),
        ].filter((event) => event.positionIds?.includes(pos.id));

        if (positionEvents.length === 0) return;

        const eventData = positionEvents.map((event) => ({
          "Round Number": event.roundNumber,
          "Round Type": event.roundType?.replace(/_/g, " ") || "-",
          "Event Title": event.title,
          "Event Type": getEventTypeLabel(event.type),
          Date: new Date(event.date).toLocaleDateString(),
          "Start Time": event.startTime || "-",
          "End Time": event.endTime || "-",
          Venue: event.venue || "-",
          Mode: event.mode || "-",
          Status: event.status?.replace(/_/g, " ") || "-",
          Present: event.attendance?.present || 0,
          Absent: event.attendance?.absent || 0,
          Selected: event.overallResults?.selected || 0,
          Rejected: event.overallResults?.rejected || 0,
          Pending: event.overallResults?.pending || 0,
        }));

        const sheetName =
          pos.title.length > 31
            ? pos.title.substring(0, 28) + "..."
            : pos.title; // Excel sheet limit
        const eventSheet = XLSX.utils.json_to_sheet(eventData);
        eventSheet["!cols"] = [
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
        ];
        XLSX.utils.book_append_sheet(workbook, eventSheet, sheetName);
      });
    }

    // --- Write file ---
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
