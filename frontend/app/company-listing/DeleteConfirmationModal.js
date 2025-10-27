import React, { useState, useEffect } from "react";
import { AlertTriangle, X, Trash2, Briefcase, Building2 } from "lucide-react";
import { useCompaniesContext } from "../../context/CompaniesContext";
import { toast } from "react-toastify";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  data,
  type = "company", // 'company' or 'position'
  isDeleting = false,
}) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [isValid, setIsValid] = useState(false);

  const { handleDeleteConfirm } = useCompaniesContext();

  // Expected confirmation text based on type
  const expectedText =
    type === "company"
      ? data?.company_name
      : `${data?.company_name}-${data?.position_title}`;

  useEffect(() => {
    setIsValid(confirmationText === expectedText);
  }, [confirmationText, expectedText]);

  useEffect(() => {
    if (!isOpen) {
      setConfirmationText("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid) {
      try {
        await handleDeleteConfirm();
        toast.success(
          `${type === "company" ? "Company" : "Position"} deleted successfully`
        );
      } catch (error) {
        toast.error(`Failed to delete ${type}`);
      }
    } else {
      toast.error("Please type the confirmation text correctly");
    }
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed h-full inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 w-full max-w-md mx-4 transform transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Delete {type === "company" ? "Company" : "Position"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
            disabled={isDeleting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Warning Message */}
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 mb-2">
                This action cannot be undone
              </p>
              <p className="text-sm text-red-700">
                {type === "company" ? (
                  <>
                    This will permanently delete{" "}
                    <span className="font-semibold">{data.company_name}</span>{" "}
                    and all associated positions, applications, and data.
                  </>
                ) : (
                  <>
                    This will permanently delete the position{" "}
                    <span className="font-semibold">{data.position_title}</span>{" "}
                    from{" "}
                    <span className="font-semibold">{data.company_name}</span>{" "}
                    and all associated applications.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Item Info Card */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            {type === "company" ? (
              <>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {data.company_name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  {data.company_type} • {data.sector}
                </p>
                <p className="text-sm text-gray-600">
                  {data.positions?.length || 0} Position(s)
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {data.position_title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  {data.job_type?.replace("_", " ").toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">
                  {data.applications_count || 0} Application(s)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Confirmation Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To confirm deletion, type{" "}
              <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-red-600">
                {expectedText}
              </code>{" "}
              below:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 font-mono ${
                confirmationText.length > 0
                  ? isValid
                    ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    : "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Type to confirm..."
              disabled={isDeleting}
              autoComplete="off"
              spellCheck="false"
            />
            {confirmationText.length > 0 && !isValid && (
              <p className="mt-2 text-sm text-red-600">
                Text doesn&apos;t match
              </p>
            )}
            {isValid && (
              <p className="mt-2 text-sm text-green-600 flex items-center space-x-1">
                <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="w-2 h-1 bg-white rounded-full"></span>
                </span>
                <span>Confirmed - ready to delete</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isDeleting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>
                    Delete {type === "company" ? "Company" : "Position"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
