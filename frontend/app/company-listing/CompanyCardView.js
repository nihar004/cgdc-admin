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
  Book,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { useCompaniesContext } from "../../context/CompaniesContext";

export default function CompanyCardView({
  company,
  statusColors,
  companyTypeColors,
}) {
  const { formatPackage, setSelectedCompany, getCompanyStatus } =
    useCompaniesContext();
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

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                  statusColors[status]
                }`}
              >
                {status === "arrived" && <Clock size={10} className="mr-1" />}
                {status === "late" && (
                  <AlertCircle size={10} className="mr-1" />
                )}
                {status === "upcoming" && (
                  <Calendar size={10} className="mr-1" />
                )}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>

              {company.company_type && (
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                    companyTypeColors[company.company_type.toLowerCase()] ||
                    "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {company.company_type.toUpperCase()}
                </span>
              )}

              {company.sector && (
                <span className="bg-white text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                  {company.sector}
                </span>
              )}
            </div>
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
      <div className="p-4 space-y-3 pt-2">
        {/* Stats Grid */}
        <div
          className={`grid gap-4 ${company.actual_arrival ? "grid-cols-4" : "grid-cols-3"}`}
        >
          {/* Schedule */}
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <Calendar size={16} className="text-slate-500 mx-auto mb-2" />
            <div className="text-xs text-slate-600 mb-1">Scheduled</div>
            <div className="text-sm font-semibold text-slate-900">
              {new Date(company.scheduled_visit).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>

          {/* Arrival Date - Only show if actual_arrival exists */}
          {company.actual_arrival && (
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <Clock size={16} className="text-emerald-500 mx-auto mb-2" />
              <div className="text-xs text-emerald-600 mb-1">Arrived</div>
              <div className="text-sm font-semibold text-emerald-900">
                {new Date(company.actual_arrival).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </div>
          )}

          {/* Applications */}
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <Users size={16} className="text-blue-500 mx-auto mb-2" />
            <div className="text-xs text-blue-600 mb-1">Applied</div>
            <div className="text-sm font-semibold text-blue-900">
              {company.applications_count || 0}
            </div>
          </div>

          {/* Selected */}
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <Award size={16} className="text-amber-500 mx-auto mb-2" />
            <div className="text-xs text-amber-600 mb-1">Selected</div>
            <div className="text-sm font-semibold text-amber-900">
              {company.selected || 0}
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Book size={16} className="text-slate-600" />
            <h4 className="text-sm font-semibold text-slate-900">
              Requirements
            </h4>
          </div>

          {!company.min_cgpa &&
          !company.max_backlogs &&
          !company.bond_required ? (
            <div className="text-sm text-slate-500 italic">
              No specific requirements mentioned
            </div>
          ) : (
            <div className="space-y-2">
              {company.min_cgpa && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Minimum CGPA</span>
                  <span className="font-semibold text-slate-900">
                    {company.min_cgpa}
                  </span>
                </div>
              )}
              {company.max_backlogs !== null &&
                company.max_backlogs !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Maximum Backlogs</span>
                    <span className="font-semibold text-slate-900">
                      ≤{company.max_backlogs}
                    </span>
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

        {/* Positions Section */}
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
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold text-slate-900 mb-1">
                          {position.position_title}
                        </h5>
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                            {position.job_type?.replace("_", " ").toUpperCase()}
                          </span>
                          <span className="text-sm font-semibold text-emerald-600">
                            {formatPackage(position.package_range)}
                          </span>
                        </div>
                      </div>
                    </div>

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
                              href={doc.document_url}
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
            {company.website_url && (
              <a
                href={company.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
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
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="LinkedIn Profile"
              >
                <Linkedin size={16} />
              </a>
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
