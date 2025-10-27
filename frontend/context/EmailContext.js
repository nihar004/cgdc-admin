import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch templates with axios
  const fetchTemplates = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/emails/email-templates`, {
        withCredentials: true,
      });

      if (data.success) {
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

  // Fetch Logs with axios
  const fetchLogs = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/emails/email-logs?page=1&limit=50`,
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  // Send email to filtered students with axios
  const sendEmailToFilteredStudents = async (emailData) => {
    setLoading(true);
    const requestId = `ctx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Convert to FormData
      const formData = new FormData();

      // Manually append each field
      formData.append("title", emailData.title || "");
      formData.append("subject", emailData.subject || "");
      formData.append("body", emailData.body || "");
      formData.append("sender_email", emailData.sender_email || "");
      formData.append("to_emails", JSON.stringify(emailData.to_emails || []));
      formData.append("cc_emails", JSON.stringify(emailData.cc_emails || []));
      formData.append(
        "student_ids",
        JSON.stringify(emailData.student_ids || [])
      );
      formData.append("message_id", emailData.message_id || "");
      formData.append("parent_message_id", emailData.parent_message_id || "");
      formData.append("position_id", emailData.position_id || "");
      formData.append(
        "recipient_type",
        emailData.recipient_type || "registered"
      );

      if (emailData.template_id) {
        formData.append("template_id", emailData.template_id);
      }

      if (emailData.excluded_template_attachments) {
        formData.append(
          "excluded_template_attachments",
          JSON.stringify(emailData.excluded_template_attachments)
        );
      }

      // Handle manual attachments if present
      if (
        emailData.manual_attachments &&
        Array.isArray(emailData.manual_attachments)
      ) {
        emailData.manual_attachments.forEach((file, index) => {
          formData.append("manual_attachments", file);
        });
      }
      const response = await axios.post(
        `${backendUrl}/emails/email-logs/send/students`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        await fetchLogs();
        return {
          success: true,
          data: response.data,
          message: `Email sent successfully to ${response.data.emailResults.successful} recipients`,
        };
      }

      return { success: false, message: response.data.error };
    } catch (error) {
      if (error.response) {
        console.error(`[${requestId}] Response status:`, error.response.status);
        console.error(`[${requestId}] Response data:`, error.response.data);
      }
      if (error.request) {
        console.error(`[${requestId}] Request made but no response`);
      }

      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Failed to send email",
      };
    } finally {
      setLoading(false);
    }
  };

  // Create template with axios
  const createTemplate = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/emails/email-templates`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        await fetchTemplates();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Update template with axios
  const updateTemplate = async (id, formData) => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${backendUrl}/emails/email-templates/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        await fetchTemplates();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error };
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
      const response = await fetch(
        `${backendUrl}/emails/email-templates/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
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

      const response = await fetch(`${backendUrl}/emails/email-logs/send`, {
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
      const response = await fetch(`${backendUrl}/emails/email-logs/${id}`, {
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
        deleteLogs,
        sendLogs,
        sendEmailToFilteredStudents,
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
