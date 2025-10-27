"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Send, X, FileText, Paperclip, Users } from "lucide-react";
import { useEmail } from "../../context/EmailContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const ComposeEmailContent = () => {
  const { templates, sendLogs, sendEmailToFilteredStudents, loading } =
    useEmail();
  const searchParams = useSearchParams();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [manualAttachments, setManualAttachments] = useState([]);
  const [removedTemplateAttachments, setRemovedTemplateAttachments] = useState(
    []
  );
  const [emailData, setEmailData] = useState(null); // Add this line
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    body: "",
    sender_email: "",
    to_emails: "",
    sendType: "filter",
    branch: [],
    batch_year: [],
    placement_status: "",
    recipient_emails: "",
    student_ids: "",
    event_id: "",
    recipient_type: "registered",
    cc_emails: "",
    message_id: "",
    parent_message_id: "",
  });
  const [activeTemplateCategory, setActiveTemplateCategory] = useState("");
  const [availableBatches, setAvailableBatches] = useState([]);

  const availableBranches = ["CSE", "ECE", "ME"];

  // Group templates by category
  const groupedTemplates = useMemo(() => {
    if (!templates || !Array.isArray(templates)) return {};
    return templates.reduce((acc, template) => {
      const category = template.category || "general";
      if (!acc[category]) acc[category] = [];
      acc[category].push(template);
      return acc;
    }, {});
  }, [templates]);

  // Get unique categories
  const categories = useMemo(() => {
    return Object.keys(groupedTemplates).sort();
  }, [groupedTemplates]);

  // Set initial category
  useEffect(() => {
    if (categories.length > 0 && !activeTemplateCategory) {
      setActiveTemplateCategory(categories[0]);
    }
  }, [categories]);

  // Fetch batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/batches`);
        if (Array.isArray(data)) {
          const years = data.map((b) => b.year);
          setAvailableBatches(years);
        } else {
          console.error("Expected array of batches, received:", data);
          setAvailableBatches([]);
        }
      } catch (err) {
        console.error("Error fetching batches:", err);
        setAvailableBatches([]);
      }
    };

    fetchBatches();
  }, []);

  // Update the useEffect that handles company email data
  useEffect(() => {
    if (searchParams.get("from") === "company") {
      const storedData = sessionStorage.getItem("emailData");
      if (storedData) {
        const data = JSON.parse(storedData);

        // Pre-fill the form with company data
        setFormData((prev) => ({
          ...prev,
          title: `${data.companyName} - ${
            data.targetType === "dream"
              ? "Dream Company Opportunity"
              : "Placement Information"
          }`,
          subject: `Important: ${data.companyName} Update`,
          sendType: "student_ids",
          // Check if student_ids exists before joining
          student_ids: data.student_ids ? data.student_ids.join(",") : "",
          // Clear other filter options
          branch: [],
          batch_year: [],
          placement_status: "",
        }));

        // Add info banner about recipients
        // Add info banner about recipients including emails
        setEmailData({
          companyName: data.companyName,
          studentCount: data.total_count || 0,
          targetType: data.targetType,
          studentEmails: data.students?.map((s) => s.college_email) || [], // Extract emails from students
          students: data.students || [], // Keep full student objects
        });

        // Clear storage
        sessionStorage.removeItem("emailData");
      }
    }
  }, [searchParams]);

  const handleUseTemplate = (template) => {
    let parsedCcEmails = "";
    if (template.cc_emails) {
      if (typeof template.cc_emails === "string") {
        try {
          const ccArray = JSON.parse(template.cc_emails);
          parsedCcEmails = Array.isArray(ccArray) ? ccArray.join(", ") : "";
        } catch (err) {
          parsedCcEmails = template.cc_emails;
        }
      } else if (Array.isArray(template.cc_emails)) {
        parsedCcEmails = template.cc_emails.join(", ");
      }
    }

    setFormData({
      ...formData,
      title: template.template_name,
      subject: template.subject,
      body: template.body,
      sender_email: template.sender_email || "",
      cc_emails: parsedCcEmails,
    });
    setSelectedTemplate(template);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 10MB`);
        return false;
      }
      return true;
    });

    const templateAttachmentCount = getTemplateAttachments().length;
    const totalCount =
      manualAttachments.length + validFiles.length + templateAttachmentCount;

    if (totalCount > 5) {
      toast.error(
        "Maximum 5 attachments allowed (including template attachments)"
      );
      return;
    }

    setManualAttachments((prev) => [...prev, ...validFiles]);
    if (validFiles.length > 0) {
      toast.success(
        `Added ${validFiles.length} attachment${
          validFiles.length !== 1 ? "s" : ""
        }`
      );
    }
  };

  const removeManualAttachment = (index) => {
    setManualAttachments((files) => files.filter((_, i) => i !== index));
  };

  const getTemplateAttachments = () => {
    if (!selectedTemplate?.attachments) return [];
    try {
      const attachments =
        typeof selectedTemplate.attachments === "string"
          ? JSON.parse(selectedTemplate.attachments)
          : selectedTemplate.attachments;
      const filtered = Array.isArray(attachments)
        ? attachments.filter(
            (a) => !removedTemplateAttachments.includes(a.filename)
          )
        : [];
      return filtered;
    } catch (err) {
      console.error("Error parsing attachments:", err);
      return [];
    }
  };

  const removeTemplateAttachment = (filename) => {
    setRemovedTemplateAttachments((prev) => [...prev, filename]);
  };

  const getTotalAttachmentCount = () => {
    return getTemplateAttachments().length + manualAttachments.length;
  };

  const handleSend = async () => {
    if (!formData.title || !formData.subject || !formData.body) {
      toast.error("Please fill title, subject, and body");
      return;
    }

    if (!formData.to_emails) {
      toast.error("Please enter at least one 'To' email address");
      return;
    }

    // Parse to_emails once (used by both paths)
    const toEmails = formData.to_emails
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);

    // SPECIAL HANDLING FOR STUDENT_IDS (Company flow)
    if (formData.sendType === "student_ids") {
      const studentIds = formData.student_ids
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));

      if (studentIds.length === 0) {
        toast.error("No valid student IDs found");
        return;
      }

      const payload = {
        title: formData.title,
        subject: formData.subject,
        body: formData.body,
        sender_email: formData.sender_email,
        to_emails: toEmails,
        cc_emails: formData.cc_emails
          ? formData.cc_emails
              .split(",")
              .map((e) => e.trim())
              .filter((e) => e)
          : [],
        student_ids: studentIds,
        message_id: formData.message_id || "",
        parent_message_id: formData.parent_message_id || "",
        position_id: formData.position_id || null, // Add this if you have position_id in formData
        recipient_type: formData.recipient_type || "registered", // Add this
      };

      // Add template info if applicable
      if (selectedTemplate) {
        payload.template_id = selectedTemplate.id;
        if (removedTemplateAttachments.length > 0) {
          payload.excluded_template_attachments = removedTemplateAttachments;
        }
      }

      // Add manual attachments
      if (manualAttachments.length > 0) {
        payload.manual_attachments = manualAttachments;
      }

      // Use sendEmailToFilteredStudents
      const sendPromise = sendEmailToFilteredStudents(payload);

      toast.promise(sendPromise, {
        loading: "Sending email...",
        success: (result) => {
          if (result.success) {
            resetForm();
            return `Email sent successfully! (${
              result.data?.emailResults?.successful || 0
            } sent, ${result.data?.emailResults?.failed || 0} failed)`;
          }
          throw new Error(result.message);
        },
        error: (err) => `Failed to send email: ${err.message}`,
      });

      return; // Exit early for student_ids flow
    }

    // NORMAL FLOW (filter and manual)
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("body", formData.body);
    formDataToSend.append("sender_email", formData.sender_email);
    formDataToSend.append("to_emails", JSON.stringify(toEmails));

    if (selectedTemplate) {
      formDataToSend.append("template_id", selectedTemplate.id);
      if (removedTemplateAttachments.length > 0) {
        formDataToSend.append(
          "excluded_template_attachments",
          JSON.stringify(removedTemplateAttachments)
        );
      }
    }

    manualAttachments.forEach((file) => {
      formDataToSend.append("manual_attachments", file);
    });

    if (formData.sendType === "filter") {
      const filters = {};
      if (formData.branch.length > 0) {
        filters.branch = formData.branch;
      }
      if (formData.batch_year.length > 0) {
        filters.batch_year = formData.batch_year;
      }
      if (formData.placement_status) {
        filters.placement_status = formData.placement_status;
      }
      formDataToSend.append("recipient_filter", JSON.stringify(filters));
    } else if (formData.sendType === "manual") {
      const emails = formData.recipient_emails
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e);
      if (emails.length === 0) {
        toast.error("Please enter at least one email address");
        return;
      }
      formDataToSend.append("recipient_emails", JSON.stringify(emails));
    }

    if (formData.cc_emails) {
      const ccEmails = formData.cc_emails
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e);
      formDataToSend.append("cc_emails", JSON.stringify(ccEmails));
    }

    // Add message tracking fields if provided
    if (formData.message_id) {
      formDataToSend.append("message_id", formData.message_id);
    }
    if (formData.parent_message_id) {
      formDataToSend.append("parent_message_id", formData.parent_message_id);
    }

    const sendPromise = sendLogs(formDataToSend);

    toast.promise(sendPromise, {
      loading: "Sending email...",
      success: (result) => {
        if (result.success) {
          resetForm();
          return `Email sent successfully! (${
            result.data?.emailResults?.successful || 0
          } sent, ${result.data?.emailResults?.failed || 0} failed)`;
        }
        throw new Error(result.message);
      },
      error: (err) => `Failed to send email: ${err.message}`,
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      body: "",
      sender_email: "",
      to_emails: "",
      sendType: "filter",
      branch: [],
      batch_year: [],
      placement_status: "",
      recipient_emails: "",
      student_ids: "",
      event_id: "",
      recipient_type: "registered",
      cc_emails: "",
      message_id: "",
      parent_message_id: "",
    });
    setSelectedTemplate(null);
    setManualAttachments([]);
    setRemovedTemplateAttachments([]);
    setEmailData(null);
  };

  return (
    <div className="space-y-6">
      {/* Quick Templates */}
      {templates.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">
                Quick Start Templates
              </h3>
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTemplateCategory(category)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTemplateCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  <span
                    className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTemplateCategory === category
                        ? "bg-blue-500 text-white"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {groupedTemplates[category]?.length || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {groupedTemplates[activeTemplateCategory]?.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;
              const attachmentCount = template.attachments
                ? Array.isArray(template.attachments)
                  ? template.attachments.length
                  : JSON.parse(template.attachments).length
                : 0;

              return (
                <button
                  key={template.id}
                  onClick={() => handleUseTemplate(template)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  {template.template_name}
                  {attachmentCount > 0 && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs ${
                        isSelected ? "text-blue-100" : "text-blue-600"
                      }`}
                    >
                      <Paperclip className="w-3 h-3" />
                      {attachmentCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Selected Template Info */}
        {selectedTemplate && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">
                    Using Template: {selectedTemplate.template_name}
                  </h4>
                </div>

                {selectedTemplate && getTemplateAttachments().length > 0 && (
                  <div className="mt-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/70 shadow-sm">
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Paperclip className="w-4 h-4 text-green-600" />
                          <h4 className="text-sm font-medium text-green-800">
                            Template Attachments (
                            {getTemplateAttachments().length})
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {getTemplateAttachments().map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-green-100 hover:bg-white transition-colors duration-200"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 bg-green-50 rounded-lg">
                                  <Paperclip className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-700 truncate">
                                    {attachment.filename}
                                  </p>
                                  {attachment.size && (
                                    <p className="text-xs text-gray-500">
                                      {(attachment.size / 1024 / 1024).toFixed(
                                        2
                                      )}{" "}
                                      MB
                                    </p>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  removeTemplateAttachment(attachment.filename)
                                }
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Remove attachment"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  setRemovedTemplateAttachments([]);
                  setFormData({
                    ...formData,
                    title: "",
                    subject: "",
                    body: "",
                  });
                }}
                className="p-1 hover:bg-green-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-green-600" />
              </button>
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title (Internal)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Google Drive Reminder - Jan 2024"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sender Email
              </label>
              <input
                type="email"
                value={formData.sender_email}
                placeholder="placement@college.edu"
                onChange={(e) =>
                  setFormData({ ...formData, sender_email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To Emails (comma-separated) *
              </label>
              <input
                type="text"
                value={formData.to_emails}
                onChange={(e) =>
                  setFormData({ ...formData, to_emails: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="placement@college.edu, hod@college.edu"
              />
              <p className="text-xs text-gray-500 mt-1">
                Primary visible recipients (students will be in BCC)
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            CC Emails (comma-separated, optional)
          </label>
          <input
            type="text"
            value={formData.cc_emails}
            onChange={(e) =>
              setFormData({ ...formData, cc_emails: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="hod@college.edu, coordinator@college.edu"
          />
          <p className="text-xs text-gray-500 mt-1">
            CC recipients will be visible to all. Students are automatically in
            BCC (hidden).
          </p>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Subject
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write your email subject here..."
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 For follow-ups: Keep subject similar to original (e.g., add
            &quot;Re:&quot; prefix)
          </p>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Body (HTML)
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 h-48 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write your email body here..."
          />
        </div>

        {/* Manual Attachments Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Attachments
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={getTotalAttachmentCount() >= 5}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg flex items-center gap-2"
              >
                <Paperclip className="w-4 h-4" />
                Add Files
              </button>
              <span className="text-sm text-gray-500">
                Max 5 files total ({getTotalAttachmentCount()}/5 used)
              </span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />

            {manualAttachments.length > 0 && (
              <div className="mt-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs font-semibold text-purple-900 mb-2">
                  Manual Attachments ({manualAttachments.length})
                </p>
                <div className="space-y-2">
                  {manualAttachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:bg-white transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Paperclip className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeManualAttachment(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Remove attachment"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recipients Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Send To
          </label>
          {/* Only show radio buttons if not coming from company page */}
          {searchParams.get("from") !== "company" && (
            <div className="flex flex-wrap gap-4 mb-4">
              {["filter", "manual", "student_ids"].map((type) => (
                <label key={type} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value={type}
                    checked={formData.sendType === type}
                    onChange={(e) =>
                      setFormData({ ...formData, sendType: e.target.value })
                    }
                    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {type === "filter"
                      ? "Filter Students"
                      : type === "manual"
                        ? "Manual Emails"
                        : "Selected Students"}
                  </span>
                </label>
              ))}
            </div>
          )}
          {/* Only show filters if sendType is filter and not coming from company */}
          {formData.sendType === "filter" &&
            searchParams.get("from") !== "company" && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableBranches.map((branch) => (
                      <button
                        key={branch}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            branch: prev.branch.includes(branch)
                              ? prev.branch.filter((b) => b !== branch)
                              : [...prev.branch, branch],
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          formData.branch.includes(branch)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {branch}
                      </button>
                    ))}
                  </div>
                  {formData.branch.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-sm text-gray-600">
                        Selected: {formData.branch.join(", ")}
                      </p>
                      <button
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, branch: [] }))
                        }
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch Year
                    </label>
                    <div className="space-y-3">
                      {availableBatches.length > 0 ? (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {availableBatches.map((year) => (
                              <button
                                key={year}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    batch_year: prev.batch_year.includes(year)
                                      ? prev.batch_year.filter(
                                          (y) => y !== year
                                        )
                                      : [...prev.batch_year, year],
                                  }));
                                }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  formData.batch_year.includes(year)
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                          {formData.batch_year.length > 0 && (
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-600">
                                Selected:{" "}
                                {formData.batch_year.sort().join(", ")}
                              </p>
                              <button
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    batch_year: [],
                                  }))
                                }
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Clear all
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No batch years available
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Placement Status
                    </label>
                    <select
                      value={formData.placement_status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          placement_status: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="">All</option>
                      <option value="placed">Placed</option>
                      <option value="unplaced">Unplaced</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          {/* Only show manual input if sendType is manual and not coming from company */}
          {formData.sendType === "manual" &&
            searchParams.get("from") !== "company" && (
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Addresses (comma-separated)
                </label>
                <textarea
                  value={formData.recipient_emails}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recipient_emails: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24"
                  placeholder="student1@college.edu, student2@college.edu"
                />
              </div>
            )}
          {/* Always show selected students info when coming from company */}
          {(formData.sendType === "student_ids" ||
            searchParams.get("from") === "company") &&
            emailData && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      {emailData.companyName}
                    </h4>
                    <p className="text-sm text-blue-700">
                      Sending to {emailData.studentCount}{" "}
                      {emailData.targetType === "dream"
                        ? "dream company eligible"
                        : "eligible"}{" "}
                      students
                    </p>
                  </div>
                </div>

                {/* Student Emails List - Comma Separated */}
                {emailData.studentEmails &&
                  emailData.studentEmails.length > 0 && (
                    <div className="mt-3 bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-2">
                        Recipients ({emailData.studentEmails.length}):
                      </p>
                      <div className="max-h-32 overflow-y-auto">
                        <p className="text-xs text-gray-700 break-words">
                          {emailData.studentEmails.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            )}
        </div>

        {/* Message Tracking (Optional Follow-up Fields) */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-blue-900">
              Message Tracking (Optional - for follow-up emails)
            </h4>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              ⚠️ For threading: use similar subject line (add &quot;Re:&quot;
              prefix)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-blue-900 mb-2">
                Message ID
              </label>
              <input
                type="text"
                value={formData.message_id}
                onChange={(e) =>
                  setFormData({ ...formData, message_id: e.target.value })
                }
                className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave empty to auto-generate"
              />
              <p className="text-xs text-blue-700 mt-1">
                Auto-generated if not provided
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-900 mb-2">
                Parent Message ID
              </label>
              <input
                type="text"
                value={formData.parent_message_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parent_message_id: e.target.value,
                  })
                }
                className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Link to original email for follow-ups"
              />
              <p className="text-xs text-blue-700 mt-1">
                Use this for follow-up/trail emails
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-300/80">
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-all shadow-lg"
          >
            <Send className="w-4 h-4" />
            {loading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Outer wrapper component
const ComposeEmail = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComposeEmailContent />
    </Suspense>
  );
};

export default ComposeEmail;
