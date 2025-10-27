"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  FileText,
  Calendar,
  Building2,
  Briefcase,
  AlertCircle,
} from "lucide-react";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const CreateFormModal = ({
  setShowCreateForm,
  fetchForms,
  selectedBatch,
  isEditing = false,
  formData: initialFormData = null,
}) => {
  const [formData, setFormData] = useState(
    initialFormData
      ? {
          title: initialFormData.title || "",
          type: initialFormData.type || "application",
          event_id: initialFormData.event_id?.toString() || "",
          batch_year: selectedBatch,
        }
      : {
          title: "",
          type: "application",
          event_id: "",
          batch_year: selectedBatch,
        }
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  // Fetch fresh events when modal opens
  useEffect(() => {
    if (selectedBatch) {
      const loadEvents = async () => {
        try {
          // Add include_event parameter when in edit mode
          const url =
            isEditing && formData.event_id
              ? `${backendUrl}/forms/events/${selectedBatch}?include_event=${formData.event_id}`
              : `${backendUrl}/forms/events/${selectedBatch}`;

          const response = await axios.get(url);
          setEvents(response.data.data || []);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      loadEvents();
    }
  }, [selectedBatch, isEditing]);

  // Add this debug effect to monitor the form data
  useEffect(() => {
    if (isEditing) {
      console.log("Initial Form Data received:", initialFormData);
      console.log("Form Data set:", formData);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Form title is required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        title: formData.title.trim(),
        type: formData.type,
        event_id: formData.event_id || null,
        batch_year: selectedBatch,
      };

      const url = isEditing
        ? `${backendUrl}/forms/${initialFormData.id}`
        : `${backendUrl}/forms`;

      const response = isEditing
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      // Only refresh forms list
      await fetchForms();
      setShowCreateForm(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to ${isEditing ? "update" : "create"} form`;
      setError(errorMessage);
      console.error(`Error ${isEditing ? "updating" : "creating"} form:`, err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowCreateForm(false);
    setError(null);
  };

  const selectedEvent = events.find((event) => event.id == formData.event_id);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {isEditing ? "Edit Form" : "Create New Form"}
              </h3>
              <p className="text-sm text-slate-600">
                For Batch {selectedBatch}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            disabled={submitting}
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-5">
          {/* Form Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <FileText className="h-4 w-4" />
              Form Title *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Goldman Sachs Application Form"
              disabled={submitting}
            />
          </div>

          {/* Form Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Form Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  value: "application",
                  label: "Application",
                  color: "purple-500",
                },
                { value: "survey", label: "Survey", color: "blue-500" },
                { value: "feedback", label: "Feedback", color: "green-500" },
                {
                  value: "attendance",
                  label: "Attendance",
                  color: "orange-500",
                },
                { value: "custom", label: "Custom", color: "gray-500" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  disabled={submitting}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    formData.type === type.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Event Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Calendar className="h-4 w-4" />
              Related Event
            </label>
            <select
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-white"
              value={formData.event_id}
              onChange={(e) =>
                setFormData({ ...formData, event_id: e.target.value })
              }
              disabled={submitting}
            >
              <option value="">No event (standalone form)</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                  {event.company_name && ` - ${event.company_name}`}
                  {event.position_title && ` (${event.position_title})`}
                </option>
              ))}
            </select>

            {/* Event Details Preview */}
            {selectedEvent && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-blue-800 font-medium mb-1">
                    <Calendar className="h-3 w-3" />
                    {selectedEvent.title}
                  </div>
                  <div className="space-y-1">
                    {selectedEvent.company_name && (
                      <div className="flex items-center gap-2 text-blue-700">
                        <Building2 className="h-3 w-3" />
                        <span>{selectedEvent.company_name}</span>
                      </div>
                    )}
                    {selectedEvent.position_title && (
                      <div className="flex items-center gap-2 text-blue-700">
                        <Briefcase className="h-3 w-3" />
                        <span>{selectedEvent.position_title}</span>
                      </div>
                    )}
                    {selectedEvent.event_date && (
                      <div className="text-blue-600 text-xs">
                        Date:{" "}
                        {new Date(
                          selectedEvent.event_date
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 text-sm font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-medium text-sm"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !formData.title.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </div>
              ) : isEditing ? (
                "Update Form"
              ) : (
                "Create Form"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFormModal;
