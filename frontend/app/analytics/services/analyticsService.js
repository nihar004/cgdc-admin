import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ===================== BATCH STATISTICS =====================
export const getBatchStatistics = async (batchYear, filters = {}) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/overview`,
      {
        params: {
          timeRange: filters.timeRange || "6months",
          department: filters.department || "all",
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching batch statistics:", error);
    throw error;
  }
};

// ===================== COMPANIES LIST =====================
export const getCompaniesList = async (batchYear) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/companies`
    );
    return data;
  } catch (error) {
    console.error("Error fetching companies list:", error);
    throw error;
  }
};

// ===================== COMPANY DETAILS =====================
export const getCompanyDetails = async (batchYear, companyId) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/companies/${companyId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching company details:", error);
    throw error;
  }
};

// ===================== STUDENTS LIST =====================
export const getStudentsList = async (batchYear, filters = {}) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/students`,
      {
        params: {
          search: filters.search || "",
          placementStatus: filters.placementStatus || "",
          department: filters.department || "all",
          limit: filters.limit || 100,
          offset: filters.offset || 0,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching students list:", error);
    throw error;
  }
};

// ===================== BATCH OVERVIEW =====================
export const getBatchOverview = async (batchYear) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/overview`
    );
    return data;
  } catch (error) {
    console.error("Error fetching batch overview:", error);
    throw error;
  }
};

// ===================== BATCH PLACEMENTS =====================
export const getBatchPlacements = async (batchYear) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/placements`
    );
    return data;
  } catch (error) {
    console.error("Error fetching placements:", error);
    throw error;
  }
};

// ===================== DEPARTMENTS ANALYTICS =====================
export const getDepartmentsAnalytics = async (batchYear) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/departments`
    );
    return data;
  } catch (error) {
    console.error("Error fetching departments analytics:", error);
    throw error;
  }
};

// ===================== COMPANIES ANALYTICS =====================
export const getCompaniesAnalytics = async (batchYear) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/companies`
    );
    return data;
  } catch (error) {
    console.error("Error fetching companies analytics:", error);
    throw error;
  }
};

// ===================== COMPANY TIMELINE =====================
export const getCompanyTimeline = async (batchYear) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/company-timeline`
    );
    return data;
  } catch (error) {
    console.error("Error fetching company timeline:", error);
    throw error;
  }
};

// ===================== PACKAGES ANALYTICS =====================
export const getPackagesAnalytics = async (batchYear) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/packages`
    );
    return data;
  } catch (error) {
    console.error("Error fetching packages analytics:", error);
    throw error;
  }
};

// ===================== STUDENT PROFILE =====================
export const getStudentOverview = async (studentId) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/student/${studentId}/overview`
    );
    return data;
  } catch (error) {
    console.error("Error fetching student overview:", error);
    throw error;
  }
};

// ===================== STUDENT APPLICATIONS =====================
export const getStudentApplications = async (studentId) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/student/${studentId}/applications`
    );
    return data;
  } catch (error) {
    console.error("Error fetching student applications:", error);
    throw error;
  }
};

// ===================== ELIGIBLE COMPANIES =====================
export const getStudentEligibleCompanies = async (studentId) => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/student-analytics/student/${studentId}/eligible-companies`
    );
    return data;
  } catch (error) {
    console.error("Error fetching eligible companies:", error);
    throw error;
  }
};

// ===================== EXPORT STUDENTS WITH COMPANY MATRIX =====================
export const exportStudentsCompanyMatrix = async (
  batchYear,
  placementStatus = ""
) => {
  try {
    const params = {};
    if (placementStatus && placementStatus.trim() !== "") {
      params.placementStatus = placementStatus;
    }

    const response = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/students/export`,
      {
        params,
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error exporting students company matrix:", error);
    throw error;
  }
};

// ===================== EXPORT STUDENT OFFERS =====================
export const exportStudentOffers = async (batchYear, placementStatus = "") => {
  try {
    const params = {};
    if (placementStatus && placementStatus.trim() !== "") {
      params.placementStatus = placementStatus;
    }

    const response = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/students/offers-export`,
      {
        params,
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error exporting student offers:", error);
    throw error;
  }
};

// ===================== EXPORT ALL COMPANIES =====================
export const exportAllCompanies = async (batchYear) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/export-all-companies`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    console.error("Error exporting all companies:", error);
    throw error;
  }
};
