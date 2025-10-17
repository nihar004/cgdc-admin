import { useState, useEffect } from "react";
import {
  FileText,
  X,
  Upload,
  Check,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const ResultUploadModal = ({
  eventId,
  positionId,
  onClose,
  companyName,
  positionTitle,
  onResultsUpdated,
  editMode = false,
}) => {
  const [uploadMethod, setUploadMethod] = useState("manual");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [initiallySelected, setInitiallySelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [csvProcessing, setCsvProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  useEffect(() => {
    fetchEventStudents();
  }, [eventId, positionId]);

  const fetchEventStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        status: "attended",
      });

      if (positionId) {
        queryParams.append("positionId", positionId);
      }

      const response = await axios.get(
        `${backendUrl}/round-tracking/events/${eventId}/students?${queryParams}`
      );

      if (response.data.success) {
        setStudents(response.data.students || []);

        // Pre-select already qualified students
        const alreadyQualified = response.data.students
          .filter((s) => s.result_status === "selected")
          .map((s) => s.id);
        setSelectedStudents(new Set(alreadyQualified));
        setInitiallySelected(new Set(alreadyQualified));
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError(error.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentToggle = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const getStudentSelectionStatus = (studentId) => {
    const isSelected = selectedStudents.has(studentId);
    const wasSelected = initiallySelected.has(studentId);

    if (editMode) {
      if (isSelected && wasSelected) return "unchanged";
      if (isSelected && !wasSelected) return "newly-selected";
      if (!isSelected && wasSelected) return "deselected";
    }
    return isSelected ? "selected" : "not-selected";
  };

  const getChangeSummary = () => {
    if (!editMode) return null;

    const newlySelected = [...selectedStudents].filter(
      (id) => !initiallySelected.has(id)
    );
    const deselected = [...initiallySelected].filter(
      (id) => !selectedStudents.has(id)
    );

    return {
      newlySelected: newlySelected.length,
      deselected: deselected.length,
      unchanged: selectedStudents.size - newlySelected.length,
    };
  };

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setCsvProcessing(true);
    setError(null);

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        `${backendUrl}/round-tracking/events/${eventId}/upload-results`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUploadSuccess(true);
        setUploadResult(response.data.data);
      } else {
        setError(response.data.message || "Failed to process file.");
      }
    } catch (error) {
      console.error("CSV processing error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to process CSV. Please ensure it contains valid registration numbers."
      );
    } finally {
      setCsvProcessing(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const qualifiedRegistrationNumbers = students
        .filter((student) => selectedStudents.has(student.id))
        .map((student) => student.registration_number);

      // For edit mode, also send deselected students
      let payload;
      if (editMode) {
        const deselectedRegistrationNumbers = students
          .filter(
            (student) =>
              initiallySelected.has(student.id) &&
              !selectedStudents.has(student.id)
          )
          .map((student) => student.registration_number);

        payload = {
          qualifiedRegistrationNumbers,
          deselectedRegistrationNumbers,
          method: "manual",
        };
      } else {
        if (qualifiedRegistrationNumbers.length === 0) {
          setError("Please select at least one student");
          setLoading(false);
          return;
        }
        payload = {
          qualifiedRegistrationNumbers,
          method: "manual",
        };
      }

      const response = await axios.post(
        `${backendUrl}/round-tracking/events/${eventId}/results`,
        payload
      );

      if (response.data.success) {
        setUploadSuccess(true);
        setUploadResult(response.data.data);
      }
    } catch (error) {
      console.error("Error updating results:", error);
      setError(error.response?.data?.message || "Failed to update results");
    } finally {
      setLoading(false);
    }
  };

  const getRowClassName = (studentId) => {
    const status = getStudentSelectionStatus(studentId);
    const baseClass = "transition-all cursor-pointer";

    switch (status) {
      case "newly-selected":
        return `${baseClass} bg-green-50 hover:bg-green-100 border-l-4 border-green-500`;
      case "deselected":
        return `${baseClass} bg-red-50 hover:bg-red-100 border-l-4 border-red-500`;
      case "unchanged":
        return `${baseClass} bg-blue-50 hover:bg-blue-100`;
      case "selected":
        return `${baseClass} bg-blue-50 hover:bg-blue-100`;
      default:
        return `${baseClass} hover:bg-gray-50`;
    }
  };

  const getStatusBadge = (studentId) => {
    const status = getStudentSelectionStatus(studentId);

    if (!editMode) return null;

    switch (status) {
      case "newly-selected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
            <CheckCircle2 size={12} />
            New
          </span>
        );
      case "deselected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
            <XCircle size={12} />
            Removed
          </span>
        );
      case "unchanged":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            <Check size={12} />
            Selected
          </span>
        );
      default:
        return null;
    }
  };

  // Success Screen
  if (uploadSuccess && uploadResult) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Results {editMode ? "Updated" : "Uploaded"} Successfully!
            </h3>
            <p className="text-gray-600 mb-8">
              The round results have been {editMode ? "updated" : "processed"}{" "}
              successfully.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {uploadResult.totalAttended || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Attended</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {uploadResult.selectedCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Selected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {uploadResult.rejectedCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Not Selected</div>
                </div>
              </div>
            </div>

            {editMode && getChangeSummary() && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-start gap-2">
                  <Info
                    size={16}
                    className="text-blue-600 mt-0.5 flex-shrink-0"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900 mb-2">
                      Changes Made:
                    </p>
                    <ul className="space-y-1 text-blue-800">
                      {getChangeSummary().newlySelected > 0 && (
                        <li>
                          • Added {getChangeSummary().newlySelected} new student
                          {getChangeSummary().newlySelected !== 1 ? "s" : ""}
                        </li>
                      )}
                      {getChangeSummary().deselected > 0 && (
                        <li>
                          • Removed {getChangeSummary().deselected} student
                          {getChangeSummary().deselected !== 1 ? "s" : ""}
                        </li>
                      )}
                      {getChangeSummary().unchanged > 0 && (
                        <li>
                          • Kept {getChangeSummary().unchanged} existing
                          selection
                          {getChangeSummary().unchanged !== 1 ? "s" : ""}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  onResultsUpdated?.();
                  onClose();
                }}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header - Remove sticky */}
        <div className="bg-white px-8 py-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {editMode ? "Edit Results" : "Upload Results"}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                {companyName} · {positionTitle}
              </p>
              {editMode && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle size={14} className="text-amber-600" />
                  <span className="text-xs text-amber-700 font-medium">
                    Editing last round results
                  </span>
                </div>
              )}
              {uploadMethod === "file" && (
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Excel Format:</span> Use any
                    column header:
                    <code className="mx-1 px-1.5 py-0.5 bg-white rounded text-blue-700 border border-blue-200">
                      registration_number
                    </code>
                    or
                    <code className="mx-1 px-1.5 py-0.5 bg-white rounded text-blue-700 border border-blue-200">
                      reg_number
                    </code>
                    or
                    <code className="mx-1 px-1.5 py-0.5 bg-white rounded text-blue-700 border border-blue-200">
                      Registration Number
                    </code>
                    with selected students only
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* Method Selection */}
          <div className="inline-flex rounded-xl bg-gray-100 p-1 mb-8">
            <button
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                uploadMethod === "manual"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setUploadMethod("manual")}
            >
              Manual Selection
            </button>
            <button
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                uploadMethod === "file"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setUploadMethod("file")}
            >
              CSV Upload
            </button>
          </div>

          {/* Manual or File Upload content */}
          {uploadMethod === "manual" ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  {students.length} students attended
                  {selectedStudents.size > 0 && (
                    <span className="ml-2 text-emerald-600 font-semibold">
                      • {selectedStudents.size} qualified
                    </span>
                  )}
                  {editMode && getChangeSummary() && (
                    <>
                      {getChangeSummary().newlySelected > 0 && (
                        <span className="ml-2 text-green-600 font-semibold">
                          • +{getChangeSummary().newlySelected} new
                        </span>
                      )}
                      {getChangeSummary().deselected > 0 && (
                        <span className="ml-2 text-red-600 font-semibold">
                          • -{getChangeSummary().deselected} removed
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() =>
                      setSelectedStudents(new Set(students.map((s) => s.id)))
                    }
                  >
                    Select All
                  </button>
                  <button
                    className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                    onClick={() => setSelectedStudents(new Set())}
                  >
                    Clear
                  </button>
                </div>
              </div>

              {editMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Info
                      size={14}
                      className="text-blue-600 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-xs text-blue-800">
                      <span className="font-semibold">Legend:</span> Green =
                      Newly selected, Red = Removed, Blue = Already selected
                    </p>
                  </div>
                </div>
              )}

              {students.length > 0 ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left w-12">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={
                              students.length > 0 &&
                              selectedStudents.size === students.length
                            }
                            onChange={() => {
                              if (selectedStudents.size === students.length) {
                                setSelectedStudents(new Set());
                              } else {
                                setSelectedStudents(
                                  new Set(students.map((s) => s.id))
                                );
                              }
                            }}
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Registration
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Branch
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          CGPA
                        </th>
                        {editMode && (
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {students.map((student) => (
                        <tr
                          key={student.id}
                          className={getRowClassName(student.id)}
                          onClick={() => handleStudentToggle(student.id)}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedStudents.has(student.id)}
                              onChange={() => handleStudentToggle(student.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {student.registration_number}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {student.department} - {student.branch}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {student.cgpa
                              ? parseFloat(student.cgpa).toFixed(2)
                              : "N/A"}
                          </td>
                          {editMode && (
                            <td className="px-6 py-4">
                              {getStatusBadge(student.id)}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <FileText className="mx-auto h-12 w-12 mb-3" />
                  <p>No students attended this round yet</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <p className="text-base font-medium text-gray-900 mb-2">
                    Upload Results File
                  </p>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="sr-only"
                    onChange={handleFileUpload}
                    disabled={csvProcessing}
                  />
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={csvProcessing}
                  >
                    {csvProcessing ? "Processing..." : "Choose File"}
                  </button>
                  {file && !csvProcessing && (
                    <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                      <Check size={16} className="mr-2" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Error Display - Remove sticky */}
        {error && (
          <div className="px-8 py-4 bg-red-50 border-t border-red-100">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Footer - Remove sticky */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {uploadMethod === "manual" && selectedStudents.size > 0 && (
                <div className="flex items-center gap-3">
                  <span className="font-medium text-emerald-600">
                    {selectedStudents.size} student
                    {selectedStudents.size !== 1 ? "s" : ""} will be marked as
                    qualified
                  </span>
                  {editMode && getChangeSummary() && (
                    <>
                      {getChangeSummary().newlySelected > 0 && (
                        <span className="text-green-600 text-xs">
                          (+{getChangeSummary().newlySelected} new)
                        </span>
                      )}
                      {getChangeSummary().deselected > 0 && (
                        <span className="text-red-600 text-xs">
                          (-{getChangeSummary().deselected} removed)
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={onClose}
                disabled={loading || csvProcessing}
              >
                Cancel
              </button>
              {uploadMethod === "manual" && (
                <button
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${
                    editMode
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={handleSubmit}
                  disabled={
                    loading || (!editMode && selectedStudents.size === 0)
                  }
                >
                  {editMode ? "Update Results" : "Upload Results"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {(loading || csvProcessing) && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
              <p className="mt-4 text-sm font-medium text-gray-600">
                {csvProcessing
                  ? "Processing CSV..."
                  : editMode
                    ? "Updating results..."
                    : "Uploading results..."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultUploadModal;
