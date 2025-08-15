"use client";

import Link from 'next/link';
import { FaUserGraduate, FaBuilding, FaComments, FaChartBar } from 'react-icons/fa';
import { MdEventAvailable, MdTrackChanges } from 'react-icons/md';
import { BiGitPullRequest } from 'react-icons/bi';

export default function Home() {
  const modules = [
    {
      title: "Student Management",
      description: "Track and manage student profiles, placements, and eligibility",
      icon: <FaUserGraduate className="w-8 h-8" />,
      link: "/students",
      color: "bg-blue-500"
    },
    {
      title: "Company Listing",
      description: "Manage recruiting companies and their visit schedules",
      icon: <FaBuilding className="w-8 h-8" />,
      link: "/company-listing",
      color: "bg-green-500"
    },
    {
      title: "Communication Hub",
      description: "Send emails, create forms, and manage notifications",
      icon: <FaComments className="w-8 h-8" />,
      link: "/communication",
      color: "bg-purple-500"
    },
    {
      title: "Round Tracking",
      description: "Monitor selection rounds and candidate progress",
      icon: <MdTrackChanges className="w-8 h-8" />,
      link: "/round-tracking",
      color: "bg-orange-500"
    },
    {
      title: "Events & Attendance",
      description: "Manage placement events and track attendance",
      icon: <MdEventAvailable className="w-8 h-8" />,
      link: "/event-and-attendance",
      color: "bg-red-500"
    },
    {
      title: "Analytics Dashboard",
      description: "View placement statistics and insights",
      icon: <FaChartBar className="w-8 h-8" />,
      link: "/analytics",
      color: "bg-indigo-500"
    },
    {
      title: "Penalty Management",
      description: "Manage student penalties, rules and handle appeals",
      icon: <BiGitPullRequest className="w-8 h-8" />,
      link: "/penalty-management",
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Career Guidance & Development Cell
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Empowering students with career opportunities and professional growth
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <Link href={module.link} key={index}>
                <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300`}>
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {module.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}