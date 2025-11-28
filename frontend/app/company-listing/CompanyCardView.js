import {
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Star,
  Globe,
  Linkedin,
  Award,
  AlertCircle,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Users,
  Building2,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { useCompaniesContext } from "../../context/CompaniesContext";

export default function CompanyCardView({
  company,
  statusColors,
  companyTypeColors,
  onEditClick,
}) {
  const {
    formatPackageRange,
    setSelectedCompany,
    getCompanyStatus,
    setShowEligibilityModal,
    setSelectedCompanyForEligibility,
  } = useCompaniesContext();
  // Individual expand state for this specific card
  const [isExpanded, setIsExpanded] = useState(false);

  const status = getCompanyStatus(company);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Header Section */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-white pb-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Building2 size={20} className="text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-slate-900 truncate">
                  {company.company_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {company.is_marquee && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                      <Award size={12} className="mr-1" />
                      Marquee
                    </span>
                  )}
                  {company.glassdoor_rating && (
                    <div className="flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      <Star size={12} className="text-amber-500 fill-current" />
                      <span className="text-xs font-medium text-slate-700">
                        {parseFloat(company.glassdoor_rating).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {company.company_description && (
              <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                {company.company_description}
              </p>
            )}

            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                statusColors[status.toLowerCase().replace(/ /g, "_")] ||
                statusColors.not_started
              }`}
            >
              {status.toLowerCase() === "jd_shared" && (
                <Clock size={10} className="mr-1" />
              )}
              {status.toLowerCase() === "ongoing" && (
                <Clock size={10} className="mr-1" />
              )}
              {status.toLowerCase() === "completed" && (
                <CheckCircle size={10} className="mr-1" />
              )}
              {status.toLowerCase() === "not_started" && (
                <Calendar size={10} className="mr-1" />
              )}
              {status
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </div>
        </div>

        {company.work_locations && (
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 backdrop-blur px-3 py-2 rounded-lg">
            <MapPin size={14} className="text-slate-500" />
            <span className="font-medium">{company.work_locations}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4 pt-2">
        {/* PS Type + Eligible Students */}
        <div className="flex items-center">
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-medium">
            <Users size={14} />
            <span>{company.total_eligible || 0} Eligible Students</span>
          </div>
        </div>

        {/* Stats Grid - Updated with new metrics */}
        <div className="grid grid-cols-4 gap-4">
          {/* JD Shared Date */}
          {company.jd_shared_date && (
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <FileText size={16} className="text-blue-500 mx-auto mb-2" />
              <div className="text-xs text-blue-600 mb-1">JD Shared</div>
              <div className="text-sm font-semibold text-blue-900">
                {new Date(company.jd_shared_date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </div>
          )}

          {/* Rounds Start Date */}
          {company.company_rounds_start_date && (
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <Calendar size={16} className="text-green-500 mx-auto mb-2" />
              <div className="text-xs text-green-600 mb-1">Started</div>
              <div className="text-sm font-semibold text-green-900">
                {new Date(company.company_rounds_start_date).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "short",
                  }
                )}
              </div>
            </div>
          )}

          {/* Rounds End Date */}
          {company.company_rounds_end_date && (
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <CheckCircle size={16} className="text-purple-500 mx-auto mb-2" />
              <div className="text-xs text-purple-600 mb-1">Completed</div>
              <div className="text-sm font-semibold text-purple-900">
                {new Date(company.company_rounds_end_date).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "short",
                  }
                )}
              </div>
            </div>
          )}

          {/* Applications - Updated */}
          <div className="bg-blue-50 rounded-xl p-4 text-center relative">
            <Users size={16} className="text-blue-500 mx-auto mb-2" />
            <div className="text-xs text-blue-600 mb-1">Registered</div>
            <div className="text-sm font-semibold text-blue-900">
              {company.total_registered || 0}
            </div>
          </div>

          {/* Selected */}
          <div className="bg-emerald-50 rounded-xl p-4 text-center relative">
            <CheckCircle size={16} className="text-emerald-500 mx-auto mb-2" />
            <div className="text-xs text-emerald-600 mb-1">Selected</div>
            <div className="text-sm font-semibold text-emerald-900">
              {company.total_selected || 0}
            </div>
          </div>
        </div>

        {/* Requirements Section - Updated logic */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap size={16} className="text-slate-600" />
            <h4 className="text-sm font-semibold text-slate-900">
              Eligibility & Requirements
            </h4>
          </div>

          <div className="space-y-3">
            {/* Allowed Specializations */}
            {company.allowed_specializations && (
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-300">
                <h5 className="text-xs font-medium text-purple-700 mb-2">
                  Eligible Branches
                </h5>
                <div className="flex flex-wrap gap-2">
                  {company.allowed_specializations
                    .replace(/[{}]/g, "")
                    .split(",")
                    .map((spec, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium"
                      >
                        {spec.trim()}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Show "No requirements" message or requirements */}
            {(!company.min_cgpa || company.min_cgpa == 0) &&
            !company.max_backlogs &&
            !company.bond_required ? (
              <div className="text-center py-3 text-slate-500 italic">
                No Other Specific Requirements Mentioned
              </div>
            ) : (
              <div className="space-y-2">
                {company.min_cgpa && company.min_cgpa != 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Minimum CGPA</span>
                    <span className="font-semibold text-slate-900">
                      {company.min_cgpa}
                    </span>
                  </div>
                )}
                {company.max_backlogs && (
                  <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-lg">
                    <AlertCircle size={14} />
                    <span className="font-medium">Backlogs Allowed</span>
                  </div>
                )}
                {company.bond_required && (
                  <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-lg">
                    <AlertCircle size={14} />
                    <span className="font-medium">Bond Required</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Positions Section - Updated with more details */}
        {company.positions && company.positions.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-left hover:bg-slate-50 rounded-lg p-3 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-slate-600" />
                <h4 className="text-sm font-semibold text-slate-900">
                  Open Positions ({company.positions.length})
                </h4>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-xs group-hover:text-slate-700">
                  {isExpanded ? "Hide" : "Show"} Details
                </span>
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="mt-2 space-y-3">
                {company.positions.map((position) => (
                  <div
                    key={position.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-all duration-200"
                  >
                    {/* Position Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-semibold text-slate-900 mb-2">
                          {position.position_title}
                        </h5>
                        <div className="flex items-center gap-2">
                          {/* Add company type badge */}
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full ${
                              companyTypeColors[position.company_type]
                            }`}
                          >
                            {position.company_type?.toUpperCase()}
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                            {position.job_type?.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Compensation Details */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {/* Internship Stipend */}
                      {(position.job_type === "internship" ||
                        position.job_type === "internship_plus_ppo") && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div
                            className={`text-sm font-semibold ${
                              !position.internship_stipend_monthly
                                ? "text-gray-500"
                                : "text-blue-700"
                            }`}
                          >
                            {!position.internship_stipend_monthly
                              ? "Not disclosed"
                              : `₹${position.internship_stipend_monthly}`}
                          </div>
                          <div className="text-xs text-blue-600">
                            Internship Stipend
                          </div>
                        </div>
                      )}

                      {(position.job_type === "full_time" ||
                        position.job_type === "internship_plus_ppo") && (
                        <div className="bg-emerald-50 rounded-lg p-3">
                          <div
                            className={`text-sm font-semibold ${
                              position.package === -1
                                ? "text-gray-500"
                                : "text-emerald-700"
                            }`}
                          >
                            {position.package === -1
                              ? "Not disclosed"
                              : formatPackageRange(position)}
                          </div>
                          <div className="text-xs text-emerald-600">
                            {position.job_type === "internship_plus_ppo"
                              ? "PPO Package"
                              : "Annual Package"}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Position Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-blue-50/50 rounded-lg p-2 text-center">
                        <div className="text-sm font-semibold text-blue-700">
                          {position.registered_students || 0}
                        </div>
                        <div className="text-xs text-blue-600">Registered</div>
                      </div>
                      <div className="bg-emerald-50/50 rounded-lg p-2 text-center">
                        <div className="text-sm font-semibold text-emerald-700">
                          {position.selected_students || 0}
                        </div>
                        <div className="text-xs text-emerald-600">Selected</div>
                      </div>
                    </div>

                    {/* Rounds Schedule */}
                    {(position.rounds_start_date ||
                      position.rounds_end_date) && (
                      <div className="bg-orange-50 rounded-lg p-3 mb-3">
                        <div className="text-xs font-medium text-orange-700 mb-2">
                          Rounds Schedule
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {position.rounds_start_date && (
                            <div className="flex items-center gap-1">
                              <Calendar size={12} className="text-orange-500" />
                              <span className="text-orange-700">
                                Starts:{" "}
                                {new Date(
                                  position.rounds_start_date
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {position.rounds_end_date && (
                            <div className="flex items-center gap-1">
                              <Clock size={12} className="text-orange-500" />
                              <span className="text-orange-700">
                                Ends:{" "}
                                {new Date(
                                  position.rounds_end_date
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Documents */}
                    {position.documents && position.documents.length > 0 && (
                      <div className="border-t border-slate-100">
                        <div className="text-xs font-medium text-slate-600">
                          Documents:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {position.documents.map((doc) => (
                            <a
                              key={doc.id}
                              href={doc.download_url.replace(/\\/g, "/")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200 transition-all duration-200"
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
            )}
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            {company.website_url ? (
              <a
                href={company.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Visit Website"
              >
                <Globe size={16} />
              </a>
            ) : (
              <div
                className="p-2 text-red-500 opacity-60 cursor-not-allowed"
                title="Website not available"
              >
                <Globe size={16} />
              </div>
            )}

            {company.linkedin_url ? (
              <a
                href={company.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="LinkedIn Profile"
              >
                <Linkedin size={16} />
              </a>
            ) : (
              <div
                className="p-2 text-red-500 opacity-60 cursor-not-allowed"
                title="LinkedIn not available"
              >
                <Linkedin size={16} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedCompany(company)}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => {
                setSelectedCompanyForEligibility(company);
                setShowEligibilityModal(true);
              }}
              className="p-2 text-slate-500 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-200"
              title="Manage Eligible Students"
            >
              <Users size={16} />
            </button>
            <button
              onClick={() => onEditClick(company)}
              className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
              title="Edit Company"
            >
              <Edit size={16} />
            </button>
            <button
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Delete Company"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
