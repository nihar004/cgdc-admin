import {
  Calendar,
  Users,
  Clock,
  X,
  Globe,
  Linkedin,
  Mail,
  Phone,
  Award,
  MapPin,
  Briefcase,
  GraduationCap,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  Building2,
  Star,
  FileText,
  AtSign,
  UserCheck,
  CheckCircle,
} from "lucide-react";
import { useCompaniesContext } from "../../context/CompaniesContext";

export function CompanyDetailModal() {
  const {
    selectedCompany,
    setSelectedCompany,
    formatPackage,
    getCompanyStatus,
  } = useCompaniesContext();

  const status = getCompanyStatus(selectedCompany);

  // Modern status colors
  const statusConfig = {
    upcoming: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Calendar,
      label: "Upcoming",
    },
    delayed: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: AlertCircle,
      label: "Delayed",
    },
    jd_shared: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: Clock,
      label: "JD Shared",
    },
  };

  const StatusIcon = statusConfig[status]?.icon || Calendar;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-2 py-4">
        <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl my-2">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 px-5 py-4 rounded-t-2xl">
            <button
              onClick={() => setSelectedCompany(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-500 bg-slate-100 hover:text-slate-900 hover:scale-110 rounded-lg transition-all duration-200"
            >
              <X size={18} />
            </button>

            <div className="pr-12">
              {/* Company Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                  <Building2 size={20} className="text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {selectedCompany.company_name}
                    </h2>
                    {selectedCompany.is_marquee && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200">
                        <Award size={12} className="mr-1" />
                        Marquee
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">
                    {selectedCompany.company_description}
                  </p>

                  {/* Status and Type Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig[status]?.color || statusConfig.upcoming.color}`}
                    >
                      <StatusIcon size={12} className="mr-1" />
                      {statusConfig[status]?.label || "Upcoming"}
                    </span>

                    {selectedCompany.sector && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                        {selectedCompany.sector}
                      </span>
                    )}

                    {selectedCompany.glassdoor_rating && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200">
                        <Star size={12} className="mr-1 fill-current" />
                        {parseFloat(selectedCompany.glassdoor_rating).toFixed(
                          1
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-3">
                {/* Office Address */}
                {selectedCompany.office_address && (
                  <div className="bg-white/60 backdrop-blur rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-slate-500" />
                      <span className="text-xs font-semibold text-slate-700">
                        Office Address
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {selectedCompany.office_address}
                    </p>
                  </div>
                )}

                {/* Work Locations */}
                {selectedCompany.work_locations && (
                  <div className="bg-white/60 backdrop-blur rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 size={14} className="text-slate-500" />
                      <span className="text-xs font-semibold text-slate-700">
                        Work Locations
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCompany.work_locations
                        .split(", ")
                        .map((location, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200"
                          >
                            {location.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-5">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              {/* Left Column - Main Content */}
              <div className="xl:col-span-2 space-y-5">
                {/* HR Contact Information */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-slate-600" />
                    Primary Contact
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          HR Manager
                        </label>
                        <p className="text-base font-bold text-slate-900 mt-0.5">
                          {selectedCompany.primary_hr_name}
                        </p>
                        <p className="text-slate-600 text-sm font-medium">
                          {selectedCompany.primary_hr_designation}
                        </p>
                      </div>
                      {/* Account Owner */}
                      {selectedCompany.account_owner && (
                        <div className="flex items-center gap-1 mt-2 text-md text-slate-900 font-bold">
                          <AtSign size={16} className="text-blue-600" />
                          <span className="font-bold text-slate-900 text-sm">
                            Account Owner: {selectedCompany.account_owner}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Contact Details
                        </label>
                        <div className="space-y-2 mt-1">
                          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                            <Mail size={14} className="text-blue-600" />
                            <a
                              href={`mailto:${selectedCompany.primary_hr_email}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                            >
                              {selectedCompany.primary_hr_email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                            <Phone size={14} className="text-emerald-600" />
                            <span className="text-slate-900 text-sm font-medium">
                              {selectedCompany.primary_hr_phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Open Positions */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Briefcase size={18} className="text-slate-600" />
                      Open Positions ({selectedCompany.positions?.length || 0})
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {selectedCompany.positions?.map((position) => (
                      <div
                        key={position.id}
                        className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-base font-bold text-slate-900 mb-2">
                              {position.position_title}
                            </h4>

                            {/* Status and Job Type Badges */}
                            <div className="flex items-center gap-2 mb-3">
                              {/* Add company_type badge */}
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {position.company_type?.toUpperCase()}
                              </span>

                              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                {position.job_type
                                  ?.replace("_", " ")
                                  .toUpperCase()}
                              </span>
                            </div>

                            {/* Compensation Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              {/* Full Time Package */}
                              {(position.job_type === "full_time" ||
                                position.job_type ===
                                  "internship_plus_ppo") && (
                                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                  <div className="text-lg font-bold text-green-600">
                                    {position.package === -1
                                      ? "Not disclosed"
                                      : position.has_range
                                        ? `${formatPackage(position.package)} - ${formatPackage(
                                            position.package_end
                                          )}`
                                        : formatPackage(position.package)}
                                  </div>
                                  <div className="text-xs text-green-700 font-medium">
                                    Annual Package{" "}
                                    {position.has_range ? "(Range)" : ""}
                                  </div>
                                </div>
                              )}

                              {/* Internship Stipend */}
                              {position.job_type === "internship" && (
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                  <div className="text-lg font-bold text-blue-600">
                                    {position.internship_stipend_monthly === -1
                                      ? "Not disclosed"
                                      : `₹${position.internship_stipend_monthly}`}
                                  </div>
                                  <div className="text-xs text-blue-700 font-medium">
                                    Internship Stipend
                                  </div>
                                </div>
                              )}

                              {/* Internship + PPO */}
                              {position.job_type === "internship_plus_ppo" && (
                                <>
                                  {position.internship_stipend_monthly && (
                                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                      <div className="text-lg font-bold text-blue-600">
                                        {position.internship_stipend_monthly ===
                                        -1
                                          ? "Not disclosed"
                                          : `₹${position.internship_stipend_monthly}`}
                                      </div>
                                      <div className="text-xs text-blue-700 font-medium">
                                        Internship Stipend
                                      </div>
                                    </div>
                                  )}
                                  {position.package_range && (
                                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                      <div className="text-lg font-bold text-green-600">
                                        {position.package_range === -1
                                          ? "Not disclosed"
                                          : formatPackage(
                                              position.package_range
                                            )}
                                      </div>
                                      <div className="text-xs text-green-700 font-medium">
                                        PPO Package
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            {/* Application Statistics */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center gap-1 mb-1">
                                  <Users size={14} className="text-blue-500" />
                                  <span className="text-xs font-medium text-blue-700">
                                    Registered
                                  </span>
                                </div>
                                <div className="text-lg font-bold text-blue-800">
                                  {position.applications_count || 0}
                                </div>
                              </div>

                              <div className="bg-green-50 p-3 rounded-lg">
                                <div className="flex items-center gap-1 mb-1">
                                  <CheckCircle
                                    size={14}
                                    className="text-green-500"
                                  />
                                  <span className="text-xs font-medium text-green-700">
                                    Selected
                                  </span>
                                </div>
                                <div className="text-lg font-bold text-green-800">
                                  {position.selected_students || 0}
                                </div>
                              </div>

                              {/* Rounds Schedule */}
                              {(position.rounds_start_date ||
                                position.rounds_end_date) && (
                                <div className="bg-orange-50 p-3 rounded-lg col-span-2 md:col-span-1">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Calendar
                                      size={14}
                                      className="text-orange-500"
                                    />
                                    <span className="text-xs font-medium text-orange-700">
                                      Rounds Schedule
                                    </span>
                                  </div>
                                  <div className="text-sm text-orange-800 space-y-1">
                                    {position.rounds_start_date && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-xs">Start:</span>
                                        <span className="font-medium">
                                          {new Date(
                                            position.rounds_start_date
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    )}
                                    {position.rounds_end_date && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-xs">End:</span>
                                        <span className="font-medium">
                                          {new Date(
                                            position.rounds_end_date
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Documents Section */}
                        {position.documents &&
                          position.documents.length > 0 && (
                            <div className="border-t border-slate-100 pt-3">
                              <div className="text-sm font-semibold text-slate-700 mb-2">
                                Documents:
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {position.documents.map((doc) => (
                                  <a
                                    key={doc.id}
                                    href={doc.download_url.replace(/\\/g, "/")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 px-2 py-1 rounded-lg border border-slate-200 hover:border-blue-200 transition-all duration-200 font-medium"
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
                    )) || (
                      <div className="text-center py-6 text-slate-500">
                        No positions available
                      </div>
                    )}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <GraduationCap size={18} className="text-blue-600" />
                    Eligibility Requirements
                  </h3>

                  <div className="space-y-4">
                    {/* Allowed Specializations */}
                    {selectedCompany.allowed_specializations && (
                      <div className="bg-violet-50 rounded-lg p-3 border border-violet-300">
                        <h4 className="text-sm font-semibold text-purple-900 mb-2">
                          Eligible Branches
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCompany.allowed_specializations
                            .replace(/[{}]/g, "")
                            .split(",")
                            .map((spec, index) => (
                              <span
                                key={index}
                                className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-sm font-medium"
                              >
                                {spec.trim()}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* 10th Percentage */}
                      {selectedCompany.eligibility_10th && (
                        <div className="bg-white rounded-lg p-3 border border-gray-300">
                          <div className="text-2xl font-bold text-blue-600 mb-0.5">
                            {selectedCompany.eligibility_10th}%
                          </div>
                          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            10th Percentage
                          </div>
                        </div>
                      )}

                      {/* 12th Percentage */}
                      {selectedCompany.eligibility_12th && (
                        <div className="bg-white rounded-lg p-3 border border-gray-300">
                          <div className="text-2xl font-bold text-blue-600 mb-0.5">
                            {selectedCompany.eligibility_12th}%
                          </div>
                          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            12th Percentage
                          </div>
                        </div>
                      )}

                      {/* CGPA */}
                      {selectedCompany.min_cgpa &&
                        selectedCompany.min_cgpa !== 0 && (
                          <div className="bg-white rounded-lg p-3 border border-gray-300">
                            <div className="text-2xl font-bold text-blue-600 mb-0.5">
                              {selectedCompany.min_cgpa}
                            </div>
                            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                              Minimum CGPA
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Backlogs Status */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg mt-2 ${
                        selectedCompany.max_backlogs
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span className="text-sm font-medium">
                          {selectedCompany.max_backlogs
                            ? "Backlogs Allowed"
                            : "No Backlogs Allowed"}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded-lg mt-2 ${
                        selectedCompany.max_backlogs
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span className="text-sm font-medium">
                          {selectedCompany.bond_required
                            ? "Bond Required"
                            : "No Bond Required"}
                        </span>
                      </div>
                    </div>
                    {/* </div> */}

                    {/* Rest of the requirements section... */}
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Info */}
              <div className="space-y-4">
                {/* Application Statistics */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-slate-600" />
                    Statistics
                  </h3>
                  <div className="space-y-4">
                    {/* Eligible Students Count */}
                    <div className="flex items-center gap-2 mb-4 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg border border-indigo-200">
                      <UserCheck size={16} />
                      <span className="font-medium">
                        {selectedCompany.total_eligible || 0} Eligible Students
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                        <div className="text-xl font-bold text-blue-600">
                          {selectedCompany.total_registered || 0}
                        </div>
                        <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                          Registered
                        </div>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-200">
                        <div className="text-xl font-bold text-emerald-600">
                          {selectedCompany.total_selected || 0}
                        </div>
                        <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">
                          Selected
                        </div>
                      </div>
                    </div>

                    {/* Selection Rate */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-600 text-sm font-medium">
                          Selection Rate
                        </span>
                        <span className="text-base font-bold text-purple-600">
                          {(selectedCompany.applications_count || 0) > 0
                            ? `${Math.round(((selectedCompany.selected || 0) / (selectedCompany.applications_count || 1)) * 100)}%`
                            : "0%"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(((selectedCompany.selected || 0) / (selectedCompany.applications_count || 1)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-600" />
                    Schedule
                  </h3>
                  <div className="space-y-3">
                    {/* JD Shared Date */}
                    {selectedCompany.jd_shared_date && (
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText size={14} className="text-purple-500" />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            JD Shared Date
                          </span>
                        </div>
                        <div className="text-sm font-bold text-purple-600">
                          {new Date(
                            selectedCompany.jd_shared_date
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    )}

                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar size={14} className="text-blue-500" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Scheduled Visit
                        </span>
                      </div>
                      <div className="text-sm font-bold text-blue-600">
                        {new Date(
                          selectedCompany.scheduled_visit
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    {selectedCompany.actual_arrival && (
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={14} className="text-emerald-500" />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Actual Arrival
                          </span>
                        </div>
                        <div className="text-sm font-bold text-emerald-600">
                          {new Date(
                            selectedCompany.actual_arrival
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ExternalLink size={16} className="text-slate-600" />
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    {selectedCompany.website_url && (
                      <a
                        href={selectedCompany.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-slate-200 transition-all duration-200 group"
                      >
                        <Globe size={16} className="text-blue-600" />
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">
                          Company Website
                        </span>
                        <ExternalLink
                          size={12}
                          className="text-slate-400 ml-auto"
                        />
                      </a>
                    )}
                    {selectedCompany.linkedin_url && (
                      <a
                        href={selectedCompany.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-slate-200 transition-all duration-200 group"
                      >
                        <Linkedin size={16} className="text-blue-600" />
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">
                          LinkedIn Page
                        </span>
                        <ExternalLink
                          size={12}
                          className="text-slate-400 ml-auto"
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
