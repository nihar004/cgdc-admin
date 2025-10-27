(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/email-management/ComposeEmail.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
;
var _s = __turbopack_context__.k.signature();
;
;
const ComposeEmail = ()=>{
    _s();
    const { templates, sendCampaign, previewEmail, loading } = useEmail();
    const [previewData, setPreviewData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: "",
        subject: "",
        body: "",
        sender_email: "placement@college.edu",
        sendType: "filter",
        department: [],
        batch_year: "",
        min_cgpa: "",
        placement_status: "",
        recipient_emails: "",
        student_ids: "",
        event_id: "",
        recipient_type: "registered"
    });
    const handleUseTemplate = (template)=>{
        setFormData({
            ...formData,
            title: template.template_name,
            subject: template.subject,
            body: template.body
        });
    };
    const handlePreview = async ()=>{
        if (!formData.subject || !formData.body) {
            alert("Please enter subject and body");
            return;
        }
        const result = await previewEmail(formData.subject, formData.body);
        if (result.success) {
            setPreviewData(result.preview);
        }
    };
    const handleSend = async ()=>{
        if (!formData.title || !formData.subject || !formData.body) {
            alert("Please fill title, subject, and body");
            return;
        }
        if (!confirm("Are you sure you want to send this email?")) return;
        const payload = {
            title: formData.title,
            subject: formData.subject,
            body: formData.body,
            sender_email: formData.sender_email
        };
        if (formData.sendType === "filter") {
            const filters = {};
            if (formData.department.length > 0) filters.department = formData.department;
            if (formData.batch_year) filters.batch_year = parseInt(formData.batch_year);
            if (formData.min_cgpa) filters.min_cgpa = parseFloat(formData.min_cgpa);
            if (formData.placement_status) filters.placement_status = formData.placement_status;
            payload.recipient_filter = filters;
        } else if (formData.sendType === "manual") {
            const emails = formData.recipient_emails.split(",").map((e)=>e.trim()).filter((e)=>e);
            if (emails.length === 0) {
                alert("Please enter at least one email address");
                return;
            }
            payload.recipient_emails = emails;
        }
        const result = await sendCampaign(payload);
        if (result.success) {
            var _result_data_emailResults, _result_data_emailResults1;
            alert("Email sent successfully!\nSuccessful: ".concat(((_result_data_emailResults = result.data.emailResults) === null || _result_data_emailResults === void 0 ? void 0 : _result_data_emailResults.successful) || 0, "\nFailed: ").concat(((_result_data_emailResults1 = result.data.emailResults) === null || _result_data_emailResults1 === void 0 ? void 0 : _result_data_emailResults1.failed) || 0));
            setFormData({
                ...formData,
                title: "",
                subject: "",
                body: "",
                department: [],
                batch_year: "",
                min_cgpa: "",
                recipient_emails: ""
            });
        } else {
            alert("Failed to send email: " + result.message);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            templates.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                className: "w-5 h-5 text-blue-600"
                            }, void 0, false, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 105,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-gray-900",
                                children: "Quick Start Templates"
                            }, void 0, false, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 106,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/email-management/ComposeEmail.js",
                        lineNumber: 104,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: templates.map((template)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleUseTemplate(template),
                                className: "px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 hover:border-blue-300 transition-all",
                                children: template.template_name
                            }, template.id, false, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 112,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/app/email-management/ComposeEmail.js",
                        lineNumber: 110,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/email-management/ComposeEmail.js",
                lineNumber: 103,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl border border-gray-200 p-6 space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                        children: "Campaign Title"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                        lineNumber: 128,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: formData.title,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                title: e.target.value
                                            }),
                                        className: "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                        placeholder: "e.g., Google Drive Reminder - Jan 2024"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                        lineNumber: 131,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 127,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                        children: "Sender Email"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                        lineNumber: 142,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        value: formData.sender_email,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                sender_email: e.target.value
                                            }),
                                        className: "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                        lineNumber: 145,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 141,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/email-management/ComposeEmail.js",
                        lineNumber: 126,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                children: "Email Subject"
                            }, void 0, false, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 158,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: formData.subject,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        subject: e.target.value
                                    }),
                                className: "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                placeholder: "Use {first_name}, {last_name}, {cgpa}, etc."
                            }, void 0, false, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 161,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/email-management/ComposeEmail.js",
                        lineNumber: 157,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                children: "Email Body (HTML)"
                            }, void 0, false, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 174,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: formData.body,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        body: e.target.value
                                    }),
                                className: "w-full border border-gray-300 rounded-lg px-4 py-2.5 h-48 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                placeholder: "<p>Dear {first_name},</p><p>Your CGPA is {cgpa}...</p>"
                            }, void 0, false, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 177,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500 mt-2",
                                children: [
                                    "Available variables: ",
                                    "{first_name}",
                                    ", ",
                                    "{last_name}",
                                    ", ",
                                    "{cgpa}",
                                    ",",
                                    " ",
                                    "{department}",
                                    ", ",
                                    "{enrollment_number}",
                                    ", ",
                                    "{batch_year}"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 183,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/email-management/ComposeEmail.js",
                        lineNumber: 173,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-semibold text-gray-700 mb-3",
                                children: "Send To"
                            }, void 0, false, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 191,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-4 mb-4",
                                children: [
                                    "filter",
                                    "manual"
                                ].map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "radio",
                                                value: type,
                                                checked: formData.sendType === type,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        sendType: e.target.value
                                                    }),
                                                className: "w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                                lineNumber: 197,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-2 text-sm font-medium text-gray-700 capitalize",
                                                children: type === "filter" ? "Filter Students" : "Manual Emails"
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                                lineNumber: 206,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, type, true, {
                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                        lineNumber: 196,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 194,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            formData.sendType === "filter" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 rounded-lg p-4 space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: "Department (comma-separated)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                                lineNumber: 216,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formData.department.join(", "),
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        department: e.target.value.split(",").map((d)=>d.trim())
                                                    }),
                                                className: "w-full border border-gray-300 rounded-lg px-4 py-2",
                                                placeholder: "CSE, ECE, ME"
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                                lineNumber: 219,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                        lineNumber: 215,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Batch Year"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                                        lineNumber: 236,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: formData.batch_year,
                                                        onChange: (e)=>setFormData({
                                                                ...formData,
                                                                batch_year: e.target.value
                                                            }),
                                                        className: "w-full border border-gray-300 rounded-lg px-4 py-2",
                                                        placeholder: "2024"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                                        lineNumber: 239,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                                lineNumber: 235,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Min CGPA"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                                        lineNumber: 250,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.1",
                                                        value: formData.min_cgpa,
                                                        onChange: (e)=>setFormData({
                                                                ...formData,
                                                                min_cgpa: e.target.value
                                                            }),
                                                        className: "w-full border border-gray-300 rounded-lg px-4 py-2",
                                                        placeholder: "7.0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                                        lineNumber: 253,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                                lineNumber: 249,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Placement Status"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                                        lineNumber: 265,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: formData.placement_status,
                                                        onChange: (e)=>setFormData({
                                                                ...formData,
                                                                placement_status: e.target.value
                                                            }),
                                                        className: "w-full border border-gray-300 rounded-lg px-4 py-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "All"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                                                lineNumber: 278,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "eligible",
                                                                children: "Eligible"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                                                lineNumber: 279,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "placed",
                                                                children: "Placed"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                                                lineNumber: 280,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "unplaced",
                                                                children: "Unplaced"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                                                lineNumber: 281,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                                        lineNumber: 268,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                                lineNumber: 264,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                        lineNumber: 234,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 214,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            formData.sendType === "manual" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 rounded-lg p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                        children: "Email Addresses (comma-separated)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                        lineNumber: 290,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: formData.recipient_emails,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                recipient_emails: e.target.value
                                            }),
                                        className: "w-full border border-gray-300 rounded-lg px-4 py-2 h-24",
                                        placeholder: "student1@college.edu, student2@college.edu"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                        lineNumber: 293,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 289,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/email-management/ComposeEmail.js",
                        lineNumber: 190,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 pt-4 border-t",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handlePreview,
                                disabled: loading,
                                className: "px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                        lineNumber: 312,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Preview"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 307,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSend,
                                disabled: loading,
                                className: "px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-all shadow-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                        lineNumber: 320,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    loading ? "Sending..." : "Send Email"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/ComposeEmail.js",
                                lineNumber: 315,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/email-management/ComposeEmail.js",
                        lineNumber: 306,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/email-management/ComposeEmail.js",
                lineNumber: 124,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            previewData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center p-6 border-b",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-bold text-gray-900",
                                    children: "Email Preview"
                                }, void 0, false, {
                                    fileName: "[project]/app/email-management/ComposeEmail.js",
                                    lineNumber: 331,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setPreviewData(null),
                                    className: "p-2 hover:bg-gray-100 rounded-lg transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/ComposeEmail.js",
                                        lineNumber: 336,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/email-management/ComposeEmail.js",
                                    lineNumber: 332,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/email-management/ComposeEmail.js",
                            lineNumber: 330,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 overflow-y-auto max-h-[calc(85vh-80px)] space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold text-gray-600 mb-1",
                                            children: "Subject:"
                                        }, void 0, false, {
                                            fileName: "[project]/app/email-management/ComposeEmail.js",
                                            lineNumber: 341,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-lg font-medium",
                                            children: previewData.subject
                                        }, void 0, false, {
                                            fileName: "[project]/app/email-management/ComposeEmail.js",
                                            lineNumber: 344,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/email-management/ComposeEmail.js",
                                    lineNumber: 340,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold text-gray-600 mb-2",
                                            children: "Body:"
                                        }, void 0, false, {
                                            fileName: "[project]/app/email-management/ComposeEmail.js",
                                            lineNumber: 347,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border rounded-lg p-4 bg-gray-50",
                                            dangerouslySetInnerHTML: {
                                                __html: previewData.body
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/email-management/ComposeEmail.js",
                                            lineNumber: 350,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/email-management/ComposeEmail.js",
                                    lineNumber: 346,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/email-management/ComposeEmail.js",
                            lineNumber: 339,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/email-management/ComposeEmail.js",
                    lineNumber: 329,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/email-management/ComposeEmail.js",
                lineNumber: 328,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/email-management/ComposeEmail.js",
        lineNumber: 100,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ComposeEmail, "dzFkq+R/a/bQy632o+CwHgnj9ig=", true);
_c = ComposeEmail;
const __TURBOPACK__default__export__ = ComposeEmail;
var _c;
__turbopack_context__.k.register(_c, "ComposeEmail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/email-management/Templates.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
;
var _s = __turbopack_context__.k.signature();
;
;
const Templates = ()=>{
    _s();
    const { templates, createTemplate, updateTemplate, deleteTemplate, loading } = useEmail();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        template_name: "",
        subject: "",
        body: "",
        category: "general"
    });
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleSave = async ()=>{
        if (!form.template_name || !form.subject || !form.body) {
            alert("Please fill all fields");
            return;
        }
        const result = editing ? await updateTemplate(editing.id, form) : await createTemplate(form);
        if (result.success) {
            alert(result.message);
            setForm({
                template_name: "",
                subject: "",
                body: "",
                category: "general"
            });
            setEditing(null);
        } else {
            alert("Failed to save: " + result.message);
        }
    };
    const handleDelete = async (id)=>{
        if (!confirm("Delete this template?")) return;
        const result = await deleteTemplate(id);
        if (result.success) {
            alert("Template deleted");
        }
    };
    const handleEdit = (template)=>{
        setEditing(template);
        setForm({
            template_name: template.template_name,
            subject: template.subject,
            body: template.body,
            category: template.category
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl border border-gray-200 p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-bold text-gray-900 mb-4",
                        children: editing ? "Edit Template" : "Create New Template"
                    }, void 0, false, {
                        fileName: "[project]/app/email-management/Templates.js",
                        lineNumber: 61,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                children: "Template Name"
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/Templates.js",
                                                lineNumber: 67,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: form.template_name,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        template_name: e.target.value
                                                    }),
                                                className: "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                placeholder: "Welcome Email"
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/Templates.js",
                                                lineNumber: 70,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/email-management/Templates.js",
                                        lineNumber: 66,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-semibold text-gray-700 mb-2",
                                                children: "Category"
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/Templates.js",
                                                lineNumber: 81,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: form.category,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        category: e.target.value
                                                    }),
                                                className: "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "general",
                                                        children: "General"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/Templates.js",
                                                        lineNumber: 89,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "placement",
                                                        children: "Placement"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/Templates.js",
                                                        lineNumber: 90,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "event",
                                                        children: "Event"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/Templates.js",
                                                        lineNumber: 91,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "reminder",
                                                        children: "Reminder"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/Templates.js",
                                                        lineNumber: 92,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/email-management/Templates.js",
                                                lineNumber: 84,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/email-management/Templates.js",
                                        lineNumber: 80,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/Templates.js",
                                lineNumber: 65,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                        children: "Subject"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/Templates.js",
                                        lineNumber: 97,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: form.subject,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                subject: e.target.value
                                            }),
                                        className: "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                        placeholder: "Welcome to our platform"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/Templates.js",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/Templates.js",
                                lineNumber: 96,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                        children: "Body (HTML)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/Templates.js",
                                        lineNumber: 109,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: form.body,
                                        onChange: (e)=>setForm({
                                                ...form,
                                                body: e.target.value
                                            }),
                                        className: "w-full border border-gray-300 rounded-lg px-4 py-2.5 h-32 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                        placeholder: "<p>Hello {first_name}...</p>"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/Templates.js",
                                        lineNumber: 112,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/Templates.js",
                                lineNumber: 108,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleSave,
                                        disabled: loading,
                                        className: "px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-all shadow-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/Templates.js",
                                                lineNumber: 125,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            editing ? "Update" : "Save",
                                            " Template"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/email-management/Templates.js",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    editing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setEditing(null);
                                            setForm({
                                                template_name: "",
                                                subject: "",
                                                body: "",
                                                category: "general"
                                            });
                                        },
                                        className: "px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium transition-all",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/Templates.js",
                                        lineNumber: 129,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/Templates.js",
                                lineNumber: 119,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/email-management/Templates.js",
                        lineNumber: 64,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/email-management/Templates.js",
                lineNumber: 60,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                children: [
                    templates.map((template)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-start mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-bold text-gray-900 mb-1",
                                                children: template.template_name
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/Templates.js",
                                                lineNumber: 157,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-600 mb-2",
                                                children: template.subject
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/Templates.js",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full",
                                                children: template.category
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/Templates.js",
                                                lineNumber: 161,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/email-management/Templates.js",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleEdit(template),
                                                className: "p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors",
                                                title: "Edit",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/email-management/Templates.js",
                                                    lineNumber: 171,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/Templates.js",
                                                lineNumber: 166,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleDelete(template.id),
                                                className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                                                title: "Delete",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/email-management/Templates.js",
                                                    lineNumber: 178,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/Templates.js",
                                                lineNumber: 173,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/email-management/Templates.js",
                                        lineNumber: 165,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/Templates.js",
                                lineNumber: 155,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, template.id, false, {
                            fileName: "[project]/app/email-management/Templates.js",
                            lineNumber: 151,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))),
                    templates.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "col-span-2 text-center py-12 text-gray-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                className: "w-12 h-12 mx-auto mb-3 opacity-30"
                            }, void 0, false, {
                                fileName: "[project]/app/email-management/Templates.js",
                                lineNumber: 186,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "No templates yet. Create one above!"
                            }, void 0, false, {
                                fileName: "[project]/app/email-management/Templates.js",
                                lineNumber: 187,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/email-management/Templates.js",
                        lineNumber: 185,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/email-management/Templates.js",
                lineNumber: 149,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/email-management/Templates.js",
        lineNumber: 58,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Templates, "Rtuft0CtTbSRqLZ4Ccgz/FKQPHk=", true);
