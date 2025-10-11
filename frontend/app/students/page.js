"use client";

import { useState } from "react";
import {
  Users,
  User,
  UserCheck,
  UserX,
  Search,
  Download,
  Plus,
  Award,
  ArrowUpDown,
  ArrowLeft,
} from "lucide-react";
import EditStudentModel from "./EditStudentModel";
import ExportModal from "./ExportModal";
import {
  StudentProvider,
  useStudentContext,
} from "../../context/StudentContext";
import StudentTable from "./StudentTable";
import ImportModal from "./ImportModal";
import ImportResultsModal from "./ImportResultsModal";
import UpdateModal from "./UpdateModal";
import UpdateResultsModal from "./UpdateResultsModal";
import { useBatchContext } from "../../context/BatchContext";

const BRANCHES = [
  { value: "CSE", label: "CSE" },
  { value: "ECE", label: "ECE" },
  { value: "ME", label: "ME" },
];

const CATEGORIES = [
  { key: "all", label: "All Students", icon: Users },
  { key: "placed", label: "Placed", icon: UserCheck },
  { key: "unplaced", label: "Unplaced", icon: UserX },
  { key: "multiple-offers", label: "Multiple Offers", icon: Award },
  { key: "higher_studies", label: "Higher Studies", icon: User },
  { key: "entrepreneurship", label: "Entrepreneurship", icon: User },
  { key: "debarred", label: "Debarred", icon: UserX },
  { key: "family_business", label: "Family Business", icon: User },
  { key: "others", label: "Others", icon: User },
];

