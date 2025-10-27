import { useState } from "react";
import axios from "axios";
import {
  Building2,
  Globe,
  Linkedin,
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  MapPin,
  GraduationCap,
  Plus,
  Trash2,
  X,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Add this helper function at the top of your file, before the component
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  // Convert the date string to YYYY-MM-DD format
  return new Date(dateString).toISOString().split("T")[0];
};

const CompanyFormModal = ({
  batchYear,
  onClose,
  onSuccess,
  editData = null,
}) => {
  // Initialize form data with editData if provided, otherwise use default values
  const [formData, setFormData] = useState({
    company_name: editData?.company_name ?? "",
    company_description: editData?.company_description ?? "",
    sector: editData?.sector ?? "",
    is_marquee: editData?.is_marquee ?? false,
    website_url: editData?.website_url ?? "",
    linkedin_url: editData?.linkedin_url ?? "",
    primary_hr_name: editData?.primary_hr_name ?? "",
    primary_hr_designation: editData?.primary_hr_designation ?? "",
    primary_hr_email: editData?.primary_hr_email ?? "",
    primary_hr_phone: editData?.primary_hr_phone ?? "",
    scheduled_visit: formatDateForInput(editData?.scheduled_visit) ?? "",
    actual_arrival: formatDateForInput(editData?.actual_arrival) ?? "",
    glassdoor_rating: editData?.glassdoor_rating ?? "",
    work_locations: editData?.work_locations ?? "",
    min_cgpa: editData?.min_cgpa ?? "",
    max_backlogs: editData?.max_backlogs ?? "",
    bond_required: editData?.bond_required ?? false,
    account_owner: editData?.account_owner ?? "",
    allowed_specializations: editData?.allowed_specializations ?? [],
    positions: (editData?.positions ?? []).map((position) => ({
      position_title: position?.position_title ?? "",
      job_type: position?.job_type ?? "full_time",
      company_type: position?.company_type ?? "tech", // Add here instead
      package_range: position?.package_range ?? 0,
      internship_stipend_monthly: position?.internship_stipend_monthly ?? -1,
      selected_students: position?.selected_students ?? -1,
      rounds_start_date: formatDateForInput(position?.rounds_start_date) ?? "",
      rounds_end_date: formatDateForInput(position?.rounds_end_date) ?? "",
      documents: (position?.documents ?? []).map((doc) => ({
        id: doc?.id || null,
        document_type: doc?.document_type ?? "job_description",
        document_title: doc?.document_title ?? "",
        newDocumentFile: null,
        original_filename: doc?.original_filename ?? doc?.document_title ?? "",
        display_order: doc?.display_order ?? 1,
      })),
    })),
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const specializations = ["CSE", "ECE", "ME"];

  const sectors = [
    {
      value: "E-Commerce, Logistics and Business",
      label: "E-Commerce, Logistics and Business",
    },
    { value: "EdTech", label: "EdTech" },
    { value: "IT & Consulting", label: "IT & Consulting" },
    { value: "IT Service", label: "IT Service" },
    { value: "IT Software (Product)", label: "IT Software (Product)" },
    { value: "Others*", label: "Others*" },
  ];

  const jobTypes = [
    { value: "full_time", label: "Full Time" },
    { value: "internship", label: "Internship" },
    { value: "internship_plus_ppo", label: "Internship + PPO" },
  ];

  const documentTypes = [
    { value: "job_description", label: "Job Description" },
    { value: "salary_breakdown", label: "Salary Breakdown" },
    { value: "company_presentation", label: "Company Presentation" },
    { value: "bond_details", label: "Bond Details" },
    { value: "eligibility_criteria", label: "Eligibility Criteria" },
    { value: "other", label: "Other" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSpecializationToggle = (spec) => {
    setFormData((prev) => ({
      ...prev,
      allowed_specializations: prev.allowed_specializations.includes(spec)
        ? prev.allowed_specializations.filter((s) => s !== spec)
        : [...prev.allowed_specializations, spec],
    }));
  };

  const addPosition = () => {
    setFormData((prev) => ({
      ...prev,
      positions: [
        ...prev.positions,
        {
          position_title: "",
          job_type: "full_time",
          company_type: "tech", // Add here instead
          package_range: 0,
          internship_stipend_monthly: 0,
          selected_students: 0,
          rounds_start_date: "",
          rounds_end_date: "",
          documents: [],
        },
      ],
    }));
  };

  const removePosition = (index) => {
    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.filter((_, i) => i !== index),
    }));
  };

  const updatePosition = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos, i) =>
        i === index ? { ...pos, [field]: value } : pos
      ),
    }));
  };

  const addDocument = (positionIndex) => {
    const newDoc = {
      document_type: "job_description",
      document_title: "",
      newDocumentFile: "",
      file_type: "pdf",
      display_order: 1,
    };

    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos, i) =>
        i === positionIndex
          ? { ...pos, documents: [...pos.documents, newDoc] }
          : pos
      ),
    }));
  };

  const removeDocument = (positionIndex, docIndex) => {
    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos, i) =>
        i === positionIndex
          ? {
              ...pos,
              documents: pos.documents.filter((_, di) => di !== docIndex),
            }
          : pos
      ),
    }));
  };

  const updateDocument = (positionIndex, docIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.map((pos, i) =>
        i === positionIndex
          ? {
              ...pos,
              documents: pos.documents.map((doc, di) =>
                di === docIndex
                  ? {
                      ...doc,
                      [field]: value,
                      // Update original_filename when newDocumentFile is updated with a File
                      ...(field === "newDocumentFile" && value instanceof File
                        ? { original_filename: value.name }
                        : {}),
                    }
                  : doc
              ),
            }
          : pos
      ),
    }));
  };

  const handleDocumentChange = (positionIndex, docIndex, field, value) => {
    console.group("🔄 Handling Document Change");
    console.log("Change details:", {
      positionIndex,
      docIndex,
      field,
      value: field === "newDocumentFile" ? "File object" : value,
    });

    if (field === "newDocumentFile" && value instanceof File) {
      console.log("New file selected:", {
        filename: value.name,
        size: value.size,
        type: value.type,
      });
      updateDocument(positionIndex, docIndex, field, value);

      if (
        !formData.positions[positionIndex].documents[docIndex].document_title
      ) {
        const newTitle = value.name.split(".")[0];
        console.log("Setting document title from filename:", newTitle);
        updateDocument(positionIndex, docIndex, "document_title", newTitle);
      }
    } else {
      console.log("Updating other document field");
      updateDocument(positionIndex, docIndex, field, value);
    }

    console.groupEnd();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company_name) {
      newErrors.company_name = "Company name is required";
    }

    if (!formData.scheduled_visit) {
      newErrors.scheduled_visit = "Scheduled visit date is required";
    }

    // Validate that actual_arrival is after scheduled_visit if both exist
    if (formData.actual_arrival && formData.scheduled_visit) {
      if (
        new Date(formData.actual_arrival) < new Date(formData.scheduled_visit)
      ) {
        newErrors.actual_arrival =
          "Actual arrival cannot be before scheduled visit";
      }
    }

    if (
      formData.primary_hr_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primary_hr_email)
    ) {
      newErrors.primary_hr_email = "Invalid email format";
    }

    if (
      formData.glassdoor_rating &&
      (formData.glassdoor_rating < 0 || formData.glassdoor_rating > 5)
    ) {
      newErrors.glassdoor_rating = "Rating must be between 0 and 5";
    }

    if (
      formData.min_cgpa &&
      (formData.min_cgpa < 0 || formData.min_cgpa > 10)
    ) {
      newErrors.min_cgpa = "CGPA must be between 0 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // END DONE

  // Helper function to detect document changes
  const detectDocumentChanges = (existingDocs, newDocs) => {
    console.group("📄 Detecting Document Changes");
    console.log("Existing Docs:", existingDocs);
    console.log("New Docs:", newDocs);

    const changes = {
      toDelete: [],
      toCreate: [],
      toUpdate: [],
      unchanged: [],
    };

    // Create maps for easier comparison
    const existingMap = new Map(existingDocs.map((doc) => [doc.id, doc]));
    const newMap = new Map();

    // Process new documents
    newDocs.forEach((newDoc) => {
      if (newDoc.id) {
        newMap.set(newDoc.id, newDoc);
        const existing = existingMap.get(newDoc.id);

        if (
          typeof File !== "undefined" &&
          newDoc.newDocumentFile instanceof File
        ) {
          // New file uploaded → delete old + create new
          changes.toDelete.push(newDoc.id);
          changes.toCreate.push(newDoc);
        } else if (existing) {
          // Compare metadata
          const metaChanged =
            newDoc.document_title !== existing.document_title ||
            newDoc.document_type !== existing.document_type ||
            newDoc.display_order !== existing.display_order;

          if (metaChanged) {
            changes.toUpdate.push(newDoc); // 🔹 PUT request later
          } else {
            changes.unchanged.push(newDoc);
          }
        }
      } else {
        // Brand new doc with no ID
        changes.toCreate.push(newDoc);
      }
    });

    // Check for documents that were completely removed -- i.e. were deleted
    existingDocs.forEach((existing) => {
      if (!newMap.has(existing.id)) {
        changes.toDelete.push(existing.id);
      }
    });

    console.log("Changes detected:", changes);
    console.groupEnd();
    return changes;
  };

  // Helper function for document updates during edit
  const handleDocumentUpdatesForEdit = async (companyData, formData) => {
    console.group("📝 Handling Document Updates for Edit");

    for (let i = 0; i < companyData.positions.length; i++) {
      const position = companyData.positions[i];
      const formPositionDocs = formData.positions[i]?.documents || [];

      console.log(`Processing Position ${i + 1}:`, {
        positionId: position.id,
        documentsCount: formPositionDocs.length,
      });

      if (formPositionDocs.length === 0) {
        console.log("No documents to process for this position");
        continue;
      }

      try {
        const existingDocsResponse = await axios.get(
          `${backendUrl}/companies/position/${position.id}/documents`
        );
        console.log("Existing documents fetched:", existingDocsResponse.data);

        const existingDocs = existingDocsResponse.data || [];
        const documentChanges = detectDocumentChanges(
          existingDocs,
          formPositionDocs
        );

        // DELETE
        if (documentChanges.toDelete.length > 0) {
          console.group("🗑️ Deleting documents");
          for (const docId of documentChanges.toDelete) {
            try {
              console.log(`Deleting document ${docId}`);
              await axios.delete(`${backendUrl}/companies/documents/${docId}`);
              console.log(`✅ Deleted document ${docId}`);
            } catch (deleteError) {
              console.error(
                `❌ Failed to delete document ${docId}:`,
                deleteError
              );
            }
          }
          console.groupEnd();
        }

        // CREATE (new file or brand new doc)
        if (documentChanges.toCreate.length > 0) {
          console.group("➕ Creating new documents");
          const formDataForUpload = new FormData();
          let hasValidDocs = false;

          documentChanges.toCreate.forEach((doc) => {
            if (doc.newDocumentFile) {
              console.log("Adding document to upload:", {
                title: doc.document_title,
                type: doc.document_type,
                filename:
                  doc.newDocumentFile instanceof File
                    ? doc.newDocumentFile.name
                    : "Existing URL",
              });
              formDataForUpload.append("documents", doc.newDocumentFile);
              formDataForUpload.append("document_types", doc.document_type);
              formDataForUpload.append("document_titles", doc.document_title);
              formDataForUpload.append(
                "display_orders",
                doc.display_order || 1
              );
              hasValidDocs = true;
            }
          });

          if (hasValidDocs) {
            console.log("Uploading new documents...");
            const uploadResponse = await axios.post(
              `${backendUrl}/companies/batch/${batchYear}/position/${position.id}/documents`,
              formDataForUpload,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            console.log("Upload successful:", uploadResponse.data);
          }
          console.groupEnd();
        }

        // UPDATE (metadata only)
        if (documentChanges.toUpdate.length > 0) {
          console.group("✏️ Updating document metadata");
          for (const doc of documentChanges.toUpdate) {
            try {
              console.log("Updating metadata for document:", doc.id);
              await axios.put(`${backendUrl}/companies/documents/${doc.id}`, {
                document_title: doc.document_title,
                document_type: doc.document_type,
                display_order: doc.display_order,
              });
              console.log(`✅ Updated metadata for document ${doc.id}`);
            } catch (updateError) {
              console.error(
                `❌ Failed to update document ${doc.id}:`,
                updateError
              );
            }
          }
          console.groupEnd();
        }

        console.log("Unchanged documents:", documentChanges.unchanged);
      } catch (error) {
        console.error(
          `Error handling documents for position ${position.id}:`,
          error
        );
        throw error;
      }
    }
    console.groupEnd();
  };

  const handleDocumentUploadsForNew = async (companyData, formData) => {
    console.group("📤 Handling Document Uploads for New Company");

    for (let i = 0; i < companyData.positions.length; i++) {
      const position = companyData.positions[i];
      const positionDocs = formData.positions[i]?.documents || [];

      console.log(`Processing Position ${i + 1}:`, {
        positionId: position.id,
        documentsCount: positionDocs.length,
      });

      if (positionDocs.length === 0) {
        console.log("No documents to upload for this position");
        continue;
      }

      const formDataForUpload = new FormData();
      let hasValidDocs = false;

      positionDocs.forEach((doc, index) => {
        if (doc.newDocumentFile) {
          console.log(`Adding document ${index + 1} to upload:`, {
            title: doc.document_title,
            type: doc.document_type,
            filename:
              doc.newDocumentFile instanceof File
                ? doc.newDocumentFile.name
                : "Invalid URL",
          });
          formDataForUpload.append("documents", doc.newDocumentFile);
          formDataForUpload.append("document_types", doc.document_type);
          formDataForUpload.append("document_titles", doc.document_title);
          formDataForUpload.append("display_orders", doc.display_order || 1);
          hasValidDocs = true;
        }
      });

      if (hasValidDocs) {
        try {
          console.log("Uploading documents...");
          const uploadResponse = await axios.post(
            `${backendUrl}/companies/batch/${batchYear}/position/${position.id}/documents`,
            formDataForUpload,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          console.log("Upload successful:", uploadResponse.data);
        } catch (error) {
          console.error("Upload failed:", error);
          throw error;
        }
      }
    }
    console.groupEnd();
  };

  // Updated handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setLoading(true);

      // Create a new object with processed data
      const processedData = {
        ...formData,
        scheduled_visit: formData.scheduled_visit || null,
        actual_arrival: formData.actual_arrival || null,
        positions: formData.positions.map((position) => ({
          ...position,
          rounds_start_date: position.rounds_start_date || null,
          rounds_end_date: position.rounds_end_date || null,
        })),
      };

      let response;

      if (editData) {
        response = await axios.put(
          `${backendUrl}/companies/${editData.id}/batch/${batchYear}`,
          processedData
        );
      } else {
        response = await axios.post(
          `${backendUrl}/companies/batch/${batchYear}`,
          processedData
        );
      }

      const companyData = response.data;

      // Handle document operations
      if (editData) {
        await handleDocumentUpdatesForEdit(companyData, formData);
      } else {
        await handleDocumentUploadsForNew(companyData, formData);
      }

      toast.success(
        editData
          ? "Company updated successfully"
          : "Company created successfully"
      );
      onSuccess(companyData);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-neutral-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-8 py-5 flex justify-between items-center z-10">
          <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            {editData ? "Edit Company" : "Add New Company"}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 transition-colors p-1 rounded"
            aria-label="Close"
          >
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Company Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-neutral-800">
                Company Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                  required
                />
                {errors.company_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.company_name}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Company Description
                </label>
                <textarea
                  name="company_description"
                  value={formData.company_description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Sector
                </label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                >
                  <option value="">Select Sector</option>

                  {sectors.map((sector) => (
                    <option key={sector.value} value={sector.value}>
                      {sector.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_marquee"
                  checked={formData.is_marquee}
                  onChange={handleInputChange}
                  className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-neutral-700">
                  Marquee Company
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Account Owner
                </label>
                <input
                  type="text"
                  name="account_owner"
                  value={formData.account_owner}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-neutral-800">
                Contact Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <Globe size={16} className="inline mr-1" />
                  Website URL
                </label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <Linkedin size={16} className="inline mr-1" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Primary HR Name
                </label>
                <input
                  type="text"
                  name="primary_hr_name"
                  value={formData.primary_hr_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  HR Designation
                </label>
                <input
                  type="text"
                  name="primary_hr_designation"
                  value={formData.primary_hr_designation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <Mail size={16} className="inline mr-1" />
                  HR Email
                </label>
                <input
                  type="email"
                  name="primary_hr_email"
                  value={formData.primary_hr_email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
                {errors.primary_hr_email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.primary_hr_email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <Phone size={16} className="inline mr-1" />
                  HR Phone
                </label>
                <input
                  type="tel"
                  name="primary_hr_phone"
                  value={formData.primary_hr_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
              </div>
            </div>
          </section>

          {/* Visit Details */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-neutral-800">
                Visit Details
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Scheduled Visit*
                </label>
                <input
                  required
                  type="date"
                  name="scheduled_visit"
                  value={formData.scheduled_visit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
                {errors.scheduled_visit && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.scheduled_visit}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Actual Arrival
                </label>
                <input
                  type="date"
                  name="actual_arrival"
                  value={formData.actual_arrival}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <Star size={16} className="inline mr-1" />
                  Glassdoor Rating
                </label>
                <input
                  type="number"
                  name="glassdoor_rating"
                  value={formData.glassdoor_rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
                {errors.glassdoor_rating && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.glassdoor_rating}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <MapPin size={16} className="inline mr-1" />
                Work Locations
              </label>
              <input
                type="text"
                name="work_locations"
                value={formData.work_locations}
                onChange={handleInputChange}
                placeholder="e.g., Bangalore, Hyderabad, Mumbai"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
              />
            </div>
          </section>

          {/* Requirements */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-neutral-800">
                Requirements
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Minimum CGPA
                </label>
                <input
                  type="number"
                  name="min_cgpa"
                  value={formData.min_cgpa}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  step="0.01"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
                {errors.min_cgpa && (
                  <p className="text-red-500 text-xs mt-1">{errors.min_cgpa}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Maximum Backlogs
                </label>
                <input
                  type="number"
                  name="max_backlogs"
                  value={formData.max_backlogs}
                  onChange={handleInputChange}
                  min="0"
                  max="999"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                />
              </div>
              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                <input
                  type="checkbox"
                  name="bond_required"
                  checked={formData.bond_required}
                  onChange={handleInputChange}
                  className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-neutral-700">
                  Bond Required
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Allowed Specializations
              </label>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => handleSpecializationToggle(spec)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                      formData.allowed_specializations.includes(spec)
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Positions */}
          <section className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-neutral-800">
                Positions
              </h3>
              <button
                type="button"
                onClick={addPosition}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add Position
              </button>
            </div>
            {formData.positions.map((position, positionIndex) => (
              <div
                key={positionIndex}
                className="border border-neutral-200 rounded-lg p-4 space-y-4 bg-neutral-50"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-md font-medium text-neutral-800">
                    Position {positionIndex + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removePosition(positionIndex)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Position Type*
                    </label>
                    <select
                      required
                      value={position.company_type}
                      onChange={(e) =>
                        updatePosition(
                          positionIndex,
                          "company_type",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="tech">Tech</option>
                      <option value="nontech">Non-Tech</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Position Title*
                      {editData && (
                        <div className="inline-block ml-2 group relative">
                          <Info size={14} className="inline text-blue-500" />
                          <div className="hidden group-hover:block absolute left-0 top-6 w-64 p-2 bg-neutral-800 text-white text-xs rounded shadow-lg z-20">
                            Position titles cannot be edited to maintain data
                            consistency across rounds and applications. To
                            modify, please delete this position and create a new
                            one.
                          </div>
                        </div>
                      )}
                    </label>
                    <input
                      required
                      type="text"
                      value={position.position_title}
                      onChange={(e) =>
                        updatePosition(
                          positionIndex,
                          "position_title",
                          e.target.value
                        )
                      }
                      disabled={!!editData}
                      className={`w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        editData
                          ? "bg-neutral-100 cursor-not-allowed opacity-75"
                          : "bg-white"
                      }`}
                    />
                    {editData && (
                      <p className="mt-1 text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
                        💡 To change position title, delete this position and
                        create a new one
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Job Type*
                    </label>
                    <select
                      required
                      value={position.job_type}
                      onChange={(e) =>
                        updatePosition(
                          positionIndex,
                          "job_type",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {jobTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Conditional Compensation Fields */}
                  {(position.job_type === "full_time" ||
                    position.job_type === "internship_plus_ppo") && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Package Range *
                      </label>
                      <input
                        type="number"
                        min="-1"
                        max="999999999"
                        value={position.package_range}
                        onChange={(e) =>
                          updatePosition(
                            positionIndex,
                            "package_range",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required={
                          position.job_type === "full_time" ||
                          position.job_type === "internship_plus_ppo"
                        }
                      />
                      <p className="mt-1 text-xs text-red-500 bg-red-100 px-2 py-1 rounded inline-block">
                        💡 Enter{" "}
                        <span className="font-medium text-red-700">-1</span> if
                        not disclosed
                      </p>
                    </div>
                  )}

                  {(position.job_type === "internship" ||
                    position.job_type === "internship_plus_ppo") && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Internship Stipend (Monthly)*
                      </label>
                      <input
                        type="number"
                        min="-1"
                        max="99999999"
                        value={position.internship_stipend_monthly}
                        onChange={(e) =>
                          updatePosition(
                            positionIndex,
                            "internship_stipend_monthly",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required={
                          position.job_type === "internship" ||
                          position.job_type === "internship_plus_ppo"
                        }
                      />
                      <p className="mt-1 text-xs text-red-500 bg-red-100 px-2 py-1 rounded inline-block">
                        💡 Enter{" "}
                        <span className="font-medium text-red-700">-1</span> if
                        not disclosed
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Selected Students
                    </label>
                    <input
                      type="number"
                      min="-1"
                      value={position.selected_students}
                      onChange={(e) =>
                        updatePosition(
                          positionIndex,
                          "selected_students",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Rounds Start Date
                    </label>
                    <input
                      type="date"
                      value={position.rounds_start_date}
                      onChange={(e) =>
                        updatePosition(
                          positionIndex,
                          "rounds_start_date",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Rounds End Date
                    </label>
                    <input
                      type="date"
                      value={position.rounds_end_date}
                      onChange={(e) =>
                        updatePosition(
                          positionIndex,
                          "rounds_end_date",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                {/* Documents for this position */}
                <div className="space-y-4">
                  {/* Header Section */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="text-sm font-medium text-neutral-700">
                        Documents
                      </h5>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        *Supports: PDF, DOC, DOCX, JPG, JPEG, PNG
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addDocument(positionIndex)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={14} />
                      Add Document
                    </button>
                  </div>

                  {/* Documents List */}
                  {position.documents.map((document, docIndex) => (
                    <div
                      key={docIndex}
                      className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Document Type */}
                        <div>
                          <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                            Document Type*
                          </label>
                          <select
                            required
                            value={document.document_type}
                            onChange={(e) =>
                              handleDocumentChange(
                                positionIndex,
                                docIndex,
                                "document_type",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {documentTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Document Title */}
                        <div>
                          <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                            Document Title*
                          </label>
                          <input
                            required
                            type="text"
                            value={document.document_title}
                            onChange={(e) =>
                              handleDocumentChange(
                                positionIndex,
                                docIndex,
                                "document_title",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter document title"
                          />
                        </div>

                        {/* File Upload Section */}
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                            Upload File
                            {!document.id && !document.newDocumentFile && "*"}
                          </label>

                          {/* Current Document Display */}
                          {document.original_filename && (
                            <div className="mb-2 p-2.5 bg-blue-50 border border-blue-200 rounded-md">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-700 truncate">
                                  Current: {document.original_filename}
                                </span>
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                                  Existing
                                </span>
                              </div>
                            </div>
                          )}

                          {/* New File Selected Display */}
                          {!document.original_filename &&
                            document.newDocumentFile && (
                              <div className="mb-2 p-2.5 bg-green-50 border border-green-200 rounded-md">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-green-700 truncate">
                                    Selected: {document.newDocumentFile.name}
                                  </span>
                                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                    New
                                  </span>
                                </div>
                              </div>
                            )}

                          {/* File Input and Remove Button - Same Line */}
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <input
                                required={
                                  !document.id && !document.newDocumentFile
                                }
                                type="file"
                                onChange={(e) =>
                                  handleDocumentChange(
                                    positionIndex,
                                    docIndex,
                                    "newDocumentFile",
                                    e.target.files[0]
                                  )
                                }
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <div className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white cursor-pointer hover:bg-neutral-50 transition-colors flex items-center">
                                <span className="text-neutral-700 truncate">
                                  {document.original_filename
                                    ? "Choose new file..."
                                    : "Choose file..."}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                removeDocument(positionIndex, docIndex)
                              }
                              className="px-3 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : editData
                  ? "Update Company"
                  : "Create Company"}
            </button>
          </div>
          {errors.submit && (
            <div className="text-red-600 text-sm text-center mt-2">
              {errors.submit}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanyFormModal;
