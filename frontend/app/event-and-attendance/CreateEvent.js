import { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Building2,
  Users,
  FileText,
  Star,
  Mic,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  GraduationCap,
} from "lucide-react";
import { useBatchContext } from "../../context/BatchContext";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Update the initial form state to handle backend data format
function CreateEvent({
  onBack,
  onEventCreated,
  isEditing = false,
  eventData = null,
}) {
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // If it's already in YYYY-MM-DD format, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // If it's a full datetime string, extract just the date part
    return dateString.split("T")[0];
  };

  // Helper function to format time from backend format
  const formatTimeForInput = (timeString) => {
    if (!timeString) return "";

    // If already in HH:MM format, return as-is
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    // If in HH:MM:SS format, strip seconds
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
      return timeString.substring(0, 5);
    }

    // If in 12-hour format (HH:MM AM/PM)
    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);

    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  };

  // Helper function to parse targetSpecializations from "{CSE}" format
  const parseSpecializations = (specializations) => {
    if (!specializations) return [];
    return specializations.replace(/{|}/g, "").split(",");
  };

  // 1. Correct initialization for edit mode
  const [formData, setFormData] = useState(
    isEditing && eventData
      ? {
          eventCategory:
            eventData.type === "company_round" ? "company_event" : "cgdc_event",
          title: eventData.title || "",
          eventType: eventData.event_type || "other",
          date: formatDateForInput(eventData.date) || "",
          startTime: formatTimeForInput(eventData.time) || "",
          endTime: formatTimeForInput(eventData.endTime) || "",
          venue: eventData.venue || "",
          mode: eventData.mode || "offline",
          isMandatory: eventData.isMandatory || false,
          companyId: eventData.company_id
            ? eventData.company_id.toString()
            : "",
          positionIds: eventData.position_ids
            ? eventData.position_ids.map(String)
            : [],
          targetSpecializations: parseSpecializations(
            eventData.targetSpecializations
          ),
          targetAcademicYears: eventData.targetAcademicYears || [],
          speakerDetails: eventData.speakerDetails || {
            speaker: "",
            designation: "",
          },
          roundType: eventData.roundType || "",
        }
      : {
          eventCategory: "",
          title: "",
          eventType: "other",
          date: "", // Single date field
          startTime: "", // Just time
          endTime: "", // Just time
          venue: "",
          mode: "offline",
          isMandatory: false,
          companyId: "",
          positionIds: [],
          targetSpecializations: [],
          targetAcademicYears: [],
          speakerDetails: {
            speaker: "",
            designation: "",
          },
          roundType: "",
        }
  );

  const [companiesWithPositions, setCompaniesWithPositions] = useState([]);
  const [selectedCompanyPositions, setSelectedCompanyPositions] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");
  const { selectedBatch } = useBatchContext();

  // Placement-focused events (company-related)
  const companyEventTypes = [
    // General
    { value: "other", label: "Other" },
    { value: "student_registration", label: "Student Registration" },

    // Pre-placement & Presentation
    { value: "pre_placement_talk", label: "Pre-Placement Talk" },
    { value: "company_presentation", label: "Company Presentation" },

    // Resume & Screening
    { value: "resume_screening", label: "Resume Screening" },

    // Assessments
    { value: "online_assessment", label: "Online Assessment" },
    { value: "aptitude_test", label: "Aptitude Test" },
    { value: "coding_test", label: "Coding Test" },
    { value: "technical_mcq", label: "Technical MCQ" },

    // Interviews
    { value: "technical_round_1", label: "Technical Round 1" },
    { value: "technical_round_2", label: "Technical Round 2" },
    { value: "technical_round_3", label: "Technical Round 3" },
    { value: "group_discussion", label: "Group Discussion" },
    { value: "case_study", label: "Case Study" },
    { value: "presentation_round", label: "Presentation Round" },
    { value: "hr_round", label: "HR Round" },
    { value: "final_round", label: "Final Round" },
  ];

  // CGDC-organized or non-placement events
  const cgdcEventTypes = [
    { value: "other", label: "Other" },

    // Training & Development
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "skill_development", label: "Skill Development" },
    { value: "career_guidance", label: "Career Guidance" },
    { value: "mock_interview", label: "Mock Interview" },
    { value: "resume_building", label: "Resume Building" },

    // Awareness or Talks
    { value: "pre_placement_talk", label: "Pre-Placement Talk" },
    { value: "company_presentation", label: "Company Presentation" },
  ];

  const specializations = ["CSE", "E.Com", "ME"];

  const modes = [
    { value: "offline", label: "Offline" },
    { value: "online", label: "Online" },
    { value: "hybrid", label: "Hybrid" },
  ];

  // Fetch data on component mount
  useEffect(() => {
    if (selectedBatch) {
      fetchCompaniesWithPositions();
    }
    fetchBatches();
  }, [selectedBatch]);

  // Auto-set academic years for company events
  useEffect(() => {
    if (formData.eventCategory === "company_event" && selectedBatch) {
      setFormData((prev) => ({
        ...prev,
        targetAcademicYears: [selectedBatch.toString()],
      }));
    } else if (formData.eventCategory === "cgdc_event") {
      setFormData((prev) => ({
        ...prev,
        targetAcademicYears: [],
      }));
    }
  }, [formData.eventCategory, selectedBatch]);

  // Update positions when company is selected
  useEffect(() => {
    if (formData.companyId) {
      const selectedCompany = companiesWithPositions.find(
        (company) => company.company_id.toString() === formData.companyId
      );
      setSelectedCompanyPositions(selectedCompany?.positions || []);
      // Only reset positionId when companyId changes by user (not on initial load)
      if (!isEditing) {
        setFormData((prev) => ({ ...prev, positionIds: [] }));
      }
    } else {
      setSelectedCompanyPositions([]);
      if (!isEditing) {
        setFormData((prev) => ({ ...prev, positionIds: [] }));
      }
    }
    // eslint-disable-next-line
  }, [formData.companyId, companiesWithPositions]);

  // When editing, set selectedCompanyPositions after companies are loaded
  useEffect(() => {
    if (isEditing && formData.companyId && companiesWithPositions.length > 0) {
      const selectedCompany = companiesWithPositions.find(
        (company) => company.company_id.toString() === formData.companyId
      );
      setSelectedCompanyPositions(selectedCompany?.positions || []);
    }
    // eslint-disable-next-line
  }, [isEditing, formData.companyId, companiesWithPositions]);

  const fetchCompaniesWithPositions = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/companies/with-active-positions/${selectedBatch}`
      );
      if (response.data.success) {
        setCompaniesWithPositions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching companies with positions:", error);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${backendUrl}/batches`);
      if (response.data) {
        const years = response.data.map((batch) => batch.year.toString());
        setAcademicYears(years.sort());
      }
    } catch (error) {
      console.error("Error fetching batch years:", error);
    }
  };

  // Update the handleInputChange function to maintain "other" as default
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("speakerDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        speakerDetails: {
          ...prev.speakerDetails,
          [field]: value,
        },
      }));
    } else if (name === "eventCategory") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        eventType: "other", // Always set to "other" when changing category
        companyId: "",
        positionIds: [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => {
      const currentValues = prev[name];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return { ...prev, [name]: newValues };
    });
  };

  // Update the form validation to match API requirements
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.title.trim()) newErrors.title = "Title is required";

    // Time validation
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    // Target audience validation for cgdc events
    if (formData.eventCategory === "cgdc_event") {
      if (
        !formData.targetAcademicYears ||
        formData.targetAcademicYears.length === 0
      ) {
        newErrors.targetAcademicYears =
          "At least one academic year must be selected";
      }

      if (
        !formData.targetSpecializations ||
        formData.targetSpecializations.length === 0
      ) {
        newErrors.targetSpecializations =
          "At least one specialization must be selected";
      }
    }

    // Company event validation
    if (formData.eventCategory === "company_event") {
      if (!isEditing) {
        // ADD THIS CHECK
        if (!formData.companyId) newErrors.companyId = "Company is required";
        if (!formData.positionIds || formData.positionIds.length === 0)
          newErrors.positionIds = "At least one position must be selected";
      }
      if (!formData.roundType) newErrors.roundType = "Round type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update the handleSubmit function to match API payload structure
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     setSubmitStatus("error");
  //     return;
  //   }

  //   setLoading(true);
  //   setSubmitStatus("");

  //   try {
  //     // Format time strings correctly for backend
  //     const formatTimeForBackend = (time) => {
  //       if (!time) return null;
  //       // Add seconds to match SQL TIME format
  //       return `${time}:00`;
  //     };

  //     const eventPayload = {
  //       title: formData.title.trim(),
  //       eventType: formData.eventType,
  //       date: formData.date, // Send date as YYYY-MM-DD
  //       startTime: formatTimeForBackend(formData.startTime), // Send time as HH:MM:SS
  //       endTime: formatTimeForBackend(formData.endTime), // Send time as HH:MM:SS
  //       venue: formData.venue.trim(),
  //       mode: formData.mode,
  //       isPlacementEvent: formData.eventCategory === "company_event",
  //       isMandatory: formData.isMandatory,
  //       companyId:
  //         formData.eventCategory === "company_event"
  //           ? formData.companyId
  //           : null,
  //       positionIds:
  //         formData.eventCategory === "company_event"
  //           ? formData.positionIds.map(Number)
  //           : null,
  //       roundType:
  //         formData.eventCategory === "company_event"
  //           ? formData.roundType
  //           : null,
  //       targetSpecializations: formData.targetSpecializations,
  //       targetAcademicYears: formData.targetAcademicYears.map(Number),
  //       speakerDetails: Object.values(formData.speakerDetails).some((val) =>
  //         val.trim()
  //       )
  //         ? formData.speakerDetails
  //         : null,
  //     };

  //     const response = await axios[isEditing ? "put" : "post"](
  //       `${backendUrl}/events${isEditing ? `/${eventData.id}` : ""}`,
  //       eventPayload
  //     );

  //     if (response.data.success) {
  //       setSubmitStatus("success");
  //       setTimeout(() => {
  //         onEventCreated?.(response.data.data);
  //         onBack?.();
  //       }, 1500);
  //     }
  //   } catch (error) {
  //     console.error("Error saving event:", error);
  //     setSubmitStatus("error");
  //     setErrors({
  //       submit: error.response?.data?.message || "Failed to save event",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // Update the handleSubmit function - replace the formatTimeForBackend section:

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    setLoading(true);
    setSubmitStatus("");

    try {
      // Format time strings correctly for backend
      const formatTimeForBackend = (time) => {
        if (!time) return null;
        // Add seconds to match SQL TIME format
        return `${time}:00`;
      };

      const eventPayload = {
        title: formData.title.trim(),
        eventType: formData.eventType,
        date: formData.date || null,
        startTime: formatTimeForBackend(formData.startTime),
        endTime: formatTimeForBackend(formData.endTime),
        venue: formData.venue.trim(),
        mode: formData.mode,
        isPlacementEvent: formData.eventCategory === "company_event",
        isMandatory: formData.isMandatory,
        companyId:
          formData.eventCategory === "company_event"
            ? formData.companyId
            : null,
        positionIds:
          formData.eventCategory === "company_event"
            ? formData.positionIds.map(Number)
            : null,
        roundType:
          formData.eventCategory === "company_event"
            ? formData.roundType
            : null,
        targetSpecializations: formData.targetSpecializations,
        targetAcademicYears: formData.targetAcademicYears.map(Number),
        speakerDetails: Object.values(formData.speakerDetails).some((val) =>
          val.trim()
        )
          ? formData.speakerDetails
          : null,
      };

      const response = await axios[isEditing ? "put" : "post"](
        `${backendUrl}/events${isEditing ? `/${eventData.id}` : ""}`,
        eventPayload
      );

      if (response.data.success) {
        setSubmitStatus("success");
        setTimeout(() => {
          onEventCreated?.(response.data.data);
          onBack?.();
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving event:", error);
      setSubmitStatus("error");
      setErrors({
        submit: error.response?.data?.message || "Failed to save event",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentEventTypes = () => {
    return formData.eventCategory === "company_event"
      ? companyEventTypes
      : cgdcEventTypes;
  };

  // Update component title based on mode
  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 pb-4 border-b border-gray-200/50">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
              <FileText className="h-6 w-6" />
            </div>
            {isEditing ? "Edit Event" : "Create New Event"}
          </h2>
          {selectedBatch && (
            <p className="text-sm text-gray-600 mt-1">
              Creating event for Batch {selectedBatch}
            </p>
          )}
        </div>
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-all duration-200 group"
        >
          <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* Success/Error Messages */}
      {submitStatus === "success" && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <CheckCircle className="h-5 w-5 mr-2" />
            Event created successfully! Redirecting...
          </div>
        </div>
      )}

      {submitStatus === "error" && errors.submit && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            {errors.submit}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Category Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-white/30 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Event Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  eventCategory: "company_event",
                }))
              }
              className={`p-6 border-2 rounded-xl transition-all duration-200 text-left ${
                formData.eventCategory === "company_event"
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    formData.eventCategory === "company_event"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Company Event</h3>
                  <p className="text-sm text-gray-600">
                    Placement drives, interviews, company visits
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  eventCategory: "cgdc_event",
                }))
              }
              className={`p-6 border-2 rounded-xl transition-all duration-200 text-left ${
                formData.eventCategory === "cgdc_event"
                  ? "border-purple-500 bg-purple-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    formData.eventCategory === "cgdc_event"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">CGDC Event</h3>
                  <p className="text-sm text-gray-600">
                    Workshops, seminars, training sessions
                  </p>
                </div>
              </div>
            </button>
          </div>

          {errors.eventCategory && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.eventCategory}
            </p>
          )}
        </div>

        {/* Company & Position (only for company events) */}
        {formData.eventCategory === "company_event" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-white/30 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              Company & Position
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  disabled={isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.companyId ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select company</option>
                  {companiesWithPositions.map((company) => (
                    <option key={company.company_id} value={company.company_id}>
                      {company.company_name}
                    </option>
                  ))}
                </select>
                {errors.companyId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.companyId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position(s) *
                </label>
                <div className="space-y-2">
                  {selectedCompanyPositions.map((position) => (
                    <label
                      key={position.position_id}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.positionIds.includes(
                          position.position_id.toString()
                        )}
                        onChange={() =>
                          handleMultiSelectChange(
                            "positionIds",
                            position.position_id.toString()
                          )
                        }
                        disabled={isEditing}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {position.position_title}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.positionIds && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.positionIds}
                  </p>
                )}
                {selectedCompanyPositions.length === 0 &&
                  formData.companyId && (
                    <p className="text-sm text-gray-500 mt-2">
                      No positions available for this company
                    </p>
                  )}
              </div>
              {isEditing && formData.eventCategory === "company_event" && (
                <div className="md:col-span-2 mt-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start text-amber-800">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">
                          Company, Positions and Round Type are locked
                        </p>
                        <p>
                          Cannot modify company, positions or round type for
                          existing placement events to maintain round sequence
                          integrity. If you need to change these, please delete
                          this event and create a new one.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {formData.eventCategory === "company_event" && selectedBatch && (
                <div className="md:col-span-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center text-blue-800">
                      <Users className="h-5 w-5 mr-2" />
                      <span className="font-medium">
                        Target Audience: Batch {selectedBatch} (Automatically
                        selected for company events)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Basic Information - Only show if category is selected */}
        {formData.eventCategory && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-white/30 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.title ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  {getCurrentEventTypes().map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              {formData.eventCategory === "company_event" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Round Type *
                  </label>
                  <select
                    name="roundType"
                    value={formData.roundType}
                    onChange={handleInputChange}
                    disabled={
                      isEditing && formData.eventCategory === "company_event"
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="">Select round type</option>
                    <option value="first">First Round</option>
                    <option value="middle">Middle Round</option>
                    <option value="last">Last Round</option>
                  </select>
                  {errors.roundType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.roundType}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode *
                </label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  {modes.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.venue ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., Auditorium, Room 101, Online Platform"
                />
                {errors.venue && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.venue}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    name="isMandatory"
                    checked={formData.isMandatory}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    <Star className="h-4 w-4 inline mr-1" />
                    Mandatory attendance
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Date & Time */}
        {formData.eventCategory && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-white/30 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Date & Time
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.date ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.startTime ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.endTime ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={!formData.startTime}
                  required
                  min={formData.startTime}
                />
                {!formData.startTime && (
                  <p className="mt-1 text-xs text-gray-500">
                    Set start time first
                  </p>
                )}
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Speaker Details */}
        {formData.eventCategory && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-white/30 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Mic className="h-5 w-5 mr-2 text-blue-600" />
              Speaker Details (Optional)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker Name
                </label>
                <input
                  type="text"
                  name="speakerDetails.speaker"
                  value={formData.speakerDetails.speaker}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter speaker name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  name="speakerDetails.designation"
                  value={formData.speakerDetails.designation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="e.g., Senior Engineer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Target Audience (only for cgdc events) */}
        {formData.eventCategory === "cgdc_event" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-white/30 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Target Audience
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Academic Years * (Select at least one)
                </label>
                <div className="flex flex-wrap gap-2">
                  {academicYears.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() =>
                        handleMultiSelectChange("targetAcademicYears", year)
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        formData.targetAcademicYears.includes(year)
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
                {errors.targetAcademicYears && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.targetAcademicYears}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Target Specializations * (Select at least one)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {specializations.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() =>
                        handleMultiSelectChange("targetSpecializations", spec)
                      }
                      className={`px-4 py-2 rounded-lg text-sm text-left transition-all duration-200 ${
                        formData.targetSpecializations.includes(spec)
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
                {errors.targetSpecializations && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.targetSpecializations}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        {formData.eventCategory && (
          <div className="flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-200/50">
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-3 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="p-1 bg-white/20 rounded-lg">
                <Save className="h-4 w-4" />
              </div>
              {isEditing ? (
                <span>{loading ? "Updating..." : "Update Event"}</span>
              ) : (
                <span>{loading ? "Creating..." : "Create Event"}</span>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateEvent;
