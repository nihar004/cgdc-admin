"use client";

import { useState, useEffect, useContext } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Download,
  Plus,
  Award,
  ArrowUpDown,
} from "lucide-react";
import axios from "axios";
import EditStudentModel from "./EditStudentModel";
import ExportModal from "./ExportModal";
import {
  StudentProvider,
  useStudentContext,
} from "../../context/StudentContext.";
import StudentTable from "./StudentTable.";
import ImportModal from "./ImportModal";
import ImportResultsModal from "./ImportResultsModal";
import UpdateModal from "./UpdateModal";
import UpdateResultsModal from "./UpdateResultsModal";
import { BatchProvider, useBatchContext } from "../../context/BatchContext";

const BRANCHES = [
  { value: "CSE", label: "CSE" },
  { value: "ECE", label: "ECE" },
  { value: "ME", label: "ME" },
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

  const fetchStudents = async () => {
    try {
      if (!selectedBatch) {
        console.warn("No batch selected!");
        return;
      }
      const response = await axios.get("http://localhost:5000/students", {
        params: { batch: selectedBatch }, // send batch as query param
      });
      setStudents(response.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Update the useEffect to use the fetchStudents function
  useEffect(() => {
    fetchStudents();
  }, []);

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

    // Declare defaults
    let highestPackage = 0;
    let lowestPackage = 0;
    let avgPackage = 0;
    let medianPackage = 0;

    if (validStudents.length > 0) {
      const packages = validStudents.map(
        (s) => s.current_offer.package / 100000
      );
      packages.sort((a, b) => a - b); // sort ascending

      // Highest (last element)
      highestPackage = packages[packages.length - 1];

      // Lowest (first element)
      lowestPackage = packages[0];

      // Average
      avgPackage = packages.reduce((acc, p) => acc + p, 0) / packages.length;

      // Median
      const mid = Math.floor(packages.length / 2);
      if (packages.length % 2 === 0) {
        medianPackage = (packages[mid - 1] + packages[mid]) / 2;
      } else {
        medianPackage = packages[mid];
      }
    }

    return {
      totalStudents,
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Student Management
              </h1>
            </div>
            <p className="text-gray-600 mt-1">
              Manage and categorize students based on placement status and
              college rules
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Import Data</span>
            </button>
            <button
              onClick={() => setShowUpdateModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Update Data</span>
            </button>
          </div>
        </div>
        {/* Export Modal */}
        {showExportModal && <ExportModal filteredStudents={filteredStudents} />}

        {/* // NEW TODO  */}
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
              // Refresh students data
              fetchStudents();
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalStudents}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Interested
                </p>
                <p className="text-sm font-medium text-gray-600">
                  (for Placement)
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalStudents - 2}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Placed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.placedStudents}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unplaced</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.unplacedStudents}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg CTC</p>
                <p className="text-xl font-bold text-purple-600">
                  {stats.avgPackage} LPA
                </p>
                <p className="text-xs text-gray-500">
                  Highest: {stats.highestPackage} LPA
                </p>
                <p className="text-xs text-gray-500">
                  Medium: {stats.medianPackage} LPA
                </p>
                <p className="text-xs text-gray-500">
                  Lowest: {stats.lowestPackage} LPA
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Category:
              </span>
              <div className="flex space-x-1">
                {[
                  {
                    key: "all",
                    label: "All Students",
                    count: stats.totalStudents,
                  },
                  {
                    key: "placed",
                    label: "Placed",
                    count: stats.placedStudents,
                  },
                  {
                    key: "unplaced",
                    label: "Unplaced",
                    count: stats.unplacedStudents,
                  },
                  {
                    key: "multiple-offers",
                    label: "Multiple Offers",
                    count: stats.multipleOffersStudents,
                  },
                  {
                    key: "higher_studies",
                    label: "Higher Studies",
                    count: stats.higher_studiesStudents,
                  },
                  {
                    key: "entrepreneurship",
                    label: "Entrepreneurship",
                    count: stats.entrepreneurshipStudents,
                  },
                  {
                    key: "debarred",
                    label: "Debarred",
                    count: stats.debarredStudents,
                  },
                  {
                    key: "family_business",
                    label: "Family Business",
                    count: stats.familyBusinessStudent,
                  },
                  {
                    key: "others",
                    label: "Others",
                    count: stats.otherStudent,
                  },
                ].map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.key
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, roll number, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Branches Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option key="sort-name" value="name">
                Sort by Name
              </option>
              <option key="sort-rollNo" value="rollNo">
                Sort by Roll No
              </option>
              <option key="sort-cgpa" value="cgpa">
                Sort by CGPA
              </option>
              <option key="sort-package" value="package">
                Sort by Package
              </option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-1"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="text-sm">
                {sortOrder === "asc" ? "ASC" : "DESC"}
              </span>
            </button>
          </div>
        </div>
        {/* Students Table */}
        <StudentTable filteredStudents={filteredStudents} />
        {/* Summary */}
        <div className="text-center text-sm text-gray-500">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>
    </div>
  );
}

// Wrap the component with StudentProvider
export default function StudentManagement() {
  return (
    <BatchProvider>
      <StudentProvider>
        <StudentManagementContent />
      </StudentProvider>
    </BatchProvider>
  );
}
