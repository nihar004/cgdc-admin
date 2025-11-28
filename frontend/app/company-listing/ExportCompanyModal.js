import { Download, X, Check, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function ExportCompanyModal({ companies, onClose }) {
  const [selectedColumns, setSelectedColumns] = useState({});

  const exportableColumns = [
    // Basic Info
    { key: "id", label: "Company ID", category: "Basic Info" },
    { key: "company_name", label: "Company Name", category: "Basic Info" },
    { key: "company_type", label: "Company Type", category: "Basic Info" },
    { key: "sector", label: "Sector", category: "Basic Info" },
    {
      key: "company_description",
      label: "Description",
      category: "Basic Info",
    },
    { key: "website_url", label: "Website", category: "Basic Info" },
    { key: "linkedin_url", label: "LinkedIn", category: "Basic Info" },
    {
      key: "glassdoor_rating",
      label: "Glassdoor Rating",
      category: "Basic Info",
    },
    { key: "work_locations", label: "Work Locations", category: "Basic Info" },
    { key: "is_marquee", label: "Marquee Company", category: "Basic Info" },
    { key: "batch_year", label: "Batch Year", category: "Basic Info" },

    // HR Contact
    { key: "primary_hr_name", label: "HR Name", category: "HR Contact" },
    {
      key: "primary_hr_designation",
      label: "HR Designation",
      category: "HR Contact",
    },
    { key: "primary_hr_email", label: "HR Email", category: "HR Contact" },
    { key: "primary_hr_phone", label: "HR Phone", category: "HR Contact" },
    { key: "office_address", label: "Office Address", category: "HR Contact" },
    { key: "account_owner", label: "Account Owner", category: "HR Contact" },

    // Requirements
    {
      key: "allowed_specializations",
      label: "Target Departments",
      category: "Requirements",
    },
    { key: "min_cgpa", label: "Min CGPA", category: "Requirements" },
    { key: "max_backlogs", label: "Max Backlogs", category: "Requirements" },
    { key: "bond_required", label: "Bond Required", category: "Requirements" },
    {
      key: "total_eligible_students",
      label: "Total Eligible Students",
      category: "Requirements",
    },
    {
      key: "eligibility_10th",
      label: "10th Percentage",
      category: "Requirements",
    },
    {
      key: "eligibility_12th",
      label: "12th Percentage",
      category: "Requirements",
    },

    { key: "jd_shared_date", label: "JD Shared Date", category: "Schedule" },
    {
      key: "company_rounds_start_date",
      label: "Company Rounds Start",
      category: "Schedule",
    },
    {
      key: "company_rounds_end_date",
      label: "Company Rounds End",
      category: "Schedule",
    },
    { key: "status", label: "Company Status", category: "Schedule" },

    // Statistics & Positions
    { key: "total_selected", label: "Total Selected", category: "Statistics" },
    {
      key: "position_count",
      label: "Number of Positions",
      category: "Statistics",
    },
    {
      key: "position_titles",
      label: "Position Titles",
      category: "Statistics",
    },
    {
      key: "internship_positions",
      label: "Internship Positions",
      category: "Statistics",
    },
    {
      key: "fulltime_positions",
      label: "Full-time Positions",
      category: "Statistics",
    },
    { key: "package_ranges", label: "Package Ranges", category: "Statistics" },
    {
      key: "unique_package_ranges",
      label: "Unique Package Ranges",
      category: "Statistics",
    },
    {
      key: "internship_stipends",
      label: "Internship Stipends",
      category: "Statistics",
    },
    {
      key: "unique_internship_stipends",
      label: "Unique Internship Stipends",
      category: "Statistics",
    },
    // Rounds Information
    {
      key: "rounds_start_date",
      label: "Rounds Start Date",
      category: "Schedule",
    },
    { key: "rounds_end_date", label: "Rounds End Date", category: "Schedule" },

    // Metadata
    { key: "created_at", label: "Created At", category: "Metadata" },
    { key: "updated_at", label: "Updated At", category: "Metadata" },
  ];

  const handleExport = () => {
    const selectedColumnKeys = Object.keys(selectedColumns).filter(
      (key) => selectedColumns[key]
    );

    if (selectedColumnKeys.length === 0) {
      alert("Please select at least one column to export.");
      return;
    }

    // Prepare data for export
    const exportData = companies.map((company) => {
      const row = {};
      selectedColumnKeys.forEach((key) => {
        switch (key) {
          case "company_type":
            row[key] = company[key]?.toUpperCase() || "N/A";
            break;
          case "allowed_specializations":
            row[key] =
              company[key]?.replace(/[{}]/g, "").split(",").join(", ") || "N/A";
            break;
          case "is_marquee":
          case "bond_required":
            row[key] = company[key] ? "Yes" : "No";
            break;
          case "glassdoor_rating":
          case "min_cgpa":
            row[key] = company[key] ? parseFloat(company[key]) : "N/A";
            break;
          case "created_at":
          case "updated_at":
          case "jd_shared_date":
          case "company_rounds_start_date":
          case "company_rounds_end_date":
            row[key] = company[key]
              ? new Date(company[key]).toLocaleDateString()
              : "N/A";
            break;

          case "status":
            row[key] = company.status
              ? company.status
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              : "N/A";
            break;
          case "position_count":
            row[key] = company.positions?.length || 0;
            break;
          case "position_titles":
            row[key] =
              company.positions?.map((p) => p.position_title).join(", ") ||
              "N/A";
            break;
          case "internship_positions":
            row[key] =
              company.positions?.filter((p) => p.job_type === "internship")
                .length || 0;
            break;
          case "fulltime_positions":
            row[key] =
              company.positions?.filter((p) => p.job_type === "full_time")
                .length || 0;
            break;
          case "package_ranges":
            row[key] =
              company.positions
                ?.map((p) => {
                  if (p.package === -1) return "Not Disclosed";
                  if (p.has_range) {
                    return `₹${p.package}L - ₹${p.package_end}L`;
                  }
                  return `₹${p.package}L`;
                })
                .join(", ") || "N/A";
            break;
          case "unique_package_ranges":
            if (company.positions?.length) {
              const uniquePackages = [
                ...new Set(
                  company.positions.map((p) => {
                    if (p.package === -1) return "Not Disclosed";
                    if (p.has_range) {
                      return `₹${p.package}L - ₹${p.package_end}L`;
                    }
                    return `₹${p.package}L`;
                  })
                ),
              ];
              row[key] = uniquePackages.join(", ");
            } else {
              row[key] = "N/A";
            }
            break;
          case "internship_stipends":
            row[key] =
              company.positions
                ?.map((p) =>
                  p.internship_stipend_monthly
                    ? `₹${p.internship_stipend_monthly}`
                    : "N/A"
                )
                .join(", ") || "N/A";
            break;
          case "unique_internship_stipends":
            if (company.positions?.length) {
              const uniqueStipends = [
                ...new Set(
                  company.positions
                    .map((p) =>
                      p.internship_stipend_monthly
                        ? `₹${p.internship_stipend_monthly}`
                        : "N/A"
                    )
                    .filter((stipend) => stipend !== "N/A") // Remove N/A from unique list
                ),
              ];
              row[key] =
                uniqueStipends.length > 0 ? uniqueStipends.join(", ") : "N/A";
            } else {
              row[key] = "N/A";
            }
            break;
          case "eligibility_10th":
          case "eligibility_12th":
            row[key] = company[key] ? `${parseFloat(company[key])}%` : "N/A";
            break;

          case "jd_shared_date":
            row[key] = company[key]
              ? new Date(company[key]).toLocaleDateString()
              : "N/A";
            break;
          default:
            row[key] = company[key] || "N/A";
        }
      });
      return row;
    });

    // Create workbook with better formatting
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Companies");

    // Set column widths based on content
    const columnWidths = selectedColumnKeys.map((key) => {
      const column = exportableColumns.find((col) => col.key === key);
      const baseWidth = column?.label.length || 10;
      return { wch: Math.max(baseWidth, 15) };
    });
    ws["!cols"] = columnWidths;

    // Generate filename with timestamp
    const fileName = `companies_export_${new Date().toISOString().split("T")[0]}_${Date.now()}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
    onClose();
  };

  const categories = [...new Set(exportableColumns.map((col) => col.category))];

  // Select/Deselect all functionality
  const handleSelectAll = () => {
    const allSelected = {};
    exportableColumns.forEach((col) => {
      allSelected[col.key] = true;
    });
    setSelectedColumns(allSelected);
  };

  const handleDeselectAll = () => {
    setSelectedColumns({});
  };

  const handleCategoryToggle = (category) => {
    const categoryColumns = exportableColumns.filter(
      (col) => col.category === category
    );
    const allCategorySelected = categoryColumns.every(
      (col) => selectedColumns[col.key]
    );

    const newSelection = { ...selectedColumns };
    categoryColumns.forEach((col) => {
      newSelection[col.key] = !allCategorySelected;
    });
    setSelectedColumns(newSelection);
  };

  const getCategorySelectionState = (category) => {
    const categoryColumns = exportableColumns.filter(
      (col) => col.category === category
    );
    const selectedCount = categoryColumns.filter(
      (col) => selectedColumns[col.key]
    ).length;

    if (selectedCount === 0) return "none";
    if (selectedCount === categoryColumns.length) return "all";
    return "partial";
  };

  const selectedCount = Object.values(selectedColumns).filter(Boolean).length;
  const totalCount = exportableColumns.length;

  useEffect(() => {
    // Initialize with commonly used columns selected
    const commonColumns = [
      "company_name",
      "company_type",
      "sector",
      "is_marquee",
      "status", // ADD
      "primary_hr_name",
      "primary_hr_email",
      "min_cgpa",
      "total_eligible_students",
      "total_selected",
      "jd_shared_date", // KEEP
      "company_rounds_start_date", // ADD
      "company_rounds_end_date", // ADD
      "eligibility_10th",
      "eligibility_12th",
      "unique_package_ranges",
    ];
    const initialSelection = {};
    exportableColumns.forEach((col) => {
      initialSelection[col.key] = commonColumns.includes(col.key);
    });
    setSelectedColumns(initialSelection);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Export Companies Data
              </h2>
              <p className="text-gray-600">
                Select the columns you want to include in your export (
                {selectedCount} of {totalCount} selected)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Check className="h-4 w-4" />
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <Minus className="h-4 w-4" />
              Deselect All
            </button>
            <div className="ml-auto text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
              {companies.length} companies • {selectedCount} columns selected
            </div>
          </div>
        </div>

        {/* Column Selection */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const selectionState = getCategorySelectionState(category);
              return (
                <div
                  key={category}
                  className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {category}
                    </h3>
                    <button
                      onClick={() => handleCategoryToggle(category)}
                      className={`p-1.5 rounded-md transition-colors ${
                        selectionState === "all"
                          ? "bg-blue-100 text-blue-600"
                          : selectionState === "partial"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-400 hover:text-gray-600"
                      }`}
                      title={
                        selectionState === "all" ? "Deselect all" : "Select all"
                      }
                    >
                      {selectionState === "partial" ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {exportableColumns
                      .filter((col) => col.category === category)
                      .map((column) => (
                        <label
                          key={column.key}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedColumns[column.key] || false}
                              onChange={() => {
                                setSelectedColumns((prev) => ({
                                  ...prev,
                                  [column.key]: !prev[column.key],
                                }));
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                            />
                          </div>
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                            {column.label}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Export will include {selectedCount} columns from{" "}
              {companies.length} companies
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={selectedCount === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Download className="h-4 w-4" />
                Export Excel ({selectedCount} columns)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
