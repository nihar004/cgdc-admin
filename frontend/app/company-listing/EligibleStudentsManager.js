import axios from "axios";
import { useState, useEffect } from "react";
import {
  X,
  Users,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Calculator,
  Eye,
  EyeOff,
  UserPlus,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Manual Override Modal Component
function ManualOverrideModal({
  student,
  companyId,
  batchYear,
  onClose,
  onSuccess,
}) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for manual override");
      return;
    }

    try {
      setSubmitting(true);
      await axios.put(
        `${backendUrl}/eligibility/manual/${companyId}/${batchYear}/students/${student.id}`,
        { action: "add", reason: reason.trim() }
      );
      toast.success("Student manually added to eligible list");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to add student manually"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserPlus className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Manual Override
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-900 font-medium mb-1">
            {student.first_name} {student.last_name}
          </p>
          <p className="text-xs text-blue-700">
            Registration: {student.registration_number} | CGPA:{" "}
            {parseFloat(student.cgpa).toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Manual Override <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this student should be manually added (e.g., special skills, extenuating circumstances, faculty recommendation...)"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This reason will be recorded and displayed in the student list
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !reason.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors font-medium text-sm"
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Add Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EligibleStudentsManager({ companyId, batchYear, onClose }) {
  const [activeTab, setActiveTab] = useState("eligible");
  const [eligibilityData, setEligibilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [briefInfo, setBriefInfo] = useState(null);
  const [showManualOverride, setShowManualOverride] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchEligibilityBrief();
  }, [companyId, batchYear]);

  const fetchEligibilityBrief = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(
        `${backendUrl}/eligibility/${companyId}/${batchYear}`
      );
      setBriefInfo(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setEligibilityData(null);
        setBriefInfo(null);
      } else {
        setError(
          err.response?.data?.error || "Failed to fetch eligibility data"
        );
        console.error("Error fetching eligibility brief:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibilityDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(
        `${backendUrl}/eligibility/${companyId}/${batchYear}/details`
      );
      setEligibilityData(data);
      setShowDetails(true);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to fetch eligibility details"
      );
      console.error("Error fetching eligibility details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateEligibility = async () => {
    try {
      setCalculating(true);
      const { data } = await axios.post(
        `${backendUrl}/eligibility/${companyId}/${batchYear}/calculate`
      );

      toast.success(
        `Eligibility calculated: ${data.eligible_count} eligible, ${data.ineligible_count} ineligible`
      );
      await fetchEligibilityBrief();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to calculate eligibility"
      );
    } finally {
      setCalculating(false);
    }
  };

  const handleAddViaDreamCompany = async (studentId) => {
    try {
      setActionLoading(studentId);
      await axios.put(
        `${backendUrl}/eligibility/${companyId}/${batchYear}/students/${studentId}`,
        { action: "add" }
      );

      toast.success("Student added via dream company");
      await fetchEligibilityDetails();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add student");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveFromEligible = async (studentId, isManualOverride) => {
    try {
      setActionLoading(studentId);

      if (isManualOverride) {
        // For manual override students, use the manual endpoint with remove action
        await axios.put(
          `${backendUrl}/eligibility/manual/${companyId}/${batchYear}/students/${studentId}`,
          { action: "remove" }
        );
      } else {
        // For dream company students, use the existing endpoint
        await axios.put(
          `${backendUrl}/eligibility/${companyId}/${batchYear}/students/${studentId}`,
          { action: "remove" }
        );
      }

      toast.success("Student removed from eligibility list");
      await fetchEligibilityDetails();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to remove student");
    } finally {
      setActionLoading(null);
    }
  };

  const handleManualOverrideClick = (student) => {
    setSelectedStudent(student);
    setShowManualOverride(true);
  };

  const handleManualOverrideSuccess = async () => {
    await fetchEligibilityDetails();
  };

  if (loading && !briefInfo && !eligibilityData) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-3 text-gray-600">
              Loading eligibility data...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !briefInfo && !eligibilityData) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={fetchEligibilityBrief}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Retry
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!briefInfo && !eligibilityData && !loading) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Calculate Eligible Students
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  No Eligibility Record Found
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Student eligibility has not been calculated for this company
                  and batch combination yet. Click the button below to calculate
                  which students are eligible based on the company's criteria.
                </p>
                <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                  <li>
                    Students will be evaluated based on CGPA, backlogs, and
                    branch requirements
                  </li>
                  <li>
                    Placement status and upgrade opportunities will be
                    considered
                  </li>
                  <li>You can manually add ineligible students later</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCalculateEligibility}
              disabled={calculating}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
            >
              {calculating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4" />
                  Calculate Eligibility
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (briefInfo && !showDetails) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Eligibility Overview
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                  Eligible
                </span>
              </div>
              <div className="text-3xl font-bold text-green-900">
                {briefInfo.total_eligible_count}
              </div>
              <p className="text-xs text-green-600 mt-1">Students can apply</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                  Ineligible
                </span>
              </div>
              <div className="text-3xl font-bold text-red-900">
                {briefInfo.total_ineligible_count}
              </div>
              <p className="text-xs text-red-600 mt-1">Don't meet criteria</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="h-5 w-5 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                  Dream Used
                </span>
              </div>
              <div className="text-3xl font-bold text-amber-900">
                {briefInfo.dream_company_count || 0}
              </div>
              <p className="text-xs text-amber-600 mt-1">Via dream company</p>
            </div>
          </div>

          {briefInfo.eligibility_criteria && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Eligibility Criteria
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Minimum CGPA:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {briefInfo.eligibility_criteria.min_cgpa || "No minimum"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Maximum Backlogs:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {briefInfo.eligibility_criteria.max_backlogs === 999
                      ? "No limit"
                      : briefInfo.eligibility_criteria.max_backlogs}
                  </span>
                </div>
                {briefInfo.eligibility_criteria.allowed_specializations && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Allowed Branches:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {(typeof briefInfo.eligibility_criteria
                        .allowed_specializations === "string"
                        ? briefInfo.eligibility_criteria.allowed_specializations
                            .replace(/[{}]/g, "")
                            .split(",")
                        : briefInfo.eligibility_criteria.allowed_specializations
                      ).map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-medium"
                        >
                          {spec.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {briefInfo.updated_at && (
            <div className="text-xs text-gray-500 mb-6">
              Last updated: {new Date(briefInfo.updated_at).toLocaleString()}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={fetchEligibilityDetails}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Show Student Details
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const eligibleStudents = eligibilityData?.eligible_students || [];
  const ineligibleStudents = eligibilityData?.ineligible_students || [];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Manage Eligible Students
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowDetails(false);
                  setEligibilityData(null);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              >
                <EyeOff className="h-4 w-4" />
                Hide Details
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex gap-0 px-6 border-b border-gray-100 bg-gray-50">
            <button
              onClick={() => setActiveTab("eligible")}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === "eligible"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Eligible ({eligibleStudents.length})
            </button>
            <button
              onClick={() => setActiveTab("ineligible")}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === "ineligible"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Ineligible ({ineligibleStudents.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "eligible" && (
              <div>
                {eligibleStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">No eligible students yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Registration
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Enrollment
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Branch
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            CGPA
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Backlogs
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Academics
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {eligibleStudents.map((student) => (
                          <tr
                            key={student.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                              {student.registration_number}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {student.first_name} {student.last_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {student.enrollment_number}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {student.department} {student.branch}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                              {parseFloat(student.cgpa).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {student.backlogs}
                            </td>
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <div className="text-xs">
                                  <span className="text-gray-500">10th:</span>
                                  <span className="ml-1 text-gray-900">
                                    {student.class_10_percentage}%
                                  </span>
                                </div>
                                <div className="text-xs">
                                  <span className="text-gray-500">12th:</span>
                                  <span className="ml-1 text-gray-900">
                                    {student.class_12_percentage}%
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {student.manual_override_reason ? (
                                <div className="max-w-xs">
                                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium mb-1">
                                    <FileText className="h-3 w-3" />
                                    Manual Override
                                  </span>
                                  <p className="text-xs text-gray-600 italic line-clamp-2">
                                    "{student.manual_override_reason}"
                                  </p>
                                </div>
                              ) : student.used_dream_company ? (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-medium">
                                  <CheckCircle className="h-3 w-3" />
                                  Dream Company
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
                                  <CheckCircle className="h-3 w-3" />
                                  Auto Eligible
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {(student.used_dream_company ||
                                student.manual_override_reason) && (
                                <button
                                  onClick={() =>
                                    handleRemoveFromEligible(
                                      student.id,
                                      !!student.manual_override_reason
                                    )
                                  }
                                  disabled={actionLoading === student.id}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs rounded-lg transition-colors font-medium"
                                >
                                  {actionLoading === student.id ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3 w-3" />
                                  )}
                                  Remove
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "ineligible" && (
              <div>
                {ineligibleStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">All students are eligible</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Registration
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Enrollment
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Branch
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            CGPA
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Backlogs
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Academics
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Dream Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {ineligibleStudents.map((student) => (
                          <tr
                            key={student.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                              {student.registration_number}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {student.first_name} {student.last_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {student.enrollment_number}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {student.department} {student.branch}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                              {parseFloat(student.cgpa).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {student.backlogs}
                            </td>
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <div className="text-xs">
                                  <span className="text-gray-500">10th:</span>
                                  <span className="ml-1 text-gray-900">
                                    {student.class_10_percentage}%
                                  </span>
                                </div>
                                <div className="text-xs">
                                  <span className="text-gray-500">12th:</span>
                                  <span className="ml-1 text-gray-900">
                                    {student.class_12_percentage}%
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {student.used_dream_company ? (
                                <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2.5 py-1 rounded-lg text-xs font-medium">
                                  <XCircle className="h-3 w-3" />
                                  Already Used
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2.5 py-1 rounded-lg text-xs font-medium">
                                  <CheckCircle className="h-3 w-3" />
                                  Available
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                {!student.used_dream_company && (
                                  <button
                                    onClick={() =>
                                      handleAddViaDreamCompany(student.id)
                                    }
                                    disabled={actionLoading === student.id}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-xs rounded-lg transition-colors font-medium"
                                    title="Add via Dream Company"
                                  >
                                    {actionLoading === student.id ? (
                                      <RefreshCw className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Plus className="h-3 w-3" />
                                    )}
                                    Dream
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    handleManualOverrideClick(student)
                                  }
                                  disabled={actionLoading === student.id}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-xs rounded-lg transition-colors font-medium"
                                  title="Manual Override with Reason"
                                >
                                  <UserPlus className="h-3 w-3" />
                                  Manual
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-6">
                <span>
                  <strong className="text-gray-900">
                    {eligibleStudents.length}
                  </strong>{" "}
                  Eligible
                </span>
                <span>
                  <strong className="text-gray-900">
                    {ineligibleStudents.length}
                  </strong>{" "}
                  Ineligible
                </span>
                <span>
                  <strong className="text-gray-900">
                    {eligibilityData?.dream_company_usage_count || 0}
                  </strong>{" "}
                  Dream Company Used
                </span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {showManualOverride && selectedStudent && (
        <ManualOverrideModal
          student={selectedStudent}
          companyId={companyId}
          batchYear={batchYear}
          onClose={() => {
            setShowManualOverride(false);
            setSelectedStudent(null);
          }}
          onSuccess={handleManualOverrideSuccess}
        />
      )}
    </>
  );
}

export default EligibleStudentsManager;
