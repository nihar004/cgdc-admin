import { Edit, Trash } from "lucide-react";
import { useStudentContext } from "../../context/StudentContext.";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function StudentTable({ filteredStudents }) {
  const {
    formatStudentName,
    setEditingStudent,
    setStudentFormData,
    setShowEditStudentModal,
    fetchStudents, // Add this from context
  } = useStudentContext();

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Update the handleConfirmDelete function
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(
        `http://localhost:5000/students/${studentToDelete.id}`
      );

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
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Placement Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BOARD MARKS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatStudentName(student)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.registration_number}
                          </div>
                          <div className="text-xs text-gray-400">
                            {student.college_email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {student.personal_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">
                          {student.department} {student.branch}
                        </div>
                        <div className="text-sm text-gray-500">
                          CGPA:{" "}
                          {student.cgpa !== undefined && student.cgpa !== null
                            ? Number(student.cgpa).toFixed(2)
                            : "N/A"}
                        </div>
                        <div className="text-xs text-gray-400">
                          Backlogs: {student.backlogs} | Batch:{" "}
                          {student.batch_year}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">+91 {student.phone}</div>
                      {student.alternate_phone && (
                        <div className="text-sm">
                          +91 {student.alternate_phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          student.placement_status
                        )}`}
                      >
                        {student.placement_status.replace("_", " ")}
                      </div>
                      {student.current_offer && (
                        <div className="mt-1 text-sm text-gray-600">
                          {student.current_offer.company_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student.offers_received?.length > 0 ? (
                        <div>
                          <div className="text-sm font-medium">
                            {student.offers_received.length} Offer(s)
                          </div>
                          {student.offers_received
                            .slice(0, 2)
                            .map((offer, idx) => (
                              <div
                                key={`${student.id}-offer-${idx}`}
                                className="text-xs text-gray-500"
                              >
                                {offer.company_name} -{" "}
                                {(offer.package / 100000).toFixed(1)} LPA
                              </div>
                            ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          No offers yet
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>10th: {student.class_10_percentage}%</div>
                        <div>12th: {student.class_12_percentage}%</div>
                        {student.drives_skipped > 0 && (
                          <div className="text-red-500">
                            Drives Skipped: {student.drives_skipped}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete Student"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
    </>
  );
}
