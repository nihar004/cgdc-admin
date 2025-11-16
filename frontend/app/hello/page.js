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
  Briefcase,
  Award,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ArrowLeft,
  Building,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ==================== UTILITY FUNCTIONS ====================
const getStatusBadge = (status) => {
  const statusConfig = {
    cleared: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Cleared",
    },
    rejected: { bg: "bg-rose-100", text: "text-rose-700", label: "Rejected" },
    scheduled: { bg: "bg-sky-100", text: "text-sky-700", label: "Scheduled" },
    pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
    offer_received: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Offer Received",
    },
    offer_accepted: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      label: "Offer Accepted",
    },
  };

  const config = statusConfig[status] || {
    bg: "bg-slate-100",
    text: "text-slate-700",
    label: status,
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
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

const getCompanyTypeColor = (category) => {
  switch (category) {
    case "Product":
      return "bg-purple-100 text-purple-800";
    case "Service":
      return "bg-sky-100 text-sky-800";
    case "Mass Recruiter":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
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

// ==================== STAT CARD COMPONENT ====================
const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  color = "blue",
  trend,
}) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 ${colorMap[color]} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${trend > 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            <TrendingUp
              className={`w-4 h-4 ${trend < 0 ? "rotate-180" : ""}`}
            />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
        {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
      </div>
    </div>
  );
};

// ==================== FILTER SECTION COMPONENT ====================
const FilterSection = ({
  selectedYear,
  setSelectedYear,
  selectedDepartment,
  setSelectedDepartment,
  timeRange,
  setTimeRange,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="sm:w-48">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Department
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time Range
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
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
);

// ==================== COMPANY CARD COMPONENT ====================
const CompanyCard = ({
  company,
  selectedCompanyDetail,
  setSelectedCompanyDetail,
}) => {
  const isExpanded = selectedCompanyDetail === company.id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {company.company}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{company.sector}</p>
            <p className="text-xs text-gray-500 mt-2">
              Visit Date: {company.visitDate}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
            {company.totalRounds} Rounds
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="mb-4 space-y-2">
        {company.positions.map((pos, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div>
              <div className="font-semibold text-gray-900">{pos.title}</div>
              <div className="text-sm text-gray-600 capitalize">
                {pos.jobType.replace(/_/g, " ")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-emerald-600">
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
        onClick={() => setSelectedCompanyDetail(isExpanded ? null : company.id)}
        className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
      >
        {isExpanded ? "Hide Event Details" : "View Event Details"}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {company.events.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {getEventTypeLabel(event.type)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {event.date}
                  {event.venue && ` • ${event.venue}`}
                </div>
                {event.avgScore && (
                  <div className="text-sm text-blue-600 font-medium mt-1">
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
                  <div className="text-sm text-emerald-600 font-semibold">
                    Cleared: {event.cleared}
                  </div>
                )}
                {event.shortlisted !== undefined && (
                  <div className="text-sm text-emerald-600 font-semibold">
                    Shortlisted: {event.shortlisted}
                  </div>
                )}
                {event.attendees !== undefined && (
                  <div className="text-sm text-blue-600 font-semibold">
                    Attendees: {event.attendees}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== TOP COMPANIES TABLE ====================
const TopCompaniesTable = ({ companies }) => (
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
              Category
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Offers
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Students Hired
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Avg Package
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Success Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company, index) => (
            <tr
              key={company.name}
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
                    {company.name}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getCompanyTypeColor(company.category)}`}
                >
                  {company.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                {company.offers}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {company.students}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                ₹{company.avgPackage} LPA
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {((company.students / company.offers) * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ==================== STUDENT APPLICATION CARD ====================
const StudentApplicationCard = ({
  app,
  idx,
  expandedStudentCompany,
  setExpandedStudentCompany,
}) => {
  const isExpanded = expandedStudentCompany === idx;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{app.company}</h3>
          <p className="text-sm text-gray-600 mt-1">{app.position}</p>
          <p className="text-xs text-gray-500 mt-2">
            Applied: {app.appliedDate}
          </p>
        </div>
        <div className="text-right">
          {getStatusBadge(app.status)}
          {app.package && (
            <p className="text-lg font-bold text-emerald-600 mt-2">
              ₹{app.package} LPA
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">
            Progress: {app.events.length} rounds
          </span>
          <span className="text-gray-600 font-medium">
            {getEventTypeLabel(app.finalRound)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              app.status === "rejected"
                ? "bg-red-500"
                : app.status === "offer_accepted"
                  ? "bg-purple-500"
                  : app.status === "offer_received"
                    ? "bg-emerald-500"
                    : "bg-blue-500"
            }`}
            style={{ width: `${(app.events.length / 6) * 100}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => setExpandedStudentCompany(isExpanded ? null : idx)}
        className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
      >
        {isExpanded ? "Hide Round Details" : "View Round Details"}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {app.events.map((event, eventIdx) => (
            <div
              key={eventIdx}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {event.status === "cleared" && (
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              )}
              {event.status === "rejected" && (
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              {event.status === "scheduled" && (
                <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
              )}

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    {getEventTypeLabel(event.type)}
                  </span>
                  <span className="text-sm text-gray-600">{event.date}</span>
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
  );
};

// ==================== MAIN DASHBOARD ====================
export default function PlacementAnalyticsDashboard() {
  const router = useRouter();
  const [view, setView] = useState("batch");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [batchTab, setBatchTab] = useState("overview");
  const [studentTab, setStudentTab] = useState("overview");
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState(null);
  const [expandedStudentCompany, setExpandedStudentCompany] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [timeRange, setTimeRange] = useState("6months");

  // Data (keeping original data structure)
  const batchData = {
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
  };

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

  const companyData = [
    { month: "Jul", expected: 12, actual: 10, offers: 45 },
    { month: "Aug", expected: 15, actual: 12, offers: 52 },
    { month: "Sep", expected: 18, actual: 15, offers: 68 },
    { month: "Oct", expected: 20, actual: 16, offers: 72 },
    { month: "Nov", expected: 10, actual: 8, offers: 38 },
    { month: "Dec", expected: 10, actual: 7, offers: 30 },
  ];

  const placementTrends = [
    { month: "Jul", placed: 25, offers: 28, avgPackage: 5.2 },
    { month: "Aug", placed: 45, offers: 52, avgPackage: 6.1 },
    { month: "Sep", placed: 68, offers: 75, avgPackage: 6.8 },
    { month: "Oct", placed: 95, offers: 108, avgPackage: 7.2 },
    { month: "Nov", placed: 65, offers: 72, avgPackage: 6.5 },
    { month: "Dec", placed: 22, offers: 25, avgPackage: 8.1 },
  ];

  const departmentData = [
    { department: "CSE", total: 120, placed: 98, rate: 81.7, avgPackage: 8.2 },
    { department: "ECE", total: 100, placed: 75, rate: 75.0, avgPackage: 6.8 },
    { department: "ME", total: 80, placed: 55, rate: 68.8, avgPackage: 5.9 },
  ];

  const packageData = [
    { range: "0-3 LPA", count: 45, percentage: 14.1 },
    { range: "3-5 LPA", count: 85, percentage: 26.6 },
    { range: "5-8 LPA", count: 120, percentage: 37.5 },
    { range: "8-12 LPA", count: 55, percentage: 17.2 },
    { range: "12+ LPA", count: 15, percentage: 4.7 },
  ];

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

  const exportBatchData = () => {
    const data = {
      batchYear: 2025,
      overview: batchData,
      companies: companyWiseData,
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
      student: { ...student, exportedAt: new Date().toISOString() },
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

  if (view === "batch") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => router.push("/")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-6 w-6 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Placement Analytics
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Batch 2025 • {batchData.totalStudents} Students
                  </p>
                </div>
              </div>
              <button
                onClick={exportBatchData}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-1">
            {["overview", "companies", "students"].map((tab) => (
              <button
                key={tab}
                onClick={() => setBatchTab(tab)}
                className={`flex-1 px-4 py-2.5 text-sm font-semibold capitalize rounded-lg transition-all ${
                  batchTab === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {batchTab === "overview" && (
            <div className="space-y-6">
              <FilterSection
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
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
                  trend={5.2}
                />
                <StatCard
                  icon={Building}
                  label="Companies Visited"
                  value={overallStats.actualCompanies}
                  subtext={`Expected: ${overallStats.expectedCompanies}`}
                  color="purple"
                  trend={-2.3}
                />
                <StatCard
                  icon={Target}
                  label="Total Offers"
                  value={overallStats.offersGenerated}
                  subtext="Generated"
                  color="orange"
                  trend={8.7}
                />
                <StatCard
                  icon={Award}
                  label="Highest Package"
                  value={`₹${batchData.highestPackage}L`}
                  subtext={`Median: ₹${batchData.medianPackage}L`}
                  color="yellow"
                  trend={12.5}
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
                    <LineChart data={placementTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis yAxisId="left" stroke="#6b7280" />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#6b7280"
                      />
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
                    </LineChart>
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
              <TopCompaniesTable companies={topCompanies} />
            </div>
          )}

          {/* Companies Tab */}
          {batchTab === "companies" && (
            <div className="space-y-4">
              {companyWiseData.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  selectedCompanyDetail={selectedCompanyDetail}
                  setSelectedCompanyDetail={setSelectedCompanyDetail}
                />
              ))}
            </div>
          )}

          {/* Students Tab */}
          {batchTab === "students" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">
                  Student List
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {Object.values(studentData).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedStudent(student.id);
                      setView("student");
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {student.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {student.fullName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {student.enrollmentNumber} • {student.specialization}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg mb-1">
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
          )}
        </div>
      </div>
    );
  }

  // Student View
  const student = studentData[selectedStudent || "STU001"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => setView("batch")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Student Analytics
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  <span className="font-semibold">{student.fullName}</span>
                  <span>•</span>
                  <span>{student.enrollmentNumber}</span>
                  <span>•</span>
                  <span>{student.specialization}</span>
                  <span>•</span>
                  <span className="font-semibold">CGPA: {student.cgpa}</span>
                </div>
              </div>
            </div>
            <button
              onClick={exportStudentData}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-1">
          {["overview", "applications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStudentTab(tab)}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold capitalize rounded-lg transition-all ${
                studentTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
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
                color="emerald"
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
              <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Current Placement
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Company</div>
                    <div className="text-lg font-bold text-gray-900">
                      {student.currentOffer.company}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Position</div>
                    <div className="text-lg font-bold text-gray-900">
                      {student.currentOffer.position}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Package</div>
                    <div className="text-2xl font-bold text-emerald-600">
                      ₹{student.currentOffer.package} LPA
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Application Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Application Status Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Application Status Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="text-gray-700 font-medium">
                      Offers Received
                    </span>
                    <span className="font-bold text-xl text-emerald-600">
                      {student.offersReceived}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <span className="text-gray-700 font-medium">
                      In Progress
                    </span>
                    <span className="font-bold text-xl text-yellow-600">
                      {student.activeApplications}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-gray-700 font-medium">Rejected</span>
                    <span className="font-bold text-xl text-red-600">
                      {student.totalApplications -
                        student.offersReceived -
                        student.activeApplications}
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic Performance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Academic Performance
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-gray-700 font-medium">
                      Current CGPA
                    </span>
                    <span className="font-bold text-xl text-blue-600">
                      {student.cgpa}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-gray-700 font-medium">
                      Class 12th
                    </span>
                    <span className="font-bold text-xl text-purple-600">
                      {student.class12Percentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-violet-50 rounded-lg border border-violet-200">
                    <span className="text-gray-700 font-medium">
                      Class 10th
                    </span>
                    <span className="font-bold text-xl text-violet-600">
                      {student.class10Percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Interview Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {student.interviewsAttended}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Total Rounds Attended
                  </div>
                </div>
                <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">
                    {(
                      (student.offersReceived / student.totalApplications) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Conversion Rate
                  </div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {student.averageRoundsReached.toFixed(1)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
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
              <StudentApplicationCard
                key={idx}
                app={app}
                idx={idx}
                expandedStudentCompany={expandedStudentCompany}
                setExpandedStudentCompany={setExpandedStudentCompany}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
