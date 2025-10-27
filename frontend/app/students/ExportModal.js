import { Download, X, Check, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { useStudentContext } from "../../context/StudentContext";
import * as XLSX from "xlsx";

export default function ExportModal({ filteredStudents }) {
  const [selectedColumns, setSelectedColumns] = useState({});
  const { setShowExportModal } = useStudentContext();

  const exportableColumns = [
    // Personal Info
    { key: "first_name", label: "First Name", category: "Personal" },
    { key: "last_name", label: "Last Name", category: "Personal" },
    { key: "date_of_birth", label: "Date of Birth", category: "Personal" },
    { key: "resume_url", label: "Resume URL", category: "Personal" },
    { key: "linkedin_url", label: "LinkedIn URL", category: "Personal" },
    { key: "github_url", label: "GitHub URL", category: "Personal" },

    // Contact Info
    { key: "permanent_address", label: "Address", category: "Contact" },
    { key: "permanent_city", label: "City", category: "Contact" },
    { key: "permanent_state", label: "State", category: "Contact" },
    { key: "college_email", label: "College Email", category: "Contact" },
    { key: "personal_email", label: "Personal Email", category: "Contact" },
    { key: "phone", label: "Phone Number", category: "Contact" },
    { key: "alternate_phone", label: "Alternate Phone", category: "Contact" },

    // Academic Info
    {
      key: "registration_number",
      label: "Registration Number",
      category: "Academic",
    },
    {
      key: "enrollment_number",
      label: "Enrollment Number",
      category: "Academic",
    },
    { key: "department", label: "Department", category: "Academic" },
    { key: "branch", label: "Branch", category: "Academic" },
    { key: "batch_year", label: "Batch Year", category: "Academic" },
    { key: "cgpa", label: "CGPA", category: "Academic" },
    { key: "backlogs", label: "Backlogs", category: "Academic" },
    {
      key: "class_10_percentage",
      label: "10th Percentage",
      category: "Academic",
    },
    {
      key: "class_12_percentage",
      label: "12th Percentage",
      category: "Academic",
    },

    // Placement Info
    {
      key: "placement_status",
      label: "Placement Status",
      category: "Placement",
    },
    { key: "current_company", label: "Current Company", category: "Placement" },
    {
      key: "current_package",
      label: "Current Package (LPA)",
      category: "Placement",
    },
    { key: "total_offers", label: "Total Offers", category: "Placement" },
    { key: "drives_skipped", label: "Drives Skipped", category: "Placement" },
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
    const exportData = filteredStudents.map((student) => {
      const row = {};
      selectedColumnKeys.forEach((key) => {
        switch (key) {
          case "current_company":
            row[key] = student.current_offer?.company_name || "N/A";
            break;
          case "current_package":
            row[key] = student.current_offer?.package
              ? (student.current_offer.package / 100000).toFixed(1)
              : "N/A";
            break;
          case "total_offers":
            row[key] = student.offers_received?.length || 0;
            break;
          case "drives_attended":
            row[key] = student.drives_attended || 0;
            break;
          case "cgpa":
            row[key] =
              student.cgpa !== undefined && student.cgpa !== null
                ? Number(student.cgpa).toFixed(2)
                : "N/A";
            break;
          case "date_of_birth":
            row[key] = student[key]
              ? new Date(student[key]).toLocaleDateString()
              : "N/A";
            break;
          case "class_10_percentage":
          case "class_12_percentage":
            row[key] = student[key] ? `${student[key]}%` : "N/A";
            break;
          default:
            row[key] = student[key] || "N/A";
        }
      });
      return row;
    });

    // Create workbook with better formatting
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    // Set column widths based on content
    const columnWidths = selectedColumnKeys.map((key) => {
      const column = exportableColumns.find((col) => col.key === key);
      const baseWidth = column?.label.length || 10;
      return { wch: Math.max(baseWidth, 15) };
    });
    ws["!cols"] = columnWidths;

    // Generate filename with timestamp
    const fileName = `students_export_${new Date().toISOString().split("T")[0]}_${Date.now()}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
    setShowExportModal(false);
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
      "first_name",
      "last_name",
      "registration_number",
      "college_email",
      "department",
      "branch",
      "cgpa",
      "placement_status",
      "current_company",
      "total_offers",
    ];
    const initialSelection = {};
    exportableColumns.forEach((col) => {
      initialSelection[col.key] = commonColumns.includes(col.key);
    });
    setSelectedColumns(initialSelection);
  }, []);

  return (
    <div className="fixed h-full inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Export Students Data
              </h2>
              <p className="text-gray-600">
                Select the columns you want to include in your export (
                {selectedCount} of {totalCount} selected)
              </p>
            </div>
            <button
              onClick={() => setShowExportModal(false)}
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
              {filteredStudents.length} students • {selectedCount} columns
              selected
            </div>
          </div>
        </div>

        {/* Column Selection */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const selectionState = getCategorySelectionState(category);
              const categoryColors = {
                Personal:
                  "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100",
                Contact:
                  "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100",
                Academic:
                  "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100",
                Placement:
                  "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100",
              };

              return (
                <div
                  key={category}
                  className={`bg-white border-2 ${categoryColors[category]} rounded-xl p-5 hover:border-opacity-70 transition-colors`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {category}
                    </h3>
                    <button
                      onClick={() => handleCategoryToggle(category)}
                      className={`p-1.5 rounded-md transition-colors ${
                        selectionState === "all"
                          ? "bg-green-100 text-green-600"
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
                              className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2"
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
              {filteredStudents.length} students
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={selectedCount === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
