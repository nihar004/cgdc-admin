"use client";
import axios from "axios";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import BatchOverview from "./components/BatchOverview";
import Companies from "./components/Companies";
import Students from "./components/Students";
import StudentOverview from "./components/StudentOverview";
import { useBatchContext } from "../../context/BatchContext";
import { useRouter } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// ==================== MAIN DASHBOARD ====================
function PlacementAnalyticsDashboard() {
  const router = useRouter();

  const [view, setView] = useState("batch");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [batchTab, setBatchTab] = useState("overview");
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [timeRange, setTimeRange] = useState("6months");
  const [exporting, setExporting] = useState(false);
  const { selectedBatch } = useBatchContext();

  // Function to handle export
  const handleExportRounds = async (studentId = null) => {
    try {
      setExporting(true);

      // Build the API URL
      const batchYear = selectedBatch; // Assuming `selectedBatch` is already defined
      const endpoint = `${backendUrl}/student-analytics/batch/${batchYear}/students/rounds-export`;
      const params = studentId ? { studentIds: studentId } : {};

      // Call the API
      const response = await axios.get(endpoint, {
        params,
        responseType: "blob", // Ensure the response is treated as a file
      });

      // Create a download link for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Set the filename
      const filename = studentId
        ? `student_${studentId}_rounds.xlsx`
        : `all_students_rounds.xlsx`;
      link.setAttribute("download", filename);

      // Trigger the download
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting student rounds:", error);
      alert("Failed to export student rounds. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (view === "batch") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button - Updated to match other pages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => router.push("/")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-6 w-6 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Placement Analytics
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Batch {selectedBatch} Analytics
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-1">
            {["overview", "companies", "students"].map((tab) => (
              <button
                key={tab}
                onClick={() => setBatchTab(tab)}
                className={`flex-1 px-4 py-2.5 text-sm font-semibold capitalize rounded-lg transition-all ${
                  batchTab === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {batchTab === "overview" && (
            <BatchOverview
              batchYear={selectedBatch}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          )}

          {/* Companies Tab */}
          {batchTab === "companies" && (
            <Companies
              batchYear={selectedBatch}
              selectedCompanyDetail={selectedCompanyDetail}
              setSelectedCompanyDetail={setSelectedCompanyDetail}
            />
          )}

          {/* Students Tab */}
          {batchTab === "students" && (
            <Students
              batchYear={selectedBatch}
              setSelectedStudent={setSelectedStudent}
              setView={setView}
            />
          )}
        </div>
      </div>
    );
  }

  // Student View
  const student = selectedStudent;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Updated to match other pages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => setView("batch")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Student Analytics
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  <span className="font-semibold">{student?.fullName}</span>
                  <span>•</span>
                  <span>{student?.registrationNumber}</span>
                  {student?.specialization && (
                    <>
                      <span>•</span>
                      <span>{student.specialization}</span>
                    </>
                  )}
                  {student?.email && (
                    <>
                      <span>•</span>
                      <span>{student.email}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-4">
              {/* Export for Selected Student */}
              <button
                onClick={() => handleExportRounds(student?.id)}
                disabled={exporting || !student}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  exporting || !student
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {exporting && student?.id
                  ? "Exporting..."
                  : "Export Student Rounds"}
              </button>

              {/* Export for All Students */}
              <button
                onClick={() => handleExportRounds()}
                disabled={exporting}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  exporting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {exporting && !student?.id
                  ? "Exporting..."
                  : "Export All Students Rounds"}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <StudentOverview student={student} studentId={student?.id} />
      </div>
    </div>
  );
}

export default PlacementAnalyticsDashboard;
