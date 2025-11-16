import { useState, useEffect } from "react";
import {
  Briefcase,
  Clock,
  Award,
  Target,
  CheckCircle,
  AlertCircle,
  Loader,
  Calendar,
  Building2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import StatCard from "./StatCard";
import StudentApplications from "./StudentApplications";
import {
  getStudentApplications,
  getStudentEligibleCompanies,
} from "../services/analyticsService";

export default function StudentOverview({ student, studentId }) {
  const [applications, setApplications] = useState([]);
  const [eligibleNotApplied, setEligibleNotApplied] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedStudentCompany, setExpandedStudentCompany] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  // Fetch applications and eligible companies when studentId provided
  useEffect(() => {
    if (!studentId) return;

    const fetchAdditionalData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [applicationsRes, eligibleRes] = await Promise.all([
          getStudentApplications(studentId),
          getStudentEligibleCompanies(studentId),
        ]);

        setApplications(applicationsRes.data?.applied || []);
        setEligibleNotApplied(eligibleRes.data?.eligibleNotApplied || []);
      } catch (err) {
        console.error("Error fetching student details:", err);
        setError(err.message || "Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    fetchAdditionalData();
  }, [studentId]);

  const conversionRate =
    student?.totalApplications > 0
      ? ((student?.offersReceived / student?.totalApplications) * 100).toFixed(
          1
        )
      : 0;

  // No transformation needed - StudentApplications handles it internally

  if (!student) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <p className="text-gray-600">Select a student to view details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-1">
        {["details", "applications", "eligible"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold capitalize rounded-lg transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab === "details" && "Details & Profile"}
            {tab === "applications" && `Applications (${applications.length})`}
            {tab === "eligible" &&
              `Eligible Not Applied (${eligibleNotApplied.length})`}
          </button>
        ))}
      </div>

      {/* Details & Profile Tab */}
      {activeTab === "details" && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Briefcase}
              label="Total Applications"
              value={student.totalApplications || 0}
              color="blue"
            />
            <StatCard
              icon={Clock}
              label="Active Applications"
              value={student.activeApplications || 0}
              subtext="In various stages"
              color="yellow"
            />
            <StatCard
              icon={Award}
              label="Offers Received"
              value={student.offersReceived || 0}
              subtext={`${
                student.placementStatus === "placed" ? 1 : 0
              } accepted`}
              color="emerald"
            />
            <StatCard
              icon={Target}
              label="Conversion Rate"
              value={`${conversionRate}%`}
              subtext="Offers / Applications"
              color="purple"
            />
          </div>

          {/* Current Placement Status */}
          {student.placementStatus === "placed" && student.currentOffer && (
            <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Current Placement
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <div className="text-sm text-gray-600 mb-1">Company</div>
                  <div className="text-lg font-bold text-gray-900">
                    {student.currentOffer.companyName}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <div className="text-sm text-gray-600 mb-1">Position</div>
                  <div className="text-lg font-bold text-gray-900">
                    {student.currentOffer.positionTitle}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <div className="text-sm text-gray-600 mb-1">Package</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    ₹{student.currentOffer.package} LPA
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <div className="text-sm text-gray-600 mb-1">
                    Acceptance Date
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {student.currentOffer.acceptanceDate
                      ? new Date(
                          student.currentOffer.acceptanceDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Application Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Application Status Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Application Status Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-gray-700 font-medium">
                    Offers Received
                  </span>
                  <span className="font-bold text-xl text-emerald-600">
                    {student.offersReceived || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="text-gray-700 font-medium">In Progress</span>
                  <span className="font-bold text-xl text-yellow-600">
                    {student.activeApplications || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-gray-700 font-medium">Rejected</span>
                  <span className="font-bold text-xl text-red-600">
                    {Math.max(
                      0,
                      (student.totalApplications || 0) -
                        (student.offersReceived || 0) -
                        (student.activeApplications || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Academic Performance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-gray-700 font-medium">
                    Current CGPA
                  </span>
                  <span className="font-bold text-xl text-blue-600">
                    {student.cgpa}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-gray-700 font-medium">Class 12th</span>
                  <span className="font-bold text-xl text-purple-600">
                    {student.class12Percentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-violet-50 rounded-lg border border-violet-200">
                  <span className="text-gray-700 font-medium">Class 10th</span>
                  <span className="font-bold text-xl text-violet-600">
                    {student.class10Percentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-gray-700 font-medium">
                    Active Backlogs
                  </span>
                  <span className="font-bold text-xl text-red-600">
                    {student.backlogs || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mr-2" />
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-xl p-6 border border-red-200 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <p className="text-gray-500 text-lg">No applications yet</p>
            </div>
          ) : (
            <StudentApplications
              applications={applications}
              expandedStudentCompany={expandedStudentCompany}
              setExpandedStudentCompany={setExpandedStudentCompany}
            />
          )}
        </div>
      )}

      {/* Eligible Not Applied Tab */}
      {activeTab === "eligible" && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mr-2" />
              <p className="text-gray-600">Loading eligible companies...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-xl p-6 border border-red-200 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : eligibleNotApplied.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <p className="text-gray-500 text-lg">
                No eligible companies to apply for
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4 px-3 py-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-orange-800">
                  Student met all eligibility criteria but chose not to apply
                  for these opportunities.
                </span>
              </div>
              {eligibleNotApplied.map((company, idx) => (
                <EligibleCompanyCard key={idx} company={company} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EligibleCompanyCard({ company }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              {company.companyName}
            </h3>
            {company.isMarquee && (
              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Marquee
              </span>
            )}
            {company.isDreamCompany && (
              <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                ⭐ Dream
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>{company.sector}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              <span className="font-medium">
                {company.totalPositions} Position
                {company.totalPositions !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {company.scheduledVisit && (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div className="text-right">
                <p className="text-xs text-blue-800 font-semibold">
                  {new Date(company.scheduledVisit).toLocaleDateString(
                    "en-IN",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Scheduled Visit</p>
          </div>
        )}
      </div>

      {/* Positions Section */}
      {company.positions && company.positions.length > 0 && (
        <div className="space-y-2 mt-4">
          <div className="space-y-2">
            {company.positions.map((pos, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {pos.positionTitle}
                  </p>
                  <p className="text-xs text-gray-600 capitalize mt-0.5">
                    {pos.jobType.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="text-right">
                  {pos.package && pos.package > 0 ? (
                    <p className="font-bold text-emerald-600">
                      ₹{pos.package}
                      {pos.hasRange && pos.packageEnd > 0
                        ? ` - ${pos.packageEnd}`
                        : ""}{" "}
                      LPA
                    </p>
                  ) : (
                    <span className="text-sm text-gray-500 italic">
                      Package TBA (To Be Announced)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for No Positions */}
      {(!company.positions || company.positions.length === 0) && (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200 mt-4">
          <p className="text-sm">No position details available</p>
        </div>
      )}
    </div>
  );
}
