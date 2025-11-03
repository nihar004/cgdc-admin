"use client";

import { useState } from "react";
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
import {
  TrendingUp,
  Building,
  DollarSign,
  Download,
  RefreshCw,
  Target,
} from "lucide-react";

const AnalyticsDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [timeRange, setTimeRange] = useState("6months");

  // Sample data for analytics
  const overallStats = {
    totalStudents: 450,
    placedStudents: 320,
    unplacedStudents: 130,
    placementRate: 71.1,
    avgPackage: 6.8,
    highestPackage: 25.0,
    expectedCompanies: 85,
    actualCompanies: 68,
    companyFulfillmentRate: 80.0,
    offersGenerated: 385,
  };

  // Company data - Expected vs Actual
  const companyData = [
    { month: "Jul", expected: 12, actual: 10, offers: 45 },
    { month: "Aug", expected: 15, actual: 12, offers: 52 },
    { month: "Sep", expected: 18, actual: 15, offers: 68 },
    { month: "Oct", expected: 20, actual: 16, offers: 72 },
    { month: "Nov", expected: 10, actual: 8, offers: 38 },
    { month: "Dec", expected: 10, actual: 7, offers: 30 },
  ];

  // Placement trends over months
  const placementTrends = [
    { month: "Jul", placed: 25, offers: 28, avgPackage: 5.2 },
    { month: "Aug", placed: 45, offers: 52, avgPackage: 6.1 },
    { month: "Sep", placed: 68, offers: 75, avgPackage: 6.8 },
    { month: "Oct", placed: 95, offers: 108, avgPackage: 7.2 },
    { month: "Nov", placed: 65, offers: 72, avgPackage: 6.5 },
    { month: "Dec", placed: 22, offers: 25, avgPackage: 8.1 },
  ];

  // Department-wise placement data
  const departmentData = [
    { department: "CSE", total: 120, placed: 98, rate: 81.7, avgPackage: 8.2 },
    { department: "ECE", total: 100, placed: 75, rate: 75.0, avgPackage: 6.8 },
    { department: "ME", total: 80, placed: 55, rate: 68.8, avgPackage: 5.9 },
  ];

  // Package distribution
  const packageData = [
    { range: "0-3 LPA", count: 45, percentage: 14.1 },
    { range: "3-5 LPA", count: 85, percentage: 26.6 },
    { range: "5-8 LPA", count: 120, percentage: 37.5 },
    { range: "8-12 LPA", count: 55, percentage: 17.2 },
    { range: "12+ LPA", count: 15, percentage: 4.7 },
  ];

  // Top companies by offers
  const topCompanies = [
    {
      name: "TCS",
      offers: 45,
      students: 42,
      avgPackage: 4.2,
      category: "Mass Recruiter",
    },
    {
      name: "Infosys",
      offers: 38,
      students: 35,
      avgPackage: 4.8,
      category: "Mass Recruiter",
    },
    {
      name: "Wipro",
      offers: 32,
      students: 28,
      avgPackage: 5.2,
      category: "Mass Recruiter",
    },
    {
      name: "Accenture",
      offers: 25,
      students: 23,
      avgPackage: 6.5,
      category: "Service",
    },
    {
      name: "Amazon",
      offers: 8,
      students: 8,
      avgPackage: 18.5,
      category: "Product",
    },
    {
      name: "Microsoft",
      offers: 5,
      students: 5,
      avgPackage: 25.0,
      category: "Product",
    },
    {
      name: "Google",
      offers: 3,
      students: 3,
      avgPackage: 22.0,
      category: "Product",
    },
  ];

  // Round-wise elimination data
  const eliminationData = [
    { round: "Applied", students: 1200 },
    { round: "Online Test", students: 650 },
    { round: "Technical", students: 420 },
    { round: "HR Round", students: 320 },
    { round: "Final Selected", students: 320 },
  ];

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#F97316",
    "#06B6D4",
  ];

  const getCompanyTypeColor = (category) => {
    switch (category) {
      case "Product":
        return "bg-purple-100 text-purple-800";
      case "Service":
        return "bg-blue-100 text-blue-800";
      case "Mass Recruiter":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Comprehensive placement analysis and insights
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="2024">Academic Year 2024</option>
                <option value="2023">Academic Year 2023</option>
                <option value="2022">Academic Year 2022</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="cse">Computer Science</option>
                <option value="ece">Electronics</option>
                <option value="me">Mechanical</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last 1 Year</option>
                <option value="2years">Last 2 Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Placement Rate
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {overallStats.placementRate}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {overallStats.placedStudents}/{overallStats.totalStudents}{" "}
                  students
                </p>
              </div>
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Package</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{overallStats.avgPackage} LPA
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Highest: ₹{overallStats.highestPackage} LPA
                </p>
              </div>
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Companies Visited
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {overallStats.actualCompanies}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Expected: {overallStats.expectedCompanies} (
                  {overallStats.companyFulfillmentRate}%)
                </p>
              </div>
              <div className="flex-shrink-0">
                <Building className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Offers
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {overallStats.offersGenerated}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Multiple offers:{" "}
                  {overallStats.offersGenerated - overallStats.placedStudents}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expected vs Actual Companies */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Expected vs Actual Companies
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={companyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="expected" fill="#93C5FD" name="Expected" />
                <Bar dataKey="actual" fill="#3B82F6" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Placement Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Placement Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={placementTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="placed"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Students Placed"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="offers"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Offers Generated"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgPackage"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Avg Package (LPA)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Department-wise Placement */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Department-wise Analysis
            </h3>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div
                  key={dept.department}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full`}
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Package Distribution
            </h3>
            <ResponsiveContainer width="85%" height={250}>
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Recruiting Companies
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students Hired
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCompanies.map((company, index) => (
                  <tr
                    key={company.name}
                    className={index < 3 ? "bg-blue-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {company.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCompanyTypeColor(company.category)}`}
                      >
                        {company.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {company.offers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {company.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ₹{company.avgPackage} LPA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((company.students / company.offers) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
