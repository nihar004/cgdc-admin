"use client";

import { useState, useEffect } from "react";
import { Search, Download, Calendar, ArrowLeft } from "lucide-react";

import StatsCards from "./StatsCards";
import CompanyCard from "./CompanyCard";

const FilterBar = ({ filters, onFiltersChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies or positions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
            />
          </div>
        </div>
        <div className="lg:w-48">
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.status}
            onChange={(e) =>
              onFiltersChange({ ...filters, status: e.target.value })
            }
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="lg:w-48">
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.jobType}
            onChange={(e) =>
              onFiltersChange({ ...filters, jobType: e.target.value })
            }
          >
            <option value="all">All Job Types</option>
            <option value="internship">Internship</option>
            <option value="full_time">Full Time</option>
            <option value="internship_plus_ppo">Internship + PPO</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Mock data
const MOCK_COMPANIES = [
  {
    id: 1,
    company_name: "Microsoft",
    logo_url: "https://logo.clearbit.com/microsoft.com",
    status: "ongoing",
    positions: [
      {
        id: 1,
        position_title: "Software Development Engineer",
        job_type: "full_time",
        package: 4400000,
        rounds: [
          {
            round_number: 1,
            name: "Online Assessment",
            status: "completed",
            total_students: 150,
            qualified_students: 75,
            date: "2025-09-20",
          },
          {
            round_number: 2,
            name: "Technical Interview",
            status: "ongoing",
            total_students: 75,
            qualified_students: 30,
            date: "2025-09-24",
          },
          {
            round_number: 3,
            name: "HR Round",
            status: "upcoming",
            total_students: 30,
            qualified_students: 0,
            date: "2025-09-26",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    company_name: "Google",
    logo_url: "https://logo.clearbit.com/google.com",
    status: "upcoming",
    positions: [
      {
        id: 2,
        position_title: "Software Engineer",
        job_type: "internship_plus_ppo",
        package: 3600000,
        rounds: [
          {
            round_number: 1,
            name: "Coding Test",
            status: "upcoming",
            total_students: 200,
            qualified_students: 0,
            date: "2025-10-01",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    company_name: "Amazon",
    logo_url: "https://logo.clearbit.com/amazon.com",
    status: "completed",
    positions: [
      {
        id: 3,
        position_title: "SDE Intern",
        job_type: "internship",
        package: 1200000,
        rounds: [
          {
            round_number: 1,
            name: "Online Test",
            status: "completed",
            total_students: 180,
            qualified_students: 90,
            date: "2025-09-15",
          },
          {
            round_number: 2,
            name: "Technical Interview 1",
            status: "completed",
            total_students: 90,
            qualified_students: 45,
            date: "2025-09-17",
          },
          {
            round_number: 3,
            name: "Technical Interview 2",
            status: "completed",
            total_students: 45,
            qualified_students: 20,
            date: "2025-09-19",
          },
          {
            round_number: 4,
            name: "HR Interview",
            status: "completed",
            total_students: 20,
            qualified_students: 15,
            date: "2025-09-20",
          },
        ],
      },
    ],
  },
];

// Main Component
const RoundTrackingPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCompanies, setExpandedCompanies] = useState(new Set());
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    jobType: "all",
  });
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCompanies(MOCK_COMPANIES);

      // Calculate stats from mock data
      const stats = {
        totalApplications: MOCK_COMPANIES.reduce(
          (sum, company) => sum + company.positions[0].rounds[0].total_students,
          0
        ),
        currentlyQualified: MOCK_COMPANIES.reduce((sum, company) => {
          const lastRound =
            company.positions[0].rounds[company.positions[0].rounds.length - 1];
          return sum + lastRound.qualified_students;
        }, 0),
        activeCompanies: MOCK_COMPANIES.filter((c) => c.status === "ongoing")
          .length,
        totalPlacements: MOCK_COMPANIES.reduce((sum, company) => {
          const lastRound =
            company.positions[0].rounds[company.positions[0].rounds.length - 1];
          return (
            sum +
            (company.status === "completed" ? lastRound.qualified_students : 0)
          );
        }, 0),
      };

      setStats(stats);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyToggle = (companyId) => {
    const newExpanded = new Set(expandedCompanies);
    if (newExpanded.has(companyId)) {
      newExpanded.delete(companyId);
    } else {
      newExpanded.add(companyId);
    }
    setExpandedCompanies(newExpanded);
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.company_name
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      company.positions?.some((pos) =>
        pos.position_title.toLowerCase().includes(filters.search.toLowerCase())
      );
    const matchesStatus =
      filters.status === "all" || company.status === filters.status;
    const matchesJobType =
      filters.jobType === "all" ||
      company.positions?.some((pos) => pos.job_type === filters.jobType);

    return matchesSearch && matchesStatus && matchesJobType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading round data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Round Tracking
                </h1>
                <p className="text-gray-600">
                  Monitor student progress through interview rounds
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md">
                <Download className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>

          <StatsCards stats={stats} />
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Companies List */}
        <div className="space-y-4">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onToggle={handleCompanyToggle}
                isExpanded={expandedCompanies.has(company.id)}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Companies Found
              </h3>
              <p className="text-gray-600">
                {filters.search ||
                filters.status !== "all" ||
                filters.jobType !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "No companies have scheduled rounds yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoundTrackingPage;
