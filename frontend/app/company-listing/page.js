"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  Users,
  Clock,
  Building2,
  Award,
  RefreshCw,
  Download,
  CheckCircle,
} from "lucide-react";
import {
  CompaniesProvider,
  useCompaniesContext,
} from "../../context/CompaniesContext";
import CompanyCardView from "./CompanyCardView";
import { CompanyDetailModal } from "./CompanyDetailModal";
import { CompanyTableView } from "./CompanyTableView";
import CompanyFormModal from "./CompanyFormModal";
import ExportCompanyModal from "./ExportCompanyModal";
import EligibleStudentsManager from "./EligibleStudentsManager";

const CompanyListing = () => {
  const [viewMode, setViewMode] = useState("table"); // table or cards
  const {
    selectedCompany,
    selectedBatch,
    sectorFilter,
    companies,
    fetchCompanies,
    setSectorFilter,
    searchTerm,
    setSearchTerm,
    filteredCompanies,
    activeTab,
    setActiveTab,
    stats,
    specializationFilter,
    setSpecializationFilter,
    showFormModal,
    setShowFormModal,
    editingCompany,
    setEditingCompany,
    showEligibilityModal,
    setShowEligibilityModal,
    selectedCompanyForEligibility,
    setSelectedCompanyForEligibility,
  } = useCompaniesContext();

  const [showExportModal, setShowExportModal] = useState(false);

  const SPECIALIZATIONS = [
    { value: "CSE", label: "CSE" },
    { value: "E.Com", label: "E.Com" },
    { value: "ME", label: "ME" },
  ];

  // Updated status colors for new status values
  const statusColors = {
    "Not Started": "bg-gray-100 text-gray-700",
    "JD Shared": "bg-blue-100 text-blue-700",
    Ongoing: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
  };

  const companyTypeColors = {
    tech: "bg-purple-100 text-purple-800",
    nontech: "bg-rose-100 text-rose-800",
  };

  // Update the add button click handler
  const handleAddClick = () => {
    setEditingCompany(null);
    setShowFormModal(true);
  };

  // Add an edit button click handler
  const handleEditClick = (company) => {
    setEditingCompany(company);
    setShowFormModal(true);
  };

  // Update the success handler
  const handleFormSuccess = () => {
    fetchCompanies();
    setShowFormModal(false);
    setEditingCompany(null);
  };

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
                  Company Management Dashboard
                </h1>
                <p className="text-gray-600">
                  Manage recruitment drives, track applications, and monitor
                  company relationships
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "table"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "cards"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  Cards
                </button>
              </div>

              <button
                onClick={() => setShowExportModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Download size={20} />
                Export Data
              </button>

              <button
                onClick={handleAddClick}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus size={20} />
                Add Company
              </button>
            </div>
          </div>

          {/* Enhanced Stats Cards - UPDATED */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <Building2 className="text-blue-600" size={24} />
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Total Companies
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-300">
              <div className="flex items-center gap-3">
                <Award className="text-yellow-600" size={24} />
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Marquee</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {stats.marquee}
                  </p>
                </div>
              </div>
            </div>

            {/* UPDATED: JD Shared */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center gap-3">
                <Users className="text-green-600" size={24} />
                <div>
                  <p className="text-green-600 text-sm font-medium">
                    JD Shared
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {stats.jd_shared}
                  </p>
                </div>
              </div>
            </div>

            {/* UPDATED: Ongoing (was Upcoming) */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100">
              <div className="flex items-center gap-3">
                <Clock className="text-yellow-600" size={24} />
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Ongoing</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {stats.ongoing}
                  </p>
                </div>
              </div>
            </div>

            {/* UPDATED: Completed (was Delayed) */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-blue-600" size={24} />
                <div>
                  <p className="text-blue-600 text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.completed}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          {/* Tabs - UPDATED */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: "all", label: "All Companies", icon: Building2 },
              { key: "marquee", label: "Marquee", icon: Award },
              { key: "jd_shared", label: "JD Shared", icon: Users },
              { key: "ongoing", label: "Ongoing", icon: Clock },
              { key: "completed", label: "Completed", icon: CheckCircle },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <IconComponent size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Batch {selectedBatch}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {companies.length} companies registered
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Sector Filter */}
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sectors</option>
                <option value="E-Commerce, Logistics and Business">
                  E-Commerce, Logistics and Business
                </option>
                <option value="EdTech">EdTech</option>
                <option value="IT & Consulting">IT & Consulting</option>
                <option value="IT Service">IT Service</option>
                <option value="IT Software (Product)">
                  IT Software (Product)
                </option>
                <option value="Others*">Others*</option>
              </select>

              {/* Specialization Filter */}
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Branches</option>
                {SPECIALIZATIONS.map((spec) => (
                  <option key={spec.value} value={spec.value}>
                    {spec.label}
                  </option>
                ))}
              </select>

              <button
                onClick={fetchCompanies}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Companies Display */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            {filteredCompanies.map((company) => (
              <CompanyCardView
                key={company.id}
                company={company}
                statusColors={statusColors}
                companyTypeColors={companyTypeColors}
                onEditClick={handleEditClick}
              />
            ))}
            {/* Empty State */}
            {filteredCompanies.length === 0 && (
              <div className="col-span-full flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
                  <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Building2 className="h-10 w-10 text-gray-400" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm ||
                    sectorFilter !== "all" ||
                    specializationFilter !== "all"
                      ? "No companies match your filters"
                      : "No companies found"}
                  </h3>

                  <p className="text-gray-500 mb-6">
                    {searchTerm ||
                    sectorFilter !== "all" ||
                    specializationFilter !== "all" ? (
                      <span className="flex items-center justify-center gap-2">
                        <Search className="h-4 w-4" />
                        Try adjusting your search criteria or filters
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Add a new company to get started with placement
                        management.
                      </span>
                    )}
                  </p>

                  {!searchTerm &&
                    sectorFilter === "all" &&
                    specializationFilter === "all" && (
                      <button
                        onClick={() => setShowFormModal(true)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Plus className="h-4 w-4" />
                        Add Company
                      </button>
                    )}

                  {(searchTerm ||
                    sectorFilter !== "all" ||
                    specializationFilter !== "all") && (
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSectorFilter("all");
                          setSpecializationFilter("all");
                        }}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <CompanyTableView
            statusColors={statusColors}
            companyTypeColors={companyTypeColors}
            onEditClick={handleEditClick}
          />
        )}

        {/* Company Detail Modal */}
        {selectedCompany && <CompanyDetailModal />}

        {showFormModal && (
          <CompanyFormModal
            batchYear={selectedBatch}
            onClose={() => {
              setShowFormModal(false);
              setEditingCompany(null);
            }}
            onSuccess={handleFormSuccess}
            editData={editingCompany}
          />
        )}

        {showExportModal && (
          <ExportCompanyModal
            companies={filteredCompanies}
            onClose={() => setShowExportModal(false)}
          />
        )}

        {/* Eligible Students Manager Modal */}
        {showEligibilityModal && selectedCompanyForEligibility && (
          <EligibleStudentsManager
            companyId={selectedCompanyForEligibility.id}
            batchYear={selectedBatch}
            onClose={() => {
              setShowEligibilityModal(false);
              setSelectedCompanyForEligibility(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

const WrappedCompanyListing = () => (
  <CompaniesProvider>
    <CompanyListing />
  </CompaniesProvider>
);

export default WrappedCompanyListing;
