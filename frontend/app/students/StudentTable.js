import { Edit, Trash, Briefcase } from "lucide-react";
import { useStudentContext } from "../../context/StudentContext";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ManualOffersModal from "./ManualOffersModal";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function StudentTable({ filteredStudents }) {
  const {
    formatStudentName,
    setEditingStudent,
    setStudentFormData,
    setShowEditStudentModal,
    fetchStudents,
  } = useStudentContext();

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for manual offers modal
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleEditStudent = (student) => {
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
      date_of_birth: student.date_of_birth
        ? student.date_of_birth.split("T")[0]
        : "",
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
      placement_status: student.placement_status || "eligible",
    });
    setShowEditStudentModal(true);
  };

  // Handle delete button click
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  // Handle manage offers button click
  const handleManageOffers = (student) => {
    setSelectedStudent(student);
    setShowOffersModal(true);
  };

  // Handle offers modal close and refresh
  const handleOffersSuccess = () => {
    fetchStudents(); // Refresh student data
  };

  const formatPackage = (amount) => {
    if (amount == null || isNaN(amount)) {
      return "Not Disclosed";
    }

    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} LPA`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  // Update the handleConfirmDelete function
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`${backendUrl}/students/${studentToDelete.id}`);

      // Close modal and reset state
      setShowDeleteModal(false);
      setStudentToDelete(null);

      // Refresh the students data
      await fetchStudents();

      // Show success toast
      toast.success(
        `${studentToDelete.first_name} ${studentToDelete.last_name} has been deleted successfully.`,
        {
          duration: 4000,
          position: "top-right",
        }
      );
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting student. Please try again.", {
        duration: 6000,
        position: "top-right",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle modal close
  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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

  return (
    <>
      <div className="space-y-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Academic Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Placement Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Board Marks
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50 transition-all duration-200"
                  >
                    <td className="px-6 py-5">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-gray-900">
                              {formatStudentName(student)}
                            </h3>
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.registration_number}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {student.college_email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {student.personal_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {student.department} {student.branch}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                            CGPA:{" "}
                            {student.cgpa !== null && student.cgpa !== undefined
                              ? Number(student.cgpa).toFixed(2)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Backlogs: {student.backlogs} | Batch:{" "}
                          {student.batch_year}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          +91 {student.phone}
                        </div>
                        {student.alternate_phone && (
                          <div className="text-xs text-gray-500">
                            +91 {student.alternate_phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            student.placement_status
                          )}`}
                        >
                          {student.placement_status.replace("_", " ")}
                        </span>
                        {student.current_offer && (
                          <div className="text-xs text-gray-600">
                            {student.current_offer.company_name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {student.offers_received?.length > 0 ? (
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {student.offers_received.length} Offer(s)
                          </div>
                          {student.offers_received
                            .slice(0, 2)
                            .map((offer, idx) => (
                              <div key={idx} className="text-xs text-gray-500">
                                {offer.company_name} -{" "}
                                {formatPackage(offer.package)}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          No offers yet
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="text-xs flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                            10th: {student.class_10_percentage}%
                          </span>
                        </div>
                        <div className="text-xs flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                            12th: {student.class_12_percentage}%
                          </span>
                        </div>
                        {student.drives_skipped > 0 && (
                          <div className="text-xs text-red-500 mt-1">
                            Drives Skipped: {student.drives_skipped}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleManageOffers(student)}
                          className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-all duration-200"
                          title="Manage Offers"
                        >
                          <Briefcase className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="p-2 text-slate-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-all duration-200"
                          title="Edit Student"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
                          title="Delete Student"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          student={studentToDelete}
          isDeleting={isDeleting}
        />

        {/* Manual Offers Modal */}
        <ManualOffersModal
          isOpen={showOffersModal}
          onClose={() => setShowOffersModal(false)}
          student={selectedStudent}
          onSuccess={handleOffersSuccess}
        />
      </div>
    </>
  );
}
