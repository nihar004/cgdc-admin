import { createContext, useContext, useState, useEffect } from "react";
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
    if (amount == null || isNaN(amount)) {
      return "Not Disclosed";
    }

    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} LPA`;
    }
    return `₹${amount.toLocaleString()}`;
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

  // Helper function to determine company status
  const getCompanyStatus = (company) => {
    const now = new Date();
    const scheduledDate = new Date(company.scheduled_visit);
    const actualDate = company.actual_arrival
      ? new Date(company.actual_arrival)
      : null;

    if (actualDate) return "JD Shared";
    if (scheduledDate < now) return "Delayed";
    return "upcoming";
  };

  // Updated filter companies logic
  const filteredCompanies = companies.filter((company) => {
    // Search filter
    const matchesSearch =
      company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.company_description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      company.sector?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector =
      sectorFilter === "all" || company.sector === sectorFilter;

    // Status filter
    const status = getCompanyStatus(company);
    const matchesStatus =
      activeTab === "all" ||
      (activeTab === "marquee" && company.is_marquee) ||
      activeTab === status;

    // Updated specialization filter logic
    const matchesSpecialization =
      specializationFilter === "all" ||
      (company.allowed_specializations &&
        specializationFilter
          .split(",")
          .every((spec) => company.allowed_specializations.includes(spec)));

    return (
      matchesSearch && matchesSector && matchesStatus && matchesSpecialization
    );
  });

  // Calculate statistics
  const stats = {
    total: companies.length,
    marquee: companies.filter((company) => company.is_marquee).length,
    jd_shared: companies.filter(
      (company) => getCompanyStatus(company) === "JD Shared"
    ).length,
    upcoming: companies.filter(
      (company) => getCompanyStatus(company) === "upcoming"
    ).length,
    delayed: companies.filter(
      (company) => getCompanyStatus(company) === "Delayed"
    ).length,
  };

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

  // TODO
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
