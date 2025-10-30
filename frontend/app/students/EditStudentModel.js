// import { Plus, Edit, X } from "lucide-react";
// import axios from "axios";
// import { useState } from "react";
// import { useStudentContext } from "../../context/StudentContext";
// import toast from "react-hot-toast";
// const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// export default function EditStudentModel() {
//   const {
//     showEditStudentModal,
//     setShowEditStudentModal,
//     setEditingStudent,
//     studentFormData,
//     editingStudent,
//     setStudentFormData,
//     setStudents, // Add this
//     fetchStudents,
//   } = useStudentContext();

//   const [formErrors, setFormErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setStudentFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error when user starts typing
//     if (formErrors[name]) {
//       setFormErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {};

//     if (!studentFormData.first_name.trim())
//       errors.first_name = "First name is required";
//     if (!studentFormData.last_name.trim())
//       errors.last_name = "Last name is required";
//     if (!studentFormData.enrollment_number.trim())
//       errors.enrollment_number = "Enrollment number is required";
//     if (!studentFormData.registration_number.trim())
//       errors.registration_number = "Registration number is required";
//     if (!studentFormData.college_email.trim())
//       errors.college_email = "College email is required";
//     if (!studentFormData.phone.trim())
//       errors.phone = "Phone number is required";
//     if (!studentFormData.department.trim())
//       errors.department = "Department is required";
//     if (!studentFormData.branch.trim()) errors.branch = "Branch is required";

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (
//       studentFormData.college_email &&
//       !emailRegex.test(studentFormData.college_email)
//     ) {
//       errors.college_email = "Invalid email format";
//     }
//     if (
//       studentFormData.personal_email &&
//       !emailRegex.test(studentFormData.personal_email)
//     ) {
//       errors.personal_email = "Invalid email format";
//     }

//     // Phone validation
//     if (studentFormData.phone && !/^\d{10}$/.test(studentFormData.phone)) {
//       errors.phone = "Phone must be 10 digits";
//     }

//     return errors;
//   };

//   const resetForm = () => {
//     setStudentFormData({
//       enrollment_number: "",
//       first_name: "",
//       last_name: "",
//       phone: "",
//       alternate_phone: "",
//       college_email: "",
//       personal_email: "",
//       department: "",
//       branch: "",
//       batch_year: new Date().getFullYear(),
//       current_semester: 1,
//       cgpa: "",
//       backlogs: 0,
//       resume_url: "",
//       linkedin_url: "",
//       github_url: "",
//       date_of_birth: "",
//       gender: "",
//       registration_number: "",
//       class_10_percentage: "",
//       class_12_percentage: "",
//       permanent_address: "",
//       permanent_city: "",
//       permanent_state: "",
//       ps2_company_name: "",
//       ps2_project_title: "",
//       ps2_certificate_url: "",
//       placement_status: "eligible",
//     });
//     setFormErrors({});
//   };

//   const handleUpdateStudent = async () => {
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Format data for API
//       const studentToUpdate = {
//         ...studentFormData,
//         cgpa: studentFormData.cgpa ? parseFloat(studentFormData.cgpa) : null,
//         class_10_percentage: studentFormData.class_10_percentage
//           ? parseFloat(studentFormData.class_10_percentage)
//           : null,
//         class_12_percentage: studentFormData.class_12_percentage
//           ? parseFloat(studentFormData.class_12_percentage)
//           : null,
//         backlogs: parseInt(studentFormData.backlogs) || 0,
//         current_semester: parseInt(studentFormData.current_semester) || 1,
//         batch_year: parseInt(studentFormData.batch_year),
//         date_of_birth: studentFormData.date_of_birth
//           ? new Date(studentFormData.date_of_birth).toISOString()
//           : null,
//       };

//       const response = await axios.put(
//         `${backendUrl}/students/update/${editingStudent.id}`,
//         studentToUpdate
//       );

//       if (response.status === 200) {
//         // Update local state
//         setStudents((prev) =>
//           prev.map((s) => (s.id === editingStudent.id ? response.data : s))
//         );

//         // Reset form and close modal
//         resetForm();
//         setEditingStudent(null);
//         setShowEditStudentModal(false);

//         // Show success toast
//         toast.success("Student updated successfully!", {
//           duration: 4000,
//           position: "top-right",
//         });

//         // Refresh the data
//         await fetchStudents();

//         // Optional: Scroll to top smoothly
//         window.scrollTo({ top: 0, behavior: "smooth" });
//       }
//     } catch (error) {
//       console.error("Error updating student:", error);

//       if (error.response) {
//         // Handle specific HTTP error codes
//         switch (error.response.status) {
//           case 404:
//             toast.error("Student not found. Please refresh the page.");
//             break;
//           case 400:
//             toast.error("Invalid data provided. Please check your inputs.");
//             break;
//           case 500:
//             toast.error("Server error. Please try again later.");
//             break;
//           default:
//             toast.error(
//               `Error updating student: ${
//                 error.response.data.message || "Unknown error"
//               }`
//             );
//         }
//       } else if (error.request) {
//         // Network error
//         toast.error("Network error. Please check your connection.");
//       } else {
//         toast.error("Error updating student. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed h-full inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/30 to-purple-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200/50">
//           <div>
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
//                 {showEditStudentModal ? (
//                   <Edit className="h-6 w-6" />
//                 ) : (
//                   <Plus className="h-6 w-6" />
//                 )}
//               </div>
//               {showEditStudentModal ? "Edit Student" : "Add New Student"}
//             </h2>
//             <p className="text-gray-500 mt-2 ml-14">
//               {showEditStudentModal
//                 ? "Update student information"
//                 : "Enter student details to add to the database"}
//             </p>
//           </div>
//           <button
//             onClick={() => {
//               setShowEditStudentModal(false);
//               setEditingStudent(null);
//               resetForm();
//             }}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-all duration-200 group"
//           >
//             <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
//           </button>
//         </div>

//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             showEditStudentModal && handleUpdateStudent();
//           }}
//         >
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Left Column - Personal & Contact Information */}
//             <div className="space-y-8">
//               {/* Personal Information */}
//               <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl">
//                 <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-blue-200/50">
//                   <div className="p-2 bg-blue-500 rounded-lg">
//                     <svg
//                       className="h-4 w-4 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       />
//                     </svg>
//                   </div>
//                   Personal Information
//                 </h3>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       First Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="first_name"
//                       value={studentFormData.first_name}
//                       onChange={handleInputChange}
//                       className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
//                         formErrors.first_name
//                           ? "border-red-400 bg-red-50/50"
//                           : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70"
//                       }`}
//                       placeholder="Enter first name"
//                     />
//                     {formErrors.first_name && (
//                       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                         <svg
//                           className="h-3 w-3"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         {formErrors.first_name}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Last Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="last_name"
//                       value={studentFormData.last_name}
//                       onChange={handleInputChange}
//                       className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
//                         formErrors.last_name
//                           ? "border-red-400 bg-red-50/50"
//                           : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70"
//                       }`}
//                       placeholder="Enter last name"
//                     />
//                     {formErrors.last_name && (
//                       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                         <svg
//                           className="h-3 w-3"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         {formErrors.last_name}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Date of Birth
//                     </label>
//                     <input
//                       type="date"
//                       name="date_of_birth"
//                       value={studentFormData.date_of_birth}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/70"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Gender
//                     </label>
//                     <select
//                       name="gender"
//                       value={studentFormData.gender}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/70"
//                     >
//                       <option value="">Select Gender</option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Phone Number *
//                     </label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={studentFormData.phone}
//                       onChange={handleInputChange}
//                       placeholder="10-digit number"
//                       className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
//                         formErrors.phone
//                           ? "border-red-400 bg-red-50/50"
//                           : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70"
//                       }`}
//                     />
//                     {formErrors.phone && (
//                       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                         <svg
//                           className="h-3 w-3"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         {formErrors.phone}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Alternate Phone
//                     </label>
//                     <input
//                       type="tel"
//                       name="alternate_phone"
//                       value={studentFormData.alternate_phone}
//                       onChange={handleInputChange}
//                       placeholder="10-digit number"
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/70"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     College Email *
//                   </label>
//                   <input
//                     type="email"
//                     name="college_email"
//                     value={studentFormData.college_email}
//                     onChange={handleInputChange}
//                     placeholder="student@college.edu"
//                     className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
//                       formErrors.college_email
//                         ? "border-red-400 bg-red-50/50"
//                         : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70"
//                     }`}
//                   />
//                   {formErrors.college_email && (
//                     <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                       <svg
//                         className="h-3 w-3"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       {formErrors.college_email}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Personal Email
//                   </label>
//                   <input
//                     type="email"
//                     name="personal_email"
//                     value={studentFormData.personal_email}
//                     onChange={handleInputChange}
//                     placeholder="personal@email.com"
//                     className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
//                       formErrors.personal_email
//                         ? "border-red-400 bg-red-50/50"
//                         : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70"
//                     }`}
//                   />
//                   {formErrors.personal_email && (
//                     <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                       <svg
//                         className="h-3 w-3"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       {formErrors.personal_email}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Address Information */}
//               <div className="space-y-6 p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 rounded-xl">
//                 <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-emerald-200/50">
//                   <div className="p-2 bg-emerald-500 rounded-lg">
//                     <svg
//                       className="h-4 w-4 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                     </svg>
//                   </div>
//                   Address Information
//                 </h3>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Permanent Address
//                   </label>
//                   <textarea
//                     name="permanent_address"
//                     value={studentFormData.permanent_address}
//                     onChange={handleInputChange}
//                     rows="3"
//                     placeholder="Enter complete address"
//                     className="w-full px-4 py-3 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white/70 resize-none"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       City
//                     </label>
//                     <input
//                       type="text"
//                       name="permanent_city"
//                       value={studentFormData.permanent_city}
//                       onChange={handleInputChange}
//                       placeholder="Enter city"
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white/70"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       State
//                     </label>
//                     <input
//                       type="text"
//                       name="permanent_state"
//                       value={studentFormData.permanent_state}
//                       onChange={handleInputChange}
//                       placeholder="Enter state"
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white/70"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Academic & Professional Information */}
//             <div className="space-y-8">
//               {/* Academic Information */}
//               <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/50 rounded-xl">
//                 <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-purple-200/50">
//                   <div className="p-2 bg-purple-500 rounded-lg">
//                     <svg
//                       className="h-4 w-4 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                       />
//                     </svg>
//                   </div>
//                   Academic Information
//                 </h3>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Enrollment Number *
//                     </label>
//                     <input
//                       type="text"
//                       name="enrollment_number"
//                       value={studentFormData.enrollment_number}
//                       onChange={handleInputChange}
//                       placeholder="ENR123456"
//                       className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
//                         formErrors.enrollment_number
//                           ? "border-red-400 bg-red-50/50"
//                           : "border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white/70"
//                       }`}
//                     />
//                     {formErrors.enrollment_number && (
//                       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                         <svg
//                           className="h-3 w-3"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         {formErrors.enrollment_number}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Registration Number *
//                     </label>
//                     <input
//                       type="text"
//                       name="registration_number"
//                       value={studentFormData.registration_number}
//                       onChange={handleInputChange}
//                       placeholder="REG123456"
//                       className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
//                         formErrors.registration_number
//                           ? "border-red-400 bg-red-50/50"
//                           : "border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white/70"
//                       }`}
//                     />
//                     {formErrors.registration_number && (
//                       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                         <svg
//                           className="h-3 w-3"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         {formErrors.registration_number}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Department *
//                     </label>
//                     <input
//                       type="text"
//                       name="department"
//                       value={studentFormData.department}
//                       onChange={handleInputChange}
//                       placeholder="e.g., B.Tech"
//                       className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
//                         formErrors.department
//                           ? "border-red-400 bg-red-50/50"
//                           : "border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white/70"
//                       }`}
//                     />
//                     {formErrors.department && (
//                       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                         <svg
//                           className="h-3 w-3"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         {formErrors.department}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Branch *
//                     </label>
//                     <input
//                       type="text"
//                       name="branch"
//                       value={studentFormData.branch}
//                       onChange={handleInputChange}
//                       placeholder="e.g., CSE, IT, ECE"
//                       className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
//                         formErrors.branch
//                           ? "border-red-400 bg-red-50/50"
//                           : "border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white/70"
//                       }`}
//                     />
//                     {formErrors.branch && (
//                       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                         <svg
//                           className="h-3 w-3"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         {formErrors.branch}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Batch Year
//                     </label>
//                     <input
//                       type="number"
//                       name="batch_year"
//                       value={studentFormData.batch_year}
//                       onChange={handleInputChange}
//                       min="2020"
//                       max="2030"
//                       placeholder="2024"
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Current Semester
//                     </label>
//                     <select
//                       name="current_semester"
//                       value={studentFormData.current_semester}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
//                     >
//                       <option value="" key="default">
//                         Select
//                       </option>
//                       {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
//                         <option key={`sem-${sem}`} value={sem}>
//                           Semester {sem}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       CGPA
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       max="10"
//                       name="cgpa"
//                       value={studentFormData.cgpa}
//                       onChange={handleInputChange}
//                       placeholder="0.00"
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       10th Percentage
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       max="100"
//                       name="class_10_percentage"
//                       value={studentFormData.class_10_percentage}
//                       onChange={handleInputChange}
//                       placeholder="85.5"
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       12th Percentage
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       max="100"
//                       name="class_12_percentage"
//                       value={studentFormData.class_12_percentage}
//                       onChange={handleInputChange}
//                       placeholder="88.2"
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Backlogs
//                     </label>
//                     <input
//                       type="number"
//                       min="0"
//                       name="backlogs"
//                       value={studentFormData.backlogs}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Professional Information */}
//               <div className="space-y-6 p-6 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/50 rounded-xl">
//                 <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-orange-200/50">
//                   <div className="p-2 bg-orange-500 rounded-lg">
//                     <svg
//                       className="h-4 w-4 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
//                       />
//                     </svg>
//                   </div>
//                   Professional Information
//                 </h3>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Resume URL
//                   </label>
//                   <input
//                     type="url"
//                     name="resume_url"
//                     value={studentFormData.resume_url}
//                     onChange={handleInputChange}
//                     placeholder="https://drive.google.com/file/..."
//                     className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       LinkedIn URL
//                     </label>
//                     <input
//                       type="url"
//                       name="linkedin_url"
//                       value={studentFormData.linkedin_url}
//                       onChange={handleInputChange}
//                       placeholder="https://linkedin.com/in/..."
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       GitHub URL
//                     </label>
//                     <input
//                       type="url"
//                       name="github_url"
//                       value={studentFormData.github_url}
//                       onChange={handleInputChange}
//                       placeholder="https://github.com/..."
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       PS2 Company
//                     </label>
//                     <input
//                       type="text"
//                       name="ps2_company_name"
//                       value={studentFormData.ps2_company_name}
//                       onChange={handleInputChange}
//                       placeholder="Company name"
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       PS2 Project Title
//                     </label>
//                     <input
//                       type="text"
//                       name="ps2_project_title"
//                       value={studentFormData.ps2_project_title}
//                       onChange={handleInputChange}
//                       placeholder="Project title"
//                       className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     PS2 Certificate URL
//                   </label>
//                   <input
//                     type="url"
//                     name="ps2_certificate_url"
//                     value={studentFormData.ps2_certificate_url}
//                     onChange={handleInputChange}
//                     placeholder="https://certificate-url.com/..."
//                     className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Placement Status
//                   </label>
//                   <select
//                     name="placement_status"
//                     value={studentFormData.placement_status}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
//                   >
//                     <option value="placed" key="placed">
//                       Placed
//                     </option>
//                     <option value="unplaced" key="unplaced">
//                       Unplaced
//                     </option>
//                     <option value="higher_studies" key="higher_studies">
//                       Higher Studies
//                     </option>
//                     <option value="entrepreneurship" key="entrepreneurship">
//                       Entrepreneurship
//                     </option>
//                     <option value="family_business" key="family_business">
//                       Family Business
//                     </option>
//                     <option value="debarred" key="debarred">
//                       Debarred
//                     </option>
//                     <option value="others" key="others">
//                       Others
//                     </option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-200/50">
//             <button
//               type="button"
//               onClick={() => {
//                 setShowEditStudentModal(false);
//                 setEditingStudent(null);
//                 resetForm();
//               }}
//               className="px-8 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-3 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 ${
//                 isLoading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               <div className="p-1 bg-white/20 rounded-lg">
//                 {showEditStudentModal ? (
//                   <Edit className="h-4 w-4" />
//                 ) : (
//                   <Plus className="h-4 w-4" />
//                 )}
//               </div>
//               <span>{isLoading ? "Updating..." : "Update Student"}</span>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { Plus, Edit, X } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useStudentContext } from "../../context/StudentContext";
import toast from "react-hot-toast";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Add these plugins to dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

