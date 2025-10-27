import React, { useState, useContext } from "react";
import { Upload, X, Download, FileText } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useStudentContext } from "../../context/StudentContext"; // Adjust the import based on your file structure
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const UpdateModal = ({ onClose, onUpdateComplete }) => {
  const [file, setFile] = useState(null);
  const [updating, setUpdating] = useState(false);
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

  const handleUpdate = async () => {
    if (!file) return;

    setUpdating(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.put(
        `${backendUrl}/students/bulk-update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Show success toast
      toast.success("Students updated successfully!", {
        duration: 4000,
        position: "top-right",
      });

      // Close modal and refresh data
      onClose();
      await fetchStudents();

      // Pass results to parent
      onUpdateComplete(response.data);

      // Optional: Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating students. Please check the file format.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed h-full inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 w-full max-w-lg mx-4 transform transition-all duration-200 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Update Students
            </h2>
            <p className="text-sm text-gray-500">
              Upload a file to update existing student records
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info Card */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Important Note
              </p>
              <p className="text-sm text-blue-700">
                Only include students you want to update. Students are matched
                by registration number.
              </p>
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive
              ? "border-purple-400 bg-purple-50 scale-[1.02]"
              : file
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
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
                  <span className="text-purple-600 hover:text-purple-700 font-semibold group-hover:underline">
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
            <div className="absolute inset-0 bg-purple-100/80 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold text-purple-700">
                  Drop your file here
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={!file || updating}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-2"
          >
            {updating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Update Students</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
