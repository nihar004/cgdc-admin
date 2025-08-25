import { Download, X, FileSpreadsheet } from "lucide-react";
import { useEffect, useState } from "react";
import { useStudentContext } from "../../context/StudentContext.";

export default function ExportModal({ filteredStudents }) {
  const [selectedColumns, setSelectedColumns] = useState({});
  const { setShowExportModal } = useStudentContext();

  const exportableColumns = [
    { key: "first_name", label: "First Name", category: "Personal" },
    { key: "last_name", label: "Last Name", category: "Personal" },
    { key: "date_of_birth", label: "Date of Birth", category: "Personal" },
    { key: "resume_url", label: "Resume URL", category: "Personal" },
    { key: "linkedin_url", label: "LinkedIn URL", category: "Personal" },
    { key: "github_url", label: "GitHub URL", category: "Personal" },
    {
      key: "permanent_address",
      label: "Address",
      category: "Contact",
    },
    { key: "permanent_city", label: "City", category: "Contact" },
    { key: "permanent_state", label: "State", category: "Contact" },
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
    { key: "college_email", label: "College Email", category: "Contact" },
    { key: "personal_email", label: "Personal Email", category: "Contact" },
    { key: "phone", label: "Phone Number", category: "Contact" },
    { key: "alternate_phone", label: "Alternate Phone", category: "Contact" },
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

    // Prepare data for export // todo
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
          default:
            row[key] = student[key] || "N/A";
        }
      });
      return row;
    });

    // Create CSV content
    const headers = selectedColumnKeys.map(
      (key) => exportableColumns.find((col) => col.key === key)?.label || key
    );

    const csvContent = [
      headers.join(","),
      ...exportData.map((row) =>
        selectedColumnKeys
          .map((key) => {
            const value = row[key];
            // Wrap in quotes if contains comma or quotes
            return typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `students_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportModal(false);
  };

  const handleColumnToggle = (columnKey) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const handleSelectAll = () => {
    const allSelected = exportableColumns.every(
      (col) => selectedColumns[col.key]
    );
    const newSelection = {};
    exportableColumns.forEach((col) => {
      newSelection[col.key] = !allSelected;
    });
    setSelectedColumns(newSelection);
  };

  const handleSelectByCategory = (category) => {
    const categoryColumns = exportableColumns.filter(
      (col) => col.category === category
    );
    const allCategorySelected = categoryColumns.every(
      (col) => selectedColumns[col.key]
    );

    setSelectedColumns((prev) => {
      const newSelection = { ...prev };
      categoryColumns.forEach((col) => {
        newSelection[col.key] = !allCategorySelected;
      });
      return newSelection;
    });
  };

  const categories = [...new Set(exportableColumns.map((col) => col.category))];

  useEffect(() => {
    // Initialize all columns as selected by default
    const initialSelection = {};
    exportableColumns.forEach((col) => {
      initialSelection[col.key] = true;
    });
    setSelectedColumns(initialSelection);
  }, []);

  return (
    <div className="fixed h-full inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/30 to-purple-900/20 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xs rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200/50">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              Export Student Data
            </h2>
            <p className="text-gray-500 mt-2 ml-14">
              Customize your data export with flexible column selection
            </p>
          </div>
          <button
            onClick={() => setShowExportModal(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-all duration-200 group"
          >
            <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Export Info Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FileSpreadsheet className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-blue-800 font-semibold">
                Ready to export {filteredStudents.length} student records
              </p>
              <p className="text-blue-600 text-sm">
                Data filtered based on your current search and filter settings
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              {exportableColumns.every((col) => selectedColumns[col.key]) ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Deselect All
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Select All
                </span>
              )}
            </button>
            {categories.map((category, index) => {
              const categoryColumns = exportableColumns.filter(
                (col) => col.category === category
              );
              const selectedCount = categoryColumns.filter(
                (col) => selectedColumns[col.key]
              ).length;
              const gradientColors = [
                "from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-600",
                "from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-600",
                "from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-600",
                "from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-600",
                "from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-600",
              ];
              const gradient = gradientColors[index % gradientColors.length];

              return (
                <button
                  key={category}
                  onClick={() => handleSelectByCategory(category)}
                  className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105`}
                >
                  <span className="flex items-center gap-2">
                    <span>{category}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {selectedCount}/{categoryColumns.length}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category, index) => {
            const categoryColumns = exportableColumns.filter(
              (col) => col.category === category
            );
            const selectedCount = categoryColumns.filter(
              (col) => selectedColumns[col.key]
            ).length;
            const borderColors = [
              "border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50",
              "border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50",
              "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50",
              "border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100/50",
              "border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100/50",
            ];
            const borderColor = borderColors[index % borderColors.length];

            return (
              <div
                key={category}
                className={`border-2 ${borderColor} rounded-xl p-5 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                  <span className="text-lg">{category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full">
                      {selectedCount}/{categoryColumns.length}
                    </span>
                    {selectedCount === categoryColumns.length && (
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </h3>
                <div className="space-y-3">
                  {categoryColumns.map((column) => (
                    <label
                      key={column.key}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedColumns[column.key] || false}
                          onChange={() => handleColumnToggle(column.key)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                        />
                        {selectedColumns[column.key] && (
                          <svg
                            className="absolute inset-0 h-4 w-4 text-blue-600 pointer-events-none"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                        {column.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/50">
          <button
            onClick={() => setShowExportModal(false)}
            className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={Object.values(selectedColumns).every((v) => !v)}
          >
            <Download className="h-5 w-5" />
            <span>
              Export CSV (
              {Object.values(selectedColumns).filter((v) => v).length} columns)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