function StudentManagementContent() {
  const {
    students,
    setStudents,
    showEditStudentModal,
    showExportModal,
    setShowExportModal,
    formatStudentName,
    showImportModal,
    setShowImportModal,
    showUpdateModal,
    setShowUpdateModal,
    showImportResultsModal,
    setShowImportResultsModal,
    showUpdateResultsModal,
    setShowUpdateResultsModal,
    importResults,
    setImportResults,
    updateResults,
    setUpdateResults,
  } = useStudentContext();

  const { selectedBatch } = useBatchContext();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const getFilteredStudents = () => {
    let filtered = [...students];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((student) => {
        if (selectedCategory === "multiple-offers") {
          return student.offers_received && student.offers_received.length > 1;
        }
        return student.placement_status === selectedCategory;
      });
    }

    if (selectedBranch !== "all") {
      filtered = filtered.filter(
        (student) => student.branch === selectedBranch
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          formatStudentName(student)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.registration_number
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.college_email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Sorting logic
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = formatStudentName(a);
          bValue = formatStudentName(b);
          break;
        case "rollNo":
          aValue = a.registration_number || "";
          bValue = b.registration_number || "";
          break;
        case "cgpa":
          aValue = a.cgpa || 0;
          bValue = b.cgpa || 0;
          break;
        case "package":
          aValue = (a.current_offer?.package || 0) / 100000;
          bValue = (b.current_offer?.package || 0) / 100000;
          break;
        default:
          aValue = formatStudentName(a);
          bValue = formatStudentName(b);
      }

      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });

    return filtered;
  };

  const getStatistics = () => {
    const totalStudents = students.length;
    const placedStudents = students.filter(
      (s) => s.placement_status === "placed"
    ).length;
    const unplacedStudents = students.filter(
      (s) => s.placement_status === "unplaced"
    ).length;
    const multipleOffersStudents = students.filter(
      (s) => s.offers_received && s.offers_received.length > 1
    ).length;
    const debarredStudents = students.filter(
      (s) => s.placement_status === "debarred"
    ).length;
    const familyBusinessStudent = students.filter(
      (s) => s.placement_status === "family_business"
    ).length;
    const otherStudent = students.filter(
      (s) => s.placement_status === "others"
    ).length;
    const higher_studiesStudents = students.filter(
      (s) => s.placement_status === "higher_studies"
    ).length;
    const entrepreneurshipStudents = students.filter(
      (s) => s.placement_status === "entrepreneurship"
    ).length;

    const validStudents = students.filter(
      (s) => s.current_offer && s.current_offer.package
    );

    let highestPackage = 0;
    let lowestPackage = 0;
    let avgPackage = 0;
    let medianPackage = 0;

    if (validStudents.length > 0) {
      const packages = validStudents.map(
        (s) => s.current_offer.package / 100000
      );
      packages.sort((a, b) => a - b);

      highestPackage = packages[packages.length - 1];
      lowestPackage = packages[0];
      avgPackage = packages.reduce((acc, p) => acc + p, 0) / packages.length;

      const mid = Math.floor(packages.length / 2);
      if (packages.length % 2 === 0) {
        medianPackage = (packages[mid - 1] + packages[mid]) / 2;
      } else {
        medianPackage = packages[mid];
      }
    }

    const interestedStudents = students.filter((s) =>
      ["placed", "unplaced", "debarred"].includes(s.placement_status)
    ).length;

    return {
      totalStudents,
      interestedStudents,
      placedStudents,
      unplacedStudents,
      multipleOffersStudents,
      debarredStudents,
      otherStudent,
      familyBusinessStudent,
      higher_studiesStudents,
      entrepreneurshipStudents,
      avgPackage: avgPackage.toFixed(1),
      highestPackage,
      medianPackage,
      lowestPackage,
    };
  };

  const stats = getStatistics();
  const filteredStudents = getFilteredStudents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => (window.location.href = "/")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Student Management Dashboard
                </h1>
                <p className="text-gray-600">
                  Manage and categorize students based on placement status and
                  college rules
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Download size={20} />
                Export Data
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus size={20} />
                Import Data
              </button>
              <button
                onClick={() => setShowUpdateModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus size={20} />
                Update Data
              </button>
            </div>
          </div>

          {/* Enhanced Statistics Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <Users className="text-blue-600" size={24} />
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.totalStudents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-300">
              <div className="flex items-center gap-3">
                <User className="text-yellow-600" size={24} />
                <div>
                  <p className="text-yellow-600 text-sm font-medium">
                    Total Interested
                  </p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {stats.interestedStudents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center gap-3">
                <UserCheck className="text-green-600" size={24} />
                <div>
                  <p className="text-green-600 text-sm font-medium">Placed</p>
                  <p className="text-2xl font-bold text-green-900">
                    {stats.placedStudents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border border-red-100">
              <div className="flex items-center gap-3">
                <UserX className="text-red-600" size={24} />
                <div>
                  <p className="text-red-600 text-sm font-medium">Unplaced</p>
                  <p className="text-2xl font-bold text-red-900">
                    {stats.unplacedStudents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100 col-span-2">
              <div className="flex items-center gap-3">
                <Award className="text-purple-600" size={24} />
                <div>
                  <p className="text-purple-600 text-sm font-medium">
                    Package Statistics
                  </p>
                  <p className="text-xl font-bold text-purple-900">
                    Avg: {stats.avgPackage} LPA
                  </p>
                  <div className="flex gap-4 mt-1 text-sm text-purple-800">
                    <span>High: {stats.highestPackage} LPA</span>
                    <span>•</span>
                    <span>Med: {stats.medianPackage} LPA</span>
                    <span>•</span>
                    <span>Low: {stats.lowestPackage} LPA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Updated Filters Section - Match CompanyListing style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Batch {selectedBatch}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {students.length} students registered
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Category Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.key} value={category.key}>
                      {category.label} (
                      {category.key === "all"
                        ? stats.totalStudents
                        : category.key === "multiple-offers"
                          ? stats.multipleOffersStudents
                          : category.key === "higher_studies"
                            ? stats.higher_studiesStudents
                            : category.key === "entrepreneurship"
                              ? stats.entrepreneurshipStudents
                              : category.key === "debarred"
                                ? stats.debarredStudents
                                : category.key === "family_business"
                                  ? stats.familyBusinessStudent
                                  : category.key === "others"
                                    ? stats.otherStudent
                                    : stats[`${category.key}Students`]}
                      )
                    </option>
                  ))}
                </select>
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Branch Filter */}
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Branches</option>
                {BRANCHES.map((branch) => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="rollNo">Sort by Roll No</option>
                <option value="cgpa">Sort by CGPA</option>
                <option value="package">Sort by Package</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="text-sm">
                  {sortOrder === "asc" ? "ASC" : "DESC"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && <ExportModal filteredStudents={filteredStudents} />}

        {/* Import Modal */}
        {showImportModal && (
          <ImportModal
            onClose={() => setShowImportModal(false)}
            onImportComplete={(results) => {
              setImportResults(results);
              setShowImportModal(false);
              setShowImportResultsModal(true);
            }}
          />
        )}
        {showUpdateModal && (
          <UpdateModal
            onClose={() => setShowUpdateModal(false)}
            onUpdateComplete={(results) => {
              setUpdateResults(results);
              setShowUpdateModal(false);
              setShowUpdateResultsModal(true);
            }}
          />
        )}

        {showImportResultsModal && importResults && (
          <ImportResultsModal
            results={importResults}
            onClose={() => setShowImportResultsModal(false)}
          />
        )}

        {showUpdateResultsModal && updateResults && (
          <UpdateResultsModal
            results={updateResults}
            onClose={() => setShowUpdateResultsModal(false)}
          />
        )}

        {/* Edit Student Modal */}
        {showEditStudentModal && <EditStudentModel />}

        {/* Students Table */}
        <StudentTable filteredStudents={filteredStudents} />

        {/* Summary */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>
    </div>
  );
}

export default function StudentManagement() {
  return (
    <StudentProvider>
      <StudentManagementContent />
    </StudentProvider>
  );
}
