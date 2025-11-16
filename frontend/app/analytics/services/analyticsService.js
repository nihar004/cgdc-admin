const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

// ===================== BATCH STATISTICS =====================
export const getBatchStatistics = async (batchYear, filters = {}) => {
  try {
    const params = new URLSearchParams({
      timeRange: filters.timeRange || "6months",
      department: filters.department || "all",
    });

    const response = await fetch(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/statistics?${params}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch batch statistics: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching batch statistics:", error);
    throw error;
  }
};

// ===================== COMPANIES LIST =====================
export const getCompaniesList = async (batchYear) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/companies`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch companies list: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching companies list:", error);
    throw error;
  }
};

// ===================== COMPANY DETAILS =====================
export const getCompanyDetails = async (batchYear, companyId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/companies/${companyId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch company details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching company details:", error);
    throw error;
  }
};

// ===================== STUDENTS LIST =====================
export const getStudentsList = async (batchYear, filters = {}) => {
  try {
    const params = new URLSearchParams({
      search: filters.search || "",
      placementStatus: filters.placementStatus || "",
      department: filters.department || "all",
      limit: filters.limit || 100,
      offset: filters.offset || 0,
    });

    const response = await fetch(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/students?${params}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch students list: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching students list:", error);
    throw error;
  }
};

// ===================== BATCH OVERVIEW =====================
export const getBatchOverview = async (batchYear) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/overview`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch batch overview: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching batch overview:", error);
    throw error;
  }
};

// ===================== BATCH PLACEMENTS =====================
export const getBatchPlacements = async (batchYear) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/placements`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch placements: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching placements:", error);
    throw error;
  }
};

// ===================== DEPARTMENTS ANALYTICS =====================
export const getDepartmentsAnalytics = async (batchYear) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/departments`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch departments analytics: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching departments analytics:", error);
    throw error;
  }
};

// ===================== COMPANIES ANALYTICS =====================
export const getCompaniesAnalytics = async (batchYear) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/companies`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch companies analytics: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching companies analytics:", error);
    throw error;
  }
};

// ===================== COMPANY TIMELINE =====================
export const getCompanyTimeline = async (batchYear) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/company-timeline`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch company timeline: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching company timeline:", error);
    throw error;
  }
};

// ===================== PACKAGES ANALYTICS =====================
export const getPackagesAnalytics = async (batchYear) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student-analytics/batch/${batchYear}/packages`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch packages analytics: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching packages analytics:", error);
    throw error;
  }
};

// ===================== STUDENT PROFILE =====================
export const getStudentOverview = async (studentId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student-analytics/student/${studentId}/overview`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch student overview: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching student overview:", error);
    throw error;
  }
};

// ===================== STUDENT APPLICATIONS =====================
export const getStudentApplications = async (studentId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student-analytics/student/${studentId}/applications`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch student applications: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching student applications:", error);
    throw error;
  }
};

// ===================== ELIGIBLE COMPANIES =====================
export const getStudentEligibleCompanies = async (studentId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student-analytics/student/${studentId}/eligible-companies`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch eligible companies: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching eligible companies:", error);
    throw error;
  }
};
