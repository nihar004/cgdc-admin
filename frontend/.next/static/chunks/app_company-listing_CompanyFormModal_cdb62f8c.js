(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/company-listing/CompanyFormModal.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$linkedin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Linkedin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/linkedin.js [app-client] (ecmascript) <export default as Linkedin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/graduation-cap.js [app-client] (ecmascript) <export default as GraduationCap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const backendUrl = ("TURBOPACK compile-time value", "http://localhost:5000/api");
// Add this helper function at the top of your file, before the component
const formatDateForInput = (dateString)=>{
    if (!dateString) return "";
    // Convert the date string to YYYY-MM-DD format
    return new Date(dateString).toISOString().split("T")[0];
};
const CompanyFormModal = (param)=>{
    let { batchYear, onClose, onSuccess, editData = null } = param;
    _s();
    var _editData_company_name, _editData_company_description, _editData_sector, _editData_is_marquee, _editData_website_url, _editData_linkedin_url, _editData_primary_hr_name, _editData_primary_hr_designation, _editData_primary_hr_email, _editData_primary_hr_phone, _formatDateForInput, _formatDateForInput1, _editData_glassdoor_rating, _editData_work_locations, _editData_min_cgpa, _editData_max_backlogs, _editData_bond_required, _editData_account_owner, _editData_office_address, _formatDateForInput2, _editData_eligibility_10th, _editData_eligibility_12th, _editData_allowed_specializations, _editData_positions;
    // Initialize form data with editData if provided, otherwise use default values
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        company_name: (_editData_company_name = editData === null || editData === void 0 ? void 0 : editData.company_name) !== null && _editData_company_name !== void 0 ? _editData_company_name : "",
        company_description: (_editData_company_description = editData === null || editData === void 0 ? void 0 : editData.company_description) !== null && _editData_company_description !== void 0 ? _editData_company_description : "",
        sector: (_editData_sector = editData === null || editData === void 0 ? void 0 : editData.sector) !== null && _editData_sector !== void 0 ? _editData_sector : "",
        is_marquee: (_editData_is_marquee = editData === null || editData === void 0 ? void 0 : editData.is_marquee) !== null && _editData_is_marquee !== void 0 ? _editData_is_marquee : false,
        website_url: (_editData_website_url = editData === null || editData === void 0 ? void 0 : editData.website_url) !== null && _editData_website_url !== void 0 ? _editData_website_url : "",
        linkedin_url: (_editData_linkedin_url = editData === null || editData === void 0 ? void 0 : editData.linkedin_url) !== null && _editData_linkedin_url !== void 0 ? _editData_linkedin_url : "",
        primary_hr_name: (_editData_primary_hr_name = editData === null || editData === void 0 ? void 0 : editData.primary_hr_name) !== null && _editData_primary_hr_name !== void 0 ? _editData_primary_hr_name : "",
        primary_hr_designation: (_editData_primary_hr_designation = editData === null || editData === void 0 ? void 0 : editData.primary_hr_designation) !== null && _editData_primary_hr_designation !== void 0 ? _editData_primary_hr_designation : "",
        primary_hr_email: (_editData_primary_hr_email = editData === null || editData === void 0 ? void 0 : editData.primary_hr_email) !== null && _editData_primary_hr_email !== void 0 ? _editData_primary_hr_email : "",
        primary_hr_phone: (_editData_primary_hr_phone = editData === null || editData === void 0 ? void 0 : editData.primary_hr_phone) !== null && _editData_primary_hr_phone !== void 0 ? _editData_primary_hr_phone : "",
        scheduled_visit: (_formatDateForInput = formatDateForInput(editData === null || editData === void 0 ? void 0 : editData.scheduled_visit)) !== null && _formatDateForInput !== void 0 ? _formatDateForInput : "",
        actual_arrival: (_formatDateForInput1 = formatDateForInput(editData === null || editData === void 0 ? void 0 : editData.actual_arrival)) !== null && _formatDateForInput1 !== void 0 ? _formatDateForInput1 : "",
        glassdoor_rating: (_editData_glassdoor_rating = editData === null || editData === void 0 ? void 0 : editData.glassdoor_rating) !== null && _editData_glassdoor_rating !== void 0 ? _editData_glassdoor_rating : "",
        work_locations: (_editData_work_locations = editData === null || editData === void 0 ? void 0 : editData.work_locations) !== null && _editData_work_locations !== void 0 ? _editData_work_locations : "",
        min_cgpa: (_editData_min_cgpa = editData === null || editData === void 0 ? void 0 : editData.min_cgpa) !== null && _editData_min_cgpa !== void 0 ? _editData_min_cgpa : "",
        max_backlogs: (_editData_max_backlogs = editData === null || editData === void 0 ? void 0 : editData.max_backlogs) !== null && _editData_max_backlogs !== void 0 ? _editData_max_backlogs : false,
        bond_required: (_editData_bond_required = editData === null || editData === void 0 ? void 0 : editData.bond_required) !== null && _editData_bond_required !== void 0 ? _editData_bond_required : false,
        account_owner: (_editData_account_owner = editData === null || editData === void 0 ? void 0 : editData.account_owner) !== null && _editData_account_owner !== void 0 ? _editData_account_owner : "",
        office_address: (_editData_office_address = editData === null || editData === void 0 ? void 0 : editData.office_address) !== null && _editData_office_address !== void 0 ? _editData_office_address : "",
        jd_shared_date: (_formatDateForInput2 = formatDateForInput(editData === null || editData === void 0 ? void 0 : editData.jd_shared_date)) !== null && _formatDateForInput2 !== void 0 ? _formatDateForInput2 : "",
        eligibility_10th: (_editData_eligibility_10th = editData === null || editData === void 0 ? void 0 : editData.eligibility_10th) !== null && _editData_eligibility_10th !== void 0 ? _editData_eligibility_10th : "",
        eligibility_12th: (_editData_eligibility_12th = editData === null || editData === void 0 ? void 0 : editData.eligibility_12th) !== null && _editData_eligibility_12th !== void 0 ? _editData_eligibility_12th : "",
        allowed_specializations: (_editData_allowed_specializations = editData === null || editData === void 0 ? void 0 : editData.allowed_specializations) !== null && _editData_allowed_specializations !== void 0 ? _editData_allowed_specializations : [],
        positions: ((_editData_positions = editData === null || editData === void 0 ? void 0 : editData.positions) !== null && _editData_positions !== void 0 ? _editData_positions : []).map({
            "CompanyFormModal.useState": (position)=>{
                var _position_position_title, _position_job_type, _position_company_type, _position_package, _position_has_range, _position_package_end, _position_internship_stipend_monthly, _position_selected_students, _formatDateForInput, _formatDateForInput1, _position_documents;
                return {
                    id: (position === null || position === void 0 ? void 0 : position.id) || null,
                    position_title: (_position_position_title = position === null || position === void 0 ? void 0 : position.position_title) !== null && _position_position_title !== void 0 ? _position_position_title : "",
                    job_type: (_position_job_type = position === null || position === void 0 ? void 0 : position.job_type) !== null && _position_job_type !== void 0 ? _position_job_type : "full_time",
                    company_type: (_position_company_type = position === null || position === void 0 ? void 0 : position.company_type) !== null && _position_company_type !== void 0 ? _position_company_type : "tech",
                    package: (_position_package = position === null || position === void 0 ? void 0 : position.package) !== null && _position_package !== void 0 ? _position_package : -1,
                    has_range: (_position_has_range = position === null || position === void 0 ? void 0 : position.has_range) !== null && _position_has_range !== void 0 ? _position_has_range : false,
                    package_end: (_position_package_end = position === null || position === void 0 ? void 0 : position.package_end) !== null && _position_package_end !== void 0 ? _position_package_end : -1,
                    internship_stipend_monthly: (_position_internship_stipend_monthly = position === null || position === void 0 ? void 0 : position.internship_stipend_monthly) !== null && _position_internship_stipend_monthly !== void 0 ? _position_internship_stipend_monthly : null,
                    selected_students: (_position_selected_students = position === null || position === void 0 ? void 0 : position.selected_students) !== null && _position_selected_students !== void 0 ? _position_selected_students : -1,
                    rounds_start_date: (_formatDateForInput = formatDateForInput(position === null || position === void 0 ? void 0 : position.rounds_start_date)) !== null && _formatDateForInput !== void 0 ? _formatDateForInput : "",
                    rounds_end_date: (_formatDateForInput1 = formatDateForInput(position === null || position === void 0 ? void 0 : position.rounds_end_date)) !== null && _formatDateForInput1 !== void 0 ? _formatDateForInput1 : "",
                    documents: ((_position_documents = position === null || position === void 0 ? void 0 : position.documents) !== null && _position_documents !== void 0 ? _position_documents : []).map({
                        "CompanyFormModal.useState": (doc)=>{
                            var _doc_document_type, _doc_document_title, _doc_original_filename, _ref, _doc_display_order;
                            return {
                                id: (doc === null || doc === void 0 ? void 0 : doc.id) || null,
                                document_type: (_doc_document_type = doc === null || doc === void 0 ? void 0 : doc.document_type) !== null && _doc_document_type !== void 0 ? _doc_document_type : "job_description",
                                document_title: (_doc_document_title = doc === null || doc === void 0 ? void 0 : doc.document_title) !== null && _doc_document_title !== void 0 ? _doc_document_title : "",
                                newDocumentFile: null,
                                original_filename: (_ref = (_doc_original_filename = doc === null || doc === void 0 ? void 0 : doc.original_filename) !== null && _doc_original_filename !== void 0 ? _doc_original_filename : doc === null || doc === void 0 ? void 0 : doc.document_title) !== null && _ref !== void 0 ? _ref : "",
                                display_order: (_doc_display_order = doc === null || doc === void 0 ? void 0 : doc.display_order) !== null && _doc_display_order !== void 0 ? _doc_display_order : 1
                            };
                        }
                    }["CompanyFormModal.useState"])
                };
            }
        }["CompanyFormModal.useState"])
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const specializations = [
        "CSE",
        "E.Com",
        "ME"
    ];
    const sectors = [
        {
            value: "E-Commerce, Logistics and Business",
            label: "E-Commerce, Logistics and Business"
        },
        {
            value: "EdTech",
            label: "EdTech"
        },
        {
            value: "IT & Consulting",
            label: "IT & Consulting"
        },
        {
            value: "IT Service",
            label: "IT Service"
        },
        {
            value: "IT Software (Product)",
            label: "IT Software (Product)"
        },
        {
            value: "Others*",
            label: "Others*"
        }
    ];
    const jobTypes = [
        {
            value: "full_time",
            label: "Full Time"
        },
        {
            value: "internship",
            label: "Internship"
        },
        {
            value: "internship_plus_ppo",
            label: "Internship + PPO"
        }
    ];
    const documentTypes = [
        {
            value: "job_description",
            label: "Job Description"
        },
        {
            value: "salary_breakdown",
            label: "Salary Breakdown"
        },
        {
            value: "company_presentation",
            label: "Company Presentation"
        },
        {
            value: "bond_details",
            label: "Bond Details"
        },
        {
            value: "eligibility_criteria",
            label: "Eligibility Criteria"
        },
        {
            value: "other",
            label: "Other"
        }
    ];
    const handleInputChange = (e)=>{
        const { name, value, type, checked } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
    };
    const handleSpecializationToggle = (spec)=>{
        setFormData((prev)=>({
                ...prev,
                allowed_specializations: Array.isArray(prev.allowed_specializations) ? prev.allowed_specializations.includes(spec) ? prev.allowed_specializations.filter((s)=>s !== spec) : [
                    ...prev.allowed_specializations,
                    spec
                ] : [
                    spec
                ]
            }));
    };
    const addPosition = ()=>{
        setFormData((prev)=>({
                ...prev,
                positions: [
                    ...prev.positions,
                    {
                        position_title: "",
                        job_type: "full_time",
                        company_type: "tech",
                        package: -1,
                        has_range: false,
                        package_end: -1,
                        internship_stipend_monthly: null,
                        selected_students: 0,
                        rounds_start_date: "",
                        rounds_end_date: "",
                        documents: []
                    }
                ]
            }));
    };
    const removePosition = (index)=>{
        setFormData((prev)=>({
                ...prev,
                positions: prev.positions.filter((_, i)=>i !== index)
            }));
    };
    const updatePosition = (index, field, value)=>{
        setFormData((prev)=>({
                ...prev,
                positions: prev.positions.map((pos, i)=>i === index ? {
                        ...pos,
                        [field]: value
                    } : pos)
            }));
    };
    const addDocument = (positionIndex)=>{
        const newDoc = {
            document_type: "job_description",
            document_title: "",
            newDocumentFile: "",
            file_type: "pdf",
            display_order: 1
        };
        setFormData((prev)=>({
                ...prev,
                positions: prev.positions.map((pos, i)=>i === positionIndex ? {
                        ...pos,
                        documents: [
                            ...pos.documents,
                            newDoc
                        ]
                    } : pos)
            }));
    };
    const removeDocument = (positionIndex, docIndex)=>{
        setFormData((prev)=>({
                ...prev,
                positions: prev.positions.map((pos, i)=>i === positionIndex ? {
                        ...pos,
                        documents: pos.documents.filter((_, di)=>di !== docIndex)
                    } : pos)
            }));
    };
    const updateDocument = (positionIndex, docIndex, field, value)=>{
        setFormData((prev)=>({
                ...prev,
                positions: prev.positions.map((pos, i)=>i === positionIndex ? {
                        ...pos,
                        documents: pos.documents.map((doc, di)=>di === docIndex ? {
                                ...doc,
                                [field]: value,
                                // Update original_filename when newDocumentFile is updated with a File
                                ...field === "newDocumentFile" && value instanceof File ? {
                                    original_filename: value.name
                                } : {}
                            } : doc)
                    } : pos)
            }));
    };
    const handleDocumentChange = (positionIndex, docIndex, field, value)=>{
        console.group("🔄 Handling Document Change");
        console.log("Change details:", {
            positionIndex,
            docIndex,
            field,
            value: field === "newDocumentFile" ? "File object" : value
        });
        if (field === "newDocumentFile" && value instanceof File) {
            console.log("New file selected:", {
                filename: value.name,
                size: value.size,
                type: value.type
            });
            updateDocument(positionIndex, docIndex, field, value);
            if (!formData.positions[positionIndex].documents[docIndex].document_title) {
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
    const validateForm = ()=>{
        const newErrors = {};
        if (!formData.company_name) {
            newErrors.company_name = "Company name is required";
        }
        // Validate that actual_arrival is after scheduled_visit if both exist
        if (formData.actual_arrival && formData.scheduled_visit) {
            if (new Date(formData.actual_arrival) < new Date(formData.scheduled_visit)) {
                newErrors.actual_arrival = "Actual arrival cannot be before scheduled visit";
            }
        }
        if (formData.primary_hr_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primary_hr_email)) {
            newErrors.primary_hr_email = "Invalid email format";
        }
        if (formData.glassdoor_rating && (formData.glassdoor_rating < 0 || formData.glassdoor_rating > 5)) {
            newErrors.glassdoor_rating = "Rating must be between 0 and 5";
        }
        if (formData.min_cgpa && (formData.min_cgpa < 0 || formData.min_cgpa > 10)) {
            newErrors.min_cgpa = "CGPA must be between 0 and 10";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // END DONE
    // Helper function to detect document changes
    const detectDocumentChanges = (existingDocs, newDocs)=>{
        console.group("📄 Detecting Document Changes");
        console.log("Existing Docs:", existingDocs);
        console.log("New Docs:", newDocs);
        const changes = {
            toDelete: [],
            toCreate: [],
            toUpdate: [],
            unchanged: []
        };
        // Create maps for easier comparison
        const existingMap = new Map(existingDocs.map((doc)=>[
                doc.id,
                doc
            ]));
        const newMap = new Map();
        // Process new documents
        newDocs.forEach((newDoc)=>{
            if (newDoc.id) {
                newMap.set(newDoc.id, newDoc);
                const existing = existingMap.get(newDoc.id);
                if (typeof File !== "undefined" && newDoc.newDocumentFile instanceof File) {
                    // New file uploaded → delete old + create new
                    changes.toDelete.push(newDoc.id);
                    changes.toCreate.push(newDoc);
                } else if (existing) {
                    // Compare metadata
                    const metaChanged = newDoc.document_title !== existing.document_title || newDoc.document_type !== existing.document_type || newDoc.display_order !== existing.display_order;
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
        existingDocs.forEach((existing)=>{
            if (!newMap.has(existing.id)) {
                changes.toDelete.push(existing.id);
            }
        });
        console.log("Changes detected:", changes);
        console.groupEnd();
        return changes;
    };
    // Helper function for document updates during edit
    const handleDocumentUpdatesForEdit = async (companyData, formData)=>{
        console.group("📝 Handling Document Updates for Edit");
        for(let i = 0; i < companyData.positions.length; i++){
            var _formData_positions_i;
            const position = companyData.positions[i];
            const formPositionDocs = ((_formData_positions_i = formData.positions[i]) === null || _formData_positions_i === void 0 ? void 0 : _formData_positions_i.documents) || [];
            console.log("Processing Position ".concat(i + 1, ":"), {
                positionId: position.id,
                documentsCount: formPositionDocs.length
            });
            if (formPositionDocs.length === 0) {
                console.log("No documents to process for this position");
                continue;
            }
            try {
                const existingDocsResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("".concat(backendUrl, "/companies/position/").concat(position.id, "/documents"));
                console.log("Existing documents fetched:", existingDocsResponse.data);
                const existingDocs = existingDocsResponse.data || [];
                const documentChanges = detectDocumentChanges(existingDocs, formPositionDocs);
                // DELETE
                if (documentChanges.toDelete.length > 0) {
                    console.group("🗑️ Deleting documents");
                    for (const docId of documentChanges.toDelete){
                        try {
                            console.log("Deleting document ".concat(docId));
                            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete("".concat(backendUrl, "/companies/documents/").concat(docId));
                            console.log("✅ Deleted document ".concat(docId));
                        } catch (deleteError) {
                            console.error("❌ Failed to delete document ".concat(docId, ":"), deleteError);
                        }
                    }
                    console.groupEnd();
                }
                // CREATE (new file or brand new doc)
                if (documentChanges.toCreate.length > 0) {
                    console.group("➕ Creating new documents");
                    const formDataForUpload = new FormData();
                    let hasValidDocs = false;
                    documentChanges.toCreate.forEach((doc)=>{
                        if (doc.newDocumentFile) {
                            console.log("Adding document to upload:", {
                                title: doc.document_title,
                                type: doc.document_type,
                                filename: doc.newDocumentFile instanceof File ? doc.newDocumentFile.name : "Existing URL"
                            });
                            formDataForUpload.append("documents", doc.newDocumentFile);
                            formDataForUpload.append("document_types", doc.document_type);
                            formDataForUpload.append("document_titles", doc.document_title);
                            formDataForUpload.append("display_orders", doc.display_order || 1);
                            hasValidDocs = true;
                        }
                    });
                    if (hasValidDocs) {
                        console.log("Uploading new documents...");
                        const uploadResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(backendUrl, "/companies/batch/").concat(batchYear, "/position/").concat(position.id, "/documents"), formDataForUpload, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        });
                        console.log("Upload successful:", uploadResponse.data);
                    }
                    console.groupEnd();
                }
                // UPDATE (metadata only)
                if (documentChanges.toUpdate.length > 0) {
                    console.group("✏️ Updating document metadata");
                    for (const doc of documentChanges.toUpdate){
                        try {
                            console.log("Updating metadata for document:", doc.id);
                            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put("".concat(backendUrl, "/companies/documents/").concat(doc.id), {
                                document_title: doc.document_title,
                                document_type: doc.document_type,
                                display_order: doc.display_order
                            });
                            console.log("✅ Updated metadata for document ".concat(doc.id));
                        } catch (updateError) {
                            console.error("❌ Failed to update document ".concat(doc.id, ":"), updateError);
                        }
                    }
                    console.groupEnd();
                }
                console.log("Unchanged documents:", documentChanges.unchanged);
            } catch (error) {
                console.error("Error handling documents for position ".concat(position.id, ":"), error);
                throw error;
            }
        }
        console.groupEnd();
    };
    const handleDocumentUploadsForNew = async (companyData, formData)=>{
        console.group("📤 Handling Document Uploads for New Company");
        for(let i = 0; i < companyData.positions.length; i++){
            var _formData_positions_i;
            const position = companyData.positions[i];
            const positionDocs = ((_formData_positions_i = formData.positions[i]) === null || _formData_positions_i === void 0 ? void 0 : _formData_positions_i.documents) || [];
            console.log("Processing Position ".concat(i + 1, ":"), {
                positionId: position.id,
                documentsCount: positionDocs.length
            });
            if (positionDocs.length === 0) {
                console.log("No documents to upload for this position");
                continue;
            }
            const formDataForUpload = new FormData();
            let hasValidDocs = false;
            positionDocs.forEach((doc, index)=>{
                if (doc.newDocumentFile) {
                    console.log("Adding document ".concat(index + 1, " to upload:"), {
                        title: doc.document_title,
                        type: doc.document_type,
                        filename: doc.newDocumentFile instanceof File ? doc.newDocumentFile.name : "Invalid URL"
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
                    const uploadResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(backendUrl, "/companies/batch/").concat(batchYear, "/position/").concat(position.id, "/documents"), formDataForUpload, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    });
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
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Please fix the validation errors");
            return;
        }
        try {
            setLoading(true);
            // Create a new object with processed data
            const processedData = {
                ...formData,
                scheduled_visit: formData.scheduled_visit || null,
                actual_arrival: formData.actual_arrival || null,
                positions: formData.positions.map((position)=>({
                        ...position,
                        rounds_start_date: position.rounds_start_date || null,
                        rounds_end_date: position.rounds_end_date || null
                    }))
            };
            let response;
            if (editData) {
                response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put("".concat(backendUrl, "/companies/").concat(editData.id, "/batch/").concat(batchYear), processedData);
            } else {
                response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(backendUrl, "/companies/batch/").concat(batchYear), processedData);
            }
            const companyData = response.data;
            // Handle document operations
            if (editData) {
                await handleDocumentUpdatesForEdit(companyData, formData);
            } else {
                await handleDocumentUploadsForNew(companyData, formData);
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(editData ? "Company updated successfully" : "Company created successfully");
            onSuccess(companyData);
            onClose();
        } catch (error) {
            var _error_response_data, _error_response;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(((_error_response = error.response) === null || _error_response === void 0 ? void 0 : (_error_response_data = _error_response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message) || "Something went wrong");
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-neutral-900/60 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-neutral-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "sticky top-0 bg-white border-b px-8 py-5 flex justify-between items-center z-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-semibold text-neutral-900 tracking-tight",
                            children: editData ? "Edit Company" : "Add New Company"
                        }, void 0, false, {
                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                            lineNumber: 612,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-neutral-400 hover:text-neutral-700 transition-colors p-1 rounded",
                            "aria-label": "Close",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 28
                            }, void 0, false, {
                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                lineNumber: 620,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                            lineNumber: 615,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                    lineNumber: 611,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "p-8 space-y-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                            size: 20,
                                            className: "text-blue-600"
                                        }, void 0, false, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 628,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-neutral-800",
                                            children: "Company Information"
                                        }, void 0, false, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 629,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 627,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: "Company Name *"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 635,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    name: "company_name",
                                                    value: formData.company_name,
                                                    onChange: handleInputChange,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50",
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 638,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.company_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-red-500 text-xs mt-1",
                                                    children: errors.company_name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 647,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 634,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:col-span-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: "Company Description"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 653,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    name: "company_description",
                                                    value: formData.company_description,
                                                    onChange: handleInputChange,
                                                    rows: 3,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 656,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 652,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: "Sector"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 665,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    name: "sector",
                                                    value: formData.sector,
                                                    onChange: handleInputChange,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Select Sector"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                            lineNumber: 674,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        sectors.map((sector)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: sector.value,
                                                                children: sector.label
                                                            }, sector.value, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 677,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 668,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 664,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    name: "is_marquee",
                                                    checked: formData.is_marquee,
                                                    onChange: handleInputChange,
                                                    className: "rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 684,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm font-medium text-neutral-700",
                                                    children: "Marquee Company"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 691,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 683,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: "Account Owner"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 696,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    name: "account_owner",
                                                    value: formData.account_owner,
                                                    onChange: handleInputChange,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 699,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 695,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 633,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                            lineNumber: 626,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                            size: 20,
                                            className: "text-blue-600"
                                        }, void 0, false, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 713,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-neutral-800",
                                            children: "Contact Information"
                                        }, void 0, false, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 714,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 712,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                            size: 16,
                                                            className: "inline mr-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                            lineNumber: 721,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Website URL"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 720,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "url",
                                                    name: "website_url",
                                                    value: formData.website_url,
                                                    onChange: handleInputChange,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 724,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 719,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$linkedin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Linkedin$3e$__["Linkedin"], {
                                                            size: 16,
                                                            className: "inline mr-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                            lineNumber: 734,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "LinkedIn URL"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 733,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "url",
                                                    name: "linkedin_url",
                                                    value: formData.linkedin_url,
                                                    onChange: handleInputChange,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 737,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 732,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: "Primary HR Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 746,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    name: "primary_hr_name",
                                                    value: formData.primary_hr_name,
                                                    onChange: handleInputChange,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 749,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 745,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: "HR Designation"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 758,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    name: "primary_hr_designation",
                                                    value: formData.primary_hr_designation,
                                                    onChange: handleInputChange,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 761,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 757,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                            size: 16,
                                                            className: "inline mr-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                            lineNumber: 771,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "HR Email"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 770,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    name: "primary_hr_email",
                                                    value: formData.primary_hr_email,
                                                    onChange: handleInputChange,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 774,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.primary_hr_email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-red-500 text-xs mt-1",
                                                    children: errors.primary_hr_email
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 782,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 769,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                            size: 16,
                                                            className: "inline mr-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                            lineNumber: 789,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "HR Phone"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 788,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "tel",
                                                    name: "primary_hr_phone",
                                                    value: formData.primary_hr_phone,
                                                    onChange: handleInputChange,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 792,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 787,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 718,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "md:col-span-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-neutral-700 mb-1",
                                                children: "Office Address"
                                            }, void 0, false, {
                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                lineNumber: 803,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                name: "office_address",
                                                value: formData.office_address,
                                                onChange: handleInputChange,
                                                rows: 2,
                                                className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50",
                                                placeholder: "Enter office address"
                                            }, void 0, false, {
                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                lineNumber: 806,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                        lineNumber: 802,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 801,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                            lineNumber: 711,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                            size: 20,
                                            className: "text-blue-600"
                                        }, void 0, false, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 821,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-neutral-800",
                                            children: "Visit Details"
                                        }, void 0, false, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 822,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 820,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: "JD Shared Date"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 828,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    name: "jd_shared_date",
                                                    value: formData.jd_shared_date,
                                                    onChange: handleInputChange,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 831,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 827,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: "Scheduled Visit"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 840,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    name: "scheduled_visit",
                                                    value: formData.scheduled_visit,
                                                    onChange: handleInputChange,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 843,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.scheduled_visit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-red-500 text-xs mt-1",
                                                    children: errors.scheduled_visit
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 851,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 839,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: "Actual Arrival"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 857,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    name: "actual_arrival",
                                                    value: formData.actual_arrival,
                                                    onChange: handleInputChange,
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 860,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 856,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                            size: 16,
                                                            className: "inline mr-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                            lineNumber: 870,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Glassdoor Rating"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 869,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    name: "glassdoor_rating",
                                                    value: formData.glassdoor_rating,
                                                    onChange: handleInputChange,
                                                    min: "0",
                                                    max: "5",
                                                    step: "0.1",
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 873,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.glassdoor_rating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-red-500 text-xs mt-1",
                                                    children: errors.glassdoor_rating
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 884,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 868,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-span-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                            size: 16,
                                                            className: "inline mr-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                            lineNumber: 891,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Work Locations"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 890,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    name: "work_locations",
                                                    value: formData.work_locations,
                                                    onChange: handleInputChange,
                                                    placeholder: "e.g., Bangalore, Hyderabad, Mumbai",
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 894,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 889,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 826,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                            lineNumber: 819,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__["GraduationCap"], {
                                            size: 20,
                                            className: "text-blue-600"
                                        }, void 0, false, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 909,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-neutral-800",
                                            children: "Requirements"
                                        }, void 0, false, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 910,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 908,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: "Minimum CGPA"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 916,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    name: "min_cgpa",
                                                    value: formData.min_cgpa,
                                                    onChange: handleInputChange,
                                                    min: "0",
                                                    max: "10",
                                                    step: "0.01",
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 919,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                errors.min_cgpa && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-red-500 text-xs mt-1",
                                                    children: errors.min_cgpa
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 930,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 915,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: "10th Eligibility (%)"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 935,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    name: "eligibility_10th",
                                                    value: formData.eligibility_10th,
                                                    onChange: handleInputChange,
                                                    min: "0",
                                                    max: "100",
                                                    step: "0.01",
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50",
                                                    placeholder: "e.g., 60.00"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 938,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 934,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1",
                                                    children: "12th Eligibility (%)"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 951,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    name: "eligibility_12th",
                                                    value: formData.eligibility_12th,
                                                    onChange: handleInputChange,
                                                    min: "0",
                                                    max: "100",
                                                    step: "0.01",
                                                    className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50",
                                                    placeholder: "e.g., 60.00"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 954,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 950,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    name: "max_backlogs",
                                                    checked: formData.max_backlogs,
                                                    onChange: handleInputChange,
                                                    className: "rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 967,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm font-medium text-neutral-700",
                                                    children: "Backlogs Allowed"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 974,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 966,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-2 mt-2 md:mt-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    name: "bond_required",
                                                    checked: formData.bond_required,
                                                    onChange: handleInputChange,
                                                    className: "rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 979,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm font-medium text-neutral-700",
                                                    children: "Bond Required"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 986,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 978,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 914,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-neutral-700 mb-2",
                                            children: "Allowed Specializations"
                                        }, void 0, false, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 992,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: specializations.map((spec)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>handleSpecializationToggle(spec),
                                                    className: "px-3 py-1 rounded-full text-sm font-medium border transition-colors ".concat(formData.allowed_specializations.includes(spec) ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200"),
                                                    children: spec
                                                }, spec, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 997,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 995,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 991,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                            lineNumber: 907,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-neutral-800",
                                            children: "Positions"
                                        }, void 0, false, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 1017,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: addPosition,
                                            className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                    lineNumber: 1025,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Add Position"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                            lineNumber: 1020,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 1016,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                formData.positions.map((position, positionIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border border-neutral-200 rounded-lg p-4 space-y-4 bg-neutral-50",
                                        children: [
                                            console.log("Rendering position:", positionIndex, position),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-md font-medium text-neutral-800",
                                                        children: [
                                                            "Position ",
                                                            positionIndex + 1
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                        lineNumber: 1036,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>removePosition(positionIndex),
                                                        className: "text-red-500 hover:text-red-700 transition-colors",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                            lineNumber: 1044,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                        lineNumber: 1039,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                lineNumber: 1035,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-neutral-700 mb-1",
                                                                children: "Position Type*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1049,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                required: true,
                                                                value: position.company_type,
                                                                onChange: (e)=>updatePosition(positionIndex, "company_type", e.target.value),
                                                                className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "tech",
                                                                        children: "Tech"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1064,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "nontech",
                                                                        children: "Non-Tech"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1065,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1052,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                        lineNumber: 1048,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-neutral-700 mb-1",
                                                                children: [
                                                                    "Position Title*",
                                                                    editData && position.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "inline-block ml-2 group relative",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                                                size: 14,
                                                                                className: "inline text-blue-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1073,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "hidden group-hover:block absolute left-0 top-6 w-64 p-2 bg-neutral-800 text-white text-xs rounded shadow-lg z-20",
                                                                                children: "Position titles cannot be edited to maintain data consistency across rounds and applications. To modify, please delete this position and create a new one."
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1074,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1072,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1069,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                required: true,
                                                                type: "text",
                                                                value: position.position_title,
                                                                onChange: (e)=>updatePosition(positionIndex, "position_title", e.target.value),
                                                                disabled: !!editData && !!position.id,
                                                                className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ".concat(!!editData && !!position.id ? "bg-neutral-100 cursor-not-allowed opacity-75" : "bg-white")
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1083,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            !!editData && !!position.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-1 text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded",
                                                                children: "💡 To change position title, delete this position and create a new one"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1102,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                        lineNumber: 1068,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-neutral-700 mb-1",
                                                                children: "Job Type*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1109,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                required: true,
                                                                value: position.job_type,
                                                                onChange: (e)=>updatePosition(positionIndex, "job_type", e.target.value),
                                                                className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
                                                                children: jobTypes.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: type.value,
                                                                        children: type.label
                                                                    }, type.value, false, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1125,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1112,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                        lineNumber: 1108,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    (position.job_type === "full_time" || position.job_type === "internship_plus_ppo") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "md:col-span-2 space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        checked: position.has_range,
                                                                        onChange: (e)=>updatePosition(positionIndex, "has_range", e.target.checked),
                                                                        className: "rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1138,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-neutral-700",
                                                                        children: "Package has a range"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1150,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1137,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "grid ".concat(position.has_range ? "grid-cols-2" : "grid-cols-1", " gap-4"),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "block text-sm font-medium text-neutral-700 mb-1",
                                                                                children: position.has_range ? "Package (Start) in LPA *" : "Package in LPA *"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1160,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "-1",
                                                                                step: "0.01",
                                                                                value: position.package,
                                                                                onChange: (e)=>updatePosition(positionIndex, "package", e.target.value),
                                                                                className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
                                                                                required: true,
                                                                                placeholder: "e.g., 12.5"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1165,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1159,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    position.has_range && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "block text-sm font-medium text-neutral-700 mb-1",
                                                                                children: "Package (End) in LPA *"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1185,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "-1",
                                                                                step: "0.01",
                                                                                value: position.package_end,
                                                                                onChange: (e)=>updatePosition(positionIndex, "package_end", e.target.value),
                                                                                className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
                                                                                required: true,
                                                                                placeholder: "e.g., 15.0"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1188,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1184,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1156,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-neutral-600 bg-blue-50 px-2 py-1 rounded",
                                                                children: [
                                                                    "💡 Enter ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium",
                                                                        children: "-1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1208,
                                                                        columnNumber: 34
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " if not disclosed. Package is in Lakhs Per Annum (LPA)"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1207,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                        lineNumber: 1135,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    (position.job_type === "internship" || position.job_type === "internship_plus_ppo") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-neutral-700 mb-1",
                                                                children: "Internship Stipend (Monthly)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1217,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: position.internship_stipend_monthly || "",
                                                                onChange: (e)=>updatePosition(positionIndex, "internship_stipend_monthly", e.target.value),
                                                                className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
                                                                placeholder: "e.g., ₹25,000 or 20k-30k or Not Disclosed"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1220,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-1 text-xs text-neutral-600 bg-blue-50 px-2 py-1 rounded",
                                                                children: '💡 Enter stipend as text (e.g., "₹25,000/month","20k-30k", or "Not Disclosed")'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1233,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                        lineNumber: 1216,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-neutral-700 mb-1",
                                                                children: "Rounds Start Date"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1242,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "date",
                                                                value: position.rounds_start_date,
                                                                onChange: (e)=>updatePosition(positionIndex, "rounds_start_date", e.target.value),
                                                                className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1245,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                        lineNumber: 1241,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-neutral-700 mb-1",
                                                                children: "Rounds End Date"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1260,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "date",
                                                                value: position.rounds_end_date,
                                                                onChange: (e)=>updatePosition(positionIndex, "rounds_end_date", e.target.value),
                                                                className: "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1263,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                        lineNumber: 1259,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                lineNumber: 1047,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                        className: "text-sm font-medium text-neutral-700",
                                                                        children: "Documents"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1283,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-neutral-500 mt-0.5",
                                                                        children: "*Supports: PDF, DOC, DOCX, JPG, JPEG, PNG"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1286,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1282,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>addDocument(positionIndex),
                                                                className: "flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1295,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    "Add Document"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1290,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                        lineNumber: 1281,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    position.documents.map((document, docIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-white border border-neutral-200 rounded-lg p-4 space-y-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "block text-xs font-medium text-neutral-600 mb-1.5",
                                                                                children: "Document Type*"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1309,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                required: true,
                                                                                value: document.document_type,
                                                                                onChange: (e)=>handleDocumentChange(positionIndex, docIndex, "document_type", e.target.value),
                                                                                className: "w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                                                children: documentTypes.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: type.value,
                                                                                        children: type.label
                                                                                    }, type.value, false, {
                                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                        lineNumber: 1326,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1312,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1308,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "block text-xs font-medium text-neutral-600 mb-1.5",
                                                                                children: "Document Title*"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1335,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                required: true,
                                                                                type: "text",
                                                                                value: document.document_title,
                                                                                onChange: (e)=>handleDocumentChange(positionIndex, docIndex, "document_title", e.target.value),
                                                                                className: "w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                                                placeholder: "Enter document title"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1338,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1334,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "md:col-span-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "block text-xs font-medium text-neutral-600 mb-1.5",
                                                                                children: [
                                                                                    "Upload File",
                                                                                    !document.id && !document.newDocumentFile && "*"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1357,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            document.original_filename && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "mb-2 p-2.5 bg-blue-50 border border-blue-200 rounded-md",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center justify-between",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-blue-700 truncate",
                                                                                            children: [
                                                                                                "Current: ",
                                                                                                document.original_filename
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                            lineNumber: 1366,
                                                                                            columnNumber: 33
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded",
                                                                                            children: "Existing"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                            lineNumber: 1369,
                                                                                            columnNumber: 33
                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                    lineNumber: 1365,
                                                                                    columnNumber: 31
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1364,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            !document.original_filename && document.newDocumentFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "mb-2 p-2.5 bg-green-50 border border-green-200 rounded-md",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center justify-between",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm text-green-700 truncate",
                                                                                            children: [
                                                                                                "Selected: ",
                                                                                                document.newDocumentFile.name
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                            lineNumber: 1381,
                                                                                            columnNumber: 35
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded",
                                                                                            children: "New"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                            lineNumber: 1384,
                                                                                            columnNumber: 35
                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                    lineNumber: 1380,
                                                                                    columnNumber: 33
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1379,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "flex-1 relative",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                required: !document.id && !document.newDocumentFile,
                                                                                                type: "file",
                                                                                                onChange: (e)=>handleDocumentChange(positionIndex, docIndex, "newDocumentFile", e.target.files[0]),
                                                                                                accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
                                                                                                className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                                lineNumber: 1394,
                                                                                                columnNumber: 31
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white cursor-pointer hover:bg-neutral-50 transition-colors flex items-center",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-neutral-700 truncate",
                                                                                                    children: document.original_filename ? "Choose new file..." : "Choose file..."
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                                    lineNumber: 1411,
                                                                                                    columnNumber: 33
                                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                                lineNumber: 1410,
                                                                                                columnNumber: 31
                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                        lineNumber: 1393,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        type: "button",
                                                                                        onClick: ()=>removeDocument(positionIndex, docIndex),
                                                                                        className: "px-3 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors",
                                                                                        children: "Remove"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                        lineNumber: 1418,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                                lineNumber: 1392,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                        lineNumber: 1356,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                                lineNumber: 1306,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, docIndex, false, {
                                                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                            lineNumber: 1302,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                                lineNumber: 1279,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, positionIndex, true, {
                                        fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                        lineNumber: 1030,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                            lineNumber: 1015,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-4 pt-6 border-t border-neutral-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 1439,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? "Saving..." : editData ? "Update Company" : "Create Company"
                                }, void 0, false, {
                                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                                    lineNumber: 1446,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                            lineNumber: 1438,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        errors.submit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-red-600 text-sm text-center mt-2",
                            children: errors.submit
                        }, void 0, false, {
                            fileName: "[project]/app/company-listing/CompanyFormModal.js",
                            lineNumber: 1459,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/company-listing/CompanyFormModal.js",
                    lineNumber: 624,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/company-listing/CompanyFormModal.js",
            lineNumber: 609,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/company-listing/CompanyFormModal.js",
        lineNumber: 608,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CompanyFormModal, "KYcDniHe+bg1pfhXCrNt49/pMD8=");
_c = CompanyFormModal;
const __TURBOPACK__default__export__ = CompanyFormModal;
var _c;
__turbopack_context__.k.register(_c, "CompanyFormModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_company-listing_CompanyFormModal_cdb62f8c.js.map