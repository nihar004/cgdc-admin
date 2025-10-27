// ImportModal.js
import React, { useState } from "react";
import {
  Upload,
  X,
  Download,
  FileText,
  Users,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useStudentContext } from "../../context/StudentContext"; // Adjust the import based on your file structure
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const ImportModal = ({ onClose, onImportComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { fetchStudents } = useStudentContext();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${backendUrl}/students/import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Show success toast
      toast.success("Students imported successfully!", {
        duration: 4000,
        position: "top-right",
      });

      // Close modal and refresh data
      onClose();
      await fetchStudents();

      // Pass results to parent
      onImportComplete(response.data);

      // Optional: Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Import error:", error);
      alert("Error importing students. Please check the file format.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(`${backendUrl}/students/template`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "student_import_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Template download error:", error);
      alert("Error downloading template. Please try again.");
    }
  };

  return (
    <div className="fixed h-full inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 w-full max-w-2xl mx-4 transform transition-all duration-200 scale-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Import Students
            </h2>
            <p className="text-sm text-gray-500">
              Add new students to your database
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Template Download Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <Download className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900 mb-1">
                  Need a Template?
                </p>
                <p className="text-sm text-purple-700">
                  Download our Excel template with pre-configured columns
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Template</span>
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                File Requirements
              </p>
              <p className="text-sm text-blue-700 mb-2">
                Supported formats: Excel (.xlsx, .xls) or CSV files
              </p>
              <p className="text-xs text-blue-600">
                Make sure all required fields are included in your file
              </p>
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
            dragActive
              ? "border-blue-400 bg-blue-50 scale-[1.02]"
              : file
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <label className="cursor-pointer group">
                  <span className="text-blue-600 hover:text-blue-700 font-semibold group-hover:underline">
                    Click to upload
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="text-sm text-gray-400 mt-2">
                  Excel (.xlsx, .xls) or CSV files only
                </p>
              </div>
            </div>
          )}

          {dragActive && (
            <div className="absolute inset-0 bg-blue-100/80 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold text-blue-700">
                  Drop your file here
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Expected Format Info */}
        {file && (
          <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-800">
                Ready to Import
              </p>
            </div>
            <p className="text-xs text-emerald-700">
              File will be processed and new student records will be added to
              your database
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file || uploading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                <span>Import Students</span>
              </>
            )}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            💡 <strong>Tip:</strong> Download the template first for best
            results, then fill in your student data
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
