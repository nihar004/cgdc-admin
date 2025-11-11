"use client";
import React, { useState } from "react";
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
  Users,
  Briefcase,
  Award,
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ArrowLeft,
  Building2,
  GraduationCap,
  DollarSign,
  Building,
} from "lucide-react";

// Dummy Data
const batchYears = [2024, 2025, 2026];

const batchOverviewData = {
  2025: {
    totalStudents: 180,
    placedStudents: 125,
    unplacedStudents: 35,
    higherStudies: 15,
    debarred: 5,
    averageCGPA: 7.8,
    medianPackage: 12.5,
    highestPackage: 44.0,
    lowestPackage: 4.5,
    totalCompanies: 45,
    totalDrives: 68,
    placementRate: 69.4,
    dreamCompaniesPlaced: 28,
    averageRoundsPerStudent: 3.2,
  },
};

const companyWiseData = [
  {
    id: 1,
    company: "Google",
    sector: "IT Software (Product)",
    positions: [
      {
        title: "SDE Intern",
        package: 8.5,
        jobType: "internship_plus_ppo",
        totalApplicants: 45,
        shortlisted: 12,
        selected: 2,
        rejected: 43,
        pending: 0,
      },
    ],
    visitDate: "2025-09-15",
    totalRounds: 5,
    events: [
      {
        type: "pre_placement_talk",
        date: "2025-09-10",
        attendees: 120,
        venue: "Auditorium A",
      },
      {
        type: "resume_screening",
        date: "2025-09-15",
        shortlisted: 45,
        rejected: 75,
      },
      {
        type: "online_assessment",
        date: "2025-09-20",
        appeared: 45,
        cleared: 12,
        avgScore: 72,
      },
      {
        type: "technical_round_1",
        date: "2025-09-25",
        appeared: 12,
        cleared: 6,
      },
      {
        type: "technical_round_2",
        date: "2025-09-28",
        appeared: 6,
        cleared: 3,
      },
      { type: "hr_round", date: "2025-10-02", appeared: 3, cleared: 2 },
    ],
  },
  {
    id: 2,
    company: "Microsoft",
    sector: "IT Software (Product)",
    positions: [
      {
        title: "Software Engineer",
        package: 18.5,
        jobType: "full_time",
        totalApplicants: 52,
        shortlisted: 15,
        selected: 4,
        rejected: 48,
        pending: 0,
      },
    ],
    visitDate: "2025-10-01",
    totalRounds: 6,
    events: [
      {
        type: "company_presentation",
        date: "2025-09-28",
        attendees: 135,
        venue: "Main Hall",
      },
      {
        type: "resume_screening",
        date: "2025-10-01",
        shortlisted: 52,
        rejected: 83,
      },
      {
        type: "coding_test",
        date: "2025-10-05",
        appeared: 52,
        cleared: 15,
        avgScore: 78,
      },
      {
        type: "technical_round_1",
        date: "2025-10-10",
        appeared: 15,
        cleared: 8,
      },
      {
        type: "technical_round_2",
        date: "2025-10-13",
        appeared: 8,
        cleared: 6,
      },
      { type: "hr_round", date: "2025-10-18", appeared: 6, cleared: 4 },
    ],
  },
  {
    id: 3,
    company: "Amazon",
    sector: "E-Commerce, Logistics and Business",
    positions: [
      {
        title: "SDE-1",
        package: 15.0,
        jobType: "full_time",
        totalApplicants: 60,
        shortlisted: 18,
        selected: 5,
        rejected: 52,
        pending: 3,
      },
    ],
    visitDate: "2025-10-10",
    totalRounds: 5,
    events: [
      {
        type: "pre_placement_talk",
        date: "2025-10-05",
        attendees: 145,
        venue: "Auditorium B",
      },
      {
        type: "resume_screening",
        date: "2025-10-10",
        shortlisted: 60,
        rejected: 85,
      },
      {
        type: "online_assessment",
        date: "2025-10-12",
        appeared: 60,
        cleared: 18,
        avgScore: 68,
      },
      {
        type: "technical_round_1",
        date: "2025-10-20",
        appeared: 18,
        cleared: 10,
      },
      {
        type: "technical_round_2",
        date: "2025-10-25",
        appeared: 10,
        cleared: 8,
      },
      { type: "final_round", date: "2025-11-02", appeared: 8, cleared: 5 },
    ],
  },
];

