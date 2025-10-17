import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Briefcase,
  DollarSign,
  Calendar,
  MapPin,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const ManualOffersModal = ({ isOpen, onClose, student, onSuccess }) => {
  const [offers, setOffers] = useState([]);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    position_title: "",
    package: "",
    company_type: "tech",
    job_type: "full_time",
    offer_date: new Date().toISOString().split("T")[0],
    stipend: "",
    work_location: "",
    bond_details: "",
    additional_details: "",
  });

  useEffect(() => {
    if (isOpen && student) {
      loadStudentOffers();
    }
  }, [isOpen, student]);

  const loadStudentOffers = () => {
    const studentOffers = Array.isArray(student.offers_received)
      ? student.offers_received
      : [];
    setOffers(studentOffers);
    setCurrentOffer(student.current_offer || null);
  };

  const resetForm = () => {
    setFormData({
      company_name: "",
      position_title: "",
      package: "",
      company_type: "tech",
      job_type: "full_time",
      offer_date: new Date().toISOString().split("T")[0],
      stipend: "",
      work_location: "",
      bond_details: "",
      additional_details: "",
    });
    setEditingOffer(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateOffer = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        package: parseFloat(formData.package),
        stipend: formData.stipend ? parseFloat(formData.stipend) : null,
      };

      if (editingOffer) {
        payload.offer_id = editingOffer.offer_id;
      }

      const response = await axios.post(
        `${backendUrl}/offers/students/${student.id}/offers/manual`,
        payload
      );

      toast.success(response.data.message);

      const updatedStudent = await axios.get(
        `${backendUrl}/offers/students/${student.id}`
      );
      setOffers(updatedStudent.data.offers_received || []);

      resetForm();
      setShowOfferForm(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving offer:", error);
      toast.error(error.response?.data?.error || "Failed to save offer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOffer = (offer) => {
    if (offer.source !== "manual") {
      toast.error("Cannot edit campus offers");
      return;
    }

    setEditingOffer(offer);
    setFormData({
      company_name: offer.company_name || "",
      position_title: offer.position_title || "",
      package: offer.package?.toString() || "",
      company_type: offer.company_type || "tech",
      job_type: offer.job_type || "full_time",
      offer_date: offer.offer_date || new Date().toISOString().split("T")[0],
      stipend: offer.stipend?.toString() || "",
      work_location: offer.work_location || "",
      bond_details: offer.bond_details || "",
      additional_details: offer.additional_details || "",
    });
    setShowOfferForm(true);
  };

  const handleDeleteOffer = async (offer) => {
    if (offer.source !== "manual") {
      toast.error("Cannot delete campus offers");
      return;
    }

    if (!window.confirm(`Delete offer from ${offer.company_name}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.delete(
        `${backendUrl}/offers/students/${student.id}/offers/manual/${offer.offer_id}`
      );

      toast.success("Offer deleted successfully");

      const updatedStudent = await axios.get(
        `${backendUrl}/offers/students/${student.id}`
      );
      setOffers(updatedStudent.data.offers_received || []);
      setCurrentOffer(updatedStudent.data.current_offer || null);

      onSuccess?.();
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error(error.response?.data?.error || "Failed to delete offer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${backendUrl}/offers/students/${student.id}/offers/current`,
        {
          offer_id: offerId,
          acceptance_date: new Date().toISOString().split("T")[0],
        }
      );

      toast.success("Offer accepted successfully");

      const updatedStudent = await axios.get(
        `${backendUrl}/offers/students/${student.id}`
      );
      setOffers(updatedStudent.data.offers_received || []);
      setCurrentOffer(updatedStudent.data.current_offer || null);

      onSuccess?.();
    } catch (error) {
      console.error("Error accepting offer:", error);
      toast.error(error.response?.data?.error || "Failed to accept offer");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPackage = (amount) => {
    if (amount == null || isNaN(amount)) return "Not Disclosed";
    if (amount === -1) return "Undisclosed";
    return `₹${(amount / 100000).toFixed(2)} LPA`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Manage Offers</h2>
            <p className="text-slate-300 text-sm mt-2">
              {student.first_name} {student.last_name} •{" "}
              {student.enrollment_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-slate-50 to-white">
          {/* Current Accepted Offer */}
          {currentOffer && (
            <div className="mb-8 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-emerald-900 text-lg">
                  Current Accepted Offer
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-emerald-700/70 font-medium mb-1">
                    Company
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {currentOffer.company_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-emerald-700/70 font-medium mb-1">
                    Position
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {currentOffer.position_title}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-emerald-700/70 font-medium mb-1">
                    Package
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {formatPackage(currentOffer.package)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-emerald-700/70 font-medium mb-1">
                    Type
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      currentOffer.source === "campus"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {currentOffer.source === "campus" ? "Campus" : "Off-Campus"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Add Offer Button */}
          {!showOfferForm && (
            <button
              onClick={() => setShowOfferForm(true)}
              className="w-full mb-8 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Add Manual Offer
            </button>
          )}

          {/* Offer Form */}
          {showOfferForm && (
            <div className="mb-8 bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-900 text-lg">
                  {editingOffer ? "Edit Manual Offer" : "Add New Manual Offer"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowOfferForm(false);
                    resetForm();
                  }}
                  className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Position Title *
                  </label>
                  <input
                    type="text"
                    name="position_title"
                    value={formData.position_title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Package (in ₹) *
                  </label>
                  <input
                    type="number"
                    name="package"
                    value={formData.package}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., 1200000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Company Type *
                  </label>
                  <select
                    name="company_type"
                    value={formData.company_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="tech">Tech</option>
                    <option value="non-tech">Non-Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Job Type
                  </label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="full_time">Full Time</option>
                    <option value="internship">Internship</option>
                    <option value="internship_plus_ppo">
                      Internship + PPO
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Offer Date
                  </label>
                  <input
                    type="date"
                    name="offer_date"
                    value={formData.offer_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Monthly Stipend (if applicable)
                  </label>
                  <input
                    type="number"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Work Location
                  </label>
                  <input
                    type="text"
                    name="work_location"
                    value={formData.work_location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bond Details
                  </label>
                  <textarea
                    name="bond_details"
                    value={formData.bond_details}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    name="additional_details"
                    value={formData.additional_details}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleAddOrUpdateOffer}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Saving..."
                    : editingOffer
                      ? "Update Offer"
                      : "Add Offer"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOfferForm(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Offers List */}
          <div>
            <h3 className="font-semibold text-slate-900 text-lg mb-4">
              All Offers{" "}
              <span className="text-slate-500 font-normal">
                ({offers.length})
              </span>
            </h3>

            {offers.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No offers found</p>
                <p className="text-sm mt-1">
                  Add a manual offer to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {offers.map((offer) => (
                  <div
                    key={offer.offer_id}
                    className={`border rounded-xl p-5 transition-all duration-200 ${
                      offer.is_accepted
                        ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md"
                        : "border-slate-200 bg-white hover:shadow-lg hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="font-semibold text-slate-900 text-lg">
                            {offer.company_name}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              offer.source === "campus"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {offer.source === "campus"
                              ? "Campus"
                              : "Off-Campus"}
                          </span>
                          {offer.is_accepted && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Accepted
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">
                          {offer.position_title}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {offer.source === "manual" && !offer.is_accepted && (
                          <>
                            <button
                              onClick={() => handleEditOffer(offer)}
                              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOffer(offer)}
                              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {!offer.is_accepted && (
                          <button
                            onClick={() => handleAcceptOffer(offer.offer_id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg font-semibold transition-all duration-200"
                          >
                            Accept
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold">
                          {formatPackage(offer.package)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Briefcase className="h-4 w-4 text-purple-600" />
                        <span className="capitalize font-semibold">
                          {offer.job_type?.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4 text-amber-600" />
                        <span className="font-semibold">
                          {offer.offer_date}
                        </span>
                      </div>
                      {offer.work_location && (
                        <div className="flex items-center gap-2 text-slate-600 col-span-3">
                          <MapPin className="h-4 w-4 text-red-600" />
                          <span className="font-semibold">
                            {offer.work_location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-8 py-4 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualOffersModal;
