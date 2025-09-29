import { FileText } from "lucide-react";

const ResultUploadModal = ({
  eventId,
  onClose,
  companyName,
  positionTitle,
}) => {
  const [uploadMethod, setUploadMethod] = useState("manual"); // 'manual' or 'file'
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(new Set());

  useEffect(() => {
    // Fetch students who attended this event
    fetchEventStudents();
  }, [eventId]);

  const fetchEventStudents = async () => {
    try {
      // API call to get students who attended this event
      // const response = await fetch(`/api/events/${eventId}/students`);
      // const data = await response.json();
      // setStudents(data);

      // Mock data for now
      setStudents([
        {
          id: 1,
          name: "John Doe",
          enrollment: "2021A7PS001",
          cgpa: 8.5,
          current_status: "attended",
        },
        {
          id: 2,
          name: "Jane Smith",
          enrollment: "2021A7PS002",
          cgpa: 9.0,
          current_status: "attended",
        },
        {
          id: 3,
          name: "Mike Johnson",
          enrollment: "2021A7PS003",
          cgpa: 7.8,
          current_status: "attended",
        },
      ]);
    } catch (error) {
      console.error("Error fetching students:", error);
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

  const handleSubmit = async () => {
    try {
      // API call to update round results
      const payload = {
        eventId,
        qualifiedStudentIds: Array.from(selectedStudents),
      };

      // await fetch(`/api/events/${eventId}/results`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });

      console.log("Submitting results:", payload);
      onClose();
    } catch (error) {
      console.error("Error updating results:", error);
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
