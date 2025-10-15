import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import axios from "axios";

const ResultUploadModal = ({
  eventId,
  onClose,
  companyName,
  positionTitle,
  onResultsUpdated,
}) => {
  const [uploadMethod, setUploadMethod] = useState("manual");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchEventStudents();
  }, [eventId]);

  const fetchEventStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/round-tracking/events/${eventId}/students?status=attended`
      );

      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load students");
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvData = e.target.result;
        const response = await axios.post(
          `http://localhost:5000/round-tracking/events/${eventId}/upload-csv`,
          { csvData }
        );

        if (response.data.success) {
          onResultsUpdated?.();
          onClose();
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to process CSV");
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const qualifiedRegistrationNumbers = students
        .filter((student) => selectedStudents.has(student.id))
        .map((student) => student.registration_number);

      const response = await axios.post(
        `http://localhost:5000/round-tracking/events/${eventId}/results`,
        {
          qualifiedRegistrationNumbers,
          method: "manual",
        }
      );

      if (response.data.success) {
        onResultsUpdated?.();
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Upload Round Results
          </h3>
          <p className="text-sm text-gray-600">
            {companyName} - {positionTitle}
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-lg ${uploadMethod === "manual" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setUploadMethod("manual")}
              >
                Manual Selection
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${uploadMethod === "file" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                onClick={() => setUploadMethod("file")}
              >
                File Upload
              </button>
            </div>
          </div>

          {uploadMethod === "manual" ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {students.length} students attended this round
                </p>
                <div className="space-x-2">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() =>
                      setSelectedStudents(new Set(students.map((s) => s.id)))
                    }
                  >
                    Select All
                  </button>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => setSelectedStudents(new Set())}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">
                        <input
                          type="checkbox"
                          checked={selectedStudents.size === students.length}
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
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Enrollment
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        CGPA
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedStudents.has(student.id)}
                            onChange={() => handleStudentToggle(student.id)}
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {student.enrollment}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {student.cgpa}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload CSV file with qualified student IDs
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".csv"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="mt-2 text-xs text-gray-500">
                    CSV file with enrollment numbers or student IDs
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="px-6 py-2 text-red-600 bg-red-50 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <div className="text-sm text-gray-600">
            {uploadMethod === "manual" &&
              `${selectedStudents.size} of ${students.length} students selected`}
          </div>
          <div className="space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Update Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultUploadModal;
