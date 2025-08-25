"use client";

import Link from "next/link";
import { useContext } from "react";
import {
  FaUserGraduate,
  FaBuilding,
  FaComments,
  FaChartBar,
} from "react-icons/fa";
import { MdEventAvailable, MdTrackChanges } from "react-icons/md";
import { BiGitPullRequest } from "react-icons/bi";
import { StudentProvider } from "../context/StudentContext.";
import { BatchProvider, BatchContext } from "../context/BatchContext";

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
  const { selectedBatch, setSelectedBatch, batches } = useContext(BatchContext);

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
          </div>
        </div>
      </div>

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
