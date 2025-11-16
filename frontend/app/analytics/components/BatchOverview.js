import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  Building,
  Target,
  Award,
  Users,
  Briefcase,
  AlertCircle,
} from "lucide-react";

import {
  getBatchOverview,
  getBatchPlacements,
  getDepartmentsAnalytics,
  getCompaniesAnalytics,
  getCompanyTimeline,
  getPackagesAnalytics,
} from "../services/analyticsService";

const StatCard = ({ icon: Icon, label, value, subtext, color = "blue" }) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    yellow: "bg-yellow-100 text-yellow-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 ${colorMap[color]} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-0.5">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
        {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
      </div>
    </div>
  );
};

export default function AnalyticsDashboard({
  batchYear,
  selectedDepartment,
  setSelectedDepartment,
  timeRange,
  setTimeRange,
}) {
  const [overview, setOverview] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyTimeline, setCompanyTimeline] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          overviewRes,
          placementsRes,
          deptsRes,
          companiesRes,
          timelineRes,
          packagesRes,
        ] = await Promise.all([
          getBatchOverview(batchYear),
          getBatchPlacements(batchYear),
          getDepartmentsAnalytics(batchYear),
          getCompaniesAnalytics(batchYear),
          getCompanyTimeline(batchYear),
          getPackagesAnalytics(batchYear),
        ]);

        setOverview(overviewRes.data);
        setPlacements(placementsRes.data || []);
        setDepartments(deptsRes.data || []);
        setCompanies(companiesRes.data || []);
        setCompanyTimeline(timelineRes.data || []);
        setPackagesData(packagesRes.data || []);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (batchYear) {
      fetchAllData();
    }
  }, [batchYear]);

  // Filter placements based on frontend filters
  const filteredPlacements = useMemo(() => {
    if (!placements.length) return [];

    let filtered = [...placements];

    // Department filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((p) => p.department === selectedDepartment);
    }

    // Time range filter
    if (timeRange !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      switch (timeRange) {
        case "1month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "6months":
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case "1year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(
        (p) => new Date(p.acceptanceDate || p.acceptedDate) >= cutoffDate
      );
    }

    return filtered;
  }, [placements, selectedDepartment, timeRange]);

  // GRAPH 1: Cumulative Placements Timeline
  const cumulativePlacementData = useMemo(() => {
    if (!filteredPlacements.length) return [];

    const sorted = [...filteredPlacements].sort(
      (a, b) => new Date(a.acceptanceDate) - new Date(b.acceptanceDate)
    );

    const monthlyData = {};
    sorted.forEach((placement, index) => {
      const date = new Date(placement.acceptanceDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: date.toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          cumulative: 0,
          newPlacements: 0,
        };
      }

      monthlyData[monthKey].newPlacements++;
    });

    // Calculate cumulative
    let cumulative = 0;
    return Object.values(monthlyData).map((data) => {
      cumulative += data.newPlacements;
      return { ...data, cumulative };
    });
  }, [filteredPlacements]);

  // GRAPH 2: Package Distribution Histogram (from API)
  const packageHistogramData = useMemo(() => {
    if (!packagesData.length) return [];
    return packagesData.map((pkg) => ({
      range: pkg.range,
      count: pkg.count,
    }));
  }, [packagesData]);

  // GRAPH 3: Top Companies by Placements (from API)
  const topCompaniesData = useMemo(() => {
    if (!companies.length) return [];
    return companies
      .sort((a, b) => (b.studentsPlaced || 0) - (a.studentsPlaced || 0))
      .slice(0, 10)
      .map((company) => ({
        name: company.name || company.companyName,
        studentsPlaced: company.studentsPlaced || 0,
        avgPackage: company.avgPackage || 0,
      }));
  }, [companies]);

  // GRAPH 4: Department Comparison (Grouped Bar) (from API)
  const departmentComparisonData = useMemo(() => {
    if (!departments.length) return [];
    return departments.map((dept) => ({
      department: dept.department || dept.name || "Unknown",
      total: dept.total || dept.totalStudents || 0,
      placed: dept.placed || dept.placedStudents || 0,
      unplaced:
        (dept.total || dept.totalStudents || 0) -
        (dept.placed || dept.placedStudents || 0),
      rate: dept.rate || dept.placementRate || 0,
    }));
  }, [departments]);

  // GRAPH 5: Company Timeline (from API)
  const companyVisitTimelineData = useMemo(() => {
    if (!companyTimeline.length) return [];
    return companyTimeline.map((item) => ({
      month: item.month,
      expected: item.expected || 0,
      actual: item.actual || 0,
    }));
  }, [companyTimeline]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl border border-red-200 p-6 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <div>
          <h3 className="text-lg font-bold text-red-900">Error Loading Data</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!overview) return <div className="p-8">No data available</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">
              Department:
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="all">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="E.Com">E.Com</option>
              <option value="ME">ME</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">
              Time Range:
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="all">All Time</option>
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredPlacements.length} placements
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={overview.totalStudents}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Placement Rate"
          value={`${overview.placementRate}%`}
          subtext={`${overview.placedStudents}/${overview.totalStudents}`}
          color="emerald"
        />
        <StatCard
          icon={Award}
          label="Highest Package"
          value={`₹${overview.highestPackage}L`}
          color="yellow"
        />
        <StatCard
          icon={Target}
          label="Average Package"
          value={`₹${overview.avgPackage}L`}
          subtext={`Median: ₹${overview.medianPackage}L`}
          color="purple"
        />
        <StatCard
          icon={Building}
          label="Companies"
          value={overview.totalCompanies}
          color="indigo"
        />
        <StatCard
          icon={Briefcase}
          label="Total Offers"
          value={overview.totalOffers}
          color="orange"
        />
      </div>

      {/* Graphs Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative Placements Over Time */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Placement Timeline
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={cumulativePlacementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: 12 }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#10b981"
                fill="#d1fae5"
                name="Total Placements"
              />
              <Area
                type="monotone"
                dataKey="newPlacements"
                stroke="#3b82f6"
                fill="#dbeafe"
                name="New This Month"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Package Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Package Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={packageHistogramData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="range"
                stroke="#6b7280"
                style={{ fontSize: 12 }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: 12 }} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
                name="Students"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphs Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Companies */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Top 10 Companies
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topCompaniesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" style={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                stroke="#6b7280"
                style={{ fontSize: 11 }}
              />
              <Tooltip />
              <Bar
                dataKey="studentsPlaced"
                fill="#f59e0b"
                radius={[0, 6, 6, 0]}
                name="Students Placed"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Comparison */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Department-wise Status
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="department"
                stroke="#6b7280"
                style={{ fontSize: 12 }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="placed"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                name="Placed"
              />
              <Bar
                dataKey="unplaced"
                fill="#ef4444"
                radius={[6, 6, 0, 0]}
                name="Unplaced"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Company Visit Timeline */}
      {companyVisitTimelineData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Company Visit Timeline
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={companyVisitTimelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: 12 }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="expected"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                name="Expected Visits"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                name="Actual Visits"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