const studentData = {
  STU001: {
    id: "STU001",
    enrollmentNumber: "2021AAPS0001G",
    fullName: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    specialization: "Basic CSE",
    cgpa: 8.5,
    batchYear: 2025,
    class10Percentage: 92.0,
    class12Percentage: 88.5,
    backlogs: 0,
    placementStatus: "placed",
    currentOffer: {
      company: "Atlassian",
      position: "Full Stack Developer",
      package: 22.0,
      acceptedDate: "2025-11-05",
    },
    totalApplications: 15,
    activeApplications: 0,
    offersReceived: 3,
    offersAccepted: 1,
    interviewsAttended: 28,
    averageRoundsReached: 3.8,
    applications: [
      {
        company: "Google",
        position: "SDE Intern",
        appliedDate: "2025-09-15",
        status: "rejected",
        finalRound: "technical_round_2",
        events: [
          { type: "resume_screening", status: "cleared", date: "2025-09-16" },
          {
            type: "online_assessment",
            status: "cleared",
            date: "2025-09-20",
            score: 85,
          },
          {
            type: "technical_round_1",
            status: "cleared",
            date: "2025-09-25",
          },
          {
            type: "technical_round_2",
            status: "rejected",
            date: "2025-09-28",
          },
        ],
      },
      {
        company: "Microsoft",
        position: "Software Engineer",
        appliedDate: "2025-10-01",
        status: "offer_received",
        package: 18.5,
        finalRound: "hr_round",
        events: [
          { type: "resume_screening", status: "cleared", date: "2025-10-02" },
          {
            type: "coding_test",
            status: "cleared",
            date: "2025-10-08",
            score: 92,
          },
          {
            type: "technical_round_1",
            status: "cleared",
            date: "2025-10-15",
          },
          {
            type: "technical_round_2",
            status: "cleared",
            date: "2025-10-18",
          },
          { type: "hr_round", status: "cleared", date: "2025-10-22" },
        ],
      },
      {
        company: "Atlassian",
        position: "Full Stack Developer",
        appliedDate: "2025-10-15",
        status: "offer_accepted",
        package: 22.0,
        finalRound: "hr_round",
        events: [
          { type: "resume_screening", status: "cleared", date: "2025-10-16" },
          {
            type: "coding_test",
            status: "cleared",
            date: "2025-10-20",
            score: 95,
          },
          {
            type: "technical_round_1",
            status: "cleared",
            date: "2025-10-25",
          },
          {
            type: "technical_round_2",
            status: "cleared",
            date: "2025-10-28",
          },
          { type: "final_round", status: "cleared", date: "2025-11-02" },
          { type: "hr_round", status: "cleared", date: "2025-11-05" },
        ],
      },
    ],
  },
};

const monthlyPlacementTrend = [
  { month: "Aug", placed: 5, drives: 3 },
  { month: "Sep", placed: 32, drives: 12 },
  { month: "Oct", placed: 48, drives: 18 },
  { month: "Nov", placed: 40, drives: 15 },
];

const specializationWisePlacement = [
  { name: "Basic CSE", placed: 45, unplaced: 8, total: 53 },
  { name: "Data Science & AI", placed: 38, unplaced: 10, total: 48 },
  { name: "Cyber Security", placed: 25, unplaced: 8, total: 33 },
  { name: "Basic E.Com", placed: 12, unplaced: 6, total: 18 },
  { name: "Basic Mechanical", placed: 5, unplaced: 3, total: 8 },
];

const packageDistribution = [
  { range: "0-5 LPA", count: 8 },
  { range: "5-10 LPA", count: 25 },
  { range: "10-15 LPA", count: 42 },
  { range: "15-20 LPA", count: 28 },
  { range: "20-25 LPA", count: 15 },
  { range: "25+ LPA", count: 7 },
];