_c = Templates;
const __TURBOPACK__default__export__ = Templates;
var _c;
__turbopack_context__.k.register(_c, "Templates");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/email-management/CampaignHistory.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
;
var _s = __turbopack_context__.k.signature();
;
const CampaignHistory = ()=>{
    _s();
    const { campaigns, deleteCampaign } = useEmail();
    const handleDelete = async (id)=>{
        if (!confirm("Delete this campaign?")) return;
        const result = await deleteCampaign(id);
        if (result.success) {
            alert("Campaign deleted");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            campaigns.map((campaign)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-bold text-gray-900 text-lg",
                                                children: campaign.title
                                            }, void 0, false, {
                                                fileName: "[project]/app/email-management/CampaignHistory.js",
                                                lineNumber: 24,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/CampaignHistory.js",
                                                        lineNumber: 28,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "Sent"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/email-management/CampaignHistory.js",
                                                lineNumber: 27,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/email-management/CampaignHistory.js",
                                        lineNumber: 23,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600 mb-3",
                                        children: campaign.subject
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/CampaignHistory.js",
                                        lineNumber: 32,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-4 text-sm text-gray-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/CampaignHistory.js",
                                                        lineNumber: 35,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    campaign.total_recipients,
                                                    " recipients"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/email-management/CampaignHistory.js",
                                                lineNumber: 34,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/CampaignHistory.js",
                                                        lineNumber: 39,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    new Date(campaign.sent_at).toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/email-management/CampaignHistory.js",
                                                lineNumber: 38,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            campaign.event_title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/email-management/CampaignHistory.js",
                                                        lineNumber: 44,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    "Event: ",
                                                    campaign.event_title
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/email-management/CampaignHistory.js",
                                                lineNumber: 43,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/email-management/CampaignHistory.js",
                                        lineNumber: 33,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/email-management/CampaignHistory.js",
                                lineNumber: 22,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleDelete(campaign.id),
                                className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                                title: "Delete",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/app/email-management/CampaignHistory.js",
                                    lineNumber: 55,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/email-management/CampaignHistory.js",
                                lineNumber: 50,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/email-management/CampaignHistory.js",
                        lineNumber: 21,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, campaign.id, false, {
                    fileName: "[project]/app/email-management/CampaignHistory.js",
                    lineNumber: 17,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))),
            campaigns.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-16 text-gray-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                        className: "w-12 h-12 mx-auto mb-3 opacity-30"
                    }, void 0, false, {
                        fileName: "[project]/app/email-management/CampaignHistory.js",
                        lineNumber: 62,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "No campaigns sent yet."
                    }, void 0, false, {
                        fileName: "[project]/app/email-management/CampaignHistory.js",
                        lineNumber: 63,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/email-management/CampaignHistory.js",
                lineNumber: 61,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/email-management/CampaignHistory.js",
        lineNumber: 15,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CampaignHistory, "LUk51UY9Q72RSA4uUML1ivTpeUg=", true);
_c = CampaignHistory;
const __TURBOPACK__default__export__ = CampaignHistory;
var _c;
__turbopack_context__.k.register(_c, "CampaignHistory");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/context/EmailContext.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "EmailProvider": ()=>EmailProvider,
    "useEmail": ()=>useEmail
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const EmailContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
const EmailProvider = (param)=>{
    let { children } = param;
    _s();
    const [templates, setTemplates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [campaigns, setCampaigns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const API_BASE = "http://localhost:5000";
    // Fetch templates
    const fetchTemplates = async ()=>{
        try {
            const response = await fetch("".concat(API_BASE, "/emails/email-templates"), {
                credentials: "include"
            });
            const data = await response.json();
            if (data.success) {
                setTemplates(data.templates);
            }
        } catch (error) {
            console.error("Failed to fetch templates:", error);
        }
    };
    // Fetch campaigns
    const fetchCampaigns = async ()=>{
        try {
            const response = await fetch("".concat(API_BASE, "/emails/email-campaigns?page=1&limit=50"), {
                credentials: "include"
            });
            const data = await response.json();
            if (data.success) {
                setCampaigns(data.campaigns);
            }
        } catch (error) {
            console.error("Failed to fetch campaigns:", error);
        }
    };
    // Create template
    const createTemplate = async (templateData)=>{
        setLoading(true);
        try {
            const response = await fetch("".concat(API_BASE, "/emails/email-templates"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(templateData)
            });
            const data = await response.json();
            if (data.success) {
                await fetchTemplates();
                return {
                    success: true,
                    message: data.message
                };
            }
            return {
                success: false,
                message: data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        } finally{
            setLoading(false);
        }
    };
    // Update template
    const updateTemplate = async (id, templateData)=>{
        setLoading(true);
        try {
            const response = await fetch("".concat(API_BASE, "/emails/email-templates/").concat(id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(templateData)
            });
            const data = await response.json();
            if (data.success) {
                await fetchTemplates();
                return {
                    success: true,
                    message: data.message
                };
            }
            return {
                success: false,
                message: data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        } finally{
            setLoading(false);
        }
    };
    // Delete template
    const deleteTemplate = async (id)=>{
        try {
            const response = await fetch("".concat(API_BASE, "/emails/email-templates/").concat(id), {
                method: "DELETE",
                credentials: "include"
            });
            const data = await response.json();
            if (data.success) {
                await fetchTemplates();
                return {
                    success: true
                };
            }
            return {
                success: false
            };
        } catch (error) {
            return {
                success: false
            };
        }
    };
    // Send email campaign
    const sendCampaign = async (campaignData)=>{
        setLoading(true);
        try {
            const response = await fetch("".concat(API_BASE, "/emails/email-campaigns/send"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(campaignData)
            });
            const data = await response.json();
            if (data.success) {
                await fetchCampaigns();
                return {
                    success: true,
                    data
                };
            }
            return {
                success: false,
                message: data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        } finally{
            setLoading(false);
        }
    };
    // Preview email
    const previewEmail = async (subject, body)=>{
        try {
            const response = await fetch("".concat(API_BASE, "/emails/email-campaigns/preview"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    subject,
                    body
                })
            });
            const data = await response.json();
            if (data.success) {
                return {
                    success: true,
                    preview: data.preview
                };
            }
            return {
                success: false
            };
        } catch (error) {
            return {
                success: false
            };
        }
    };
    // Delete campaign
    const deleteCampaign = async (id)=>{
        try {
            const response = await fetch("".concat(API_BASE, "/emails/email-campaigns/").concat(id), {
                method: "DELETE",
                credentials: "include"
            });
            const data = await response.json();
            if (data.success) {
                await fetchCampaigns();
                return {
                    success: true
                };
            }
            return {
                success: false
            };
        } catch (error) {
            return {
                success: false
            };
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EmailProvider.useEffect": ()=>{
            fetchTemplates();
            fetchCampaigns();
        }
    }["EmailProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmailContext.Provider, {
        value: {
            templates,
            campaigns,
            loading,
            createTemplate,
            updateTemplate,
            deleteTemplate,
            sendCampaign,
            previewEmail,
            deleteCampaign,
            fetchTemplates,
            fetchCampaigns
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/EmailContext.js",
        lineNumber: 178,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(EmailProvider, "1QL6ACQoTxZYupP/GF72efUcYQ8=");
_c = EmailProvider;
const useEmail = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(EmailContext);
    if (!context) {
        throw new Error("useEmail must be used within EmailProvider");
    }
    return context;
};
_s1(useEmail, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "EmailProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/email-management/page.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Send,
//   Mail,
//   Users,
//   Eye,
//   Trash2,
//   Plus,
//   Edit,
//   Save,
//   X,
// } from "lucide-react";
// const EmailCampaignPage = () => {
//   const [activeTab, setActiveTab] = useState("compose");
//   const [templates, setTemplates] = useState([]);
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [previewData, setPreviewData] = useState(null);
//   // Template form state
//   const [templateForm, setTemplateForm] = useState({
//     template_name: "",
//     subject: "",
//     body: "",
//     category: "general",
//   });
//   const [editingTemplate, setEditingTemplate] = useState(null);
//   // Email compose form state
//   const [emailForm, setEmailForm] = useState({
//     title: "",
//     subject: "",
//     body: "",
//     sender_email: "placement@college.edu",
//     sendType: "filter", // 'filter', 'manual', 'students', 'event'
//     // Filter options
//     department: [],
//     batch_year: "",
//     min_cgpa: "",
//     placement_status: "",
//     // Manual emails
//     recipient_emails: "",
//     // Student IDs
//     student_ids: "",
//     // Event
//     event_id: "",
//     recipient_type: "registered",
//   });
//   // Configure axios defaults
//   axios.defaults.baseURL = "http://localhost:5000";
//   axios.defaults.withCredentials = true;
//   // Fetch templates
//   const fetchTemplates = async () => {
//     try {
//       const { data } = await axios.get("/emails/email-templates");
//       if (data.success) {
//         setTemplates(data.templates);
//       }
//     } catch (error) {
//       alert(
//         "Failed to fetch templates: " + error.response?.data?.message ||
//           error.message
//       );
//     }
//   };
//   // Fetch campaigns
//   const fetchCampaigns = async () => {
//     try {
//       const { data } = await axios.get("/emails/email-campaigns", {
//         params: { page: 1, limit: 50 },
//       });
//       if (data.success) {
//         setCampaigns(data.campaigns);
//       }
//     } catch (error) {
//       alert(
//         "Failed to fetch campaigns: " + error.response?.data?.message ||
//           error.message
//       );
//     }
//   };
//   useEffect(() => {
//     fetchTemplates();
//     fetchCampaigns();
//   }, []);
//   // Handle template operations
//   const handleSaveTemplate = async () => {
//     if (
//       !templateForm.template_name ||
//       !templateForm.subject ||
//       !templateForm.body
//     ) {
//       alert("Please fill all template fields");
//       return;
//     }
//     setLoading(true);
//     try {
//       const url = editingTemplate
//         ? `/emails/email-templates/${editingTemplate.id}`
//         : "/emails/email-templates";
//       const method = editingTemplate ? "put" : "post";
//       const { data } = await axios[method](url, templateForm);
//       if (data.success) {
//         alert(data.message);
//         fetchTemplates();
//         setTemplateForm({
//           template_name: "",
//           subject: "",
//           body: "",
//           category: "general",
//         });
//         setEditingTemplate(null);
//       }
//     } catch (error) {
//       alert(
//         "Failed to save template: " + error.response?.data?.message ||
//           error.message
//       );
//     }
//     setLoading(false);
//   };
//   const handleDeleteTemplate = async (id) => {
//     if (!confirm("Delete this template?")) return;
//     try {
//       const { data } = await axios.delete(`/emails/email-templates/${id}`);
//       if (data.success) {
//         alert("Template deleted");
//         fetchTemplates();
//       }
//     } catch (error) {
//       alert(
//         "Failed to delete template: " + error.response?.data?.message ||
//           error.message
//       );
//     }
//   };
//   const handleUseTemplate = (template) => {
//     setEmailForm({
//       ...emailForm,
//       title: template.template_name,
//       subject: template.subject,
//       body: template.body,
//     });
//     setActiveTab("compose");
//   };
//   // Handle email preview
//   const handlePreview = async () => {
//     if (!emailForm.subject || !emailForm.body) {
//       alert("Please enter subject and body");
//       return;
//     }
//     setLoading(true);
//     try {
//       const { data } = await axios.post("/emails/email-campaigns/preview", {
//         subject: emailForm.subject,
//         body: emailForm.body,
//       });
//       if (data.success) {
//         setPreviewData(data.preview);
//       }
//     } catch (error) {
//       alert(
//         "Failed to preview email: " + error.response?.data?.message ||
//           error.message
//       );
//     }
//     setLoading(false);
//   };
//   // Handle send email
//   const handleSendEmail = async () => {
//     if (!emailForm.title || !emailForm.subject || !emailForm.body) {
//       alert("Please fill title, subject, and body");
//       return;
//     }
//     if (!confirm("Are you sure you want to send this email?")) return;
//     setLoading(true);
//     try {
//       let url = "/emails/email-campaigns/send";
//       let body = {
//         title: emailForm.title,
//         subject: emailForm.subject,
//         body: emailForm.body,
//         sender_email: emailForm.sender_email,
//       };
//       if (emailForm.sendType === "filter") {
//         const filters = {};
//         if (emailForm.department.length > 0)
//           filters.department = emailForm.department;
//         if (emailForm.batch_year)
//           filters.batch_year = parseInt(emailForm.batch_year);
//         if (emailForm.min_cgpa)
//           filters.min_cgpa = parseFloat(emailForm.min_cgpa);
//         if (emailForm.placement_status)
//           filters.placement_status = emailForm.placement_status;
//         body.recipient_filter = filters;
//       } else if (emailForm.sendType === "manual") {
//         const emails = emailForm.recipient_emails
//           .split(",")
//           .map((e) => e.trim())
//           .filter((e) => e);
//         if (emails.length === 0) {
//           alert("Please enter at least one email address");
//           setLoading(false);
//           return;
//         }
//         body.recipient_emails = emails;
//       } else if (emailForm.sendType === "students") {
//         url = "/emails/email-campaigns/send/students";
//         const ids = emailForm.student_ids
//           .split(",")
//           .map((id) => parseInt(id.trim()))
//           .filter((id) => !isNaN(id));
//         if (ids.length === 0) {
//           alert("Please enter at least one student ID");
//           setLoading(false);
//           return;
//         }
//         body.student_ids = ids;
//       } else if (emailForm.sendType === "event") {
//         if (!emailForm.event_id) {
//           alert("Please enter event ID");
//           setLoading(false);
//           return;
//         }
//         url = `/emails/email-campaigns/send/event/${emailForm.event_id}`;
//         body.recipient_type = emailForm.recipient_type;
//       }
//       const { data } = await axios.post(url, body);
//       if (data.success) {
//         alert(
//           `${data.message}\nSuccessful: ${data.emailResults?.successful || 0}\nFailed: ${data.emailResults?.failed || 0}`
//         );
//         fetchCampaigns();
//         // Reset form
//         setEmailForm({
//           ...emailForm,
//           title: "",
//           subject: "",
//           body: "",
//           department: [],
//           batch_year: "",
//           min_cgpa: "",
//           recipient_emails: "",
//           student_ids: "",
//           event_id: "",
//         });
//       }
//     } catch (error) {
//       alert(
//         "Failed to send email: " + error.response?.data?.message ||
//           error.message
//       );
//     }
//     setLoading(false);
//   };
//   const handleDeleteCampaign = async (id) => {
//     if (!confirm("Delete this campaign?")) return;
//     try {
//       const { data } = await axios.delete(`/emails/email-campaigns/${id}`);
//       if (data.success) {
//         alert("Campaign deleted");
//         fetchCampaigns();
//       }
//     } catch (error) {
//       alert(
//         "Failed to delete campaign: " + error.response?.data?.message ||
//           error.message
//       );
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//           <Mail className="w-8 h-8" />
//           Email Campaign Manager
//         </h1>
//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow mb-6">
//           <div className="flex border-b">
//             <button
//               onClick={() => setActiveTab("compose")}
//               className={`px-6 py-3 font-medium ${activeTab === "compose" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
//             >
//               <Send className="w-4 h-4 inline mr-2" />
//               Compose Email
//             </button>
//             <button
//               onClick={() => setActiveTab("templates")}
//               className={`px-6 py-3 font-medium ${activeTab === "templates" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
//             >
//               <Mail className="w-4 h-4 inline mr-2" />
//               Templates
//             </button>
//             <button
//               onClick={() => setActiveTab("history")}
//               className={`px-6 py-3 font-medium ${activeTab === "history" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
//             >
//               <Users className="w-4 h-4 inline mr-2" />
//               Campaign History
//             </button>
//           </div>
//         </div>
//         {/* Compose Email Tab */}
//         {activeTab === "compose" && (
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Compose New Email</h2>
//             {/* Quick Templates */}
//             {templates.length > 0 && (
//               <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//                 <p className="font-medium mb-2">Quick Start - Use Template:</p>
//                 <div className="flex flex-wrap gap-2">
//                   {templates.map((template) => (
//                     <button
//                       key={template.id}
//                       onClick={() => handleUseTemplate(template)}
//                       className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
//                     >
//                       {template.template_name}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <div className="space-y-4">
//               <div>
//                 <label className="block font-medium mb-2">
//                   Campaign Title (Internal)
//                 </label>
//                 <input
//                   type="text"
//                   value={emailForm.title}
//                   onChange={(e) =>
//                     setEmailForm({ ...emailForm, title: e.target.value })
//                   }
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="e.g., Google Drive Reminder - Jan 2024"
//                 />
//               </div>
//               <div>
//                 <label className="block font-medium mb-2">Sender Email</label>
//                 <input
//                   type="email"
//                   value={emailForm.sender_email}
//                   onChange={(e) =>
//                     setEmailForm({ ...emailForm, sender_email: e.target.value })
//                   }
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="placement@college.edu"
//                 />
//               </div>
//               <div>
//                 <label className="block font-medium mb-2">Email Subject</label>
//                 <input
//                   type="text"
//                   value={emailForm.subject}
//                   onChange={(e) =>
//                     setEmailForm({ ...emailForm, subject: e.target.value })
//                   }
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="Use {first_name}, {last_name}, {cgpa}, etc."
//                 />
//               </div>
//               <div>
//                 <label className="block font-medium mb-2">
//                   Email Body (HTML)
//                 </label>
//                 <textarea
//                   value={emailForm.body}
//                   onChange={(e) =>
//                     setEmailForm({ ...emailForm, body: e.target.value })
//                   }
//                   className="w-full border rounded px-3 py-2 h-48 font-mono text-sm"
//                   placeholder="<p>Dear {first_name},</p><p>Your CGPA is {cgpa}...</p>"
//                 />
//                 <p className="text-sm text-gray-600 mt-1">
//                   Available variables: {"{first_name}"}, {"{last_name}"},{" "}
//                   {"{cgpa}"}, {"{department}"}, {"{enrollment_number}"},{" "}
//                   {"{batch_year}"}
//                 </p>
//               </div>
//               {/* Recipient Type Selection */}
//               <div>
//                 <label className="block font-medium mb-2">Send To</label>
//                 <div className="flex gap-4 mb-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       value="filter"
//                       checked={emailForm.sendType === "filter"}
//                       onChange={(e) =>
//                         setEmailForm({ ...emailForm, sendType: e.target.value })
//                       }
//                       className="mr-2"
//                     />
//                     Filter Students
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       value="manual"
//                       checked={emailForm.sendType === "manual"}
//                       onChange={(e) =>
//                         setEmailForm({ ...emailForm, sendType: e.target.value })
//                       }
//                       className="mr-2"
//                     />
//                     Manual Emails
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       value="students"
//                       checked={emailForm.sendType === "students"}
//                       onChange={(e) =>
//                         setEmailForm({ ...emailForm, sendType: e.target.value })
//                       }
//                       className="mr-2"
//                     />
//                     Student IDs
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       value="event"
//                       checked={emailForm.sendType === "event"}
//                       onChange={(e) =>
//                         setEmailForm({ ...emailForm, sendType: e.target.value })
//                       }
//                       className="mr-2"
//                     />
//                     Event Participants
//                   </label>
//                 </div>
//                 {/* Filter Options */}
//                 {emailForm.sendType === "filter" && (
//                   <div className="space-y-3 p-4 bg-gray-50 rounded">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         Department (comma-separated)
//                       </label>
//                       <input
//                         type="text"
//                         value={emailForm.department.join(", ")}
//                         onChange={(e) =>
//                           setEmailForm({
//                             ...emailForm,
//                             department: e.target.value
//                               .split(",")
//                               .map((d) => d.trim()),
//                           })
//                         }
//                         className="w-full border rounded px-3 py-2"
//                         placeholder="CSE, ECE, ME"
//                       />
//                     </div>
//                     <div className="grid grid-cols-3 gap-3">
//                       <div>
//                         <label className="block text-sm font-medium mb-1">
//                           Batch Year
//                         </label>
//                         <input
//                           type="number"
//                           value={emailForm.batch_year}
//                           onChange={(e) =>
//                             setEmailForm({
//                               ...emailForm,
//                               batch_year: e.target.value,
//                             })
//                           }
//                           className="w-full border rounded px-3 py-2"
//                           placeholder="2024"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-1">
//                           Min CGPA
//                         </label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           value={emailForm.min_cgpa}
//                           onChange={(e) =>
//                             setEmailForm({
//                               ...emailForm,
//                               min_cgpa: e.target.value,
//                             })
//                           }
//                           className="w-full border rounded px-3 py-2"
//                           placeholder="7.0"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-1">
//                           Placement Status
//                         </label>
//                         <select
//                           value={emailForm.placement_status}
//                           onChange={(e) =>
//                             setEmailForm({
//                               ...emailForm,
//                               placement_status: e.target.value,
//                             })
//                           }
//                           className="w-full border rounded px-3 py-2"
//                         >
//                           <option value="">All</option>
//                           <option value="eligible">Eligible</option>
//                           <option value="placed">Placed</option>
//                           <option value="unplaced">Unplaced</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 {/* Manual Emails */}
//                 {emailForm.sendType === "manual" && (
//                   <div className="p-4 bg-gray-50 rounded">
//                     <label className="block text-sm font-medium mb-1">
//                       Email Addresses (comma-separated)
//                     </label>
//                     <textarea
//                       value={emailForm.recipient_emails}
//                       onChange={(e) =>
//                         setEmailForm({
//                           ...emailForm,
//                           recipient_emails: e.target.value,
//                         })
//                       }
//                       className="w-full border rounded px-3 py-2 h-24"
//                       placeholder="student1@college.edu, student2@college.edu"
//                     />
//                   </div>
//                 )}
//                 {/* Student IDs */}
//                 {emailForm.sendType === "students" && (
//                   <div className="p-4 bg-gray-50 rounded">
//                     <label className="block text-sm font-medium mb-1">
//                       Student IDs (comma-separated)
//                     </label>
//                     <input
//                       type="text"
//                       value={emailForm.student_ids}
//                       onChange={(e) =>
//                         setEmailForm({
//                           ...emailForm,
//                           student_ids: e.target.value,
//                         })
//                       }
//                       className="w-full border rounded px-3 py-2"
//                       placeholder="1, 2, 3, 45, 67"
//                     />
//                   </div>
//                 )}
//                 {/* Event Options */}
//                 {emailForm.sendType === "event" && (
//                   <div className="p-4 bg-gray-50 rounded space-y-3">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         Event ID
//                       </label>
//                       <input
//                         type="number"
//                         value={emailForm.event_id}
//                         onChange={(e) =>
//                           setEmailForm({
//                             ...emailForm,
//                             event_id: e.target.value,
//                           })
//                         }
//                         className="w-full border rounded px-3 py-2"
//                         placeholder="1"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-1">
//                         Recipient Type
//                       </label>
//                       <select
//                         value={emailForm.recipient_type}
//                         onChange={(e) =>
//                           setEmailForm({
//                             ...emailForm,
//                             recipient_type: e.target.value,
//                           })
//                         }
//                         className="w-full border rounded px-3 py-2"
//                       >
//                         <option value="registered">Registered Students</option>
//                         <option value="attended">Attended Students</option>
//                         <option value="absent">Absent Students</option>
//                         <option value="selected">Selected Students</option>
//                       </select>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               {/* Action Buttons */}
//               <div className="flex gap-3">
//                 <button
//                   onClick={handlePreview}
//                   disabled={loading}
//                   className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
//                 >
//                   <Eye className="w-4 h-4" />
//                   Preview
//                 </button>
//                 <button
//                   onClick={handleSendEmail}
//                   disabled={loading}
//                   className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//                 >
//                   <Send className="w-4 h-4" />
//                   {loading ? "Sending..." : "Send Email"}
//                 </button>
//               </div>
//             </div>
//             {/* Preview Modal */}
//             {previewData && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                 <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-xl font-bold">Email Preview</h3>
//                     <button onClick={() => setPreviewData(null)}>
//                       <X className="w-6 h-6" />
//                     </button>
//                   </div>
//                   <div className="space-y-3">
//                     <div>
//                       <p className="font-medium text-sm text-gray-600">
//                         Subject:
//                       </p>
//                       <p className="text-lg">{previewData.subject}</p>
//                     </div>
//                     <div>
//                       <p className="font-medium text-sm text-gray-600 mb-2">
//                         Body:
//                       </p>
//                       <div
//                         className="border rounded p-4 bg-gray-50"
//                         dangerouslySetInnerHTML={{ __html: previewData.body }}
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium text-sm text-gray-600">
//                         Sample Data Used:
//                       </p>
//                       <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
//                         {JSON.stringify(previewData.sample_data, null, 2)}
//                       </pre>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//         {/* Templates Tab */}
//         {activeTab === "templates" && (
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Email Templates</h2>
//             {/* Create/Edit Template Form */}
//             <div className="mb-6 p-4 bg-gray-50 rounded">
//               <h3 className="font-bold mb-3">
//                 {editingTemplate ? "Edit Template" : "Create New Template"}
//               </h3>
//               <div className="space-y-3">
//                 <input
//                   type="text"
//                   value={templateForm.template_name}
//                   onChange={(e) =>
//                     setTemplateForm({
//                       ...templateForm,
//                       template_name: e.target.value,
//                     })
//                   }
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="Template Name"
//                 />
//                 <input
//                   type="text"
//                   value={templateForm.subject}
//                   onChange={(e) =>
//                     setTemplateForm({
//                       ...templateForm,
//                       subject: e.target.value,
//                     })
//                   }
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="Subject"
//                 />
//                 <textarea
//                   value={templateForm.body}
//                   onChange={(e) =>
//                     setTemplateForm({ ...templateForm, body: e.target.value })
//                   }
//                   className="w-full border rounded px-3 py-2 h-32"
//                   placeholder="Body (HTML)"
//                 />
//                 <select
//                   value={templateForm.category}
//                   onChange={(e) =>
//                     setTemplateForm({
//                       ...templateForm,
//                       category: e.target.value,
//                     })
//                   }
//                   className="w-full border rounded px-3 py-2"
//                 >
//                   <option value="general">General</option>
//                   <option value="placement">Placement</option>
//                   <option value="event">Event</option>
//                   <option value="reminder">Reminder</option>
//                 </select>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleSaveTemplate}
//                     disabled={loading}
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//                   >
//                     <Save className="w-4 h-4" />
//                     {editingTemplate ? "Update" : "Save"} Template
//                   </button>
//                   {editingTemplate && (
//                     <button
//                       onClick={() => {
//                         setEditingTemplate(null);
//                         setTemplateForm({
//                           template_name: "",
//                           subject: "",
//                           body: "",
//                           category: "general",
//                         });
//                       }}
//                       className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//                     >
//                       Cancel
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//             {/* Templates List */}
//             <div className="space-y-3">
//               {templates.map((template) => (
//                 <div
//                   key={template.id}
//                   className="border rounded p-4 hover:bg-gray-50"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <h4 className="font-bold">{template.template_name}</h4>
//                       <p className="text-sm text-gray-600 mb-1">
//                         {template.subject}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {template.category}
//                       </p>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleUseTemplate(template)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded"
//                         title="Use Template"
//                       >
//                         <Mail className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setEditingTemplate(template);
//                           setTemplateForm({
//                             template_name: template.template_name,
//                             subject: template.subject,
//                             body: template.body,
//                             category: template.category,
//                           });
//                         }}
//                         className="p-2 text-green-600 hover:bg-green-50 rounded"
//                         title="Edit"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteTemplate(template.id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded"
//                         title="Delete"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {templates.length === 0 && (
//                 <p className="text-gray-500 text-center py-8">
//                   No templates yet. Create one above!
//                 </p>
//               )}
//             </div>
//           </div>
//         )}
//         {/* Campaign History Tab */}
//         {activeTab === "history" && (
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-bold mb-4">Campaign History</h2>
//             <div className="space-y-3">
//               {campaigns.map((campaign) => (
//                 <div
//                   key={campaign.id}
//                   className="border rounded p-4 hover:bg-gray-50"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <h4 className="font-bold">{campaign.title}</h4>
//                       <p className="text-sm text-gray-600 mb-1">
//                         {campaign.subject}
//                       </p>
//                       <div className="flex gap-4 text-xs text-gray-500 mt-2">
//                         <span>Recipients: {campaign.total_recipients}</span>
//                         <span>
//                           Sent: {new Date(campaign.sent_at).toLocaleString()}
//                         </span>
//                         {campaign.event_title && (
//                           <span>Event: {campaign.event_title}</span>
//                         )}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => handleDeleteCampaign(campaign.id)}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded"
//                       title="Delete"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               {campaigns.length === 0 && (
//                 <p className="text-gray-500 text-center py-8">
//                   No campaigns sent yet.
//                 </p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default EmailCampaignPage;
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$email$2d$management$2f$ComposeEmail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/email-management/ComposeEmail.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$email$2d$management$2f$Templates$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/email-management/Templates.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$email$2d$management$2f$CampaignHistory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/email-management/CampaignHistory.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$EmailContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/EmailContext.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const EmailCampaignPage = ()=>{
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("compose");
    const tabs = [
        {
            id: "compose",
            label: "Compose Email",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"]
        },
        {
            id: "templates",
            label: "Templates",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"]
        },
        {
            id: "history",
            label: "Campaign History",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$EmailContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmailProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                        className: "w-6 h-6 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/app/email-management/page.js",
                                        lineNumber: 922,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/email-management/page.js",
                                    lineNumber: 921,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-3xl font-bold text-gray-900",
                                            children: "Email Campaign Manager"
                                        }, void 0, false, {
                                            fileName: "[project]/app/email-management/page.js",
                                            lineNumber: 925,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-600",
                                            children: "Create, manage, and track email communications"
                                        }, void 0, false, {
                                            fileName: "[project]/app/email-management/page.js",
                                            lineNumber: 928,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/email-management/page.js",
                                    lineNumber: 924,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/email-management/page.js",
                            lineNumber: 920,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/app/email-management/page.js",
                        lineNumber: 919,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex border-b border-gray-200",
                            children: tabs.map((tab)=>{
                                const Icon = tab.icon;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveTab(tab.id),
                                    className: "flex-1 px-6 py-4 font-semibold text-sm flex items-center justify-center gap-2 transition-all ".concat(activeTab === tab.id ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/email-management/page.js",
                                            lineNumber: 950,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        tab.label
                                    ]
                                }, tab.id, true, {
                                    fileName: "[project]/app/email-management/page.js",
                                    lineNumber: 941,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0));
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/email-management/page.js",
                            lineNumber: 937,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/app/email-management/page.js",
                        lineNumber: 936,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            activeTab === "compose" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$email$2d$management$2f$ComposeEmail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/email-management/page.js",
                                lineNumber: 960,
                                columnNumber: 41
                            }, ("TURBOPACK compile-time value", void 0)),
                            activeTab === "templates" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$email$2d$management$2f$Templates$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/email-management/page.js",
                                lineNumber: 961,
                                columnNumber: 43
                            }, ("TURBOPACK compile-time value", void 0)),
                            activeTab === "history" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$email$2d$management$2f$CampaignHistory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/email-management/page.js",
                                lineNumber: 962,
                                columnNumber: 41
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/email-management/page.js",
                        lineNumber: 959,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/email-management/page.js",
                lineNumber: 917,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/app/email-management/page.js",
            lineNumber: 916,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/email-management/page.js",
        lineNumber: 915,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(EmailCampaignPage, "gu+GwnNm3uMgGY3ODnSo0/7c8n4=");
_c = EmailCampaignPage;
const __TURBOPACK__default__export__ = EmailCampaignPage;
var _c;
__turbopack_context__.k.register(_c, "EmailCampaignPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_534e82ee._.js.map