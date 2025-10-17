"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  X,
  Database,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const ModernDataViewModal = ({ selectedForm, setShowDataModal }) => {
  const [formData, setFormData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  // Fetch form data
  const fetchFormData = async (page = 1) => {
    try {
      setLoadingData(true);
      setError(null);
      const response = await axios.get(
        `${backendUrl}/forms/${selectedForm.id}/data?page=${page}&limit=${pagination.limit}`
      );

      setFormData(response.data.data || []);
      setPagination((prev) => ({
        ...prev,
        ...response.data.pagination,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch form data");
      console.error("Error fetching form data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (selectedForm) {
      fetchFormData(pagination.page);
    }
  }, [selectedForm, pagination.page]);

  const columns =
    formData.length > 0
      ? Object.keys(formData[0]).filter((key) => key !== "id")
      : [];

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      setError(null);
      await axios.delete(
        `${backendUrl}/forms/${selectedForm.id}/responses/${id}`
      );
      fetchFormData(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete record");
      console.error("Error deleting record:", err);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const resetModal = () => {
    setShowDataModal(false);
    setError(null);
  };

  const formatColumnName = (column) => {
    return column.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getColumnType = (column) => {
    // First check if the value looks like a timestamp
    const isTimestamp = (value) => {
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/.test(value);
    };

    // Check column name for date-related keywords
    if (
      column.toLowerCase().includes("date") ||
      column.toLowerCase().includes("time") ||
      column === "uploaded_at" ||
      column === "dob" ||
      column === "birth_date"
    ) {
      return "date";
    }

    // Check actual value in formData for timestamp format
    if (
      formData.length > 0 &&
      formData[0][column] &&
      isTimestamp(formData[0][column])
    ) {
      return "date";
    }

    // Other type checks
    if (column.includes("email")) {
      return "email";
    }
    if (column.includes("phone") || column.includes("mobile")) {
      return "tel";
    }
    return "text";
  };

  // Update the formatDateTime function to be more precise
  const formatDateTime = (value) => {
    if (!value) return "";

    try {
      const date = new Date(value);
      if (isNaN(date)) return value;

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(date);
    } catch (error) {
      return value;
    }
  };

  const handleExport = async () => {
    try {
      // Show loading state
      setLoadingData(true);
      setError(null);
      // Fetch all data for export (without pagination)
      const response = await axios.get(
        `${backendUrl}/forms/${selectedForm.id}/data?page=1&limit=9999`
      );

      const dataToExport = response.data.data || [];

      if (dataToExport.length === 0) {
        setError("No data available to export");
        return;
      }

      // Remove id column and prepare data
      const exportData = dataToExport.map((row) => {
        const cleanRow = { ...row };
        delete cleanRow.id;

        // Format date fields
        Object.keys(cleanRow).forEach((key) => {
          if (getColumnType(key) === "date") {
            cleanRow[key] = formatDateTime(cleanRow[key]);
          }
        });

        return cleanRow;
      });

      try {
        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Form Data");

        // Generate filename
        const fileName = `${selectedForm.title
          .replace(/[^a-z0-9]/gi, "_")
          .toLowerCase()}_${new Date().toISOString().split("T")[0]}.xlsx`;

        // Save file
        XLSX.writeFile(wb, fileName);
      } catch (xlsxError) {
        setError("Failed to generate Excel file");
      }
    } catch (err) {
      console.error("Export error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to export data"
      );
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 text-white relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleExport();
              }}
              disabled={loadingData || formData.length === 0}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Download className="h-5 w-5" />
              <h3 className="text-md font-semibold">Export</h3>
            </button>
            <button
              onClick={resetModal}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Form Data</h3>
              <p className="text-slate-300 text-sm">{selectedForm?.title}</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {loadingData ? (
            <div className="text-center py-16">
              <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-slate-600 font-medium">Loading form data...</p>
            </div>
          ) : formData.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-slate-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Database className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No data available
              </h3>
              <p className="text-slate-600 mb-6">
                This form doesn't have any submitted responses yet.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {columns.map((column) => (
                        <th
                          key={column}
                          className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider"
                        >
                          {formatColumnName(column)}
                        </th>
                      ))}
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 uppercase tracking-wider w-32">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.map((row) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50 transition-colors`}
                      >
                        {columns.map((column) => (
                          <td
                            key={column}
                            className="px-6 py-4 text-sm text-slate-900"
                          >
                            <div
                              className="max-w-xs truncate"
                              title={row[column]}
                            >
                              {getColumnType(column) === "date"
                                ? formatDateTime(row[column])
                                : row[column]}
                            </div>
                          </td>
                        ))}
                        <td className="px-6 py-4">
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={() => handleDelete(row.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {formData.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                records
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                {/* Replace your existing pagination buttons with this */}
                <div className="flex items-center gap-1">
                  {pagination.pages > 0 && pagination.page > 2 && (
                    <>
                      <button
                        key="first-page"
                        onClick={() => handlePageChange(1)}
                        className="px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100"
                      >
                        1
                      </button>
                      {pagination.page > 3 && (
                        <span className="px-3 py-2 text-sm text-slate-600">
                          ...
                        </span>
                      )}
                    </>
                  )}

                  {Array.from({ length: pagination.pages }, (_, i) => {
                    const page = i + 1;
                    // Show current page and one page before and after
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= pagination.page - 1 &&
                        page <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={`page-${page}`}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            pagination.page === page
                              ? "bg-blue-600 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    return null;
                  })}

                  {pagination.pages > 0 &&
                    pagination.page < pagination.pages - 1 && (
                      <>
                        {pagination.page < pagination.pages - 2 && (
                          <span
                            key="last-ellipsis"
                            className="px-3 py-2 text-sm text-slate-600"
                          >
                            ...
                          </span>
                        )}
                        <button
                          key="last-page"
                          onClick={() => handlePageChange(pagination.pages)}
                          className="px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                          {pagination.pages}
                        </button>
                      </>
                    )}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= (pagination.pages || 1)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ModernDataViewModal;