export default function PlacementAnalyticsDashboard() {
  const [selectedBatchYear, setSelectedBatchYear] = useState(2025);
  const [view, setView] = useState("batch");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [batchTab, setBatchTab] = useState("overview");
  const [studentTab, setStudentTab] = useState("overview");
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState(null);
  const [expandedStudentCompany, setExpandedStudentCompany] = useState(null);
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

  const batchData = batchOverviewData[selectedBatchYear]; // Use the state variable

  const exportBatchData = () => {
    const data = {
      batchYear: 2025,
      overview: batchData,
      companies: companyWiseData,
      specializations: specializationWisePlacement,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch-2025-analytics-${Date.now()}.json`;
    a.click();
  };

  const exportStudentData = () => {
    const student = studentData.STU001;
    const data = {
      student: {
        ...student,
        exportedAt: new Date().toISOString(),
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.enrollmentNumber}-analytics-${Date.now()}.json`;
    a.click();
  };

  const StatCard = ({ icon: Icon, label, value, subtext, color = "blue" }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-8 h-8 text-${color}-500`} />
        <span className={`text-2xl font-bold text-${color}-600`}>{value}</span>
      </div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
    </div>
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      cleared: { bg: "bg-green-100", text: "text-green-700", label: "Cleared" },
      rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
      scheduled: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Scheduled",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Pending",
      },
      offer_received: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Offer Received",
      },
      offer_accepted: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "Offer Accepted",
      },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
      label: status,
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      pre_placement_talk: "Pre-Placement Talk",
      company_presentation: "Company Presentation",
      resume_screening: "Resume Screening",
      online_assessment: "Online Assessment",
      aptitude_test: "Aptitude Test",
      coding_test: "Coding Test",
      technical_mcq: "Technical MCQ",
      technical_round_1: "Technical Round 1",
      technical_round_2: "Technical Round 2",
      technical_round_3: "Technical Round 3",
      group_discussion: "Group Discussion",
      case_study: "Case Study",
      presentation_round: "Presentation Round",
      hr_round: "HR Round",
      final_round: "Final Round",
    };
    return labels[type] || type;
  };

  if (view === "batch") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Batch Placement Analytics
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">Batch Year: 2025</span>
              <span>•</span>
              <span>Total Students: {batchData.totalStudents}</span>
              <span>•</span>
              <span>Placement Rate: {batchData.placementRate}%</span>
            </div>
          </div>
          <button
            onClick={exportBatchData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-6">
            {["overview", "companies", "students"].map((tab) => (
              <button
                key={tab}
                onClick={() => setBatchTab(tab)}
                className={`pb-3 px-2 text-sm font-medium capitalize transition-colors ${
                  batchTab === tab
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {batchTab === "overview" && (
          <div className="space-y-6">
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
                        {overallStats.placedStudents}/
                        {overallStats.totalStudents} students
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
                        {overallStats.offersGenerated -
                          overallStats.placedStudents}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Target className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </div>
                <StatCard
                  icon={Award}
                  label="Highest Package"
                  value={`₹${batchData.highestPackage} L`}
                  subtext={`Median: ₹${batchData.medianPackage} L`}
                  color="yellow"
                />
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
                        label={({ range, percentage }) =>
                          `${range}: ${percentage}%`
                        }
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
                            {(
                              (company.students / company.offers) *
                              100
                            ).toFixed(1)}
                            %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Companies Tab */}
        {batchTab === "companies" && (
          <div className="space-y-4">
            {companyWiseData.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {company.company}
                    </h3>
                    <p className="text-sm text-gray-600">{company.sector}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Visit Date: {company.visitDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">
                      Total Rounds: {company.totalRounds}
                    </div>
                  </div>
                </div>

                {/* Positions */}
                <div className="mb-4 space-y-2">
                  {company.positions.map((pos, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {pos.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {pos.jobType.replace(/_/g, " ")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ₹{pos.package} LPA
                        </div>
                        <div className="text-sm text-gray-600">
                          {pos.selected}/{pos.totalApplicants} selected
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setSelectedCompanyDetail(
                      selectedCompanyDetail === company.id ? null : company.id
                    )
                  }
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {selectedCompanyDetail === company.id
                    ? "Hide Event Details"
                    : "View Event Details"}
                </button>

                {selectedCompanyDetail === company.id && (
                  <div className="mt-4 space-y-3">
                    {company.events.map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {getEventTypeLabel(event.type)}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Date: {event.date}
                            {event.venue && ` • ${event.venue}`}
                          </div>
                          {event.avgScore && (
                            <div className="text-sm text-blue-600 mt-1">
                              Avg Score: {event.avgScore}%
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {event.appeared !== undefined && (
                            <div className="text-sm text-gray-700">
                              Appeared: {event.appeared}
                            </div>
                          )}
                          {event.cleared !== undefined && (
                            <div className="text-sm text-green-600 font-medium">
                              Cleared: {event.cleared}
                            </div>
                          )}
                          {event.shortlisted !== undefined && (
                            <div className="text-sm text-green-600 font-medium">
                              Shortlisted: {event.shortlisted}
                            </div>
                          )}
                          {event.attendees !== undefined && (
                            <div className="text-sm text-blue-600 font-medium">
                              Attendees: {event.attendees}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Students Tab */}
        {batchTab === "students" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Student List
              </h3>
              <div className="space-y-2">
                {Object.values(studentData).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedStudent(student.id);
                      setView("student");
                    }}
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {student.fullName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {student.enrollmentNumber} • {student.specialization}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">
                        CGPA: {student.cgpa}
                      </div>
                      <div className="text-sm text-gray-600">
                        {student.placementStatus === "placed"
                          ? `Placed at ${student.currentOffer.company}`
                          : "Unplaced"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Student View
  const student = studentData[selectedStudent || "STU001"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setView("batch")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Batch Overview
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Student Analytics
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">{student.fullName}</span>
              <span>•</span>
              <span>{student.enrollmentNumber}</span>
              <span>•</span>
              <span>{student.specialization}</span>
              <span>•</span>
              <span>CGPA: {student.cgpa}</span>
            </div>
          </div>
          <button
            onClick={exportStudentData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-6">
          {["overview", "applications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStudentTab(tab)}
              className={`pb-3 px-2 text-sm font-medium capitalize transition-colors ${
                studentTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {studentTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Briefcase}
              label="Total Applications"
              value={student.totalApplications}
              color="blue"
            />
            <StatCard
              icon={Clock}
              label="Active Applications"
              value={student.activeApplications}
              subtext="In various stages"
              color="yellow"
            />
            <StatCard
              icon={Award}
              label="Offers Received"
              value={student.offersReceived}
              subtext={`${student.offersAccepted} accepted`}
              color="green"
            />
            <StatCard
              icon={Target}
              label="Avg. Rounds Reached"
              value={student.averageRoundsReached.toFixed(1)}
              subtext="Per application"
              color="purple"
            />
          </div>

          {/* Current Placement Status */}
          {student.placementStatus === "placed" && student.currentOffer && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Current Placement
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <div className="text-sm text-gray-600">Company</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {student.currentOffer.company}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Position</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {student.currentOffer.position}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Package</div>
                  <div className="text-lg font-bold text-green-600">
                    ₹{student.currentOffer.package} LPA
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Application Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Application Status Breakdown */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Application Status Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <span className="text-gray-700">Offers Received</span>
                  <span className="font-semibold text-green-600">
                    {student.offersReceived}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                  <span className="text-gray-700">In Progress</span>
                  <span className="font-semibold text-yellow-600">
                    {student.activeApplications}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                  <span className="text-gray-700">Rejected</span>
                  <span className="font-semibold text-red-600">
                    {student.totalApplications -
                      student.offersReceived -
                      student.activeApplications}
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Performance */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Academic Performance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <span className="text-gray-700">Current CGPA</span>
                  <span className="font-semibold text-blue-600">
                    {student.cgpa}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                  <span className="text-gray-700">Class 12th</span>
                  <span className="font-semibold text-purple-600">
                    {student.class12Percentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded">
                  <span className="text-gray-700">Class 10th</span>
                  <span className="font-semibold text-indigo-600">
                    {student.class10Percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Performance */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Interview Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {student.interviewsAttended}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Total Rounds Attended
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {(
                    (student.offersReceived / student.totalApplications) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Conversion Rate
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {student.averageRoundsReached.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Avg Rounds Cleared
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {studentTab === "applications" && (
        <div className="space-y-4">
          {student.applications.map((app, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {app.company}
                  </h3>
                  <p className="text-sm text-gray-600">{app.position}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Applied: {app.appliedDate}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(app.status)}
                  {app.package && (
                    <p className="text-lg font-bold text-green-600 mt-2">
                      ₹{app.package} LPA
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    Progress: {app.events.length} rounds
                  </span>
                  <span className="text-gray-600">
                    {getEventTypeLabel(app.finalRound)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      app.status === "rejected"
                        ? "bg-red-500"
                        : app.status === "offer_accepted"
                          ? "bg-purple-500"
                          : app.status === "offer_received"
                            ? "bg-green-500"
                            : "bg-blue-500"
                    }`}
                    style={{ width: `${(app.events.length / 6) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  setExpandedStudentCompany(
                    expandedStudentCompany === idx ? null : idx
                  )
                }
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {expandedStudentCompany === idx
                  ? "Hide Round Details"
                  : "View Round Details"}
              </button>

              {expandedStudentCompany === idx && (
                <div className="mt-4 space-y-3">
                  {app.events.map((event, eventIdx) => (
                    <div
                      key={eventIdx}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      {event.status === "cleared" && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                      {event.status === "rejected" && (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      {event.status === "scheduled" && (
                        <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      )}

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            {getEventTypeLabel(event.type)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {event.date}
                          </span>
                        </div>
                        {event.score && (
                          <span className="text-sm text-gray-600">
                            Score: {event.score}%
                          </span>
                        )}
                      </div>

                      {getStatusBadge(event.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
