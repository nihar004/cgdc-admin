import { useEffect, useState, useMemo } from "react";
import axios from "axios";
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
} from "recharts";

import { TrendingUp, Building, Target, Award, AlertCircle } from "lucide-react";

import StatCard from "./StatCard";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Custom Tooltip for showing companies
const CustomPlacementTooltip = ({ active, payload, label, monthlyTrends }) => {
  if (!active || !payload || !payload.length) return null;

  const currentMonth = payload[0]?.payload?.monthKey;
  const monthData = monthlyTrends.find((m) => m.monthKey === currentMonth);

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
      style={{
        minWidth: "320px",
        maxWidth: "480px",
        width: "auto",
        position: "relative",
        zIndex: 9999,
      }}
    >
      <p className="font-bold text-gray-900 mb-3">
        {payload[0]?.payload?.month}
      </p>

      {/* Main metrics */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
        {payload.map((entry, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span style={{ color: entry.color }} className="font-semibold">
              {entry.name}:
            </span>
            <span className="text-gray-900 font-bold">
              {entry.name.includes("Package")
                ? `₹${entry.value.toFixed(2)}L`
                : entry.value}
            </span>
          </div>
        ))}
      </div>

      {/* Companies section */}
      {monthData && monthData.companies && monthData.companies.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Companies Visited:
          </p>
          {monthData.companies.map((company, idx) => (
            <div
              key={idx}
              className="bg-blue-50 p-2 rounded border border-blue-200 text-xs"
            >
              <div className="font-semibold text-gray-900">
                {company.companyName}
              </div>
              <div className="text-gray-700 text-xs mt-1 space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sector:</span>
                  <span className="font-medium">{company.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Placed:</span>
                  <span className="font-medium text-emerald-600">
                    {company.studentsPlaced} students
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Package:</span>
                  <span className="font-medium text-orange-600">
                    ₹{company.avgPackage.toFixed(2)}L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Highest:</span>
                  <span className="font-medium text-blue-600">
                    ₹{company.highestPackage.toFixed(2)}L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Visit Date:</span>
                  <span className="font-medium">
                    {new Date(company.visitDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== FILTER SECTION ====================
const FilterSection = ({ selectedDepartment, setSelectedDepartment }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Department
        </label>
        <select
          className="min-w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 shadow-sm"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="E.Com">E.Com</option>
          <option value="ME">ME</option>
        </select>
      </div>
    </div>
  </div>
);

// ==================== TOP COMPANIES TABLE ====================
const TopCompaniesTable = ({ companies }) => {
  if (!companies || companies.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Top Recruiting Companies
        </h3>
        <p className="text-gray-500 text-center py-8">
          No company data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900">
          Top Recruiting Companies
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Sector
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Eligible
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total Registered
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Students Placed
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Avg Package
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Highest Package
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Success Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company, index) => (
              <tr
                key={`${company.companyName}-${index}`}
                className={`${index < 3 ? "bg-blue-50" : ""} hover:bg-gray-50 transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-white">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {company.companyName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
                    {company.sector || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {company.totalEligible || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {company.totalRegistered || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  {company.totalPlaced || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                  ₹{parseFloat(company.avgPackage || 0).toFixed(2)} LPA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                  ₹{parseFloat(company.highestPackage || 0).toFixed(2)} LPA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {parseFloat(company.successRate || 0).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
];

export default function AnalyticsDashboard({ batchYear }) {
  // State management
  const [overview, setOverview] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Fetch all analytics data
  useEffect(() => {
    const fetchAllData = async () => {
      if (!batchYear) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [
          overviewRes,
          deptsRes,
          companiesRes,
          packagesRes,
          monthlyStatsRes,
          monthlyTrendsRes,
        ] = await Promise.all([
          axios.get(
            `${backendUrl}/student-analytics/batch/${batchYear}/overview/filter/${selectedDepartment}`
          ),
          axios.get(
            `${backendUrl}/student-analytics/batch/${batchYear}/departments/filter/${selectedDepartment}`
          ),
          axios.get(
            `${backendUrl}/student-analytics/batch/${batchYear}/top-companies/filter/${selectedDepartment}`
          ),
          axios.get(
            `${backendUrl}/student-analytics/batch/${batchYear}/packages/filter/${selectedDepartment}`
          ),
          axios.get(
            `${backendUrl}/student-analytics/monthly-placement-stats/batch/${batchYear}/filter/${selectedDepartment}`
          ),
          axios.get(
            `${backendUrl}/student-analytics/batch/${batchYear}/company-timeline/filter/${selectedDepartment}`
          ),
        ]);

        setOverview(overviewRes.data.data || overviewRes.data);
        setDepartments(deptsRes.data.data || deptsRes.data || []);
        setCompanies(companiesRes.data.data || companiesRes.data || []);
        setPackagesData(packagesRes.data.data || packagesRes.data || []);
        setMonthlyStats(
          monthlyStatsRes.data.data || monthlyStatsRes.data || []
        );

        // Extract timeline from the company-timeline response
        const timelineData = monthlyTrendsRes.data.timeline || [];
        setMonthlyTrends(timelineData);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [batchYear, selectedDepartment]);

  // Transform monthlyTrends data for the chart
  const placementTrendsData = useMemo(() => {
    if (!monthlyTrends.length) return [];

    return monthlyTrends.map((trend) => ({
      month: trend.monthLabel,
      monthKey: trend.monthKey,
      cumulativePlacements: parseInt(trend.cumulativePlacements) || 0,
      totalPlacements: parseInt(trend.totalPlacements) || 0,
      avgPackage: parseFloat(trend.avgPackage) || 0,
      highestPackage: parseFloat(trend.highestPackage) || 0,
      totalCompanies: parseInt(trend.totalCompanies) || 0,
    }));
  }, [monthlyTrends]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4 text-lg">
            Loading analytics data...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 rounded-xl border border-red-200 p-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-red-900">
                Error Loading Data
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!overview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
            <p className="text-yellow-800">
              No data available for batch year {batchYear}
              {selectedDepartment && ` - ${selectedDepartment}`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Filter Section */}
          <FilterSection
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
          />

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={TrendingUp}
              label="Placement Rate"
              value={`${(overview.placementRate || 0).toFixed(1)}%`}
              subtext={`${overview.placedStudents}/${overview.totalStudents} students`}
              color="emerald"
              trend={(overview.placementRate || 0) - 70}
            />
            <StatCard
              icon={Building}
              label="Companies Visited"
              value={overview.companiesVisited || 0}
              subtext={`Total companies`}
              color="purple"
            />
            <StatCard
              icon={Target}
              label="Total Offers"
              value={overview.totalOffers || 0}
              subtext="Generated"
              color="orange"
              trend={(
                ((overview.totalOffers || 0) / (overview.totalStudents || 1)) *
                  100 -
                100
              ).toFixed(1)}
            />
            <StatCard
              icon={Award}
              subtext={`Highest Package: ₹ ${(overview.highestPackage || 0).toFixed(2)}L`}
              subtext2={`Average Package: ₹ ${(overview.averagePackage || 0).toFixed(2)}L`}
              subtext3={`Median Package: ₹ ${(overview.medianPackage || 0).toFixed(2)}L`}
              color="yellow"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expected vs Actual Companies */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Monthly Company Visits & Offers
              </h3>
              {monthlyStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="expected"
                      fill="#dbeafe"
                      name="Expected"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="actual"
                      fill="#2563eb"
                      name="Actual"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No monthly data available
                </p>
              )}
            </div>

            {/* Cumulative Placement Trends */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Cumulative Placement Trends
                <span className="text-xs text-gray-500 block mt-1">
                  Hover over data points to see companies
                </span>
              </h3>
              {placementTrendsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={placementTrendsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis yAxisId="left" stroke="#6b7280" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#6b7280"
                    />
                    <Tooltip
                      content={
                        <CustomPlacementTooltip monthlyTrends={monthlyTrends} />
                      }
                      cursor={{ strokeDasharray: "3 3" }}
                      // This ensures tooltip appears above everything
                      wrapperStyle={{ zIndex: 1000 }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "10px",
                        marginBottom: "-10px",
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="cumulativePlacements"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Cumulative Placements"
                      dot={{ fill: "#10b981", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="totalPlacements"
                      stroke="#2563eb"
                      strokeWidth={2}
                      name="Monthly Placements"
                      dot={{ fill: "#2563eb", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgPackage"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Avg Package (L)"
                      dot={{ fill: "#f59e0b", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No placement data available
                </p>
              )}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Department-wise Placement */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Department-wise Analysis
              </h3>
              {departments.length > 0 ? (
                <div className="space-y-3">
                  {departments.map((dept, index) => (
                    <div
                      key={dept.department}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <span className="text-sm font-semibold text-gray-900">
                          {dept.department}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {(dept.placementRate || 0).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {dept.placedStudents || 0}/{dept.totalStudents || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No department data available
                </p>
              )}
            </div>

            {/* Package Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Package Distribution
              </h3>
              {packagesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={packagesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="range" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#6366f1"
                      name="Students"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No package data available
                </p>
              )}
            </div>
          </div>

          {/* Top Companies Table */}
          <TopCompaniesTable companies={companies} />
        </div>
      </div>
    </div>
  );
}
