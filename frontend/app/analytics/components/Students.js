import { useEffect, useState } from "react";
import {
  AlertCircle,
  Users,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getStudentsList } from "../services/analyticsService";
import * as XLSX from "xlsx";

export default function Students({ batchYear, setSelectedStudent, setView }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 500,
    offset: 0,
    totalPages: 0,
    currentPage: 1,
  });

  // Fetch students with pagination
  const fetchStudents = async (newOffset = 0) => {
    try {
      setLoading(true);
      const result = await getStudentsList(batchYear, {
        search: searchTerm,
        placementStatus: filterStatus !== "all" ? filterStatus : "",
        department: "all",
        limit: pagination.limit,
        offset: newOffset,
      });

      if (result.success) {
        setStudents(result.data.students);

        // Update pagination info
        const total = result.data.pagination.total;
        const totalPages = Math.ceil(total / pagination.limit);
        const currentPage = Math.floor(newOffset / pagination.limit) + 1;

        setPagination((prev) => ({
          ...prev,
          total,
          offset: newOffset,
          totalPages,
          currentPage,
        }));

        setError(null);
      } else {
        throw new Error("Failed to fetch students");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when batchYear changes
  useEffect(() => {
    fetchStudents(0);
  }, [batchYear]);

  // Refetch when search or filter changes (reset to page 1)
  useEffect(() => {
    fetchStudents(0);
  }, [searchTerm, filterStatus]);

  // Handle pagination
  const handleNextPage = () => {
    const newOffset = pagination.offset + pagination.limit;
    if (newOffset < pagination.total) {
      fetchStudents(newOffset);
    }
  };

  const handlePrevPage = () => {
    const newOffset = pagination.offset - pagination.limit;
    if (newOffset >= 0) {
      fetchStudents(newOffset);
    }
  };

  const handlePageChange = (pageNumber) => {
    const newOffset = (pageNumber - 1) * pagination.limit;
    fetchStudents(newOffset);
  };

  // Export to Excel (export all records, not just current page)
  const handleExportToExcel = async () => {
    try {
      setLoading(true);

      // Fetch all students without pagination for export
      const result = await getStudentsList(batchYear, {
        search: searchTerm,
        placementStatus: filterStatus !== "all" ? filterStatus : "",
        department: "all",
        limit: 10000, // Large limit to get all
        offset: 0,
      });

      if (!result.success)
        throw new Error("Failed to fetch students for export");

      const exportStudents = result.data.students;

      if (exportStudents.length === 0) {
        alert("No students to export");
        return;
      }

      const exportData = exportStudents.map((student) => ({
        "Full Name": student.fullName,
        "Registration Number": student.registrationNumber,
        Email: student.email,
        CGPA: student.cgpa || "-",
        "10th Percentage": student.class10Percentage || "-",
        "12th Percentage": student.class12Percentage || "-",
        Backlogs: student.backlogs || 0,
        "Placement Status":
          student.placementStatus === "placed" ? "Placed" : "Unplaced",
        "Company Name": student.currentOffer?.companyName || "-",
        "Position Title": student.currentOffer?.positionTitle || "-",
        Package: student.currentOffer
          ? student.currentOffer.hasRange
            ? `${student.currentOffer.package} - ${student.currentOffer.packageEnd} LPA`
            : `${student.currentOffer.package} LPA`
          : "-",
        "Offer Date": student.currentOffer?.offerDate || "-",
        "Offer Source": student.currentOffer?.source || "-",
        "Total Eligible Companies": student.totalEligibleCompanies || 0,
        "Total Applications": student.totalApplications || 0,
        "Active Applications": student.activeApplications || 0,
        "Total Offers Received": student.offersReceived || 0,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

      // Auto-size columns
      const columnWidths = Array(
        exportData[0] ? Object.keys(exportData[0]).length : 0
      ).fill({ wch: 20 });
      worksheet["!cols"] = columnWidths;

      // Style the header (first row)
      const headerRow = Object.keys(exportData[0] || {});
      headerRow.forEach((_, idx) => {
        const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: idx })];
        if (cell) {
          cell.s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "1F4E78" } },
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      });

      XLSX.writeFile(workbook, `students-export-${Date.now()}.xlsx`);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl border border-red-200 p-6 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <div>
          <h3 className="text-lg font-bold text-red-900">
            Error Loading Students
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 justify-between items-center">
        <div className="flex gap-4 flex-1">
          <input
            type="text"
            placeholder="Search by name or enrollment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="placed">Placed</option>
            <option value="unplaced">Unplaced</option>
          </select>
        </div>
        <button
          onClick={handleExportToExcel}
          disabled={pagination.total === 0 || loading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
        >
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            Student List (Showing {students.length} of {pagination.total})
          </h3>
        </div>
        {loading && students.length === 0 ? (
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">
              No Students Found
            </h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedStudent(student);
                    setView("student");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {student.fullName?.charAt(0) || "S"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {student.fullName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {student.registrationNumber} • {student.specialization}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* CGPA */}
                    <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg mb-1">
                      CGPA: {student.cgpa}
                    </div>

                    {/* Placement Status */}
                    <div
                      className={`text-sm font-semibold px-3 py-1 rounded-lg mb-1 ${
                        student.placementStatus === "placed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.placementStatus === "placed"
                        ? `Placed (${student.offersReceived} offer${
                            student.offersReceived > 1 ? "s" : ""
                          })`
                        : "Unplaced"}
                    </div>

                    {/* Placement Company + Position */}
                    {student.placementStatus === "placed" &&
                      student.currentOffer && (
                        <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                          <div className="font-semibold">
                            {student.currentOffer.companyName}
                          </div>
                          <div className="text-xs text-blue-600">
                            {student.currentOffer.positionTitle}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages} •{" "}
                {pagination.total} total students
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={pagination.currentPage === 1 || loading}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => {
                    const pageNum = i + 1;
                    // Show first 3, last 2, and current page + neighbors
                    if (
                      pageNum <= 3 ||
                      pageNum > pagination.totalPages - 2 ||
                      (pageNum >= pagination.currentPage - 1 &&
                        pageNum <= pagination.currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            pageNum === pagination.currentPage
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === 4 ||
                      pageNum === pagination.totalPages - 2
                    ) {
                      return (
                        <span key={pageNum} className="px-2 py-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={
                    pagination.currentPage === pagination.totalPages || loading
                  }
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
