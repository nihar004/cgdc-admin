"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useBatchContext } from "./BatchContext";
import { useAuth } from "./AuthContext";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const { selectedBatch } = useBatchContext();
  const { user, loading } = useAuth();

  const [studentFormData, setStudentFormData] = useState({
    enrollment_number: "",
    full_name: "",
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
    placement_status: "unplaced",
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
    specialization_name: "",
  });

  // new TODO
  const [showImportModal, setShowImportModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showImportResultsModal, setShowImportResultsModal] = useState(false);
  const [showUpdateResultsModal, setShowUpdateResultsModal] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [updateResults, setUpdateResults] = useState(null);

  const formatStudentName = (student) => {
    return student.full_name || "N/A";
  };

  const fetchStudents = async () => {
    try {
      if (!selectedBatch) {
        console.warn("No batch selected!");
        return;
      }
      const response = await axios.get(`${backendUrl}/students`, {
        params: { batch: selectedBatch },
      });
      setStudents(response.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedBatch, user, loading]);

  return (
    <StudentContext.Provider
      value={{
        students,
        setStudents,
        selectedStudent,
        setSelectedStudent,
        showEditStudentModal,
        setShowEditStudentModal,
        showExportModal,
        setShowExportModal,
        studentFormData,
        setStudentFormData,
        setEditingStudent,
        editingStudent,
        formatStudentName,
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
        setUpdateResults,

        fetchStudents,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentContext must be used within a StudentProvider");
  }
  return context;
};
