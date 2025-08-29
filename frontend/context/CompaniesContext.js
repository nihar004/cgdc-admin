import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useBatchContext } from "./BatchContext"; // Fix: Correct import name

const CompaniesContext = createContext();

export function CompaniesProvider({ children }) {
  const { selectedBatch } = useBatchContext(); // Fix: Use correct context name
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");

  const formatPackage = (amount) => {
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
        `http://localhost:5000/companies/batch/${selectedBatch}`
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

    if (actualDate) return "arrived";
    if (scheduledDate < now) return "late";
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

    // Type filter
    const matchesType =
      typeFilter === "all" || company.company_type === typeFilter;

    // Sector filter
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
      matchesSearch &&
      matchesType &&
      matchesSector &&
      matchesStatus &&
      matchesSpecialization
    );
  });

  // Calculate statistics
  const stats = {
    total: companies.length,
    marquee: companies.filter((company) => company.is_marquee).length,
    arrived: companies.filter(
      (company) => getCompanyStatus(company) === "arrived"
    ).length,
    upcoming: companies.filter(
      (company) => getCompanyStatus(company) === "upcoming"
    ).length,
    late: companies.filter((company) => getCompanyStatus(company) === "late")
      .length,
  };

  // Add useEffect to fetch companies when selectedBatch changes
  useEffect(() => {
    if (selectedBatch) {
      fetchCompanies();
    }
  }, [selectedBatch]);

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
        typeFilter,
        setTypeFilter,
        sectorFilter,
        setSectorFilter,
        filteredCompanies,
        activeTab,
        setActiveTab,
        stats,
        getCompanyStatus,
        specializationFilter,
        setSpecializationFilter,
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
