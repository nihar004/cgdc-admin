import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:5000";

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      // NEW
      // const { data } = await axios.get("/emails/email-templates");
      const { data } = await axios.get(`${API_BASE}/emails/email-templates`);

      if (data.success) {
        // Transform grouped templates into flat array with category
        const flatTemplates = data.groupedTemplates.reduce((acc, group) => {
          return [
            ...acc,
            ...group.templates.map((template) => ({
              ...template,
              category: group.category,
              cc_emails: template.cc_emails
                ? typeof template.cc_emails === "string"
                  ? JSON.parse(template.cc_emails)
                  : template.cc_emails
                : [],
            })),
          ];
        }, []);
        setTemplates(flatTemplates);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

  // Fetch Logs
  const fetchLogs = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/emails/email-logs?page=1&limit=50`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  // Create template
  const createTemplate = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post("/emails/email-templates", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        await fetchTemplates();
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.error };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Update template
  const updateTemplate = async (id, formData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE}/emails/email-templates/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        await fetchTemplates();
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.error };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Delete template
  const deleteTemplate = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/emails/email-templates/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        await fetchTemplates();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  // Send email Logs
  const sendLogs = async (Data) => {
    setLoading(true);
    try {
      // Check if it's FormData (has manual attachments) or regular object
      const isFormData = Data instanceof FormData;

      const response = await fetch(`${API_BASE}/emails/email-logs/send`, {
        method: "POST",
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        credentials: "include",
        body: isFormData ? Data : JSON.stringify(Data),
      });
      const data = await response.json();
      if (data.success) {
        await fetchLogs();
        return { success: true, data };
      }
      return { success: false, message: data.error };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete Logs
  const deleteLogs = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/emails/email-logs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        await fetchLogs();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchLogs();
  }, []);

  return (
    <EmailContext.Provider
      value={{
        templates,
        logs,
        loading,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        sendLogs,
        deleteLogs,
        fetchTemplates,
        fetchLogs,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error("useEmail must be used within EmailProvider");
  }
  return context;
};
