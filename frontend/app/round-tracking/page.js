"use client";

import { useState, useEffect } from "react";
import { Search, Download, Calendar, ArrowLeft } from "lucide-react";
import axios from "axios";

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

// Main Component
const RoundTrackingPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCompanies, setExpandedCompanies] = useState(new Set());
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    jobType: "all",
  });
  const [currentBatch, setCurrentBatch] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, [currentBatch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/round-tracking/companies/${currentBatch}`
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch companies");
      }

      const transformedCompanies = data.companies.map((company) => {
        const positions = company.positions.map((position) => ({
          ...position,
          events: position.events.map((event) => ({
            ...event,
            event_date: new Date(event.event_date),
          })),
        }));

        // Calculate company status based on position events
        const status = calculateCompanyStatus(positions);

        return {
          ...company,
          positions,
          status,
        };
      });

      setCompanies(transformedCompanies);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Improved company status calculation
  const calculateCompanyStatus = (positions) => {
    const now = new Date();
    let status = "upcoming";

    for (const position of positions) {
      for (const event of position.events) {
        const eventDate = new Date(event.event_date);

        // Check if any event is happening today
        if (eventDate.toDateString() === now.toDateString()) {
          return "ongoing";
        }

        // Event is in the past
        if (eventDate < now) {
          status = "completed";
          continue;
        }

        // Event is in the future but we already found a completed event
        if (eventDate > now && status !== "completed") {
          status = "upcoming";
        }
      }
    }

    return status;
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Data
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
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

          <div className="mt-4">
            {/* Add batch selector */}
            <select
              value={currentBatch}
              onChange={(e) => setCurrentBatch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    Batch {year}
                  </option>
                );
              })}
            </select>
          </div>

          <StatsCards />
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
