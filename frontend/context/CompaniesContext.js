import { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useBatchContext } from "./BatchContext";
import { toast } from "react-hot-toast";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const CompaniesContext = createContext();

export function CompaniesProvider({ children }) {
  const { selectedBatch } = useBatchContext();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState("company");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [selectedCompanyForEligibility, setSelectedCompanyForEligibility] =
    useState(null);

  const formatPackage = (amount) => {
    if (amount == null || isNaN(amount) || amount === -1) {
      return "Not Disclosed";
    }

    // Amount is now already in lakhs from backend
    if (amount >= 100) {
      return `₹${(amount / 100).toFixed(1)} Cr`;
    }
    return `₹${amount.toFixed(2)} LPA`;
  };

  const formatPackageRange = (position) => {
    if (!position.package || position.package === -1) {
      return "Not Disclosed";
    }

    if (
      position.has_range &&
      position.package_end &&
      position.package_end !== -1
    ) {
      return `${formatPackage(position.package)} - ${formatPackage(position.package_end)}`;
    }

    return formatPackage(position.package);
  };

  // Fetch companies data
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/companies/batch/${selectedBatch}`
      );
      setCompanies(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch companies");
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine company status - FIXED
  const getCompanyStatus = (company) => {
    // Normalize the status from backend (handles "Completed", "completed", etc.)
    if (company.status) {
      return company.status.toLowerCase().replace(/ /g, "_");
    }

    // Fallback calculation if status not provided by backend
    if (company.company_rounds_end_date) {
      return "completed";
    }

    if (company.company_rounds_start_date) {
      return "ongoing";
    }

    if (company.jd_shared_date) {
      return "jd_shared";
    }

    return "not_started";
  };

  // Filtered companies - FIXED
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      // Search filter
      const matchesSearch = company.company_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Sector filter
      const matchesSector =
        sectorFilter === "all" || company.sector === sectorFilter;

      // Specialization filter
      const matchesSpecialization =
        specializationFilter === "all" ||
        (company.allowed_specializations &&
          company.allowed_specializations.includes(specializationFilter));

      // Get normalized status
      const status = getCompanyStatus(company);

      // Active tab filter - FIXED
      let matchesTab = true;
      if (activeTab === "marquee") {
        matchesTab = company.is_marquee;
      } else if (activeTab === "jd_shared") {
        matchesTab = status === "jd_shared";
      } else if (activeTab === "ongoing") {
        matchesTab = status === "ongoing";
      } else if (activeTab === "completed") {
        matchesTab = status === "completed";
      }
      // activeTab === "all" means no filtering

      return (
        matchesSearch && matchesSector && matchesSpecialization && matchesTab
      );
    });
  }, [companies, searchTerm, sectorFilter, specializationFilter, activeTab]);

  // Calculate statistics - FIXED
  const stats = useMemo(() => {
    return {
      total: companies.length,
      marquee: companies.filter((c) => c.is_marquee).length,
      jd_shared: companies.filter((c) => getCompanyStatus(c) === "jd_shared")
        .length,
      ongoing: companies.filter((c) => getCompanyStatus(c) === "ongoing")
        .length,
      completed: companies.filter((c) => getCompanyStatus(c) === "completed")
        .length,
    };
  }, [companies]);

  // Add useEffect to fetch companies when selectedBatch changes
  useEffect(() => {
    if (selectedBatch) {
      fetchCompanies();
    }
  }, [selectedBatch, showEligibilityModal]);

  // Delete company
  const handleDeleteCompany = async (companyId) => {
    try {
      await axios.delete(
        `${backendUrl}/companies/${companyId}/batch/${selectedBatch}`
      );

      // Optimistic update
      setCompanies(companies.filter((company) => company.id !== companyId));

      // Show success toast
      toast.success("Company deleted successfully!", {
        duration: 4000,
        position: "top-right",
      });

      // Silent re-sync
      fetchCompanies();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete company";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-right",
      });
      console.error("Error deleting company:", err);
    }
  };

  // Delete position
  const handleDeletePosition = async (positionId) => {
    try {
      await axios.delete(`${backendUrl}/companies/position/${positionId}`);
      // Show success toast
      toast.success("Position deleted successfully!", {
        duration: 4000,
        position: "top-right",
      });

      // Refresh companies data
      fetchCompanies();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete position";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-right",
      });
      console.error("Error deleting position:", err);
    }
  };

  const handleDeleteClick = (item, type = "company") => {
    setDeleteType(type);
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      if (deleteType === "company") {
        await handleDeleteCompany(itemToDelete.id);
      } else {
        await handleDeletePosition(itemToDelete.id);
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <CompaniesContext.Provider
      value={{
        formatPackage,
        formatPackageRange,
        selectedCompany,
        setSelectedCompany,
        companies,
        setCompanies,
        fetchCompanies,
        loading,
        setLoading,
        error,
        setError,
        selectedBatch,
        searchTerm,
        setSearchTerm,
        sectorFilter,
        setSectorFilter,
        filteredCompanies,
        activeTab,
        setActiveTab,
        stats,
        getCompanyStatus,
        specializationFilter,
        setSpecializationFilter,
        showDeleteModal,
        setShowDeleteModal,
        deleteType,
        setDeleteType,
        itemToDelete,
        setItemToDelete,
        isDeleting,
        setIsDeleting,
        handleDeleteClick,
        handleDeleteConfirm,
        showFormModal,
        setShowFormModal,
        editingCompany,
        setEditingCompany,
        showEligibilityModal,
        setShowEligibilityModal,
        selectedCompanyForEligibility,
        setSelectedCompanyForEligibility,
      }}
    >
      {children}
    </CompaniesContext.Provider>
  );
}

export const useCompaniesContext = () => {
  const context = useContext(CompaniesContext);
  if (!context) {
    throw new Error(
      "useCompaniesContext must be used within a CompaniesProvider"
    );
  }
  return context;
};
