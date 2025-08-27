import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Building2,
  Star,
  Globe,
  Linkedin,
  Award,
  MapPin,
  GraduationCap,
  AlertCircle,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import { useCompaniesContext } from "../../context/CompaniesContext";

export function CompanyTableView({ statusColors, companyTypeColors }) {
  const {
    formatPackage,
    setSelectedCompany,
    companies,
    fetchCompanies,
    loading,
    error,
    selectedBatch,
    searchTerm,
    typeFilter,
    sectorFilter,
    filteredCompanies,
    getCompanyStatus,
    setSearchTerm,
    setTypeFilter,
    setSectorFilter,
  } = useCompaniesContext();

  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false); // controls add company modal visibility

  // TODO
  // Delete company
  const handleDeleteCompany = async (companyId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this company? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/companies/${companyId}/batch/${selectedBatch}`
      );
      setCompanies(companies.filter((company) => company.id !== companyId));
      alert("Company deleted successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete company");
    }
  };

  // TODO
  // Delete position
  const handleDeletePosition = async (positionId) => {
    if (!window.confirm("Are you sure you want to delete this position?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/companies/position/${positionId}`
      );
      // Refresh companies data
      fetchCompanies();
      alert("Position deleted successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete position");
    }
  };

  // Toggle row expansion
  const toggleRowExpansion = (companyId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(companyId)) {
      newExpanded.delete(companyId);
    } else {
      newExpanded.add(companyId);
    }
    setExpandedRows(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-gray-600">Loading companies...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-4 text-lg font-semibold text-red-900">
          Error Loading Companies
        </h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          onClick={fetchCompanies}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-10">
      {/* Companies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Company Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type & Sector
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Positions
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Requirements
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Schedule & Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {filteredCompanies.map((company) => {
                const status = getCompanyStatus(company);
                const isExpanded = expandedRows.has(company.id);

                return (
                  <React.Fragment key={company.id}>
                    <tr className="hover:bg-slate-50 transition-all duration-200">
                      {/* Company Details */}
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-bold text-gray-900">
                                {company.company_name}
                              </h3>
                              {company.is_marquee && (
                                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                  <Award size={12} />
                                  Marquee
                                </div>
                              )}
                            </div>

                            {company.company_description && (
                              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                {company.company_description}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-xs">
                              {company.glassdoor_rating && (
                                <div className="flex items-center gap-1">
                                  <Star
                                    size={12}
                                    className="text-yellow-400 fill-current"
                                  />
                                  <span className="font-medium text-gray-700">
                                    {parseFloat(
                                      company.glassdoor_rating
                                    ).toFixed(1)}
                                  </span>
                                </div>
                              )}

                              {company.work_locations && (
                                <div className="flex items-center gap-1 text-gray-500">
                                  <MapPin size={12} />
                                  <span className="truncate max-w-32">
                                    {company.work_locations}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type & Sector */}
                      <td className="px-4 py-5">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${companyTypeColors[company.company_type]}`}
                          >
                            {company.company_type?.toUpperCase()}
                          </span>
                          {company.sector && (
                            <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {company.sector}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Positions Summary */}
                      <td className="px-4 py-5">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {company.positions?.length || 0} Position
                            {company.positions?.length !== 1 ? "s" : ""}
                          </div>
                          <button
                            onClick={() => toggleRowExpansion(company.id)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp size={12} />
                            ) : (
                              <ChevronDown size={12} />
                            )}
                            {isExpanded ? "Hide Details" : "View Details"}
                          </button>
                        </div>
                      </td>

                      {/* Requirements */}
                      <td className="px-6 py-5">
                        <div className="space-y-1 text-xs">
                          {/* If both CGPA and Backlogs are missing */}
                          {!company.min_cgpa &&
                            !company.max_backlogs &&
                            !company.bond_required && (
                              <div className="text-gray-500 italic">
                                No Requirements
                              </div>
                            )}

                          {/* CGPA */}
                          {company.min_cgpa && (
                            <div className="flex items-center gap-1">
                              <GraduationCap
                                size={12}
                                className="text-blue-500"
                              />
                              <span className="font-medium">
                                CGPA: {company.min_cgpa}
                              </span>
                            </div>
                          )}

                          {/* Backlogs */}
                          {company.max_backlogs && (
                            <div className="flex items-center gap-1">
                              <AlertCircle
                                size={12}
                                className="text-orange-500"
                              />
                              <span>Backlogs: ≤{company.max_backlogs}</span>
                            </div>
                          )}

                          {/* Bond Required */}
                          {company.bond_required && (
                            <div className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded">
                              <FileText size={12} />
                              <span className="font-medium">Bond Required</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Schedule & Status */}
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}
                          >
                            {status}
                          </span>

                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} className="text-gray-400" />
                              <span>
                                {new Date(
                                  company.scheduled_visit
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {company.actual_arrival && (
                              <div className="flex items-center gap-1">
                                <Clock size={12} className="text-green-500" />
                                <span>
                                  {new Date(
                                    company.actual_arrival
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Applications */}
                      <td className="px-1 py-5">
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-xs ">
                            <div className="text-center bg-blue-50 rounded p-2 w-full">
                              <div className="font-bold text-blue-600">
                                {company.applications_count || 0}
                              </div>
                              <div className="text-blue-500">Applied</div>
                            </div>
                            <div className="text-center bg-green-50 rounded p-2 w-full">
                              <div className="font-bold text-green-600">
                                {company.selected || 0}
                              </div>
                              <div className="text-green-500">Selected</div>
                            </div>
                          </div>

                          {(company.applications_count || 0) > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(((company.selected || 0) / (company.applications_count || 1)) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {/* External Links */}
                          <div className="flex items-center gap-1">
                            {company.website_url && (
                              <a
                                href={company.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                title="Visit Website"
                              >
                                <Globe size={16} />
                              </a>
                            )}
                            {company.linkedin_url && (
                              <a
                                href={company.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                title="LinkedIn Profile"
                              >
                                <Linkedin size={16} />
                              </a>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 border-l pl-2">
                            <button
                              onClick={() => setSelectedCompany(company)}
                              className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-800 transition-colors p-1 rounded hover:bg-gray-50"
                              title="Edit Company"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCompany(company.id)}
                              className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                              title="Delete Company"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row - Position Details */}
                    {isExpanded && company.positions && (
                      <tr className="bg-slate-25">
                        <td
                          colSpan="7"
                          className="px-6 py-4 border-t border-slate-100"
                        >
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">
                              Position Details
                            </h4>

                            <div className="grid gap-4">
                              {company.positions.map((position) => (
                                <div
                                  key={position.id}
                                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h5 className="text-sm font-semibold text-gray-900">
                                        {position.position_title}
                                      </h5>
                                      <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                          {position.job_type
                                            ?.replace("_", " ")
                                            .toUpperCase()}
                                        </span>
                                        <span className="text-sm font-medium text-green-600">
                                          {formatPackage(
                                            position.package_range
                                          )}
                                        </span>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() =>
                                        handleDeletePosition(position.id)
                                      }
                                      className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50"
                                      title="Delete Position"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>

                                  {/* Documents */}
                                  {position.documents &&
                                    position.documents.length > 0 && (
                                      <div className="mt-3">
                                        <h6 className="text-xs font-medium text-gray-700 mb-2">
                                          Documents:
                                        </h6>
                                        <div className="flex flex-wrap gap-2">
                                          {position.documents.map((doc) => (
                                            <a
                                              key={doc.id}
                                              href={doc.document_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                                            >
                                              <FileText size={12} />
                                              {doc.document_title}
                                              <ExternalLink size={10} />
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="col-span-full flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
              <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-10 w-10 text-gray-400" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || typeFilter !== "all" || sectorFilter !== "all"
                  ? "No companies match your filters"
                  : "No companies found"}
              </h3>

              <p className="text-gray-500 mb-6">
                {searchTerm ||
                typeFilter !== "all" ||
                sectorFilter !== "all" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Search className="h-4 w-4" />
                    Try adjusting your search criteria or filters
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Add a new company to get started with placement management.
                  </span>
                )}
              </p>

              {!searchTerm &&
                typeFilter === "all" &&
                sectorFilter === "all" && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    Add Company
                  </button>
                )}

              {(searchTerm ||
                typeFilter !== "all" ||
                sectorFilter !== "all") && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setTypeFilter("all");
                      setSectorFilter("all");
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
