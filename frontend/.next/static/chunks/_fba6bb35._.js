(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/context/StudentContext..js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "StudentProvider": ()=>StudentProvider,
    "useStudentContext": ()=>useStudentContext
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const StudentContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
const StudentProvider = (param)=>{
    let { children } = param;
    _s();
    const [students, setStudents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedStudent, setSelectedStudent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAddStudentModal, setShowAddStudentModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEditStudentModal, setShowEditStudentModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showExportModal, setShowExportModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingStudent, setEditingStudent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [studentFormData, setStudentFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        enrollment_number: "",
        first_name: "",
        last_name: "",
        phone: "",
        alternate_phone: "",
        college_email: "",
        personal_email: "",
        department: "",
        branch: "",
        batch_year: new Date().getFullYear(),
        current_semester: 1,
        cgpa: "",
        backlogs: 0,
        resume_url: "",
        linkedin_url: "",
        github_url: "",
        date_of_birth: "",
        gender: "",
        registration_number: "",
        class_10_percentage: "",
        class_12_percentage: "",
        permanent_address: "",
        permanent_city: "",
        permanent_state: "",
        ps2_company_name: "",
        ps2_project_title: "",
        ps2_certificate_url: "",
        placement_status: "unplaced"
    });
    // new TODO
    const [showImportModal, setShowImportModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showUpdateModal, setShowUpdateModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showImportResultsModal, setShowImportResultsModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showUpdateResultsModal, setShowUpdateResultsModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [importResults, setImportResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [updateResults, setUpdateResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const formatStudentName = (student)=>{
        return "".concat(student.first_name, " ").concat(student.last_name);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StudentContext.Provider, {
        value: {
            students,
            setStudents,
            selectedStudent,
            setSelectedStudent,
            showAddStudentModal,
            setShowAddStudentModal,
            showEditStudentModal,
            setShowEditStudentModal,
            // showDeleteConfirmation,
            // setShowDeleteConfirmation,
            showExportModal,
            setShowExportModal,
            studentFormData,
            setStudentFormData,
            setEditingStudent,
            editingStudent,
            formatStudentName,
            // NEW TODO
            showImportModal,
            setShowImportModal,
            showUpdateModal,
            setShowUpdateModal,
            showImportResultsModal,
            setShowImportResultsModal,
            showUpdateResultsModal,
            setShowUpdateResultsModal,
            importResults,
            setImportResults,
            updateResults,
            setUpdateResults
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/StudentContext..js",
        lineNumber: 59,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(StudentProvider, "vkSa27gh9lmNlzJDw3uWJFMj/nU=");
_c = StudentProvider;
const useStudentContext = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(StudentContext);
    if (!context) {
        throw new Error("useStudentContext must be used within a StudentProvider");
    }
    return context;
};
_s1(useStudentContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "StudentProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/students/AddStudentModel.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>AddStudentModel
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/StudentContext..js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function AddStudentModel() {
    _s();
    const { showEditStudentModal, setShowAddStudentModal, setShowEditStudentModal, setEditingStudent, studentFormData, editingStudent, setStudentFormData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStudentContext"])();
    const [formErrors, setFormErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        setStudentFormData((prev)=>({
                ...prev,
                [name]: value
            }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors((prev)=>({
                    ...prev,
                    [name]: ""
                }));
        }
    };
    const validateForm = ()=>{
        const errors = {};
        if (!studentFormData.first_name.trim()) errors.first_name = "First name is required";
        if (!studentFormData.last_name.trim()) errors.last_name = "Last name is required";
        if (!studentFormData.enrollment_number.trim()) errors.enrollment_number = "Enrollment number is required";
        if (!studentFormData.registration_number.trim()) errors.registration_number = "Registration number is required";
        if (!studentFormData.college_email.trim()) errors.college_email = "College email is required";
        if (!studentFormData.phone.trim()) errors.phone = "Phone number is required";
        if (!studentFormData.department.trim()) errors.department = "Department is required";
        if (!studentFormData.branch.trim()) errors.branch = "Branch is required";
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (studentFormData.college_email && !emailRegex.test(studentFormData.college_email)) {
            errors.college_email = "Invalid email format";
        }
        if (studentFormData.personal_email && !emailRegex.test(studentFormData.personal_email)) {
            errors.personal_email = "Invalid email format";
        }
        // Phone validation
        if (studentFormData.phone && !/^\d{10}$/.test(studentFormData.phone)) {
            errors.phone = "Phone must be 10 digits";
        }
        return errors;
    };
    const resetForm = ()=>{
        setStudentFormData({
            enrollment_number: "",
            first_name: "",
            last_name: "",
            phone: "",
            alternate_phone: "",
            college_email: "",
            personal_email: "",
            department: "",
            branch: "",
            batch_year: new Date().getFullYear(),
            current_semester: 1,
            cgpa: "",
            backlogs: 0,
            resume_url: "",
            linkedin_url: "",
            github_url: "",
            date_of_birth: "",
            gender: "",
            registration_number: "",
            class_10_percentage: "",
            class_12_percentage: "",
            permanent_address: "",
            permanent_city: "",
            permanent_state: "",
            ps2_company_name: "",
            ps2_project_title: "",
            ps2_certificate_url: "",
            placement_status: "eligible"
        });
        setFormErrors({});
    };
    const handleAddStudent = async ()=>{
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        try {
            // Format data for API
            const studentToAdd = {
                ...studentFormData,
                cgpa: studentFormData.cgpa ? parseFloat(studentFormData.cgpa) : null,
                class_10_percentage: studentFormData.class_10_percentage ? parseFloat(studentFormData.class_10_percentage) : null,
                class_12_percentage: studentFormData.class_12_percentage ? parseFloat(studentFormData.class_12_percentage) : null,
                backlogs: parseInt(studentFormData.backlogs) || 0,
                current_semester: parseInt(studentFormData.current_semester) || 1,
                batch_year: parseInt(studentFormData.batch_year),
                date_of_birth: studentFormData.date_of_birth ? new Date(studentFormData.date_of_birth).toISOString() : null
            };
            // API call to add student
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("http://localhost:5000/students", studentToAdd);
            // Update local state
            setStudents((prev)=>[
                    ...prev,
                    response.data
                ]);
            resetForm();
            setShowAddStudentModal(false);
            // Show success message (you can add a toast notification here)
            alert("Student added successfully!");
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Error adding student. Please try again.");
        }
    };
    const handleUpdateStudent = async ()=>{
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        try {
            // Format data for API
            const studentToUpdate = {
                ...studentFormData,
                cgpa: studentFormData.cgpa ? parseFloat(studentFormData.cgpa) : null,
                class_10_percentage: studentFormData.class_10_percentage ? parseFloat(studentFormData.class_10_percentage) : null,
                class_12_percentage: studentFormData.class_12_percentage ? parseFloat(studentFormData.class_12_percentage) : null,
                backlogs: parseInt(studentFormData.backlogs) || 0,
                current_semester: parseInt(studentFormData.current_semester) || 1,
                batch_year: parseInt(studentFormData.batch_year),
                date_of_birth: studentFormData.date_of_birth ? new Date(studentFormData.date_of_birth).toISOString() : null
            };
            // API call to update student
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put("http://localhost:5000/students/".concat(editingStudent.id), studentToUpdate);
            // Update local state
            setStudents((prev)=>prev.map((s)=>s.id === editingStudent.id ? response.data : s));
            resetForm();
            setEditingStudent(null);
            setShowEditStudentModal(false);
            // Show success message
            alert("Student updated successfully!");
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Error updating student. Please try again.");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed h-full inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/30 to-purple-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-6 pb-4 border-b border-gray-200/50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg",
                                            children: showEditStudentModal ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                className: "h-6 w-6"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                lineNumber: 214,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "h-6 w-6"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                lineNumber: 216,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/AddStudentModel.js",
                                            lineNumber: 212,
                                            columnNumber: 15
                                        }, this),
                                        showEditStudentModal ? "Edit Student" : "Add New Student"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/AddStudentModel.js",
                                    lineNumber: 211,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500 mt-2 ml-14",
                                    children: showEditStudentModal ? "Update student information" : "Enter student details to add to the database"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/AddStudentModel.js",
                                    lineNumber: 221,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/students/AddStudentModel.js",
                            lineNumber: 210,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setShowAddStudentModal(false);
                                setShowEditStudentModal(false);
                                setEditingStudent(null);
                                resetForm();
                            },
                            className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-all duration-200 group",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-6 w-6 group-hover:rotate-90 transition-transform duration-200"
                            }, void 0, false, {
                                fileName: "[project]/app/students/AddStudentModel.js",
                                lineNumber: 236,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/students/AddStudentModel.js",
                            lineNumber: 227,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/students/AddStudentModel.js",
                    lineNumber: 209,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: (e)=>{
                        e.preventDefault();
                        showEditStudentModal ? handleUpdateStudent() : handleAddStudent();
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-blue-200/50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-2 bg-blue-500 rounded-lg",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "h-4 w-4 text-white",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 259,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                                lineNumber: 253,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 252,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Personal Information"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 251,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "First Name *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 272,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "first_name",
                                                                    value: studentFormData.first_name,
                                                                    onChange: handleInputChange,
                                                                    className: "w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ".concat(formErrors.first_name ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70"),
                                                                    placeholder: "Enter first name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 275,
                                                                    columnNumber: 21
                                                                }, this),
                                                                formErrors.first_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-red-500 text-xs mt-1 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            className: "h-3 w-3",
                                                                            fill: "currentColor",
                                                                            viewBox: "0 0 20 20",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                fillRule: "evenodd",
                                                                                d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                                                                clipRule: "evenodd"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                                                lineNumber: 294,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                                            lineNumber: 289,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        formErrors.first_name
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 288,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 271,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Last Name *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 305,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "last_name",
                                                                    value: studentFormData.last_name,
                                                                    onChange: handleInputChange,
                                                                    className: "w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ".concat(formErrors.last_name ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70"),
                                                                    placeholder: "Enter last name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 308,
                                                                    columnNumber: 21
                                                                }, this),
                                                                formErrors.last_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-red-500 text-xs mt-1 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            className: "h-3 w-3",
                                                                            fill: "currentColor",
                                                                            viewBox: "0 0 20 20",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                fillRule: "evenodd",
                                                                                d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                                                                clipRule: "evenodd"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                                                lineNumber: 327,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                                            lineNumber: 322,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        formErrors.last_name
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 321,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 304,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 270,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Date of Birth"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 341,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "date",
                                                                    name: "date_of_birth",
                                                                    value: studentFormData.date_of_birth,
                                                                    onChange: handleInputChange,
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 344,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 340,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Gender"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 353,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    name: "gender",
                                                                    value: studentFormData.gender,
                                                                    onChange: handleInputChange,
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/70",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Select Gender"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                                            lineNumber: 362,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Male",
                                                                            children: "Male"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                                            lineNumber: 363,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Female",
                                                                            children: "Female"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                                            lineNumber: 364,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Other",
                                                                            children: "Other"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                                            lineNumber: 365,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 356,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 352,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 339,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Phone Number *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 372,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "tel",
                                                                    name: "phone",
                                                                    value: studentFormData.phone,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "10-digit number",
                                                                    className: "w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ".concat(formErrors.phone ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 375,
                                                                    columnNumber: 21
                                                                }, this),
                                                                formErrors.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-red-500 text-xs mt-1 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            className: "h-3 w-3",
                                                                            fill: "currentColor",
                                                                            viewBox: "0 0 20 20",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                fillRule: "evenodd",
                                                                                d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                                                                clipRule: "evenodd"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                                                lineNumber: 394,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                                            lineNumber: 389,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        formErrors.phone
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 388,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 371,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Alternate Phone"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 405,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "tel",
                                                                    name: "alternate_phone",
                                                                    value: studentFormData.alternate_phone,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "10-digit number",
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 408,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 404,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 370,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-semibold text-gray-700 mb-2",
                                                            children: "College Email *"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 420,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "email",
                                                            name: "college_email",
                                                            value: studentFormData.college_email,
                                                            onChange: handleInputChange,
                                                            placeholder: "student@college.edu",
                                                            className: "w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ".concat(formErrors.college_email ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70")
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 423,
                                                            columnNumber: 19
                                                        }, this),
                                                        formErrors.college_email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-red-500 text-xs mt-1 flex items-center gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "h-3 w-3",
                                                                    fill: "currentColor",
                                                                    viewBox: "0 0 20 20",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        fillRule: "evenodd",
                                                                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                                                        clipRule: "evenodd"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/students/AddStudentModel.js",
                                                                        lineNumber: 442,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 437,
                                                                    columnNumber: 23
                                                                }, this),
                                                                formErrors.college_email
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 436,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 419,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-semibold text-gray-700 mb-2",
                                                            children: "Personal Email"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 454,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "email",
                                                            name: "personal_email",
                                                            value: studentFormData.personal_email,
                                                            onChange: handleInputChange,
                                                            placeholder: "personal@email.com",
                                                            className: "w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ".concat(formErrors.personal_email ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70")
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 457,
                                                            columnNumber: 19
                                                        }, this),
                                                        formErrors.personal_email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-red-500 text-xs mt-1 flex items-center gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "h-3 w-3",
                                                                    fill: "currentColor",
                                                                    viewBox: "0 0 20 20",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        fillRule: "evenodd",
                                                                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                                                        clipRule: "evenodd"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/students/AddStudentModel.js",
                                                                        lineNumber: 476,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 471,
                                                                    columnNumber: 23
                                                                }, this),
                                                                formErrors.personal_email
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 470,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 453,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/students/AddStudentModel.js",
                                            lineNumber: 250,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-6 p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 rounded-xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-emerald-200/50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-2 bg-emerald-500 rounded-lg",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "h-4 w-4 text-white",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/students/AddStudentModel.js",
                                                                        lineNumber: 498,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/students/AddStudentModel.js",
                                                                        lineNumber: 504,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                                lineNumber: 492,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 491,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Address Information"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 490,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-semibold text-gray-700 mb-2",
                                                            children: "Permanent Address"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 516,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            name: "permanent_address",
                                                            value: studentFormData.permanent_address,
                                                            onChange: handleInputChange,
                                                            rows: "3",
                                                            placeholder: "Enter complete address",
                                                            className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white/70 resize-none"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 519,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 515,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "City"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 531,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "permanent_city",
                                                                    value: studentFormData.permanent_city,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "Enter city",
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 534,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 530,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "State"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 544,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "permanent_state",
                                                                    value: studentFormData.permanent_state,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "Enter state",
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 547,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 543,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 529,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/students/AddStudentModel.js",
                                            lineNumber: 489,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/AddStudentModel.js",
                                    lineNumber: 248,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-6 p-6 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/50 rounded-xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-purple-200/50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-2 bg-purple-500 rounded-lg",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "h-4 w-4 text-white",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 572,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                                lineNumber: 566,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 565,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Academic Information"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 564,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Enrollment Number *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 585,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "enrollment_number",
                                                                    value: studentFormData.enrollment_number,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "ENR123456",
                                                                    className: "w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ".concat(formErrors.enrollment_number ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white/70")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 588,
                                                                    columnNumber: 21
                                                                }, this),
                                                                formErrors.enrollment_number && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-red-500 text-xs mt-1 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            className: "h-3 w-3",
                                                                            fill: "currentColor",
                                                                            viewBox: "0 0 20 20",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                fillRule: "evenodd",
                                                                                d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                                                                clipRule: "evenodd"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                                                lineNumber: 607,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                                            lineNumber: 602,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        formErrors.enrollment_number
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 601,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 584,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Registration Number *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 618,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "registration_number",
                                                                    value: studentFormData.registration_number,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "REG123456",
                                                                    className: "w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ".concat(formErrors.registration_number ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white/70")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 621,
                                                                    columnNumber: 21
                                                                }, this),
                                                                formErrors.registration_number && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-red-500 text-xs mt-1 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            className: "h-3 w-3",
                                                                            fill: "currentColor",
                                                                            viewBox: "0 0 20 20",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                fillRule: "evenodd",
                                                                                d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                                                                clipRule: "evenodd"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                                                lineNumber: 640,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                                            lineNumber: 635,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        formErrors.registration_number
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 634,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 617,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 583,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Department *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 654,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "department",
                                                                    value: studentFormData.department,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "e.g., B.Tech",
                                                                    className: "w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ".concat(formErrors.department ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white/70")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 657,
                                                                    columnNumber: 21
                                                                }, this),
                                                                formErrors.department && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-red-500 text-xs mt-1 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            className: "h-3 w-3",
                                                                            fill: "currentColor",
                                                                            viewBox: "0 0 20 20",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                fillRule: "evenodd",
                                                                                d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                                                                clipRule: "evenodd"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                                                lineNumber: 676,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                                            lineNumber: 671,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        formErrors.department
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 670,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 653,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Branch *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 687,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "branch",
                                                                    value: studentFormData.branch,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "e.g., CSE, IT, ECE",
                                                                    className: "w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ".concat(formErrors.branch ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white/70")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 690,
                                                                    columnNumber: 21
                                                                }, this),
                                                                formErrors.branch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-red-500 text-xs mt-1 flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            className: "h-3 w-3",
                                                                            fill: "currentColor",
                                                                            viewBox: "0 0 20 20",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                fillRule: "evenodd",
                                                                                d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                                                                clipRule: "evenodd"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                                                lineNumber: 709,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                                            lineNumber: 704,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        formErrors.branch
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 703,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 686,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 652,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Batch Year"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 723,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    name: "batch_year",
                                                                    value: studentFormData.batch_year,
                                                                    onChange: handleInputChange,
                                                                    min: "2020",
                                                                    max: "2030",
                                                                    placeholder: "2024",
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 726,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 722,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Current Semester"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 738,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    name: "current_semester",
                                                                    value: studentFormData.current_semester,
                                                                    onChange: handleInputChange,
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Select"
                                                                        }, "default", false, {
                                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                                            lineNumber: 747,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        [
                                                                            1,
                                                                            2,
                                                                            3,
                                                                            4,
                                                                            5,
                                                                            6,
                                                                            7,
                                                                            8
                                                                        ].map((sem)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: sem,
                                                                                children: [
                                                                                    "Semester ",
                                                                                    sem
                                                                                ]
                                                                            }, "sem-".concat(sem), true, {
                                                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                                                lineNumber: 751,
                                                                                columnNumber: 25
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 741,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 737,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "CGPA"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 758,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    step: "0.01",
                                                                    min: "0",
                                                                    max: "10",
                                                                    name: "cgpa",
                                                                    value: studentFormData.cgpa,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "0.00",
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 761,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 757,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 721,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "10th Percentage"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 777,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    step: "0.01",
                                                                    min: "0",
                                                                    max: "100",
                                                                    name: "class_10_percentage",
                                                                    value: studentFormData.class_10_percentage,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "85.5",
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 780,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 776,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "12th Percentage"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 793,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    step: "0.01",
                                                                    min: "0",
                                                                    max: "100",
                                                                    name: "class_12_percentage",
                                                                    value: studentFormData.class_12_percentage,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "88.2",
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 796,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 792,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Backlogs"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 809,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "0",
                                                                    name: "backlogs",
                                                                    value: studentFormData.backlogs,
                                                                    onChange: handleInputChange,
                                                                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 812,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 808,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 775,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/students/AddStudentModel.js",
                                            lineNumber: 563,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-6 p-6 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/50 rounded-xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-orange-200/50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-2 bg-orange-500 rounded-lg",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "h-4 w-4 text-white",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 834,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                                lineNumber: 828,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 827,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Professional Information"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 826,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-semibold text-gray-700 mb-2",
                                                            children: "Resume URL"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 846,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "url",
                                                            name: "resume_url",
                                                            value: studentFormData.resume_url,
                                                            onChange: handleInputChange,
                                                            placeholder: "https://drive.google.com/file/...",
                                                            className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 849,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 845,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "LinkedIn URL"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 861,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "url",
                                                                    name: "linkedin_url",
                                                                    value: studentFormData.linkedin_url,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "https://linkedin.com/in/...",
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 864,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 860,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "GitHub URL"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 874,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "url",
                                                                    name: "github_url",
                                                                    value: studentFormData.github_url,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "https://github.com/...",
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 877,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 873,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 859,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "PS2 Company"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 890,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "ps2_company_name",
                                                                    value: studentFormData.ps2_company_name,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "Company name",
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 893,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 889,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "PS2 Project Title"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 903,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "ps2_project_title",
                                                                    value: studentFormData.ps2_project_title,
                                                                    onChange: handleInputChange,
                                                                    placeholder: "Project title",
                                                                    className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 906,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 902,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 888,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-semibold text-gray-700 mb-2",
                                                            children: "PS2 Certificate URL"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 918,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "url",
                                                            name: "ps2_certificate_url",
                                                            value: studentFormData.ps2_certificate_url,
                                                            onChange: handleInputChange,
                                                            placeholder: "https://certificate-url.com/...",
                                                            className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 921,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 917,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-semibold text-gray-700 mb-2",
                                                            children: "Placement Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 932,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            name: "placement_status",
                                                            value: studentFormData.placement_status,
                                                            onChange: handleInputChange,
                                                            className: "w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "placed",
                                                                    children: "✅ Placed"
                                                                }, "placed", false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 941,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "unplaced",
                                                                    children: "🔍 Unplaced"
                                                                }, "unplaced", false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 944,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "higher_studies",
                                                                    children: "🎓 Higher Studies"
                                                                }, "higher_studies", false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 947,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "entrepreneurship",
                                                                    children: "🚀 Entrepreneurship"
                                                                }, "entrepreneurship", false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 950,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "debarred",
                                                                    children: "⛔ Debarred"
                                                                }, "debarred", false, {
                                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                                    lineNumber: 953,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/AddStudentModel.js",
                                                            lineNumber: 935,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/AddStudentModel.js",
                                                    lineNumber: 931,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/students/AddStudentModel.js",
                                            lineNumber: 825,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/AddStudentModel.js",
                                    lineNumber: 561,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/students/AddStudentModel.js",
                            lineNumber: 246,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-200/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>{
                                        setShowAddStudentModal(false);
                                        setShowEditStudentModal(false);
                                        setEditingStudent(null);
                                        resetForm();
                                    },
                                    className: "px-8 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/AddStudentModel.js",
                                    lineNumber: 964,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-3 font-medium shadow-lg hover:shadow-xl transform hover:scale-105",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-1 bg-white/20 rounded-lg",
                                            children: showEditStudentModal ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                lineNumber: 982,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/AddStudentModel.js",
                                                lineNumber: 984,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/AddStudentModel.js",
                                            lineNumber: 980,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: showEditStudentModal ? "Update Student" : "Add Student"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/AddStudentModel.js",
                                            lineNumber: 987,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/AddStudentModel.js",
                                    lineNumber: 976,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/students/AddStudentModel.js",
                            lineNumber: 963,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/students/AddStudentModel.js",
                    lineNumber: 240,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/students/AddStudentModel.js",
            lineNumber: 207,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/students/AddStudentModel.js",
        lineNumber: 206,
        columnNumber: 5
    }, this);
}
_s(AddStudentModel, "DxQeWOFwigm6vP6OgppdVcnKBKk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStudentContext"]
    ];
});
_c = AddStudentModel;
var _c;
__turbopack_context__.k.register(_c, "AddStudentModel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/students/ExportModal.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>ExportModal
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/StudentContext..js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function ExportModal(param) {
    let { filteredStudents } = param;
    _s();
    const [selectedColumns, setSelectedColumns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const { setShowExportModal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStudentContext"])();
    const exportableColumns = [
        {
            key: "first_name",
            label: "First Name",
            category: "Personal"
        },
        {
            key: "last_name",
            label: "Last Name",
            category: "Personal"
        },
        {
            key: "date_of_birth",
            label: "Date of Birth",
            category: "Personal"
        },
        {
            key: "resume_url",
            label: "Resume URL",
            category: "Personal"
        },
        {
            key: "linkedin_url",
            label: "LinkedIn URL",
            category: "Personal"
        },
        {
            key: "github_url",
            label: "GitHub URL",
            category: "Personal"
        },
        {
            key: "permanent_address",
            label: "Address",
            category: "Contact"
        },
        {
            key: "permanent_city",
            label: "City",
            category: "Contact"
        },
        {
            key: "permanent_state",
            label: "State",
            category: "Contact"
        },
        {
            key: "registration_number",
            label: "Registration Number",
            category: "Academic"
        },
        {
            key: "enrollment_number",
            label: "Enrollment Number",
            category: "Academic"
        },
        {
            key: "college_email",
            label: "College Email",
            category: "Contact"
        },
        {
            key: "personal_email",
            label: "Personal Email",
            category: "Contact"
        },
        {
            key: "phone",
            label: "Phone Number",
            category: "Contact"
        },
        {
            key: "alternate_phone",
            label: "Alternate Phone",
            category: "Contact"
        },
        {
            key: "department",
            label: "Department",
            category: "Academic"
        },
        {
            key: "branch",
            label: "Branch",
            category: "Academic"
        },
        {
            key: "batch_year",
            label: "Batch Year",
            category: "Academic"
        },
        {
            key: "cgpa",
            label: "CGPA",
            category: "Academic"
        },
        {
            key: "backlogs",
            label: "Backlogs",
            category: "Academic"
        },
        {
            key: "class_10_percentage",
            label: "10th Percentage",
            category: "Academic"
        },
        {
            key: "class_12_percentage",
            label: "12th Percentage",
            category: "Academic"
        },
        {
            key: "placement_status",
            label: "Placement Status",
            category: "Placement"
        },
        {
            key: "current_company",
            label: "Current Company",
            category: "Placement"
        },
        {
            key: "current_package",
            label: "Current Package (LPA)",
            category: "Placement"
        },
        {
            key: "total_offers",
            label: "Total Offers",
            category: "Placement"
        },
        {
            key: "drives_skipped",
            label: "Drives Skipped",
            category: "Placement"
        }
    ];
    const handleExport = ()=>{
        const selectedColumnKeys = Object.keys(selectedColumns).filter((key)=>selectedColumns[key]);
        if (selectedColumnKeys.length === 0) {
            alert("Please select at least one column to export.");
            return;
        }
        // Prepare data for export // todo
        const exportData = filteredStudents.map((student)=>{
            const row = {};
            selectedColumnKeys.forEach((key)=>{
                switch(key){
                    case "current_company":
                        var _student_current_offer;
                        row[key] = ((_student_current_offer = student.current_offer) === null || _student_current_offer === void 0 ? void 0 : _student_current_offer.company_name) || "N/A";
                        break;
                    case "current_package":
                        var _student_current_offer1;
                        row[key] = ((_student_current_offer1 = student.current_offer) === null || _student_current_offer1 === void 0 ? void 0 : _student_current_offer1.package) ? (student.current_offer.package / 100000).toFixed(1) : "N/A";
                        break;
                    case "total_offers":
                        var _student_offers_received;
                        row[key] = ((_student_offers_received = student.offers_received) === null || _student_offers_received === void 0 ? void 0 : _student_offers_received.length) || 0;
                        break;
                    case "drives_attended":
                        row[key] = student.drives_attended || 0;
                        break;
                    case "cgpa":
                        row[key] = student.cgpa !== undefined && student.cgpa !== null ? Number(student.cgpa).toFixed(2) : "N/A";
                        break;
                    default:
                        row[key] = student[key] || "N/A";
                }
            });
            return row;
        });
        // Create CSV content
        const headers = selectedColumnKeys.map((key)=>{
            var _exportableColumns_find;
            return ((_exportableColumns_find = exportableColumns.find((col)=>col.key === key)) === null || _exportableColumns_find === void 0 ? void 0 : _exportableColumns_find.label) || key;
        });
        const csvContent = [
            headers.join(","),
            ...exportData.map((row)=>selectedColumnKeys.map((key)=>{
                    const value = row[key];
                    // Wrap in quotes if contains comma or quotes
                    return typeof value === "string" && (value.includes(",") || value.includes('"')) ? '"'.concat(value.replace(/"/g, '""'), '"') : value;
                }).join(","))
        ].join("\n");
        // Download file
        const blob = new Blob([
            csvContent
        ], {
            type: "text/csv;charset=utf-8;"
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "students_export_".concat(new Date().toISOString().split("T")[0], ".csv"));
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowExportModal(false);
    };
    const handleColumnToggle = (columnKey)=>{
        setSelectedColumns((prev)=>({
                ...prev,
                [columnKey]: !prev[columnKey]
            }));
    };
    const handleSelectAll = ()=>{
        const allSelected = exportableColumns.every((col)=>selectedColumns[col.key]);
        const newSelection = {};
        exportableColumns.forEach((col)=>{
            newSelection[col.key] = !allSelected;
        });
        setSelectedColumns(newSelection);
    };
    const handleSelectByCategory = (category)=>{
        const categoryColumns = exportableColumns.filter((col)=>col.category === category);
        const allCategorySelected = categoryColumns.every((col)=>selectedColumns[col.key]);
        setSelectedColumns((prev)=>{
            const newSelection = {
                ...prev
            };
            categoryColumns.forEach((col)=>{
                newSelection[col.key] = !allCategorySelected;
            });
            return newSelection;
        });
    };
    const categories = [
        ...new Set(exportableColumns.map((col)=>col.category))
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExportModal.useEffect": ()=>{
            // Initialize all columns as selected by default
            const initialSelection = {};
            exportableColumns.forEach({
                "ExportModal.useEffect": (col)=>{
                    initialSelection[col.key] = true;
                }
            }["ExportModal.useEffect"]);
            setSelectedColumns(initialSelection);
        }
    }["ExportModal.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed h-full inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/30 to-purple-900/20 backdrop-blur-xs flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white/95 backdrop-blur-xs rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-8 pb-4 border-b border-gray-200/50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                className: "h-6 w-6"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/ExportModal.js",
                                                lineNumber: 201,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/ExportModal.js",
                                            lineNumber: 200,
                                            columnNumber: 15
                                        }, this),
                                        "Export Student Data"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/ExportModal.js",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500 mt-2 ml-14",
                                    children: "Customize your data export with flexible column selection"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/ExportModal.js",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/students/ExportModal.js",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowExportModal(false),
                            className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-all duration-200 group",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-6 w-6 group-hover:rotate-90 transition-transform duration-200"
                            }, void 0, false, {
                                fileName: "[project]/app/students/ExportModal.js",
                                lineNumber: 213,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/students/ExportModal.js",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/students/ExportModal.js",
                    lineNumber: 197,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-2 bg-blue-500 rounded-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                    className: "h-4 w-4 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/ExportModal.js",
                                    lineNumber: 221,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/students/ExportModal.js",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-blue-800 font-semibold",
                                        children: [
                                            "Ready to export ",
                                            filteredStudents.length,
                                            " student records"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/students/ExportModal.js",
                                        lineNumber: 224,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-blue-600 text-sm",
                                        children: "Data filtered based on your current search and filter settings"
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/ExportModal.js",
                                        lineNumber: 227,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/students/ExportModal.js",
                                lineNumber: 223,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/students/ExportModal.js",
                        lineNumber: 219,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/students/ExportModal.js",
                    lineNumber: 218,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSelectAll,
                                className: "px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105",
                                children: exportableColumns.every((col)=>selectedColumns[col.key]) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "h-4 w-4",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/ExportModal.js",
                                                lineNumber: 249,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/ExportModal.js",
                                            lineNumber: 243,
                                            columnNumber: 19
                                        }, this),
                                        "Deselect All"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/ExportModal.js",
                                    lineNumber: 242,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "h-4 w-4",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M5 13l4 4L19 7"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/ExportModal.js",
                                                lineNumber: 266,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/ExportModal.js",
                                            lineNumber: 260,
                                            columnNumber: 19
                                        }, this),
                                        "Select All"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/ExportModal.js",
                                    lineNumber: 259,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/students/ExportModal.js",
                                lineNumber: 237,
                                columnNumber: 13
                            }, this),
                            categories.map((category, index)=>{
                                const categoryColumns = exportableColumns.filter((col)=>col.category === category);
                                const selectedCount = categoryColumns.filter((col)=>selectedColumns[col.key]).length;
                                const gradientColors = [
                                    "from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-600",
                                    "from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-600",
                                    "from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-600",
                                    "from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-600",
                                    "from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-600"
                                ];
                                const gradient = gradientColors[index % gradientColors.length];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleSelectByCategory(category),
                                    className: "px-4 py-2 bg-gradient-to-r ".concat(gradient, " text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: category
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/ExportModal.js",
                                                lineNumber: 300,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-white/20 px-2 py-0.5 rounded-full text-xs",
                                                children: [
                                                    selectedCount,
                                                    "/",
                                                    categoryColumns.length
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/students/ExportModal.js",
                                                lineNumber: 301,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/students/ExportModal.js",
                                        lineNumber: 299,
                                        columnNumber: 19
                                    }, this)
                                }, category, false, {
                                    fileName: "[project]/app/students/ExportModal.js",
                                    lineNumber: 294,
                                    columnNumber: 17
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/students/ExportModal.js",
                        lineNumber: 236,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/students/ExportModal.js",
                    lineNumber: 235,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8",
                    children: categories.map((category, index)=>{
                        const categoryColumns = exportableColumns.filter((col)=>col.category === category);
                        const selectedCount = categoryColumns.filter((col)=>selectedColumns[col.key]).length;
                        const borderColors = [
                            "border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50",
                            "border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50",
                            "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50",
                            "border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100/50",
                            "border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100/50"
                        ];
                        const borderColor = borderColors[index % borderColors.length];
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-2 ".concat(borderColor, " rounded-xl p-5 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-bold text-gray-800 mb-4 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-lg",
                                            children: category
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/ExportModal.js",
                                            lineNumber: 335,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full",
                                                    children: [
                                                        selectedCount,
                                                        "/",
                                                        categoryColumns.length
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/ExportModal.js",
                                                    lineNumber: 337,
                                                    columnNumber: 21
                                                }, this),
                                                selectedCount === categoryColumns.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "h-4 w-4 text-green-500",
                                                    fill: "currentColor",
                                                    viewBox: "0 0 20 20",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fillRule: "evenodd",
                                                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                                        clipRule: "evenodd"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/students/ExportModal.js",
                                                        lineNumber: 346,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/students/ExportModal.js",
                                                    lineNumber: 341,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/students/ExportModal.js",
                                            lineNumber: 336,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/ExportModal.js",
                                    lineNumber: 334,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: categoryColumns.map((column)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center space-x-3 cursor-pointer group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: selectedColumns[column.key] || false,
                                                            onChange: ()=>handleColumnToggle(column.key),
                                                            className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/ExportModal.js",
                                                            lineNumber: 362,
                                                            columnNumber: 25
                                                        }, this),
                                                        selectedColumns[column.key] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "absolute inset-0 h-4 w-4 text-blue-600 pointer-events-none",
                                                            fill: "currentColor",
                                                            viewBox: "0 0 20 20",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                fillRule: "evenodd",
                                                                d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                                                clipRule: "evenodd"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/students/ExportModal.js",
                                                                lineNumber: 374,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/ExportModal.js",
                                                            lineNumber: 369,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/ExportModal.js",
                                                    lineNumber: 361,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200",
                                                    children: column.label
                                                }, void 0, false, {
                                                    fileName: "[project]/app/students/ExportModal.js",
                                                    lineNumber: 382,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, column.key, true, {
                                            fileName: "[project]/app/students/ExportModal.js",
                                            lineNumber: 357,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/students/ExportModal.js",
                                    lineNumber: 355,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, category, true, {
                            fileName: "[project]/app/students/ExportModal.js",
                            lineNumber: 330,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/students/ExportModal.js",
                    lineNumber: 312,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end space-x-4 pt-6 border-t border-gray-200/50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowExportModal(false),
                            className: "px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/app/students/ExportModal.js",
                            lineNumber: 395,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleExport,
                            className: "px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                            disabled: Object.values(selectedColumns).every((v)=>!v),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/ExportModal.js",
                                    lineNumber: 406,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "Export CSV (",
                                        Object.values(selectedColumns).filter((v)=>v).length,
                                        " columns)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/ExportModal.js",
                                    lineNumber: 407,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/students/ExportModal.js",
                            lineNumber: 401,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/students/ExportModal.js",
                    lineNumber: 394,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/students/ExportModal.js",
            lineNumber: 195,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/students/ExportModal.js",
        lineNumber: 194,
        columnNumber: 5
    }, this);
}
_s(ExportModal, "bJxLMavsLvW0sS0x+RBkpeAcxhs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStudentContext"]
    ];
});
_c = ExportModal;
var _c;
__turbopack_context__.k.register(_c, "ExportModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/students/StudentTable..js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>StudentTable
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash.js [app-client] (ecmascript) <export default as Trash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/StudentContext..js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function StudentTable(param) {
    let { filteredStudents } = param;
    _s();
    const { formatStudentName, setEditingStudent, setStudentFormData, setShowEditStudentModal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStudentContext"])();
    const handleEditStudent = (student)=>{
        setEditingStudent(student);
        setStudentFormData({
            enrollment_number: student.enrollment_number || "",
            first_name: student.first_name || "",
            last_name: student.last_name || "",
            phone: student.phone || "",
            alternate_phone: student.alternate_phone || "",
            college_email: student.college_email || "",
            personal_email: student.personal_email || "",
            department: student.department || "",
            branch: student.branch || "",
            batch_year: student.batch_year || new Date().getFullYear(),
            current_semester: student.current_semester || 1,
            cgpa: student.cgpa || "",
            backlogs: student.backlogs || 0,
            resume_url: student.resume_url || "",
            linkedin_url: student.linkedin_url || "",
            github_url: student.github_url || "",
            date_of_birth: student.date_of_birth ? student.date_of_birth.split("T")[0] : "",
            gender: student.gender || "",
            registration_number: student.registration_number || "",
            class_10_percentage: student.class_10_percentage || "",
            class_12_percentage: student.class_12_percentage || "",
            permanent_address: student.permanent_address || "",
            permanent_city: student.permanent_city || "",
            permanent_state: student.permanent_state || "",
            ps2_company_name: student.ps2_company_name || "",
            ps2_project_title: student.ps2_project_title || "",
            ps2_certificate_url: student.ps2_certificate_url || "",
            placement_status: student.placement_status || "eligible"
        });
        setShowEditStudentModal(true);
    };
    const getStatusColor = (status)=>{
        switch(status){
            case "placed":
                return "bg-green-100 text-green-800";
            case "unplaced":
                return "bg-neutral-200 text-black-800";
            case "higher_studies":
                return "bg-blue-100 text-blue-800";
            case "entrepreneurship":
                return "bg-purple-100 text-purple-800";
            case "debarred":
                return "bg-red-100 text-red-800  ";
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-lg shadow-sm border overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "overflow-x-auto",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                className: "w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                        className: "bg-gray-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        className: "rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/StudentTable..js",
                                        lineNumber: 71,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/students/StudentTable..js",
                                    lineNumber: 70,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                    children: "Student Details"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/StudentTable..js",
                                    lineNumber: 73,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                    children: "Academic Info"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/StudentTable..js",
                                    lineNumber: 76,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                    children: "Contact details"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/StudentTable..js",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                    children: "Status"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/StudentTable..js",
                                    lineNumber: 82,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                    children: "Placement Details"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/StudentTable..js",
                                    lineNumber: 85,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                    children: "BOARD MARKS"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/StudentTable..js",
                                    lineNumber: 88,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                    children: "Actions"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/StudentTable..js",
                                    lineNumber: 91,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/students/StudentTable..js",
                            lineNumber: 69,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/students/StudentTable..js",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        className: "bg-white divide-y divide-gray-200",
                        children: filteredStudents.map((student)=>{
                            var _student_offers_received;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "hover:bg-gray-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-6 py-4 whitespace-nowrap",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            className: "rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/StudentTable..js",
                                            lineNumber: 101,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/StudentTable..js",
                                        lineNumber: 100,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-6 py-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-medium text-gray-900",
                                                        children: formatStudentName(student)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/students/StudentTable..js",
                                                        lineNumber: 106,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-500",
                                                        children: student.registration_number
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/students/StudentTable..js",
                                                        lineNumber: 109,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-400",
                                                        children: student.college_email
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/students/StudentTable..js",
                                                        lineNumber: 112,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-400",
                                                        children: student.personal_email
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/students/StudentTable..js",
                                                        lineNumber: 115,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/students/StudentTable..js",
                                                lineNumber: 105,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/StudentTable..js",
                                            lineNumber: 104,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/StudentTable..js",
                                        lineNumber: 103,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-6 py-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-gray-900",
                                                    children: [
                                                        student.department,
                                                        " ",
                                                        student.branch
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/StudentTable..js",
                                                    lineNumber: 123,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-gray-500",
                                                    children: [
                                                        "CGPA:",
                                                        " ",
                                                        student.cgpa !== undefined && student.cgpa !== null ? Number(student.cgpa).toFixed(2) : "N/A"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/StudentTable..js",
                                                    lineNumber: 126,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-gray-400",
                                                    children: [
                                                        "Backlogs: ",
                                                        student.backlogs,
                                                        " | Batch:",
                                                        " ",
                                                        student.batch_year
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/StudentTable..js",
                                                    lineNumber: 132,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/students/StudentTable..js",
                                            lineNumber: 122,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/StudentTable..js",
                                        lineNumber: 121,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-6 py-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm",
                                                children: [
                                                    "+91 ",
                                                    student.phone
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/students/StudentTable..js",
                                                lineNumber: 139,
                                                columnNumber: 21
                                            }, this),
                                            student.alternate_phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm",
                                                children: [
                                                    "+91 ",
                                                    student.alternate_phone
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/students/StudentTable..js",
                                                lineNumber: 141,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/students/StudentTable..js",
                                        lineNumber: 138,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-6 py-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(getStatusColor(student.placement_status)),
                                                children: student.placement_status.replace("_", " ")
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/StudentTable..js",
                                                lineNumber: 147,
                                                columnNumber: 21
                                            }, this),
                                            student.current_offer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-1 text-sm text-gray-600",
                                                children: student.current_offer.company_name
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/StudentTable..js",
                                                lineNumber: 155,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/students/StudentTable..js",
                                        lineNumber: 146,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-6 py-4",
                                        children: ((_student_offers_received = student.offers_received) === null || _student_offers_received === void 0 ? void 0 : _student_offers_received.length) > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-medium",
                                                    children: [
                                                        student.offers_received.length,
                                                        " Offer(s)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/StudentTable..js",
                                                    lineNumber: 163,
                                                    columnNumber: 25
                                                }, this),
                                                student.offers_received.slice(0, 2).map((offer, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-500",
                                                        children: [
                                                            offer.company_name,
                                                            " -",
                                                            " ",
                                                            (offer.package / 100000).toFixed(1),
                                                            " LPA"
                                                        ]
                                                    }, "".concat(student.id, "-offer-").concat(idx), true, {
                                                        fileName: "[project]/app/students/StudentTable..js",
                                                        lineNumber: 169,
                                                        columnNumber: 29
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/students/StudentTable..js",
                                            lineNumber: 162,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-gray-400",
                                            children: "No offers yet"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/StudentTable..js",
                                            lineNumber: 179,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/StudentTable..js",
                                        lineNumber: 160,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-6 py-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        "10th: ",
                                                        student.class_10_percentage,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/StudentTable..js",
                                                    lineNumber: 186,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        "12th: ",
                                                        student.class_12_percentage,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/StudentTable..js",
                                                    lineNumber: 187,
                                                    columnNumber: 23
                                                }, this),
                                                student.drives_skipped > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-red-500",
                                                    children: [
                                                        "Drives Skipped: ",
                                                        student.drives_skipped
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/StudentTable..js",
                                                    lineNumber: 189,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/students/StudentTable..js",
                                            lineNumber: 185,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/StudentTable..js",
                                        lineNumber: 184,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-6 py-4 whitespace-nowrap text-sm font-medium",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleEditStudent(student),
                                                    className: "text-green-600 hover:text-green-800",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/students/StudentTable..js",
                                                        lineNumber: 201,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/students/StudentTable..js",
                                                    lineNumber: 197,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "text-red-500 hover:text-red-700",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__["Trash"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/students/StudentTable..js",
                                                        lineNumber: 204,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/students/StudentTable..js",
                                                    lineNumber: 203,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/students/StudentTable..js",
                                            lineNumber: 196,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/StudentTable..js",
                                        lineNumber: 195,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, student.id, true, {
                                fileName: "[project]/app/students/StudentTable..js",
                                lineNumber: 99,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/students/StudentTable..js",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/students/StudentTable..js",
                lineNumber: 67,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/students/StudentTable..js",
            lineNumber: 66,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/students/StudentTable..js",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_s(StudentTable, "ay3J7AHLSU//r7/GjUdG552Ji/M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStudentContext"]
    ];
});
_c = StudentTable;
var _c;
__turbopack_context__.k.register(_c, "StudentTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/students/ImportModal.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// ImportModal.js
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const ImportModal = (param)=>{
    let { onClose, onImportComplete } = param;
    _s();
    const [file, setFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dragActive, setDragActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleDrag = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    const handleDrop = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };
    const handleFileSelect = (e)=>{
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };
    const downloadTemplate = async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("http://localhost:5000/students/template", {
                responseType: "blob"
            });
            const url = window.URL.createObjectURL(new Blob([
                response.data
            ]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "student_import_template.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading template:", error);
        }
    };
    const handleImport = async ()=>{
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("http://localhost:5000/students/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            onImportComplete(response.data);
        } catch (error) {
            console.error("Import error:", error);
            alert("Error importing students. Please check the file format.");
        } finally{
            setUploading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg p-6 w-full max-w-md mx-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-gray-800",
                            children: "Import Students"
                        }, void 0, false, {
                            fileName: "[project]/app/students/ImportModal.js",
                            lineNumber: 89,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-500 hover:text-gray-700",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/app/students/ImportModal.js",
                                lineNumber: 96,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/students/ImportModal.js",
                            lineNumber: 92,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/students/ImportModal.js",
                    lineNumber: 88,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: downloadTemplate,
                        className: "w-full bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/app/students/ImportModal.js",
                                lineNumber: 106,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Download Template"
                            }, void 0, false, {
                                fileName: "[project]/app/students/ImportModal.js",
                                lineNumber: 107,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/students/ImportModal.js",
                        lineNumber: 102,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/students/ImportModal.js",
                    lineNumber: 101,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-2 border-dashed rounded-lg p-6 text-center ".concat(dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"),
                    onDragEnter: handleDrag,
                    onDragLeave: handleDrag,
                    onDragOver: handleDrag,
                    onDrop: handleDrop,
                    children: file ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                className: "h-8 w-8 text-green-500 mx-auto"
                            }, void 0, false, {
                                fileName: "[project]/app/students/ImportModal.js",
                                lineNumber: 125,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-gray-900",
                                children: file.name
                            }, void 0, false, {
                                fileName: "[project]/app/students/ImportModal.js",
                                lineNumber: 126,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500",
                                children: [
                                    (file.size / 1024 / 1024).toFixed(2),
                                    " MB"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/students/ImportModal.js",
                                lineNumber: 127,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/students/ImportModal.js",
                        lineNumber: 124,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                className: "h-8 w-8 text-gray-400 mx-auto"
                            }, void 0, false, {
                                fileName: "[project]/app/students/ImportModal.js",
                                lineNumber: 133,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-blue-600 hover:text-blue-500",
                                            children: "Click to upload"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/ImportModal.js",
                                            lineNumber: 136,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-500",
                                            children: " or drag and drop"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/ImportModal.js",
                                            lineNumber: 139,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "file",
                                            className: "hidden",
                                            accept: ".xlsx,.xls,.csv",
                                            onChange: handleFileSelect
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/ImportModal.js",
                                            lineNumber: 140,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/ImportModal.js",
                                    lineNumber: 135,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/students/ImportModal.js",
                                lineNumber: 134,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500",
                                children: "Excel or CSV files only"
                            }, void 0, false, {
                                fileName: "[project]/app/students/ImportModal.js",
                                lineNumber: 148,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/students/ImportModal.js",
                        lineNumber: 132,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/students/ImportModal.js",
                    lineNumber: 112,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex space-x-3 mt-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/app/students/ImportModal.js",
                            lineNumber: 155,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleImport,
                            disabled: !file || uploading,
                            className: "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2",
                            children: uploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/ImportModal.js",
                                        lineNumber: 168,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Importing..."
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/ImportModal.js",
                                        lineNumber: 169,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Import Students"
                            }, void 0, false, {
                                fileName: "[project]/app/students/ImportModal.js",
                                lineNumber: 172,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/students/ImportModal.js",
                            lineNumber: 161,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/students/ImportModal.js",
                    lineNumber: 154,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/students/ImportModal.js",
            lineNumber: 87,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/students/ImportModal.js",
        lineNumber: 86,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ImportModal, "+FcSeI4iihBP8SiGvHxwpMR+LMs=");
_c = ImportModal;
const __TURBOPACK__default__export__ = ImportModal;
var _c;
__turbopack_context__.k.register(_c, "ImportModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/students/ImportResultsModal.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// ImportResultsModal.js
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
;
;
const ImportResultsModal = (param)=>{
    let { results, onClose } = param;
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showDetails, setShowDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { successful, existing, invalid, successfulStudents, existingStudents, invalidStudents } = results;
    const tabs = [
        {
            key: "successful",
            label: "Successfully Added",
            count: successful,
            color: "green",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"],
            students: successfulStudents
        },
        {
            key: "existing",
            label: "Already Existing",
            count: existing,
            color: "yellow",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
            students: existingStudents
        },
        {
            key: "invalid",
            label: "Insufficient Data",
            count: invalid,
            color: "red",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
            students: invalidStudents
        }
    ];
    const getColorClasses = (color)=>{
        const colors = {
            green: {
                bg: "bg-green-50",
                text: "text-green-700",
                border: "border-green-200",
                icon: "text-green-500"
            },
            yellow: {
                bg: "bg-yellow-50",
                text: "text-yellow-700",
                border: "border-yellow-200",
                icon: "text-yellow-500"
            },
            red: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                icon: "text-red-500"
            }
        };
        return colors[color];
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold text-gray-800",
                            children: "Import Results"
                        }, void 0, false, {
                            fileName: "[project]/app/students/ImportResultsModal.js",
                            lineNumber: 73,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-500 hover:text-gray-700",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/app/students/ImportResultsModal.js",
                                lineNumber: 80,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/students/ImportResultsModal.js",
                            lineNumber: 76,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/students/ImportResultsModal.js",
                    lineNumber: 72,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                !showDetails ? /* Summary View */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-medium text-gray-900 mb-2",
                                    children: "Import Summary"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                    lineNumber: 88,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600",
                                    children: [
                                        "Total processed: ",
                                        successful + existing + invalid,
                                        " students"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                    lineNumber: 91,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/students/ImportResultsModal.js",
                            lineNumber: 87,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        tabs.map((tab)=>{
                            const colors = getColorClasses(tab.color);
                            const Icon = tab.icon;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "".concat(colors.bg, " ").concat(colors.border, " border rounded-lg p-4"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    className: "h-6 w-6 ".concat(colors.icon)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                                    lineNumber: 107,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-medium ".concat(colors.text),
                                                            children: tab.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/ImportResultsModal.js",
                                                            lineNumber: 109,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm ".concat(colors.text, " opacity-75"),
                                                            children: [
                                                                tab.count,
                                                                " students"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/ImportResultsModal.js",
                                                            lineNumber: 112,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                                    lineNumber: 108,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/students/ImportResultsModal.js",
                                            lineNumber: 106,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        tab.count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setActiveTab(tab);
                                                setShowDetails(true);
                                            },
                                            className: "".concat(colors.text, " hover:opacity-75 flex items-center space-x-1 text-sm"),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                                    lineNumber: 126,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "View Names"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                                    lineNumber: 127,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/students/ImportResultsModal.js",
                                            lineNumber: 119,
                                            columnNumber: 23
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                    lineNumber: 105,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, tab.key, false, {
                                fileName: "[project]/app/students/ImportResultsModal.js",
                                lineNumber: 101,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0));
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end mt-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/app/students/ImportResultsModal.js",
                                lineNumber: 136,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/students/ImportResultsModal.js",
                            lineNumber: 135,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/students/ImportResultsModal.js",
                    lineNumber: 86,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : /* Details View */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowDetails(false),
                                className: "text-blue-600 hover:text-blue-500 text-sm",
                                children: "← Back to Summary"
                            }, void 0, false, {
                                fileName: "[project]/app/students/ImportResultsModal.js",
                                lineNumber: 148,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/students/ImportResultsModal.js",
                            lineNumber: 147,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "".concat(getColorClasses(activeTab.color).bg, " px-4 py-3 border-b"),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(activeTab.icon, {
                                                className: "h-5 w-5 ".concat(getColorClasses(activeTab.color).icon)
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/ImportResultsModal.js",
                                                lineNumber: 161,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-medium ".concat(getColorClasses(activeTab.color).text),
                                                children: [
                                                    activeTab.label,
                                                    " (",
                                                    activeTab.count,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/students/ImportResultsModal.js",
                                                lineNumber: 164,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/students/ImportResultsModal.js",
                                        lineNumber: 160,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                    lineNumber: 157,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-h-64 overflow-y-auto",
                                    children: activeTab.students && activeTab.students.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "divide-y",
                                        children: activeTab.students.map((student, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-4 py-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-medium text-gray-900",
                                                                    children: [
                                                                        student.first_name,
                                                                        " ",
                                                                        student.last_name
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                                                    lineNumber: 179,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-600",
                                                                    children: [
                                                                        "Registration:",
                                                                        " ",
                                                                        student.registration_number || "N/A"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                                                    lineNumber: 182,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                student.branch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-600",
                                                                    children: [
                                                                        student.branch,
                                                                        " - Batch ",
                                                                        student.batch_year
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                                                    lineNumber: 187,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/ImportResultsModal.js",
                                                            lineNumber: 178,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        activeTab.key === "invalid" && student.missingFields && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-right",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-red-600",
                                                                    children: "Missing:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                                                    lineNumber: 196,
                                                                    columnNumber: 33
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-red-600",
                                                                    children: student.missingFields.join(", ")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                                                    lineNumber: 197,
                                                                    columnNumber: 33
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/students/ImportResultsModal.js",
                                                            lineNumber: 195,
                                                            columnNumber: 31
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        activeTab.key === "existing" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-right",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-yellow-600",
                                                                children: "Already exists"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/students/ImportResultsModal.js",
                                                                lineNumber: 205,
                                                                columnNumber: 31
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/students/ImportResultsModal.js",
                                                            lineNumber: 204,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                                    lineNumber: 177,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, index, false, {
                                                fileName: "[project]/app/students/ImportResultsModal.js",
                                                lineNumber: 176,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/ImportResultsModal.js",
                                        lineNumber: 174,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-8 text-center text-gray-500",
                                        children: "No students in this category"
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/ImportResultsModal.js",
                                        lineNumber: 215,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/students/ImportResultsModal.js",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/students/ImportResultsModal.js",
                            lineNumber: 156,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/students/ImportResultsModal.js",
                    lineNumber: 146,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/students/ImportResultsModal.js",
            lineNumber: 71,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/students/ImportResultsModal.js",
        lineNumber: 70,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ImportResultsModal, "gDqnNkeWbJgHF9pLdNbzId8YUIU=");
_c = ImportResultsModal;
const __TURBOPACK__default__export__ = ImportResultsModal;
var _c;
__turbopack_context__.k.register(_c, "ImportResultsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/students/page.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>StudentManagement
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-check.js [app-client] (ecmascript) <export default as UserCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserX$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-x.js [app-client] (ecmascript) <export default as UserX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.js [app-client] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$students$2f$AddStudentModel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/students/AddStudentModel.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$students$2f$ExportModal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/students/ExportModal.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/StudentContext..js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$students$2f$StudentTable$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/students/StudentTable..js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$students$2f$ImportModal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/students/ImportModal.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$students$2f$ImportResultsModal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/students/ImportResultsModal.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function StudentManagementContent() {
    _s();
    const { students, setStudents, showAddStudentModal, setShowAddStudentModal, showEditStudentModal, showExportModal, setShowExportModal, formatStudentName, showImportModal, setShowImportModal, showUpdateModal, setShowUpdateModal, showImportResultsModal, setShowImportResultsModal, showUpdateResultsModal, setShowUpdateResultsModal, importResults, setImportResults, updateResults, setUpdateResults } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStudentContext"])();
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedBranch, setSelectedBranch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [selectedBatch, setSelectedBatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("name");
    const [sortOrder, setSortOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("asc");
    const getFilteredStudents = ()=>{
        let filtered = [
            ...students
        ];
        if (selectedCategory !== "all") {
            filtered = filtered.filter((student)=>student.placement_status === selectedCategory);
        }
        if (selectedBranch !== "all") {
            filtered = filtered.filter((student)=>student.branch === selectedBranch);
        }
        if (selectedBatch !== "all") {
            filtered = filtered.filter((student)=>student.batch_year.toString() === selectedBatch);
        }
        if (searchTerm) {
            filtered = filtered.filter((student)=>{
                var _student_registration_number, _student_college_email;
                return formatStudentName(student).toLowerCase().includes(searchTerm.toLowerCase()) || ((_student_registration_number = student.registration_number) === null || _student_registration_number === void 0 ? void 0 : _student_registration_number.toLowerCase().includes(searchTerm.toLowerCase())) || ((_student_college_email = student.college_email) === null || _student_college_email === void 0 ? void 0 : _student_college_email.toLowerCase().includes(searchTerm.toLowerCase()));
            });
        }
        // Sorting logic
        filtered.sort((a, b)=>{
            let aValue, bValue;
            switch(sortBy){
                case "name":
                    aValue = formatStudentName(a);
                    bValue = formatStudentName(b);
                    break;
                case "rollNo":
                    aValue = a.registration_number || "";
                    bValue = b.registration_number || "";
                    break;
                case "cgpa":
                    aValue = a.cgpa || 0;
                    bValue = b.cgpa || 0;
                    break;
                case "package":
                    var _a_current_offer, _b_current_offer;
                    aValue = (((_a_current_offer = a.current_offer) === null || _a_current_offer === void 0 ? void 0 : _a_current_offer.package) || 0) / 100000;
                    bValue = (((_b_current_offer = b.current_offer) === null || _b_current_offer === void 0 ? void 0 : _b_current_offer.package) || 0) / 100000;
                    break;
                default:
                    aValue = formatStudentName(a);
                    bValue = formatStudentName(b);
            }
            return sortOrder === "asc" ? aValue > bValue ? 1 : -1 : aValue < bValue ? 1 : -1;
        });
        return filtered;
    };
    // Fetch students data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StudentManagementContent.useEffect": ()=>{
            const fetchStudents1 = {
                "StudentManagementContent.useEffect.fetchStudents": async ()=>{
                    try {
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("http://localhost:5000/students");
                        setStudents(response.data);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }["StudentManagementContent.useEffect.fetchStudents"];
            fetchStudents1();
        }
    }["StudentManagementContent.useEffect"], []); // Refetch when academic year changes
    const getStatistics = ()=>{
        const totalStudents = students.length;
        const placedStudents = students.filter((s)=>s.placement_status === "placed").length;
        const unplacedStudents = students.filter((s)=>s.placement_status === "unplaced").length;
        const multipleOffersStudents = students.filter((s)=>Array.isArray(s.offers_received) && s.offers_received.length > 1).length;
        const debarredStudents = students.filter((s)=>s.placement_status === "debarred").length;
        const familyBusinessStudent = students.filter((s)=>s.placement_status === "family_business").length;
        const otherStudent = students.filter((s)=>s.placement_status === "others").length;
        const higher_studiesStudents = students.filter((s)=>s.placement_status === "higher_studies").length;
        const entrepreneurshipStudents = students.filter((s)=>s.placement_status === "entrepreneurship").length;
        const validStudents = students.filter((s)=>s.current_offer && s.current_offer.package);
        // Declare defaults
        let highestPackage = 0;
        let lowestPackage = 0;
        let avgPackage = 0;
        let medianPackage = 0;
        if (validStudents.length > 0) {
            const packages = validStudents.map((s)=>s.current_offer.package / 100000);
            packages.sort((a, b)=>a - b); // sort ascending
            // Highest (last element)
            highestPackage = packages[packages.length - 1];
            // Lowest (first element)
            lowestPackage = packages[0];
            // Average
            avgPackage = packages.reduce((acc, p)=>acc + p, 0) / packages.length;
            // Median
            const mid = Math.floor(packages.length / 2);
            if (packages.length % 2 === 0) {
                medianPackage = (packages[mid - 1] + packages[mid]) / 2;
            } else {
                medianPackage = packages[mid];
            }
        }
        return {
            totalStudents,
            placedStudents,
            unplacedStudents,
            multipleOffersStudents,
            debarredStudents,
            otherStudent,
            familyBusinessStudent,
            higher_studiesStudents,
            entrepreneurshipStudents,
            avgPackage: avgPackage.toFixed(1),
            highestPackage,
            medianPackage,
            lowestPackage
        };
    };
    const stats = getStatistics();
    const branches = [
        ...new Set(students.map((s)=>s.branch))
    ];
    const batches = [
        ...new Set(students.map((s)=>s.batch))
    ];
    const filteredStudents = getFilteredStudents();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-3xl font-bold text-gray-800",
                                        children: "Student Management"
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 235,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/students/page.js",
                                    lineNumber: 234,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600 mt-1",
                                    children: "Manage and categorize students based on placement status and college rules"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/page.js",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/students/page.js",
                            lineNumber: 233,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex space-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowExportModal(true),
                                    className: "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 249,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Export Data"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 250,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/page.js",
                                    lineNumber: 245,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowImportModal(true),
                                    className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 256,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Import Data"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 257,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/page.js",
                                    lineNumber: 252,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowUpdateModal(true),
                                    className: "bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 263,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Update Data"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 264,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/page.js",
                                    lineNumber: 259,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowAddStudentModal(true),
                                    className: "bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 270,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Add Student"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 271,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/page.js",
                                    lineNumber: 266,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/students/page.js",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/students/page.js",
                    lineNumber: 232,
                    columnNumber: 9
                }, this),
                showExportModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$students$2f$ExportModal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    filteredStudents: filteredStudents
                }, void 0, false, {
                    fileName: "[project]/app/students/page.js",
                    lineNumber: 276,
                    columnNumber: 29
                }, this),
                showImportModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$students$2f$ImportModal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    onClose: ()=>setShowImportModal(false),
                    onImportComplete: (results)=>{
                        setImportResults(results);
                        setShowImportModal(false);
                        setShowImportResultsModal(true);
                        // Refresh students data
                        fetchStudents();
                    }
                }, void 0, false, {
                    fileName: "[project]/app/students/page.js",
                    lineNumber: 281,
                    columnNumber: 11
                }, this),
                showUpdateModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UpdateModal, {
                    onClose: ()=>setShowUpdateModal(false),
                    onUpdateComplete: (results)=>{
                        setUpdateResults(results);
                        setShowUpdateModal(false);
                        setShowUpdateResultsModal(true);
                        // Refresh students data
                        fetchStudents();
                    }
                }, void 0, false, {
                    fileName: "[project]/app/students/page.js",
                    lineNumber: 293,
                    columnNumber: 11
                }, this),
                showImportResultsModal && importResults && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$students$2f$ImportResultsModal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    results: importResults,
                    onClose: ()=>setShowImportResultsModal(false)
                }, void 0, false, {
                    fileName: "[project]/app/students/page.js",
                    lineNumber: 306,
                    columnNumber: 11
                }, this),
                showUpdateResultsModal && updateResults && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UpdateResultsModal, {
                    results: updateResults,
                    onClose: ()=>setShowUpdateResultsModal(false)
                }, void 0, false, {
                    fileName: "[project]/app/students/page.js",
                    lineNumber: 313,
                    columnNumber: 11
                }, this),
                (showAddStudentModal || showEditStudentModal) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$students$2f$AddStudentModel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/students/page.js",
                    lineNumber: 320,
                    columnNumber: 59
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white p-6 rounded-lg shadow-sm border",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-gray-600",
                                                children: "Total Students"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 327,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-gray-900",
                                                children: stats.totalStudents
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 330,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 326,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        className: "h-8 w-8 text-blue-600"
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 334,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/students/page.js",
                                lineNumber: 325,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/students/page.js",
                            lineNumber: 324,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white p-6 rounded-lg shadow-sm border",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-gray-600",
                                                children: "Total Interested"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 341,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-gray-600",
                                                children: "(for Placement)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 344,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-gray-900",
                                                children: stats.totalStudents - 2
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 347,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 340,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        className: "h-8 w-8 text-blue-600"
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 351,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/students/page.js",
                                lineNumber: 339,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/students/page.js",
                            lineNumber: 338,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white p-6 rounded-lg shadow-sm border",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-gray-600",
                                                children: "Placed"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 358,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-green-600",
                                                children: stats.placedStudents
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 359,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 357,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__["UserCheck"], {
                                        className: "h-8 w-8 text-green-600"
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 363,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/students/page.js",
                                lineNumber: 356,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/students/page.js",
                            lineNumber: 355,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white p-6 rounded-lg shadow-sm border",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-gray-600",
                                                children: "Unplaced"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 370,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-red-600",
                                                children: stats.unplacedStudents
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 371,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 369,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserX$3e$__["UserX"], {
                                        className: "h-8 w-8 text-red-600"
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 375,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/students/page.js",
                                lineNumber: 368,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/students/page.js",
                            lineNumber: 367,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white p-6 rounded-lg shadow-sm border",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-gray-600",
                                                children: "Avg CTC"
                                            }, void 0, false, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 382,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xl font-bold text-purple-600",
                                                children: [
                                                    stats.avgPackage,
                                                    " LPA"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 383,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: [
                                                    "Highest: ",
                                                    stats.highestPackage,
                                                    " LPA"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 386,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: [
                                                    "Medium: ",
                                                    stats.medianPackage,
                                                    " LPA"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 389,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: [
                                                    "Lowest: ",
                                                    stats.lowestPackage,
                                                    " LPA"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/students/page.js",
                                                lineNumber: 392,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 381,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                        className: "h-8 w-8 text-purple-600"
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 396,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/students/page.js",
                                lineNumber: 380,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/students/page.js",
                            lineNumber: 379,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/students/page.js",
                    lineNumber: 323,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white p-6 rounded-lg shadow-sm border",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium text-gray-700",
                                    children: "Category:"
                                }, void 0, false, {
                                    fileName: "[project]/app/students/page.js",
                                    lineNumber: 405,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex space-x-1",
                                    children: [
                                        {
                                            key: "all",
                                            label: "All Students",
                                            count: stats.totalStudents
                                        },
                                        {
                                            key: "placed",
                                            label: "Placed",
                                            count: stats.placedStudents
                                        },
                                        {
                                            key: "unplaced",
                                            label: "Unplaced",
                                            count: stats.unplacedStudents
                                        },
                                        {
                                            key: "multiple-offers",
                                            label: "Multiple Offers",
                                            count: stats.multipleOffersStudentss
                                        },
                                        {
                                            key: "higher_studies",
                                            label: "Higher Studies",
                                            count: stats.higher_studiesStudents
                                        },
                                        {
                                            key: "entrepreneurship",
                                            label: "Entrepreneurship",
                                            count: stats.entrepreneurshipStudents
                                        },
                                        {
                                            key: "debarred",
                                            label: "Debarred",
                                            count: stats.debarredStudents
                                        },
                                        {
                                            key: "family_business",
                                            label: "Family Business",
                                            count: stats.familyBusinessStudent
                                        },
                                        {
                                            key: "others",
                                            label: "Others",
                                            count: stats.otherStudent
                                        }
                                    ].map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedCategory(category.key),
                                            className: "px-3 py-2 rounded-lg text-sm font-medium transition-colors ".concat(selectedCategory === category.key ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"),
                                            children: [
                                                category.label,
                                                " (",
                                                category.count,
                                                ")"
                                            ]
                                        }, category.key, true, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 456,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/students/page.js",
                                    lineNumber: 408,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/students/page.js",
                            lineNumber: 404,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/students/page.js",
                        lineNumber: 403,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/students/page.js",
                    lineNumber: 402,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white p-4 rounded-lg shadow-sm border",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-4 items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-64",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "h-4 w-4 absolute left-3 top-3 text-gray-400"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 477,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Search by name, roll number, email, or company...",
                                            value: searchTerm,
                                            onChange: (e)=>setSearchTerm(e.target.value),
                                            className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        }, void 0, false, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 478,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/students/page.js",
                                    lineNumber: 476,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/students/page.js",
                                lineNumber: 475,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: selectedBranch,
                                onChange: (e)=>setSelectedBranch(e.target.value),
                                className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: "All Branches"
                                    }, "all-branches", false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 494,
                                        columnNumber: 15
                                    }, this),
                                    branches.map((branch)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: branch,
                                            children: branch
                                        }, "branch-".concat(branch), false, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 498,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/students/page.js",
                                lineNumber: 489,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: selectedBatch,
                                onChange: (e)=>setSelectedBatch(e.target.value),
                                className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: "All Batches"
                                    }, "all-batches", false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 510,
                                        columnNumber: 15
                                    }, this),
                                    batches.map((batch)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: batch,
                                            children: batch
                                        }, "batch-".concat(batch), false, {
                                            fileName: "[project]/app/students/page.js",
                                            lineNumber: 514,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/students/page.js",
                                lineNumber: 505,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: sortBy,
                                onChange: (e)=>setSortBy(e.target.value),
                                className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "name",
                                        children: "Sort by Name"
                                    }, "sort-name", false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 526,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "rollNo",
                                        children: "Sort by Roll No"
                                    }, "sort-rollNo", false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 529,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "cgpa",
                                        children: "Sort by CGPA"
                                    }, "sort-cgpa", false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 532,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "package",
                                        children: "Sort by Package"
                                    }, "sort-package", false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 535,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/students/page.js",
                                lineNumber: 521,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSortOrder(sortOrder === "asc" ? "desc" : "asc"),
                                className: "px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 544,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm",
                                        children: sortOrder === "asc" ? "ASC" : "DESC"
                                    }, void 0, false, {
                                        fileName: "[project]/app/students/page.js",
                                        lineNumber: 545,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/students/page.js",
                                lineNumber: 540,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/students/page.js",
                        lineNumber: 474,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/students/page.js",
                    lineNumber: 473,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$students$2f$StudentTable$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    filteredStudents: filteredStudents
                }, void 0, false, {
                    fileName: "[project]/app/students/page.js",
                    lineNumber: 552,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center text-sm text-gray-500",
                    children: [
                        "Showing ",
                        filteredStudents.length,
                        " of ",
                        students.length,
                        " students"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/students/page.js",
                    lineNumber: 554,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/students/page.js",
            lineNumber: 230,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/students/page.js",
        lineNumber: 229,
        columnNumber: 5
    }, this);
}
_s(StudentManagementContent, "c72dUaPQwa/uvIMjHY5QGGJL3hU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStudentContext"]
    ];
});
_c = StudentManagementContent;
function StudentManagement() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$StudentContext$2e2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StudentProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StudentManagementContent, {}, void 0, false, {
            fileName: "[project]/app/students/page.js",
            lineNumber: 566,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/students/page.js",
        lineNumber: 565,
        columnNumber: 5
    }, this);
}
_c1 = StudentManagement;
var _c, _c1;
__turbopack_context__.k.register(_c, "StudentManagementContent");
__turbopack_context__.k.register(_c1, "StudentManagement");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_fba6bb35._.js.map