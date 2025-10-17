"use client";

import { useState, useEffect } from "react";
import { useBatchContext } from "../../context/BatchContext";
import {
  Plus,
  Upload,
  Eye,
  Trash2,
  Calendar,
  Users,
  Building2,
  Briefcase,
  FileText,
  Target,
  Search,
  Edit,
  X,
  ArrowLeft,
} from "lucide-react";
import * as XLSX from "xlsx";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

import UploadModal from "./UploadModal";
import DataViewModal from "./DataViewModal";
import CreateFormModal from "./CreateFormModal";
import DeleteFormModal from "./DeleteFormModal";
import axios from "axios";

const FormManagementSystem = () => {
  const { selectedBatch } = useBatchContext();
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCompany, setFilterCompany] = useState("all");
  const [filterPosition, setFilterPosition] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Fetch forms directly using axios with batch context
  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/forms/${selectedBatch}`);
      setForms(response.data.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch forms");
      console.error("Error fetching forms:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete form directly
  const handleDeleteForm = async (formId) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;

    try {
      await axios.delete(`${backendUrl}/forms/${formId}`);
      fetchForms(); // Refresh the forms list
    } catch (err) {
      setError("Failed to delete form");
      console.error("Error deleting form:", err);
    }
  };

  // Update the delete handler
  const handleDeleteClick = (form) => {
    setSelectedForm(form);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    if (selectedBatch) {
      fetchForms();
    }
  }, [selectedBatch]);

  // Get unique companies and positions for filters
  const uniqueCompanies = [
    ...new Set(forms.map((form) => form.company_name).filter(Boolean)),
  ].sort();

  const uniquePositions = [
    ...new Set(
      forms
        .filter(
          (form) =>
            filterCompany === "all" || form.company_name === filterCompany
        )
        .map((form) => form.position_title)
        .filter(Boolean)
    ),
  ].sort();

  // Reset position filter when company filter changes
  useEffect(() => {
    if (filterCompany !== "all") {
      const validPositions = forms
        .filter((form) => form.company_name === filterCompany)
        .map((form) => form.position_title)
        .filter(Boolean);

      if (
        filterPosition !== "all" &&
        !validPositions.includes(filterPosition)
      ) {
        setFilterPosition("all");
      }
    } else {
      setFilterPosition("all");
    }
  }, [filterCompany, forms, filterPosition]);

  // Filter forms
  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.event_title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || form.type === filterType;
    const matchesCompany =
      filterCompany === "all" || form.company_name === filterCompany;
    const matchesPosition =
      filterPosition === "all" || form.position_title === filterPosition;

    return matchesSearch && matchesType && matchesCompany && matchesPosition;
  });

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterCompany("all");
    setFilterPosition("all");
  };

  const getTypeColor = (type) => {
    const colors = {
      survey: "bg-blue-50 text-blue-700 border-blue-200",
      feedback: "bg-emerald-50 text-emerald-700 border-emerald-200",
      application: "bg-purple-50 text-purple-700 border-purple-200",
      registration: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return colors[type] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getResponsesBadgeColor = (responses) => {
    const count = parseInt(responses);
    if (count === 0) return "bg-slate-100 text-slate-600";
    if (count < 25) return "bg-yellow-100 text-yellow-800";
    if (count < 75) return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  const hasActiveFilters =
    searchTerm ||
    filterType !== "all" ||
    filterCompany !== "all" ||
    filterPosition !== "all";

  // Add this function inside FormManagementSystem component before the return statement
  const handleExportForms = () => {
    try {
      // Prepare data for export
      const exportData = forms.map((form) => ({
        "Form Title": form.title,
        Type: form.type.charAt(0).toUpperCase() + form.type.slice(1),
        Company: form.company_name || "-",
        Position: form.position_title || "-",
        "Total Responses": form.total_responses || 0,
        "Created Date": new Date(form.created_at).toLocaleDateString(),
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      ws["!cols"] = [
        { wch: 40 }, // Form Title
        { wch: 15 }, // Type
        { wch: 25 }, // Company
        { wch: 25 }, // Position
        { wch: 15 }, // Total Responses
        { wch: 15 }, // Created Date
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Forms - Batch ${selectedBatch}`);

      // Generate filename
      const fileName = `forms_report_batch_${selectedBatch}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Error exporting forms:", error);
      alert("Failed to export forms data");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => (window.location.href = "/")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Form Management
                </h1>
                <p className="text-gray-600">
                  Track and manage application forms, surveys and feedback -
                  Batch {selectedBatch}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportForms}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FileText className="h-4 w-4" />
                Export Forms
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setError(null);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                Create Form
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="application">Application</option>
                <option value="survey">Survey</option>
                <option value="feedback">Feedback</option>
                <option value="registration">Registration</option>
              </select>

              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Companies</option>
                {uniqueCompanies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>

              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                disabled={filterCompany === "all"}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="all">
                  {filterCompany === "all"
                    ? "Select company first"
                    : "All Positions"}
                </option>
                {uniquePositions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Compact Forms List */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Forms</h2>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mx-auto mb-3"></div>
                <p className="text-slate-500 text-sm">Loading forms...</p>
              </div>
            ) : filteredForms.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No forms found</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                  >
                    Clear filters to see all forms
                  </button>
                )}
              </div>
            ) : (
              filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {form.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(form.type)}`}
                        >
                          {form.type}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getResponsesBadgeColor(form.total_responses)}`}
                        >
                          {form.total_responses} responses
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span>{form.company_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          <span>{form.position_title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(form.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedForm(form);
                          setShowDataModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>

                      <button
                        onClick={() => {
                          setSelectedForm(form);
                          setShowUploadModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Upload className="h-3 w-3" />
                        Upload
                      </button>
                      <button
                        onClick={() => {
                          setSelectedForm(form);
                          setShowEditForm(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(form)}
                        className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modals */}
        {(showCreateForm || showEditForm) && (
          <CreateFormModal
            setShowCreateForm={
              showEditForm ? setShowEditForm : setShowCreateForm
            }
            fetchForms={fetchForms}
            selectedBatch={selectedBatch}
            isEditing={showEditForm}
            formData={showEditForm ? selectedForm : null}
          />
        )}
        {showUploadModal && (
          <UploadModal
            selectedForm={selectedForm}
            setShowUploadModal={setShowUploadModal}
            fetchForms={fetchForms}
            selectedBatch={selectedBatch}
          />
        )}
        {showDataModal && (
          <DataViewModal
            selectedForm={selectedForm}
            setShowDataModal={setShowDataModal}
            selectedBatch={selectedBatch}
          />
        )}
        {showDeleteModal && (
          <DeleteFormModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            form={selectedForm}
            onFormDeleted={fetchForms}
          />
        )}
      </div>
    </div>
  );
};

export default FormManagementSystem;
