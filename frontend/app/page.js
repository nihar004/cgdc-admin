"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaUserGraduate,
  FaBuilding,
  FaPlus,
  FaEnvelope,
  FaTable,
  FaUserShield,
  FaTimes,
  FaChartBar,
} from "react-icons/fa";
import { MdEventAvailable, MdTrackChanges } from "react-icons/md";
import { StudentProvider } from "../context/StudentContext";
import { useBatchContext } from "../context/BatchContext";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import useAuth
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  return (
    <StudentProvider>
      <HomeContent />
    </StudentProvider>
  );
}

function HomeContent() {
  const { user, logout } = useAuth();

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
      await axios.post(`${backendUrl}/batches`, {
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
      title: "Round Creation and Attendance",
      description: "Manage placement events and track attendance",
      icon: <MdEventAvailable className="w-5 h-5" />,
      link: "/event-and-attendance",
      color: "bg-red-500",
    },

    {
      title: "Round Results",
      description: "Monitor selection rounds and candidate progress",
      icon: <MdTrackChanges className="w-5 h-5" />,
      link: "/round-tracking",
      color: "bg-orange-500",
    },
    {
      title: "Form Management",
      description:
        "Collect and manage student submissions through structured data forms (CSV/Excel)",
      icon: <FaTable className="w-5 h-5" />,
      link: "/form-responses",
      color: "bg-teal-500",
    },
    {
      title: "Email Management",
      description:
        "Create, manage, and send official placement communications using templates",
      icon: <FaEnvelope className="w-5 h-5" />,
      link: "/email-management",
      color: "bg-pink-500",
    },
    ...(user?.role === "admin"
      ? [
          {
            title: "User Management",
            description: "Manage user accounts, roles, and permissions",
            icon: <FaUserShield className="w-5 h-5" />,
            link: "/user-management",
            color: "bg-purple-500",
          },
        ]
      : []),
    {
      title: "Analytics Dashboard",
      description: "View placement statistics and comprehensive insights",
      icon: <FaChartBar className="w-5 h-5" />,
      link: "/analytics",
      color: "bg-indigo-500",
    },
    // {
    //   title: "Penalty Management",
    //   description: "Manage student penalties, rules and handle appeals",
    //   icon: <BiGitPullRequest className="w-5 h-5" />,
    //   link: "/penalty-management",
    //   color: "bg-yellow-500",
    // },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Updated Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Career Guidance & Development Cell
              </h1>
              <p className="text-gray-600">Placement Management System</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Batch Selection */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <select
                    value={selectedBatch || ""}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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

                <button
                  onClick={() => setShowAddBatch(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Batch
                </button>
              </div>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name || user?.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.role
                      ? user.role
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                      : ""}
                  </span>
                </div>
                <div className="relative group">
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg hover:bg-red-50 group-hover:text-red-600 transition-all duration-200"
                    title="Logout"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 top-full mt-1 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transform transition-all duration-200">
                    <div className="bg-red-50 text-red-600 text-xs font-medium py-1 px-2 rounded whitespace-nowrap">
                      Logout
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module, index) => (
            <Link href={module.link} key={index}>
              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all duration-200 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`${module.color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}
                  >
                    {module.icon}
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                <h3 className="font-semibold text-gray-900 mb-2">
                  {module.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {module.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {showAddBatch && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 
                   transform transition-all duration-300 ease-out scale-100 
                   border border-gray-100/50 backdrop-blur-sm"
          >
            {/* Subtle gradient border */}
            <div
              className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 
                     rounded-2xl opacity-60 blur-sm"
            ></div>

            <div className="relative bg-white rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3
                    className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 
                         bg-clip-text text-transparent"
                  >
                    Add New Academic Batch
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Create a new batch year
                  </p>
                </div>
                <button
                  onClick={handleCancelAdd}
                  className="w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 
                     flex items-center justify-center transition-all duration-200
                     hover:scale-110 group disabled:opacity-50"
                  disabled={isAddingBatch}
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors"
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

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Batch Year
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newBatchYear}
                    onChange={(e) => setNewBatchYear(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., 2022, 2023, 2024"
                    className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-base
                       focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
                       transition-all duration-300 bg-gray-50/50 hover:bg-white
                       placeholder:text-gray-400 disabled:opacity-50 font-medium"
                    autoFocus
                    disabled={isAddingBatch}
                    maxLength={4}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Enter a 4-digit year (e.g., 2022, 2023)
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCancelAdd}
                  disabled={isAddingBatch}
                  className="flex-1 px-6 py-3.5 text-sm font-semibold text-gray-600 
                     bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 
                     hover:shadow-md active:transform active:scale-95 
                     disabled:opacity-50 disabled:hover:scale-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBatch}
                  disabled={!newBatchYear.trim() || isAddingBatch}
                  className="flex-1 px-6 py-3.5 text-sm font-semibold text-white 
                     bg-gradient-to-r from-blue-600 to-indigo-600
                     hover:from-blue-700 hover:to-indigo-700 
                     disabled:from-gray-300 disabled:to-gray-400
                     disabled:cursor-not-allowed rounded-xl transition-all duration-200 
                     shadow-lg hover:shadow-xl active:transform active:scale-95 
                     disabled:active:transform-none flex items-center gap-2 
                     justify-center relative overflow-hidden group"
                >
                  {/* Shimmer effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                  ></div>

                  {isAddingBatch && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  {isAddingBatch ? "Adding..." : "Add Batch"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
