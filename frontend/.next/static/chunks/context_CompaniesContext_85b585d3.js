(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/context/CompaniesContext.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "CompaniesProvider": ()=>CompaniesProvider,
    "useCompaniesContext": ()=>useCompaniesContext
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$BatchContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/BatchContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$path$2d$browserify$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/path-browserify/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
const backendUrl = ("TURBOPACK compile-time value", "http://localhost:5000/api");
const CompaniesContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
function CompaniesProvider(param) {
    let { children } = param;
    _s();
    const { selectedBatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$BatchContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBatchContext"])();
    const [selectedCompany, setSelectedCompany] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [companies, setCompanies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sectorFilter, setSectorFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [specializationFilter, setSpecializationFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [showDeleteModal, setShowDeleteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deleteType, setDeleteType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("company");
    const [itemToDelete, setItemToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isDeleting, setIsDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showFormModal, setShowFormModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingCompany, setEditingCompany] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showEligibilityModal, setShowEligibilityModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedCompanyForEligibility, setSelectedCompanyForEligibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const formatPackage = (amount)=>{
        if (amount == null || isNaN(amount) || amount === -1) {
            return "Not Disclosed";
        }
        // Amount is now already in lakhs from backend
        if (amount >= 100) {
            return "₹".concat((amount / 100).toFixed(1), " Cr");
        }
        return "₹".concat(amount.toFixed(2), " LPA");
    };
    const formatPackageRange = (position)=>{
        if (!position.package || position.package === -1) {
            return "Not Disclosed";
        }
        if (position.has_range && position.package_end && position.package_end !== -1) {
            return "".concat(formatPackage(position.package), " - ").concat(formatPackage(position.package_end));
        }
        return formatPackage(position.package);
    };
    // Fetch companies data
    const fetchCompanies = async ()=>{
        try {
            setLoading(true);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("".concat(backendUrl, "/companies/batch/").concat(selectedBatch));
            setCompanies(response.data);
            setError(null);
        } catch (err) {
            var _err_response_data, _err_response;
            setError(((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.error) || "Failed to fetch companies");
            console.error("Error fetching companies:", err);
        } finally{
            setLoading(false);
        }
    };
    // Helper function to determine company status
    const getCompanyStatus = (company)=>{
        const now = new Date();
        const scheduledDate = new Date(company.scheduled_visit);
        const actualDate = company.actual_arrival ? new Date(company.actual_arrival) : null;
        if (actualDate) return "JD Shared";
        if (scheduledDate < now) return "Delayed";
        return "upcoming";
    };
    // Updated filter companies logic
    const filteredCompanies = companies.filter((company)=>{
        var _company_company_description, _company_sector;
        // Search filter
        const matchesSearch = company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || ((_company_company_description = company.company_description) === null || _company_company_description === void 0 ? void 0 : _company_company_description.toLowerCase().includes(searchTerm.toLowerCase())) || ((_company_sector = company.sector) === null || _company_sector === void 0 ? void 0 : _company_sector.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesSector = sectorFilter === "all" || company.sector === sectorFilter;
        // Status filter
        const status = getCompanyStatus(company);
        const matchesStatus = activeTab === "all" || activeTab === "marquee" && company.is_marquee || activeTab === status;
        // Updated specialization filter logic
        const matchesSpecialization = specializationFilter === "all" || company.allowed_specializations && specializationFilter.split(",").every((spec)=>company.allowed_specializations.includes(spec));
        return matchesSearch && matchesSector && matchesStatus && matchesSpecialization;
    });
    // Calculate statistics
    const stats = {
        total: companies.length,
        marquee: companies.filter((company)=>company.is_marquee).length,
        jd_shared: companies.filter((company)=>getCompanyStatus(company) === "JD Shared").length,
        upcoming: companies.filter((company)=>getCompanyStatus(company) === "upcoming").length,
        delayed: companies.filter((company)=>getCompanyStatus(company) === "Delayed").length
    };
    // Add useEffect to fetch companies when selectedBatch changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CompaniesProvider.useEffect": ()=>{
            if (selectedBatch) {
                fetchCompanies();
            }
        }
    }["CompaniesProvider.useEffect"], [
        selectedBatch,
        showEligibilityModal
    ]);
    // Delete company
    const handleDeleteCompany = async (companyId)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete("".concat(backendUrl, "/companies/").concat(companyId, "/batch/").concat(selectedBatch));
            // Optimistic update
            setCompanies(companies.filter((company)=>company.id !== companyId));
            // Show success toast
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Company deleted successfully!", {
                duration: 4000,
                position: "top-right"
            });
            // Silent re-sync
            fetchCompanies();
        } catch (err) {
            var _err_response_data, _err_response;
            const errorMessage = ((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.error) || "Failed to delete company";
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMessage, {
                duration: 4000,
                position: "top-right"
            });
            console.error("Error deleting company:", err);
        }
    };
    // TODO
    // Delete position
    const handleDeletePosition = async (positionId)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete("".concat(backendUrl, "/companies/position/").concat(positionId));
            // Show success toast
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Position deleted successfully!", {
                duration: 4000,
                position: "top-right"
            });
            // Refresh companies data
            fetchCompanies();
        } catch (err) {
            var _err_response_data, _err_response;
            const errorMessage = ((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.error) || "Failed to delete position";
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMessage, {
                duration: 4000,
                position: "top-right"
            });
            console.error("Error deleting position:", err);
        }
    };
    const handleDeleteClick = function(item) {
        let type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "company";
        setDeleteType(type);
        setItemToDelete(item);
        setShowDeleteModal(true);
    };
    const handleDeleteConfirm = async ()=>{
        setIsDeleting(true);
        try {
            if (deleteType === "company") {
                await handleDeleteCompany(itemToDelete.id);
            } else {
                await handleDeletePosition(itemToDelete.id);
            }
            setShowDeleteModal(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Delete failed:", error);
        } finally{
            setIsDeleting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CompaniesContext.Provider, {
        value: {
            formatPackage,
            formatPackageRange,
            selectedCompany,
            setSelectedCompany,
            companies,
            setCompanies,
            fetchCompanies,
            loading,
            setLoading,
            error,
            setError,
            selectedBatch,
            searchTerm,
            setSearchTerm,
            sectorFilter,
            setSectorFilter,
            filteredCompanies,
            activeTab,
            setActiveTab,
            stats,
            getCompanyStatus,
            specializationFilter,
            setSpecializationFilter,
            showDeleteModal,
            setShowDeleteModal,
            deleteType,
            setDeleteType,
            itemToDelete,
            setItemToDelete,
            isDeleting,
            setIsDeleting,
            handleDeleteClick,
            handleDeleteConfirm,
            showFormModal,
            setShowFormModal,
            editingCompany,
            setEditingCompany,
            showEligibilityModal,
            setShowEligibilityModal,
            selectedCompanyForEligibility,
            setSelectedCompanyForEligibility
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/CompaniesContext.js",
        lineNumber: 220,
        columnNumber: 5
    }, this);
}
_s(CompaniesProvider, "GamDoT8BftS0bsf0D3afPcKZxRE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$BatchContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBatchContext"]
    ];
});
_c = CompaniesProvider;
const useCompaniesContext = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CompaniesContext);
    if (!context) {
        throw new Error("useCompaniesContext must be used within a CompaniesProvider");
    }
    return context;
};
_s1(useCompaniesContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CompaniesProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=context_CompaniesContext_85b585d3.js.map