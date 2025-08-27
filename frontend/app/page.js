"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaUserGraduate,
  FaBuilding,
  FaComments,
  FaChartBar,
  FaPlus,
} from "react-icons/fa";
import { MdEventAvailable, MdTrackChanges } from "react-icons/md";
import { BiGitPullRequest } from "react-icons/bi";
import { StudentProvider } from "../context/StudentContext.";
import { BatchProvider, useBatchContext } from "../context/BatchContext";
import axios from "axios";

export default function Home() {
  return (
    <BatchProvider>
      <StudentProvider>
        <HomeContent />
      </StudentProvider>
    </BatchProvider>
  );
}

function HomeContent() {
  const { selectedBatch, setSelectedBatch, batches, reloadBatches } =
    useBatchContext();
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [newBatchYear, setNewBatchYear] = useState("");
  const [isAddingBatch, setIsAddingBatch] = useState(false);

  const handleAddBatch = async () => {
    const yearValue = newBatchYear.trim();

    // Validate input - must be exactly 4 digits
    if (!/^\d{4}$/.test(yearValue)) {
      alert("Please enter a valid 4-digit year (e.g., 2022, 2023)");
      return;
    }

    // Check if batch already exists
    if (batches.some((batch) => batch.year === yearValue)) {
      alert("This batch already exists");
      return;
    }

    setIsAddingBatch(true);

    try {
      // Add batch to backend
      await axios.post("http://localhost:5000/batches", {
        year: yearValue,
      });

      // Re-fetch batches to update the context
      await reloadBatches();

      // Update UI
      setNewBatchYear("");
      setShowAddBatch(false);
    } catch (error) {
      console.error("Error adding batch:", error);

      if (error.response?.status === 400) {
        alert("Invalid batch data. Please check your input.");
      } else if (error.response?.status === 409) {
        alert("This batch already exists in the database.");
      } else {
        alert("Failed to add batch. Please try again later.");
      }
    } finally {
      setIsAddingBatch(false);
    }
  };

  const handleCancelAdd = () => {
    setNewBatchYear("");
    setShowAddBatch(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isAddingBatch) {
      handleAddBatch();
    }
  };

  const modules = [
    {
      title: "Student Management",
      description: "Track student profiles, placements, and eligibility status",
      icon: <FaUserGraduate className="w-5 h-5" />,
      link: "/students",
      color: "bg-blue-500",
    },
    {
      title: "Company Listing",
      description: "Manage recruiting companies and their visit schedules",
      icon: <FaBuilding className="w-5 h-5" />,
      link: "/company-listing",
      color: "bg-green-500",
    },
    {
      title: "Communication Hub",
      description: "Send emails, create forms, and manage notifications",
      icon: <FaComments className="w-5 h-5" />,
      link: "/communication",
      color: "bg-purple-500",
    },
    {
      title: "Round Tracking",
      description: "Monitor selection rounds and candidate progress",
      icon: <MdTrackChanges className="w-5 h-5" />,
      link: "/round-tracking",
      color: "bg-orange-500",
    },
    {
      title: "Events & Attendance",
      description: "Manage placement events and track attendance",
      icon: <MdEventAvailable className="w-5 h-5" />,
      link: "/event-and-attendance",
      color: "bg-red-500",
    },
    {
      title: "Analytics Dashboard",
      description: "View placement statistics and comprehensive insights",
      icon: <FaChartBar className="w-5 h-5" />,
      link: "/analytics",
      color: "bg-indigo-500",
    },
    {
      title: "Penalty Management",
      description: "Manage student penalties, rules and handle appeals",
      icon: <BiGitPullRequest className="w-5 h-5" />,
      link: "/penalty-management",
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Career Guidance & Development Cell
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Placement Management System
              </p>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1 pl-1">
                  Academic Batch
                </label>
                <select
                  value={selectedBatch || ""}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select Batch
                  </option>
                  {batches.map((batch, index) => (
                    <option key={index} value={batch.year}>
                      {batch.year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add New Batch Button */}
              <button
                onClick={() => setShowAddBatch(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg 
                         text-sm font-medium transition-all duration-200 flex items-center gap-2
                         shadow-sm hover:shadow-md active:transform active:scale-95"
                title="Add New Batch"
              >
                <FaPlus className="w-3 h-3" />
                <span className="hidden sm:inline">Add Batch</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Batch Modal */}
      {showAddBatch && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-100 
                          transform transition-all duration-300 ease-out scale-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Add New Academic Batch
              </h3>
              <button
                onClick={handleCancelAdd}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isAddingBatch}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Year
              </label>
              <input
                type="text"
                value={newBatchYear}
                onChange={(e) => setNewBatchYear(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 2022, 2023, 2024"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 bg-gray-50 focus:bg-white"
                autoFocus
                disabled={isAddingBatch}
                maxLength={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a 4-digit year (e.g., 2022, 2023)
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelAdd}
                disabled={isAddingBatch}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 
                         hover:bg-gray-200 rounded-lg transition-all duration-200 
                         hover:shadow-sm active:transform active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBatch}
                disabled={!newBatchYear.trim() || isAddingBatch}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-500 
                         hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                         rounded-lg transition-all duration-200 shadow-sm hover:shadow-md
                         active:transform active:scale-95 disabled:active:transform-none
                         flex items-center gap-2 min-w-[110px] justify-center"
              >
                {isAddingBatch && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isAddingBatch ? "Adding..." : "Add Batch"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {modules.map((module, index) => (
            <Link href={module.link} key={index}>
              <div
                className="group bg-white rounded-lg border border-gray-200 p-5 h-36 
                            hover:shadow-md hover:border-gray-300 transition-all duration-200 
                            cursor-pointer flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div
                    className={`${module.color} w-9 h-9 rounded-lg flex items-center 
                                 justify-center text-white flex-shrink-0`}
                  >
                    {module.icon}
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-gray-600 
                                 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="mt-3">
                  <h3
                    className="font-medium text-gray-900 text-sm mb-1 
                               group-hover:text-blue-600 transition-colors duration-200"
                  >
                    {module.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
