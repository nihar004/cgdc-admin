// ===== Templates.js (Frontend) =====
import { useState, useRef, useMemo, useEffect } from "react";
import { Mail, Trash2, Save, Edit, Paperclip, X, Users } from "lucide-react";
import { useEmail } from "../../context/EmailContext";
import toast from "react-hot-toast";
import CKEditorEmail, { convertToEmailHTML } from "./CKEditorEmail";

const Templates = () => {
  const { templates, createTemplate, updateTemplate, deleteTemplate, loading } =
    useEmail();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    template_name: "",
    subject: "",
    body: "",
    category: "", // Remove default value
    sender_email: "",
    cc_emails: "",
  });
  const [editing, setEditing] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [removedAttachments, setRemovedAttachments] = useState([]);
  const [activeCategory, setActiveCategory] = useState(""); // Update activeCategory state to have no default

  // Group templates by category
  const groupedTemplates = useMemo(() => {
    if (!templates || !Array.isArray(templates)) return {};
    return templates.reduce((acc, template) => {
      const category = template.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(template);
      return acc;
    }, {});
  }, [templates]);

  // Get unique categories
  const categories = useMemo(() => {
    return Object.keys(groupedTemplates).sort();
  }, [groupedTemplates]);

  // Set initial category from data
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory);
      setForm((prev) => ({ ...prev, category: firstCategory }));
    }
  }, [categories, activeCategory]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeNewFile = (index) => {
    setSelectedFiles((files) => files.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index) => {
    const removed = existingAttachments[index];
    setRemovedAttachments((prev) => [...prev, removed.filename]);
    setExistingAttachments((files) => files.filter((_, i) => i !== index));
  };

  // Update handleSave function
  const handleSave = async () => {
    if (!form.template_name || !form.subject || !form.body) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("template_name", form.template_name);
    formData.append("subject", form.subject);
    formData.append("body", convertToEmailHTML(form.body));
    formData.append("category", form.category);

    // Add new fields
    if (form.sender_email) {
      formData.append("sender_email", form.sender_email);
    }

    if (form.cc_emails) {
      // Convert comma-separated emails to array
      const ccEmails = form.cc_emails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);
      formData.append("cc_emails", JSON.stringify(ccEmails));
    }

    selectedFiles.forEach((file) => {
      formData.append("attachments", file);
    });

    if (editing) {
      if (existingAttachments.length > 0) {
        formData.append("keep_existing_attachments", "true");
      }
      if (removedAttachments.length > 0) {
        formData.append(
          "removed_attachments",
          JSON.stringify(removedAttachments)
        );
      }
    }

    const result = editing
      ? await updateTemplate(editing.id, formData)
      : await createTemplate(formData);

    if (result.success) {
      toast.success(result.message);
      resetForm();
    } else {
      toast.error("Failed to save: " + result.message);
    }
  };

  const resetForm = () => {
    setForm({
      template_name: "",
      subject: "",
      body: "",
      category: activeCategory || "general",
      sender_email: "",
      cc_emails: "",
    });
    setSelectedFiles([]);
    setExistingAttachments([]);
    setRemovedAttachments([]);
    setEditing(null);
  };

  // Update handleDelete function
  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Delete this template?"); // Keep confirmation dialog
    if (!shouldDelete) return;

    const deletePromise = deleteTemplate(id);

    toast.promise(deletePromise, {
      loading: "Deleting template...",
      success: "Template deleted successfully",
      error: "Failed to delete template",
    });
  };

  const handleEdit = (template) => {
    setEditing(template);
    setForm({
      template_name: template.template_name,
      subject: template.subject,
      body: template.body,
      // category: editing ? template.category : "general", // Set to 'general' not empty string
      category: template.category,
      sender_email: template.sender_email || "",
      cc_emails: Array.isArray(template.cc_emails)
        ? template.cc_emails.join(", ")
        : template.cc_emails || "",
    });

    // Always reset attachment states first
    setExistingAttachments([]);
    setSelectedFiles([]);
    setRemovedAttachments([]);
    if (template.attachments) {
      try {
        let attachments = template.attachments;

        // If it's a string, parse it
        if (typeof attachments === "string") {
          attachments = JSON.parse(attachments);
        }

        // Make sure it's an array before setting
        if (Array.isArray(attachments) && attachments.length > 0) {
          setExistingAttachments(attachments);
        }
      } catch (err) {
        console.error("Error parsing attachments:", err);
        setExistingAttachments([]);
      }
    } else {
      setExistingAttachments([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {editing ? "Edit Template" : "Create New Template"}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={form.template_name}
                onChange={(e) =>
                  setForm({ ...form, template_name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Welcome Email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="placement">Placement</option>
                <option value="event">Event</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Default Sender Email
            </label>
            <input
              type="email"
              value={form.sender_email || ""}
              onChange={(e) =>
                setForm({ ...form, sender_email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="sender@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              CC Email Addresses
            </label>
            <input
              type="text"
              value={form.cc_emails || ""}
              onChange={(e) => setForm({ ...form, cc_emails: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="email1@example.com, email2@example.com"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple emails with commas
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Welcome to our platform"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Body (HTML)
            </label>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Body (HTML)
              </label>
              <CKEditorEmail
                content={form.body}
                onChange={(html) =>
                  setForm((prev) => ({ ...prev, body: html }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Attachments
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                  Add Files
                </button>
                <span className="text-sm text-gray-500">
                  Max 5 files, 10MB each
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

              {/* Existing Attachments (when editing) */}
              {existingAttachments.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-900 mb-2">
                    Existing Attachments
                  </p>
                  <div className="space-y-2">
                    {existingAttachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-2 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-700">
                            {file.filename}
                          </span>
                        </div>
                        <button
                          onClick={() => removeExistingAttachment(index)}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-semibold text-green-900 mb-2">
                    New Files to Upload
                  </p>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-2 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeNewFile(index)}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-all shadow-lg"
            >
              <Save className="w-4 h-4" />
              {editing ? "Update" : "Save"} Template
            </button>
            {editing && (
              <button
                onClick={resetForm}
                className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeCategory === category
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {groupedTemplates[category]?.length || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid - Only show active category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groupedTemplates[activeCategory]?.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">
                  {template.template_name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {template.category}
                  </span>
                  {template.attachments && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      <Paperclip className="w-3 h-3" />
                      {/* Safely parse attachments */}
                      {(() => {
                        try {
                          const attachments =
                            typeof template.attachments === "string"
                              ? JSON.parse(template.attachments)
                              : template.attachments;
                          return `${attachments.length} files`;
                        } catch (err) {
                          console.error("Error parsing attachments:", err);
                          return "0 files";
                        }
                      })()}
                    </span>
                  )}
                  {template.sender_email && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      <Mail className="w-3 h-3" />
                      {template.sender_email}
                    </span>
                  )}
                  {template.cc_emails && template.cc_emails.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      <Users className="w-3 h-3" />
                      {Array.isArray(template.cc_emails)
                        ? `${template.cc_emails.length} CC`
                        : `${template.cc_emails.split(",").length} CC`}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(template)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {(!groupedTemplates[activeCategory] ||
          groupedTemplates[activeCategory].length === 0) && (
          <div className="col-span-2 text-center py-12 text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No templates in the {activeCategory} category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
