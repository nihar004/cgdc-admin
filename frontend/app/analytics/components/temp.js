import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Building, Target, Award } from "lucide-react";
import StatCard from "./StatCard";
import FilterSection from "./FilterSection";
import TopCompaniesTable from "./TopCompaniesTable";
import {
  getBatchStatistics,
  getCompaniesList,
} from "../services/analyticsService";

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
];

export default function BatchOverview({
  batchYear,
  selectedDepartment,
  setSelectedDepartment,
  timeRange,
  setTimeRange,
}) {
  const [data, setData] = useState({
    batchData: {},
    overallStats: {},
    companyData: [],
    departmentData: [],
    packageData: [],
    topCompanies: [],
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch batch statistics
        const statsResult = await getBatchStatistics(batchYear, {
          timeRange,
          department: selectedDepartment,
        });

        if (statsResult.success) {
          setData(statsResult.data);
          setError(null);
        } else {
          throw new Error("Failed to fetch batch statistics");
        }

        // Fetch companies list
        const companiesResult = await getCompaniesList(batchYear);
        if (companiesResult.success) {
          setCompanies(companiesResult.data || []);
        } else {
          console.warn("Failed to fetch companies list");
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [batchYear, timeRange, selectedDepartment]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <h3 className="text-lg font-bold text-red-900 mb-2">
          Error Loading Data
        </h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const {
    batchData,
    overallStats,
    companyData,
    departmentData,
    packageData,
    topCompanies,
  } = data;
  return (
    <div className="space-y-6">
      <FilterSection
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Placement Rate"
          value={`${overallStats.placementRate}%`}
          subtext={`${overallStats.placedStudents}/${overallStats.totalStudents} students`}
          color="emerald"
        />
        <StatCard
          icon={Building}
          label="Companies Visited"
          value={overallStats.actualCompanies}
          subtext={`Expected: ${overallStats.expectedCompanies}`}
          color="purple"
        />
        <StatCard
          icon={Target}
          label="Total Offers"
          value={overallStats.offersGenerated}
          subtext="Generated"
          color="orange"
        />
        <StatCard
          icon={Award}
          label="Highest Package"
          value={`₹${batchData.highestPackage}L`}
          subtext={`Median: ₹${batchData.medianPackage}L`}
          color="yellow"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expected vs Actual Companies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Expected vs Actual Companies
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={companyData}>
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
        </div>

        {/* Placement Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Placement Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            {/* <LineChart data={placementTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="placed"
                stroke="#10b981"
                strokeWidth={3}
                name="Students Placed"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="offers"
                stroke="#2563eb"
                strokeWidth={2}
                name="Offers Generated"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgPackage"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Avg Package (LPA)"
              />
            </LineChart> */}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department-wise Placement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Department-wise Analysis
          </h3>
          <div className="space-y-3">
            {departmentData.map((dept, index) => (
              <div
                key={dept.department}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-sm font-semibold text-gray-900">
                    {dept.department}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {dept.rate}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {dept.placed}/{dept.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Package Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={packageData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ range, percentage }) => `${range}: ${percentage}%`}
              >
                {packageData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Companies Table */}
      <TopCompaniesTable companies={companies} />
    </div>
  );
}
