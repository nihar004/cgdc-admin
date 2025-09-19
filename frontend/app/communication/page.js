"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Send,
  Mail,
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  Calendar,
  Search,
  X,
  ExternalLink,
  Copy,
  Upload,
  Users,
} from "lucide-react";
import axios from "axios";

const CommunicationSystem = () => {
  const [activeTab, setActiveTab] = useState("mail");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [events, setEvents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [emails, setEmails] = useState([]);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [emailsRes, formsRes, eventsRes, companiesRes, hello] =
        await Promise.all([
          axios.get("http://localhost:5000/emails/campaigns"),
          axios.get("http://localhost:5000/forms"),
          axios.get("http://localhost:5000/events"),
          axios.get("http://localhost:5000/companies"),
          axios.get("http://localhost:5000/emails/active-events"),
        ]);

      // Access data directly from response.data
      if (emailsRes.data.success) setEmails(emailsRes.data.data);
      if (formsRes.data.success) setForms(formsRes.data.data);
      if (eventsRes.data.success) setEvents(eventsRes.data.data);
      if (companiesRes.data.success) setCompanies(companiesRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [newEmail, setNewEmail] = useState({
    title: "",
    subject: "",
    body_template: "",
    email_type: "general",
    event_id: "",
    form_id: "",
    scheduled_at: "",
    manual_recipients: [],
    use_template: false,
    template_data: {},
  });

  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    form_url: "",
    type: "application",
    company_id: "",
    event_id: "",
    deadline: "",
    allow_edit: false,
    target_departments: [],
    target_batches: [],
  });

  const [csvFile, setCsvFile] = useState(null);

  const statusColors = {
    sent: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    scheduled: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    closed: "bg-red-100 text-red-800",
    draft_form: "bg-gray-100 text-gray-800",
  };

  const typeColors = {
    company_notification: "bg-blue-50 text-blue-700",
    event_notification: "bg-purple-50 text-purple-700",
    interview_schedule: "bg-orange-50 text-orange-700",
    general: "bg-gray-50 text-gray-700",
    application: "bg-green-50 text-green-700",
    feedback: "bg-yellow-50 text-yellow-700",
    survey: "bg-indigo-50 text-indigo-700",
    attendance: "bg-pink-50 text-pink-700",
    custom: "bg-teal-50 text-teal-700",
  };

  const filteredEmails = emails.filter((email) => {
    const matchesSearch = email.subject
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || email.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || form.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getEmailStats = () => {
    const totalSent = emails.reduce(
      (sum, email) => sum + email.total_recipients,
      0
    );
    const sentCount = emails.filter((e) => e.status === "sent").length;
    const scheduledCount = emails.filter(
      (e) => e.status === "scheduled"
    ).length;

    return { totalSent, sentCount, scheduledCount };
  };

  const getFormStats = () => {
    const totalForms = forms.length;
    const activeForms = forms.filter((f) => f.status === "active").length;
    const totalResponses = forms.reduce(
      (sum, form) => sum + (form.response_count || 0),
      0
    );
    const avgResponses =
      totalForms > 0 ? Math.round(totalResponses / totalForms) : 0;

    return { totalForms, activeForms, totalResponses, avgResponses };
  };

  const emailStats = getEmailStats();
  const formStats = getFormStats();

  const handleSendEmail = async () => {
    try {
      if (!newEmail.title || !newEmail.subject || !newEmail.body_template) {
        alert("Please fill in all required fields");
        return;
      }

      const emailPayload = {
        ...newEmail,
        recipient_criteria: {
          departments: [],
          batch_years: [],
          min_cgpa: null,
          max_backlogs: null,
        },
        template_data: {},
      };

      const response = await axios.post(
        "http://localhost:5000/emails/campaigns",
        emailPayload
      );

      if (response.data.success) {
        fetchData();
        setNewEmail({
          title: "",
          subject: "",
          body_template: "",
          email_type: "general",
          event_id: "",
          form_id: "",
          scheduled_at: "",
          manual_recipients: [],
          use_template: false,
          template_data: {},
        });
        setShowCreateModal(false);
        alert("Email campaign created successfully!");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert(
        "Error sending email: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCreateForm = async () => {
    try {
      if (!newForm.title || !newForm.description || !newForm.form_url) {
        alert("Please fill in all required fields");
        return;
      }

      const formPayload = {
        ...newForm,
        target_departments: newForm.target_departments,
        target_batch_years: newForm.target_batches,
      };

      const response = await axios.post(
        "http://localhost:5000/forms",
        formPayload
      );

      if (response.data.success) {
        fetchData();
        setNewForm({
          title: "",
          description: "",
          form_url: "",
          type: "application",
          company_id: "",
          event_id: "",
          deadline: "",
          allow_edit: false,
          target_departments: [],
          target_batches: [],
        });
        setShowFormModal(false);
        alert("Form created successfully!");
      }
    } catch (error) {
      console.error("Error creating form:", error);
      alert(
        "Error creating form: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCsvUpload = async (formId) => {
    if (!csvFile) {
      alert("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("studentFile", csvFile);

    try {
      const response = await axios.post(
        `http://localhost:5000/forms/${formId}/upload-students`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert(`Successfully processed ${response.data.message}`);
        setCsvFile(null);
        fetchData();
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      alert(
        "Error uploading CSV: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/forms/${formId}`
      );
      if (response.data.success) {
        fetchData();
        alert("Form deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting form:", error);
      alert(
        "Error deleting form: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleFormStatusChange = async (formId, newStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/forms/${formId}/status`,
        {
          status: newStatus,
        }
      );
      if (response.data.success) {
        fetchData();
        alert("Form status updated successfully");
      }
    } catch (error) {
      console.error("Error updating form status:", error);
      alert(
        "Error updating form status: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDeleteEmail = async (emailId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/emails/campaigns/${emailId}`
      );
      if (response.data.success) {
        fetchData();
        alert("Email campaign deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting email campaign:", error);
      alert(
        "Error deleting email campaign: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const copyFormLink = (url) => {
    navigator.clipboard.writeText(url);
    alert("Form link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading communication hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Communication System
              </h1>
              <p className="text-gray-600 mt-1">
                Manage emails and forms for student communications
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Mail size={20} />
                Send Email
              </button>
              <button
                onClick={() => setShowFormModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FileText size={20} />
                Create Form
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {activeTab === "mail" ? (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">
                      Total Emails Sent
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {emailStats.totalSent}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Send className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">
                      Sent Campaigns
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {emailStats.sentCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Calendar className="text-yellow-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">
                      Scheduled
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {emailStats.scheduledCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">
                      Total Recipients
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {emailStats.totalSent}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">
                      Total Forms
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {formStats.totalForms}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">
                      Active Forms
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {formStats.activeForms}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Users className="text-yellow-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">
                      Total Responses
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {formStats.totalResponses}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">
                      Avg. Responses
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {formStats.avgResponses}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tabs and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["mail", "forms"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab === "mail" ? <Mail size={20} /> : <FileText size={20} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {activeTab === "mail" ? (
                  <>
                    <option value="sent">Sent</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                  </>
                ) : (
                  <>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "mail" ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmails.map((email) => (
                    <tr key={email.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {email.subject}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[email.email_type]}`}
                            >
                              {email.email_type.replace("_", " ")}
                            </span>
                            {email.event_title && (
                              <span className="text-xs text-gray-500">
                                • {email.event_title}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium">Recipients:</span>{" "}
                            {email.total_recipients}
                          </div>
                          {email.event_title && (
                            <div>
                              <span className="font-medium">Event:</span>{" "}
                              {email.event_title}
                            </div>
                          )}
                          {email.form_title && (
                            <div>
                              <span className="font-medium">Form:</span>{" "}
                              {email.form_title}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[email.status]}`}
                        >
                          {email.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} className="text-gray-400" />
                          {email.sent_at
                            ? new Date(email.sent_at).toLocaleDateString()
                            : email.scheduled_at
                              ? new Date(
                                  email.scheduled_at
                                ).toLocaleDateString()
                              : "Not sent yet"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEmail(email.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {form.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {form.description}
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[form.status]}`}
                      >
                        {form.status}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[form.type]}`}
                      >
                        {form.type}
                      </span>
                    </div>

                    {form.company_name && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Company:</strong> {form.company_name}
                      </div>
                    )}

                    {form.event_title && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Event:</strong> {form.event_title}
                      </div>
                    )}

                    <div className="text-sm text-gray-600 mb-3">
                      <strong>Responses:</strong> {form.response_count || 0}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>
                        Created:{" "}
                        {new Date(form.created_at).toLocaleDateString()}
                      </span>
                      {form.deadline && (
                        <span className="text-red-600">
                          Deadline:{" "}
                          {new Date(form.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-blue-600">
                        {form.response_count || 0} responses
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyFormLink(form.form_url)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Copy link"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="View form"
                          onClick={() => window.open(form.form_url, "_blank")}
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Upload CSV"
                          onClick={() =>
                            document
                              .getElementById(`csv-upload-${form.id}`)
                              .click()
                          }
                        >
                          <Upload size={16} />
                        </button>
                        <input
                          type="file"
                          id={`csv-upload-${form.id}`}
                          accept=".csv"
                          className="hidden"
                          onChange={(e) => {
                            setCsvFile(e.target.files[0]);
                            handleCsvUpload(form.id);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Email Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Send Email</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    value={newEmail.title}
                    onChange={(e) =>
                      setNewEmail({ ...newEmail, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Email campaign title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={newEmail.subject}
                    onChange={(e) =>
                      setNewEmail({ ...newEmail, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Email subject"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Type
                    </label>
                    <select
                      value={newEmail.email_type}
                      onChange={(e) =>
                        setNewEmail({ ...newEmail, email_type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="company_notification">
                        Company Notification
                      </option>
                      <option value="event_notification">
                        Event Notification
                      </option>
                      <option value="interview_schedule">
                        Interview Schedule
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event (Optional)
                    </label>
                    <select
                      value={newEmail.event_id}
                      onChange={(e) =>
                        setNewEmail({ ...newEmail, event_id: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Event</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {newEmail.event_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form (Optional)
                    </label>
                    <select
                      value={newEmail.form_id}
                      onChange={(e) =>
                        setNewEmail({ ...newEmail, form_id: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Form</option>
                      {forms
                        .filter((form) => form.event_id == newEmail.event_id)
                        .map((form) => (
                          <option key={form.id} value={form.id}>
                            {form.title}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content *
                  </label>
                  <textarea
                    value={newEmail.body_template}
                    onChange={(e) =>
                      setNewEmail({
                        ...newEmail,
                        body_template: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="8"
                    placeholder="Write your email content here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send Time
                  </label>
                  <select
                    value={newEmail.scheduled_at ? "schedule" : "now"}
                    onChange={(e) => {
                      if (e.target.value === "now") {
                        setNewEmail({ ...newEmail, scheduled_at: "" });
                      } else {
                        const now = new Date();
                        now.setHours(now.getHours() + 1);
                        setNewEmail({
                          ...newEmail,
                          scheduled_at: now.toISOString().slice(0, 16),
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="now">Send Now</option>
                    <option value="schedule">Schedule for Later</option>
                  </select>
                </div>

                {newEmail.scheduled_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={newEmail.scheduled_at}
                      onChange={(e) =>
                        setNewEmail({
                          ...newEmail,
                          scheduled_at: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Send size={16} />
                  {newEmail.scheduled_at ? "Schedule Email" : "Send Email"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Form Modal */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Create New Form
                </h2>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Title *
                  </label>
                  <input
                    type="text"
                    value={newForm.title}
                    onChange={(e) =>
                      setNewForm({ ...newForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter form title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newForm.description}
                    onChange={(e) =>
                      setNewForm({ ...newForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Form description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form URL *
                  </label>
                  <input
                    type="url"
                    value={newForm.form_url}
                    onChange={(e) =>
                      setNewForm({ ...newForm, form_url: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://forms.google.com/your-form"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form Type
                    </label>
                    <select
                      value={newForm.type}
                      onChange={(e) =>
                        setNewForm({ ...newForm, type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="application">Application</option>
                      <option value="feedback">Feedback</option>
                      <option value="survey">Survey</option>
                      <option value="attendance">Attendance</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company (Optional)
                    </label>
                    <select
                      value={newForm.company_id}
                      onChange={(e) =>
                        setNewForm({ ...newForm, company_id: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.company_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event (Optional)
                  </label>
                  <select
                    value={newForm.event_id}
                    onChange={(e) =>
                      setNewForm({ ...newForm, event_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eligible Departments
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"].map(
                      (department) => (
                        <label
                          key={department}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={newForm.target_departments.includes(
                              department
                            )}
                            onChange={(e) => {
                              const updatedDepartments = e.target.checked
                                ? [...newForm.target_departments, department]
                                : newForm.target_departments.filter(
                                    (d) => d !== department
                                  );
                              setNewForm({
                                ...newForm,
                                target_departments: updatedDepartments,
                              });
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {department}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eligible Batches
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[2023, 2024, 2025, 2026].map((batch) => (
                      <label
                        key={batch}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={newForm.target_batches.includes(batch)}
                          onChange={(e) => {
                            const updatedBatches = e.target.checked
                              ? [...newForm.target_batches, batch]
                              : newForm.target_batches.filter(
                                  (b) => b !== batch
                                );
                            setNewForm({
                              ...newForm,
                              target_batches: updatedBatches,
                            });
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{batch}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={newForm.deadline}
                      onChange={(e) =>
                        setNewForm({ ...newForm, deadline: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      checked={newForm.allow_edit}
                      onChange={(e) =>
                        setNewForm({ ...newForm, allow_edit: e.target.checked })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      id="allow-edit"
                    />
                    <label
                      htmlFor="allow-edit"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Allow editing responses
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateForm}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <FileText size={16} />
                  Create Form
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationSystem;