export default function EditStudentModel() {
  const {
    showEditStudentModal,
    setShowEditStudentModal,
    setEditingStudent,
    studentFormData,
    editingStudent,
    setStudentFormData,
    setStudents, // Add this
    fetchStudents,
  } = useStudentContext();

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // Add new state for specializations
  const [specializations, setSpecializations] = useState([]);
  const [showAddSpecialization, setShowAddSpecialization] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState("");

  // Update the useEffect where initial data is set
  useEffect(() => {
    if (editingStudent) {
      setStudentFormData({
        ...editingStudent,
        specialization: editingStudent.specialization_id || "",
        enrollment_number: editingStudent.enrollment_number || "",
        full_name: editingStudent.full_name || "",
        phone: editingStudent.phone || "",
        alternate_phone: editingStudent.alternate_phone || "",
        college_email: editingStudent.college_email || "",
        personal_email: editingStudent.personal_email || "",
        department: editingStudent.department || "",
        branch: editingStudent.branch || "",
        batch_year: editingStudent.batch_year || new Date().getFullYear(),
        current_semester: editingStudent.current_semester || "",
        cgpa: editingStudent.cgpa || "",
        backlogs: editingStudent.backlogs || 0,
        resume_url: editingStudent.resume_url || "",
        linkedin_url: editingStudent.linkedin_url || "",
        github_url: editingStudent.github_url || "",
        date_of_birth:
          editingStudent.date_of_birth &&
          dayjs(editingStudent.date_of_birth).isValid()
            ? dayjs(editingStudent.date_of_birth).format("YYYY-MM-DD")
            : "",
        gender: editingStudent.gender || "",
        registration_number: editingStudent.registration_number || "",
        class_10_percentage: editingStudent.class_10_percentage || "",
        class_12_percentage: editingStudent.class_12_percentage || "",
        permanent_address: editingStudent.permanent_address || "", // THIS IS THE KEY ONE FOR TEXTAREA
        permanent_city: editingStudent.permanent_city || "",
        permanent_state: editingStudent.permanent_state || "",
        ps2_company_name: editingStudent.ps2_company_name || "",
        ps2_project_title: editingStudent.ps2_project_title || "",
        placement_status: editingStudent.placement_status || "eligible",
        father_name: editingStudent.father_name || "",
        father_mobile: editingStudent.father_mobile || "",
        father_email: editingStudent.father_email || "",
        mother_name: editingStudent.mother_name || "",
        mother_mobile: editingStudent.mother_mobile || "",
        aadhar_number: editingStudent.aadhar_number || "",
        pan_number: editingStudent.pan_number || "",
        domicile_state: editingStudent.domicile_state || "",
        board_10_name: editingStudent.board_10_name || "",
        board_10_passing_year: editingStudent.board_10_passing_year || "",
        board_12_name: editingStudent.board_12_name || "",
        board_12_passing_year: editingStudent.board_12_passing_year || "",
      });
    }
  }, [editingStudent, setStudentFormData]); // Add setStudentFormData to dependency array

  // Add this useEffect to fetch specializations
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/students/specializations`
        );
        if (response.data) {
          setSpecializations(response.data);
        }
      } catch (error) {
        console.error("Error fetching specializations:", error);
        toast.error("Failed to load specializations");
      }
    };

    fetchSpecializations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!studentFormData.full_name.trim())
      errors.full_name = "Name is required";
    if (!studentFormData.registration_number.trim())
      errors.registration_number = "Registration number is required";
    if (!studentFormData.college_email.trim())
      errors.college_email = "College email is required";
    if (!studentFormData.phone.trim())
      errors.phone = "Phone number is required";
    if (!studentFormData.department.trim())
      errors.department = "Department is required";
    if (!studentFormData.branch.trim()) errors.branch = "Branch is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      studentFormData.college_email &&
      !emailRegex.test(studentFormData.college_email)
    ) {
      errors.college_email = "Invalid email format";
    }
    if (
      studentFormData.personal_email &&
      !emailRegex.test(studentFormData.personal_email)
    ) {
      errors.personal_email = "Invalid email format";
    }

    // Phone validation
    if (studentFormData.phone && !/^\d{10}$/.test(studentFormData.phone)) {
      errors.phone = "Phone must be 10 digits";
    }

    return errors;
  };

  const initialFormState = {
    enrollment_number: "",
    full_name: "",
    phone: "",
    alternate_phone: "",
    college_email: "",
    personal_email: "",
    department: "",
    branch: "",
    batch_year: new Date().getFullYear(),
    current_semester: "",
    cgpa: "",
    backlogs: "0", // Convert to string for controlled input
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
    placement_status: "eligible",
    father_name: "",
    father_mobile: "",
    father_email: "",
    mother_name: "",
    mother_mobile: "",
    aadhar_number: "",
    pan_number: "",
    domicile_state: "",
    board_10_name: "",
    board_10_passing_year: "",
    board_12_name: "",
    board_12_passing_year: "",
    specialization: "",
  };

  const resetForm = () => {
    setStudentFormData(initialFormState);
    setFormErrors({});
  };

  // Update the handleUpdateStudent function
  const handleUpdateStudent = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const studentToUpdate = {
        ...studentFormData,
        // Convert specialization ID to number if it exists
        specialization_id: studentFormData.specialization
          ? parseInt(studentFormData.specialization)
          : null,
        date_of_birth: studentFormData.date_of_birth || null,
        cgpa: studentFormData.cgpa ? parseFloat(studentFormData.cgpa) : null,
        class_10_percentage: studentFormData.class_10_percentage
          ? parseFloat(studentFormData.class_10_percentage)
          : null,
        class_12_percentage: studentFormData.class_12_percentage
          ? parseFloat(studentFormData.class_12_percentage)
          : null,
        backlogs: parseInt(studentFormData.backlogs) || 0,
        current_semester: parseInt(studentFormData.current_semester) || 1,
        batch_year: parseInt(studentFormData.batch_year),
        resume_url: studentFormData.resume_url || null,
        linkedin_url: studentFormData.linkedin_url || null,
        github_url: studentFormData.github_url || null,
      };

      const response = await axios.put(
        `${backendUrl}/students/update/${editingStudent.id}`,
        studentToUpdate
      );

      if (response.status === 200) {
        // Update local state
        setStudents((prev) =>
          prev.map((s) => (s.id === editingStudent.id ? response.data : s))
        );

        // Reset form and close modal
        resetForm();
        setEditingStudent(null);
        setShowEditStudentModal(false);

        // Show success toast
        toast.success("Student updated successfully!", {
          duration: 4000,
          position: "top-right",
        });

        // Refresh the data
        await fetchStudents();

        // Optional: Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error updating student:", error);

      if (error.response) {
        // Handle specific HTTP error codes
        switch (error.response.status) {
          case 404:
            toast.error("Student not found. Please refresh the page.");
            break;
          case 400:
            toast.error("Invalid data provided. Please check your inputs.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error(
              `Error updating student: ${
                error.response.data.message || "Unknown error"
              }`
            );
        }
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Error updating student. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update the handleAddSpecialization function
  const handleAddSpecialization = async () => {
    if (!newSpecialization.trim()) {
      toast.error("Please enter a specialization name");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/students/specializations`,
        { name: newSpecialization.trim() }
      );

      if (response.data.success) {
        // Update specializations list with new entry
        const specsResponse = await axios.get(
          `${backendUrl}/students/specializations`
        );
        setSpecializations(specsResponse.data);

        // Set the new specialization as selected
        setStudentFormData((prev) => ({
          ...prev,
          specialization: response.data.specialization.id,
        }));

        // Reset form state
        setNewSpecialization("");
        setShowAddSpecialization(false);

        // Show success message
        toast.success(
          `Added new specialization: ${response.data.specialization.name}`
        );
      }
    } catch (error) {
      console.error("Error adding specialization:", error);
      toast.error(
        error.response?.data?.message || "Failed to add specialization"
      );
    }
  };

  return (
    <div className="fixed h-full inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/30 to-purple-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200/50">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
                {showEditStudentModal ? (
                  <Edit className="h-6 w-6" />
                ) : (
                  <Plus className="h-6 w-6" />
                )}
              </div>
              {showEditStudentModal ? "Edit Student" : "Add New Student"}
            </h2>
            <p className="text-gray-500 mt-2 ml-14">
              {showEditStudentModal
                ? "Update student information"
                : "Enter student details to add to the database"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowEditStudentModal(false);
              setEditingStudent(null);
              resetForm();
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-all duration-200 group"
          >
            <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            showEditStudentModal && handleUpdateStudent();
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Personal & Contact Information */}
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-blue-200/50">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  Personal Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={studentFormData.full_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
                        formErrors.full_name
                          ? "border-red-400 bg-red-50/50"
                          : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70"
                      }`}
                      placeholder="Enter first name"
                    />
                    {formErrors.full_name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formErrors.full_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={
                        studentFormData.date_of_birth
                          ? dayjs(studentFormData.date_of_birth)
                              // .add(1, "day")
                              .format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={studentFormData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/70"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={studentFormData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
                        formErrors.phone
                          ? "border-red-400 bg-red-50/50"
                          : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70"
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alternate Phone
                    </label>
                    <input
                      type="tel"
                      name="alternate_phone"
                      value={studentFormData.alternate_phone}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    College Email *
                  </label>
                  <input
                    type="email"
                    name="college_email"
                    value={studentFormData.college_email}
                    onChange={handleInputChange}
                    placeholder="student@college.edu"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
                      formErrors.college_email
                        ? "border-red-400 bg-red-50/50"
                        : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70"
                    }`}
                  />
                  {formErrors.college_email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formErrors.college_email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Personal Email
                  </label>
                  <input
                    type="email"
                    name="personal_email"
                    value={studentFormData.personal_email}
                    onChange={handleInputChange}
                    placeholder="personal@email.com"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
                      formErrors.personal_email
                        ? "border-red-400 bg-red-50/50"
                        : "border-gray-200 hover:border-blue-300 focus:border-blue-500 bg-white/70"
                    }`}
                  />
                  {formErrors.personal_email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formErrors.personal_email}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6 p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-emerald-200/50">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  Address Information
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Permanent Address
                  </label>
                  <textarea
                    name="permanent_address"
                    value={studentFormData.permanent_address || ""}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter complete address"
                    className="w-full px-4 py-3 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white/70 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="permanent_city"
                      value={studentFormData.permanent_city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="permanent_state"
                      value={studentFormData.permanent_state}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Academic & Professional Information */}
            <div className="space-y-8">
              {/* Academic Information */}
              <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-purple-200/50">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  Academic Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enrollment Number *
                    </label>
                    <input
                      type="text"
                      name="enrollment_number"
                      value={studentFormData.enrollment_number}
                      onChange={handleInputChange}
                      placeholder="ENR123456"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
                        formErrors.enrollment_number
                          ? "border-red-400 bg-red-50/50"
                          : "border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white/70"
                      }`}
                    />
                    {formErrors.enrollment_number && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formErrors.enrollment_number}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      name="registration_number"
                      value={studentFormData.registration_number}
                      onChange={handleInputChange}
                      placeholder="REG123456"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
                        formErrors.registration_number
                          ? "border-red-400 bg-red-50/50"
                          : "border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white/70"
                      }`}
                    />
                    {formErrors.registration_number && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formErrors.registration_number}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={studentFormData.department}
                      onChange={handleInputChange}
                      placeholder="e.g., B.Tech"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
                        formErrors.department
                          ? "border-red-400 bg-red-50/50"
                          : "border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white/70"
                      }`}
                    />
                    {formErrors.department && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formErrors.department}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Branch *
                    </label>
                    <input
                      type="text"
                      name="branch"
                      value={studentFormData.branch}
                      onChange={handleInputChange}
                      placeholder="e.g., CSE, IT, E.Com"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
                        formErrors.branch
                          ? "border-red-400 bg-red-50/50"
                          : "border-gray-200 hover:border-purple-300 focus:border-purple-500 bg-white/70"
                      }`}
                    />
                    {formErrors.branch && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formErrors.branch}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Batch Year
                    </label>
                    <input
                      type="number"
                      name="batch_year"
                      value={studentFormData.batch_year}
                      onChange={handleInputChange}
                      min="2020"
                      max="2030"
                      placeholder="2024"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Semester
                    </label>
                    <select
                      name="current_semester"
                      value={studentFormData.current_semester}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
                    >
                      <option value="" key="default">
                        Select
                      </option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={`sem-${sem}`} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      name="cgpa"
                      value={studentFormData.cgpa}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      10th Percentage
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      name="class_10_percentage"
                      value={studentFormData.class_10_percentage}
                      onChange={handleInputChange}
                      placeholder="85.5"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      10th Board
                    </label>
                    <input
                      type="text"
                      name="board_10_name"
                      value={studentFormData.board_10_name}
                      onChange={handleInputChange}
                      placeholder="e.g., CBSE"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      10th Passing Year
                    </label>
                    <input
                      type="number"
                      name="board_10_passing_year"
                      value={studentFormData.board_10_passing_year}
                      onChange={handleInputChange}
                      min="2000"
                      max="2030"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      12th Percentage
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      name="class_12_percentage"
                      value={studentFormData.class_12_percentage}
                      onChange={handleInputChange}
                      placeholder="88.2"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      12th Board
                    </label>
                    <input
                      type="text"
                      name="board_12_name"
                      value={studentFormData.board_12_name}
                      onChange={handleInputChange}
                      placeholder="e.g., CBSE"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      12th Passing Year
                    </label>
                    <input
                      type="number"
                      name="board_12_passing_year"
                      value={studentFormData.board_12_passing_year}
                      onChange={handleInputChange}
                      min="2000"
                      max="2030"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Backlogs
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="backlogs"
                    value={studentFormData.backlogs}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Specialization Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specialization
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <select
                        name="specialization"
                        value={studentFormData.specialization}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-xl focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white/70"
                      >
                        <option value="">Select Specialization</option>
                        {specializations.map((spec) => (
                          <option key={spec.id} value={spec.id}>
                            {spec.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowAddSpecialization(true)}
                        className="px-4 py-3 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-xl transition-all duration-200"
                      >
                        + Add New
                      </button>
                    </div>

                    {/* Add New Specialization Form */}
                    {showAddSpecialization && (
                      <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSpecialization}
                            onChange={(e) =>
                              setNewSpecialization(e.target.value)
                            }
                            placeholder="Enter new specialization"
                            className="flex-1 px-4 py-2 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-lg focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white"
                          />
                          <button
                            type="button"
                            onClick={handleAddSpecialization}
                            className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-all duration-200"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddSpecialization(false);
                              setNewSpecialization("");
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-all duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6 p-6 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-orange-200/50">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                      />
                    </svg>
                  </div>
                  Professional Information
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resume URL
                  </label>
                  <input
                    type="url"
                    name="resume_url"
                    value={studentFormData.resume_url || ""}
                    onChange={handleInputChange}
                    placeholder="https://drive.google.com/file/..."
                    className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedin_url"
                      value={studentFormData.linkedin_url || ""}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="github_url"
                      value={studentFormData.github_url || ""}
                      onChange={handleInputChange}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name of the PS2 station
                    </label>
                    <input
                      type="text"
                      name="ps2_company_name"
                      value={studentFormData.ps2_company_name}
                      onChange={handleInputChange}
                      placeholder="Company name"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title of the Project/Thesis
                    </label>
                    <input
                      type="text"
                      name="ps2_project_title"
                      value={studentFormData.ps2_project_title}
                      onChange={handleInputChange}
                      placeholder="Project title"
                      className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Placement Status
                  </label>
                  <select
                    name="placement_status"
                    value={studentFormData.placement_status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white/70"
                  >
                    <option value="placed" key="placed">
                      Placed
                    </option>
                    <option value="unplaced" key="unplaced">
                      Unplaced
                    </option>
                    <option value="higher_studies" key="higher_studies">
                      Higher Studies
                    </option>
                    <option value="entrepreneurship" key="entrepreneurship">
                      Entrepreneurship
                    </option>
                    <option value="family_business" key="family_business">
                      Family Business
                    </option>
                    <option value="debarred" key="debarred">
                      Debarred
                    </option>
                    <option value="others" key="others">
                      Others
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="space-y-6 p-6 bg-gradient-to-br from-pink-50 to-red-50 border border-pink-200/50 rounded-xl mt-8">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 pb-3 border-b border-pink-200/50">
              <div className="p-2 bg-pink-500 rounded-lg">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              Parent Information
            </h3>

            {/* Father's Details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Father&apos;s Name
                </label>
                <input
                  type="text"
                  name="father_name"
                  value={studentFormData.father_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-200 bg-white/70"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Father&apos;s Mobile
                </label>
                <input
                  type="tel"
                  name="father_mobile"
                  value={studentFormData.father_mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-200 bg-white/70"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Father&apos;s Email
                </label>
                <input
                  type="email"
                  name="father_email"
                  value={studentFormData.father_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-200 bg-white/70"
                />
              </div>
            </div>

            {/* Mother's Details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mother&apos;s Name
                </label>
                <input
                  type="text"
                  name="mother_name"
                  value={studentFormData.mother_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-200 bg-white/70"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mother&apos;s Mobile
                </label>
                <input
                  type="tel"
                  name="mother_mobile"
                  value={studentFormData.mother_mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-200 bg-white/70"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  name="aadhar_number"
                  value={studentFormData.aadhar_number}
                  onChange={handleInputChange}
                  maxLength="12"
                  className="w-full px-4 py-3 border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-200 bg-white/70"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PAN Number
                </label>
                <input
                  type="text"
                  name="pan_number"
                  value={studentFormData.pan_number}
                  onChange={handleInputChange}
                  maxLength="10"
                  className="w-full px-4 py-3 border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-200 bg-white/70"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Domicile State
                </label>
                <input
                  type="text"
                  name="domicile_state"
                  value={studentFormData.domicile_state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 rounded-xl focus:ring-4 focus:ring-pink-500/20 transition-all duration-200 bg-white/70"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setShowEditStudentModal(false)}
              className="px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isLoading
                  ? "bg-blue-300 text-blue-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Updating..." : "Update Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
