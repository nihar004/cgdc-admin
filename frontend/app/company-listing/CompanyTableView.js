import React, { useState } from "react";
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
  UserCheck,
  Users,
  CheckCircle,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useCompaniesContext } from "../../context/CompaniesContext";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EmailTargetModal from "./EmailTargetModal";

export function CompanyTableView({
  statusColors,
  companyTypeColors,
  onEditClick,
}) {
  const {
    formatPackage,
    formatPackageRange,
    setSelectedCompany,
    fetchCompanies,
    loading,
    error,
    searchTerm,
    typeFilter,
    sectorFilter,
    filteredCompanies,
    getCompanyStatus,
    setSearchTerm,
    setTypeFilter,
    setSectorFilter,
    handleDeleteClick,
    showDeleteModal,
    setShowDeleteModal,
    itemToDelete,
    deleteType,
    isDeleting,
    setItemToDelete,
    setShowEligibilityModal,
    setSelectedCompanyForEligibility,
  } = useCompaniesContext();

  const router = useRouter();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedCompanyForEmail, setSelectedCompanyForEmail] = useState(null);

  const [expandedRows, setExpandedRows] = useState(new Set());

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

  const handleEmailClick = (company) => {
    setSelectedCompanyForEmail(company);
    setShowEmailModal(true);
  };

  const handleEmailTargetSelect = (emailData) => {
    // Store in sessionStorage for email page
    sessionStorage.setItem("emailData", JSON.stringify(emailData));
    // Close modal
    setShowEmailModal(false);
    // Navigate to email page
    router.push("/email-management?from=company");
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
    <>
      <div className="space-y-6 mb-10">
        {/* Companies Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[25%]">
                    Company Details
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[8%]">
                    Type & Sector
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[12%]">
                    Positions
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[15%]">
                    Requirements
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[15%]">
                    Schedule & Status
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-[15%]">
                    Applications
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-[10%]">
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
                        <td className="px-6 py-5 w-1/4">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-bold text-gray-900">
                                  {company.company_name}
                                </h3>
                                {company.is_marquee && (
                                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
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
                        <td className="px-4 py-5 w-[8%]">
                          <div className="space-y-1">
                            {/* Sector */}
                            {company.sector && (
                              <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-center">
                                {company.sector}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Positions Summary */}
                        <td className="px-4 py-5 w-[12%]">
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
                        <td className="px-4 py-5 w-[15%]">
                          <div className="space-y-2">
                            {/* Eligibility */}
                            {(company.eligibility_10th ||
                              company.eligibility_12th) && (
                              <div className="space-y-1">
                                {company.eligibility_10th && (
                                  <div className="text-xs">
                                    <span className="font-medium">10th:</span>{" "}
                                    {company.eligibility_10th}%
                                  </div>
                                )}
                                {company.eligibility_12th && (
                                  <div className="text-xs">
                                    <span className="font-medium">12th:</span>{" "}
                                    {company.eligibility_12th}%
                                  </div>
                                )}
                              </div>
                            )}

                            {/* CGPA */}
                            {company.min_cgpa && company.min_cgpa !== 0 && (
                              <div className="flex items-center gap-1 text-xs">
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
                              <div className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                                <AlertCircle size={12} />
                                <span>Backlogs Allowed</span>
                              </div>
                            )}

                            {/* Bond */}
                            {company.bond_required && (
                              <div className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                                <FileText size={12} />
                                <span>Bond Required</span>
                              </div>
                            )}

                            {/* Specializations */}
                            {company.allowed_specializations && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {company.allowed_specializations
                                  .replace(/[{}]/g, "")
                                  .split(",")
                                  .map((spec, index) => (
                                    <span
                                      key={index}
                                      className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-xs font-medium"
                                    >
                                      {spec.trim()}
                                    </span>
                                  ))}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Schedule & Status */}
                        <td className="px-4 py-5 w-[15%]">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex px-2.5 py-1 text-xs font-medium rounded ${statusColors[status]}`}
                            >
                              {status}
                            </span>

                            <div className="space-y-1 text-xs">
                              {company.jd_shared_date && (
                                <div className="flex items-center gap-1">
                                  <FileText
                                    size={12}
                                    className="text-blue-500"
                                  />
                                  <span>
                                    JD Shared:{" "}
                                    {new Date(
                                      company.jd_shared_date
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar size={12} className="text-gray-400" />
                                <span>
                                  Visit:{" "}
                                  {new Date(
                                    company.scheduled_visit
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              {company.actual_arrival && (
                                <div className="flex items-center gap-1">
                                  <Clock size={12} className="text-green-500" />
                                  <span>
                                    Arrived:{" "}
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
                        <td className="px-4 py-5 w-[15%]">
                          <div className="space-y-3">
                            {company.total_eligible === -1 ? (
                              <div
                                onClick={() => {
                                  setSelectedCompanyForEligibility(company);
                                  setShowEligibilityModal(true);
                                }}
                                className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity"
                              >
                                <Users size={14} className="text-red-500" />
                                <span className="text-xs text-red-400 text-center font-medium">
                                  Set Eligible Students First
                                </span>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-center gap-2">
                                  <UserCheck
                                    size={14}
                                    className="text-emerald-500"
                                  />
                                  <span className="font-medium text-xs text-gray-500">
                                    {company.total_eligible || 0} Eligible
                                    Students
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-center bg-blue-50 rounded-lg p-2">
                                    <div className="font-bold text-blue-600 text-xs">
                                      {company.total_registered || 0}
                                    </div>
                                    <div className="text-blue-500 text-[11px]">
                                      Registered
                                    </div>
                                  </div>
                                  <div className="text-center bg-green-50 rounded-lg p-2">
                                    <div className="font-bold text-green-600 text-xs">
                                      {company.total_selected || 0}
                                    </div>
                                    <div className="text-green-500 text-[11px] truncate">
                                      Selected
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-5 w-[10%]">
                          <div className="flex items-center justify-end gap-1">
                            {/* External Links */}
                            <div className="flex items-center gap-2">
                              {/* External Links */}
                              <div className="flex items-center gap-1">
                                {/* Website Link */}
                                {company.website_url ? (
                                  <a
                                    href={company.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                    title="Visit Website"
                                  >
                                    <Globe size={16} />
                                  </a>
                                ) : (
                                  <div
                                    className="text-red-500 p-1 cursor-not-allowed opacity-60"
                                    title="Website not available"
                                  >
                                    <Globe size={16} />
                                  </div>
                                )}

                                {/* LinkedIn Link */}
                                {company.linkedin_url ? (
                                  <a
                                    href={company.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                    title="LinkedIn Profile"
                                  >
                                    <Linkedin size={16} />
                                  </a>
                                ) : (
                                  <div
                                    className="text-red-500 p-1 cursor-not-allowed opacity-60"
                                    title="LinkedIn not available"
                                  >
                                    <Linkedin size={16} />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 border-l pl-2">
                              <button
                                onClick={() => setSelectedCompany(company)}
                                className="p-2 text-violet-600 hover:text-violet-800 hover:bg-violet-100 rounded-lg transition-all duration-200"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCompanyForEligibility(company);
                                  setShowEligibilityModal(true);
                                }}
                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-200"
                                title="Manage Eligible Students"
                              >
                                <Users size={16} />
                              </button>
                              <button
                                onClick={() => handleEmailClick(company)}
                                className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-lg transition-all duration-200"
                                title="Send Email To Students"
                              >
                                <Mail size={16} />
                              </button>
                              <button
                                onClick={() => onEditClick(company)}
                                className="p-2 text-slate-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-all duration-200"
                                title="Edit Company"
                              >
                                <Edit size={16} />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteClick(company, "company")
                                }
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
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
                                          {/* Add company type badge */}
                                          <span
                                            className={`text-xs px-2 py-1 rounded-full ${
                                              companyTypeColors[
                                                position.company_type
                                              ]
                                            }`}
                                          >
                                            {position.company_type?.toUpperCase()}
                                          </span>

                                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                            {position.job_type
                                              ?.replace("_", " ")
                                              .toUpperCase()}
                                          </span>

                                          {/* Conditional Compensation Display */}
                                          <div className="flex items-center gap-2">
                                            {/* Full Time Package */}
                                            {(position.job_type ===
                                              "full_time" ||
                                              position.job_type ===
                                                "internship_plus_ppo") && (
                                              <span
                                                className={`text-sm font-medium ${
                                                  position.package === -1
                                                    ? "text-gray-500"
                                                    : "text-green-600"
                                                }`}
                                              >
                                                {position.package === -1
                                                  ? "Package: Not disclosed"
                                                  : position.has_range
                                                    ? formatPackageRange(
                                                        position
                                                      )
                                                    : formatPackage(
                                                        position.package
                                                      )}
                                              </span>
                                            )}

                                            {/* Internship Stipend */}
                                            {(position.job_type ===
                                              "internship" ||
                                              position.job_type ===
                                                "internship_plus_ppo") && (
                                              <span
                                                className={`text-sm font-medium ${
                                                  !position.internship_stipend_monthly
                                                    ? "text-gray-500"
                                                    : "text-green-600"
                                                }`}
                                              >
                                                {!position.internship_stipend_monthly
                                                  ? "Stipend: Not disclosed"
                                                  : `₹${position.internship_stipend_monthly}`}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      {/* For position delete button */}
                                      <button
                                        onClick={() =>
                                          handleDeleteClick(
                                            {
                                              ...position,
                                              company_name:
                                                company.company_name,
                                            },
                                            "position"
                                          )
                                        }
                                        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50"
                                        title="Delete Position"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>

                                    {/* Position Statistics */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3 text-xs">
                                      <div className="bg-blue-50 p-2 rounded">
                                        <div className="flex items-center gap-1">
                                          <Users
                                            size={12}
                                            className="text-blue-500"
                                          />
                                          <span className="font-medium text-blue-700">
                                            Registered
                                          </span>
                                        </div>
                                        <div className="text-sm font-semibold text-blue-800 mt-1">
                                          {position.registered_students || 0}
                                        </div>
                                      </div>

                                      <div className="bg-green-50 p-2 rounded">
                                        <div className="flex items-center gap-1">
                                          <CheckCircle
                                            size={12}
                                            className="text-green-500"
                                          />
                                          <span className="font-medium text-green-700">
                                            Selected
                                          </span>
                                        </div>
                                        <div className="text-sm font-semibold text-green-800 mt-1">
                                          {position.selected_students || 0}
                                        </div>
                                      </div>

                                      {(position.rounds_start_date ||
                                        position.rounds_end_date) && (
                                        <div className="bg-orange-50 p-2 rounded">
                                          <div className="flex items-center gap-1">
                                            <Calendar
                                              size={12}
                                              className="text-orange-500"
                                            />
                                            <span className="font-medium text-orange-700">
                                              Rounds
                                            </span>
                                          </div>
                                          <div className="text-xs text-orange-800 mt-1">
                                            {position.rounds_start_date && (
                                              <div>
                                                Start:{" "}
                                                {new Date(
                                                  position.rounds_start_date
                                                ).toLocaleDateString()}
                                              </div>
                                            )}
                                            {position.rounds_end_date && (
                                              <div>
                                                End:{" "}
                                                {new Date(
                                                  position.rounds_end_date
                                                ).toLocaleDateString()}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
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
                                                href={doc.download_url.replace(
                                                  /\\/g,
                                                  "/"
                                                )}
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
                      Add a new company to get started with placement
                      management.
                    </span>
                  )}
                </p>

                {!searchTerm &&
                  typeFilter === "all" &&
                  sectorFilter === "all" && (
                    <button
                      onClick={() => setShowFormModal(true)}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        data={itemToDelete}
        type={deleteType}
        isDeleting={isDeleting}
      />

      {/* Email Target Modal */}
      {showEmailModal && selectedCompanyForEmail && (
        <EmailTargetModal
          company={selectedCompanyForEmail}
          onClose={() => {
            setShowEmailModal(false);
            setSelectedCompanyForEmail(null);
          }}
          onSelect={handleEmailTargetSelect}
        />
      )}
    </>
  );
}
