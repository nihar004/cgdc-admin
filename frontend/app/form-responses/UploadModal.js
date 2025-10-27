"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Upload,
  X,
  AlertTriangle,
  FileText,
  BarChart3,
} from "lucide-react";
import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const UploadModal = ({ selectedForm, setShowUploadModal, fetchForms }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("summary");
  const [statusFilter, setStatusFilter] = useState("all");

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
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const validateFile = (file) => {
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only CSV and Excel files are allowed");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return false;
    }

    setError(null);
    return true;
  };

  const handleUpload = async () => {
    if (!file || !selectedForm) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      setUploadStatus({ type: "loading", message: "Processing file..." });
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      // Simulate API call - replace with actual axios call
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = prev + 10;
            setUploadStatus({
              type: "loading",
              message: `Uploading... ${newProgress}%`,
            });
            if (newProgress >= 100) {
              clearInterval(interval);
              resolve();
            }
            return newProgress;
          });
        }, 200);
      });

      const response = await axios.post(
        `${backendUrl}/forms/${selectedForm.id}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            setUploadStatus({
              type: "loading",
              message: `Uploading... ${percentCompleted}%`,
            });
          },
        }
      );

      setUploadStatus({
        type: "success",
        message: "Upload completed successfully!",
        summary: response.data.summary,
        details: response.data.details || [],
      });

      if (fetchForms) fetchForms();
    } catch (err) {
      setUploadStatus(null);
      // NEW: Check for eligibility snapshot missing
      if (err.response?.data?.requiresAction === "create_eligibility") {
        setError(
          `${err.response.data.message}\n\nPlease go to Company Management and create the eligibility snapshot first.`
        );
      } else {
        setError(err.response?.data?.message || "Failed to upload file");
      }

      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetModal = () => {
    setShowUploadModal(false);
    setUploadStatus(null);
    setFile(null);
    setError(null);
    setUploadProgress(0);
    setActiveTab("summary");
    setStatusFilter("all");
  };

  const getFilteredDetails = () => {
    if (!uploadStatus?.details) return [];
    if (statusFilter === "all") return uploadStatus.details;
    return uploadStatus.details.filter((item) => item.status === statusFilter);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "duplicate":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-50 text-green-800 border-green-200";
      case "error":
        return "bg-red-50 text-red-800 border-red-200";
      case "duplicate":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 text-white relative">
          <button
            onClick={resetModal}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Upload Data</h3>
              <p className="text-blue-100 text-sm">
                Form: {selectedForm?.title || "Demo Form"}
              </p>
              {selectedForm?.batch_year && (
                <p className="text-blue-200 text-xs">
                  Batch Year: {selectedForm.batch_year} • Only students from
                  this batch can be uploaded
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Upload Area */}
          {!uploadStatus && (
            <div className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-blue-400 bg-blue-50 scale-105"
                    : file
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-green-800">
                        File Ready
                      </p>
                      <p className="text-green-600">Click upload to process</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full transition-colors ${
                        dragActive ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      <FileSpreadsheet
                        className={`h-8 w-8 ${dragActive ? "text-blue-600" : "text-gray-400"}`}
                      />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">
                        {dragActive
                          ? "Drop your file here"
                          : "Drag & drop your file"}
                      </p>
                      <p className="text-gray-500">or click to browse</p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {!file && (
                  <button className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                    Select File
                  </button>
                )}
              </div>

              {/* File Info */}
              {file && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-800">
                        Selected File
                      </p>
                      <p className="text-green-700">{file.name}</p>
                      <p className="text-sm text-green-600">
                        Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="p-1 hover:bg-green-200 rounded text-green-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5">
                <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Upload Requirements & Important Notes
                </h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-amber-700">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>File must contain registration number column</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Supported: CSV, Excel (.xlsx, .xls)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Registration numbers validated against database</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Duplicate entries will be flagged</span>
                  </div>
                </div>

                {/* Data Replacement Warning */}
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-orange-800 text-sm">
                        Data Replacement Policy
                      </p>
                      <p className="text-xs text-orange-700 mt-1">
                        Uploading new data will{" "}
                        <strong>replace existing responses</strong> for students
                        already in the system. Students not in the new file will
                        keep their existing data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {uploadStatus?.type === "loading" && (
            <div className="text-center py-12 space-y-6">
              <div className="relative inline-flex items-center justify-center w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
                  style={{ animationDuration: "1s" }}
                ></div>
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {uploadStatus.message}
                </p>
                <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto mt-4">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadStatus?.type === "success" && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-green-800 mb-2">
                  Upload Complete!
                </h4>
                <p className="text-green-600">
                  Your data has been processed successfully
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "summary"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <BarChart3 className="h-4 w-4 inline mr-2" />
                  Summary
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "details"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FileText className="h-4 w-4 inline mr-2" />
                  Details ({uploadStatus.details?.length || 0})
                </button>
              </div>

              {/* Summary Tab */}
              {activeTab === "summary" && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-blue-700 mb-1">
                        {uploadStatus.summary?.total || 0}
                      </div>
                      <div className="text-sm font-medium text-blue-600">
                        Total Records
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-green-700 mb-1">
                        {uploadStatus.summary?.successful || 0}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        Successful
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-yellow-700 mb-1">
                        {uploadStatus.summary?.duplicates || 0}
                      </div>
                      <div className="text-sm font-medium text-yellow-600">
                        Duplicates
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-red-700 mb-1">
                        {uploadStatus.summary?.invalid || 0}
                      </div>
                      <div className="text-sm font-medium text-red-600">
                        Invalid
                      </div>
                    </div>

                    {uploadStatus.summary?.year_mismatches > 0 && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-purple-700 mb-1">
                          {uploadStatus.summary.year_mismatches}
                        </div>
                        <div className="text-sm font-medium text-purple-600">
                          Year Mismatches
                        </div>
                      </div>
                    )}
                    {uploadStatus.summary?.eligibility_failures > 0 && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-purple-700 mb-1">
                          {uploadStatus.summary.eligibility_failures}
                        </div>
                        <div className="text-sm font-medium text-purple-600">
                          Eligibility Failures
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Batch Year Info
                  {uploadStatus.summary?.form_batch_year && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800">
                          Form Information
                        </span>
                      </div>
                      <div className="text-sm text-blue-700">
                        This form is configured for{" "}
                        <strong>
                          Batch {uploadStatus.summary.form_batch_year}
                        </strong>{" "}
                        students only.
                        {uploadStatus.summary.year_mismatches > 0 && (
                          <span className="text-purple-700 ml-2">
                            {uploadStatus.summary.year_mismatches} records were
                            rejected due to batch year mismatch.
                          </span>
                        )}
                      </div>
                    </div>
                  )} */}
                  {/* Batch Year Info */}
                  {uploadStatus.summary?.form_batch_year && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800">
                          Form Information
                        </span>
                      </div>
                      <div className="text-sm text-blue-700 space-y-2">
                        <div>
                          This form is configured for{" "}
                          <strong>
                            Batch {uploadStatus.summary.form_batch_year}
                          </strong>{" "}
                          students only.
                        </div>

                        {/* Year Mismatch Info */}
                        {uploadStatus.summary.year_mismatches > 0 && (
                          <div className="text-purple-700">
                            ⚠ {uploadStatus.summary.year_mismatches} records
                            were rejected due to batch year mismatch.
                          </div>
                        )}

                        {/* Eligibility Status */}
                        {uploadStatus.summary.has_company_eligibility && (
                          <div className="text-green-700 font-medium">
                            ✓ Company eligibility verified for all uploaded
                            students
                          </div>
                        )}

                        {/* Eligibility Failures */}
                        {uploadStatus.summary.eligibility_failures > 0 && (
                          <div className="text-red-700 font-medium">
                            ✗ {uploadStatus.summary.eligibility_failures}{" "}
                            students failed eligibility criteria for this
                            company
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Success Rate Progress Bar */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Success Rate
                      </span>
                      <span className="text-sm text-gray-600">
                        {uploadStatus.summary?.total > 0
                          ? Math.round(
                              (uploadStatus.summary.successful /
                                uploadStatus.summary.total) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000"
                        style={{
                          width: `${
                            uploadStatus.summary?.total > 0
                              ? (uploadStatus.summary.successful /
                                  uploadStatus.summary.total) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === "details" && (
                <div className="space-y-4">
                  {/* Filter Controls */}
                  <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setStatusFilter("all")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          statusFilter === "all"
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        All ({uploadStatus.details?.length || 0})
                      </button>
                      <button
                        onClick={() => setStatusFilter("success")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          statusFilter === "success"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Success ({uploadStatus.summary?.successful || 0})
                      </button>
                      <button
                        onClick={() => setStatusFilter("error")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          statusFilter === "error"
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Errors ({uploadStatus.summary?.invalid || 0})
                      </button>
                      <button
                        onClick={() => setStatusFilter("duplicate")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          statusFilter === "duplicate"
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Duplicates ({uploadStatus.summary?.duplicates || 0})
                      </button>
                    </div>
                  </div>

                  {/* Results List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getFilteredDetails().map((item, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-3 ${getStatusColor(item.status)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(item.status)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  Row {item.row}
                                </span>
                                {item.regNumber && (
                                  <span className="font-mono text-sm bg-white/50 px-2 py-0.5 rounded">
                                    {item.regNumber}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm mt-1">{item.reason}</p>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              item.status === "success"
                                ? "bg-green-200 text-green-800"
                                : item.status === "error"
                                  ? "bg-red-200 text-red-800"
                                  : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}

                    {getFilteredDetails().length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No items found for the selected filter
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={resetModal}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
            >
              {uploadStatus?.type === "success" ? "Close" : "Cancel"}
            </button>
            {!uploadStatus && file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 transition-all font-medium shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Upload & Process
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
