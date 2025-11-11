"use client";

import { useState } from "react";
import { X, Mail, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function EmailTargetModal({ selectedEvent, onClose }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const attendance = selectedEvent.attendance || [];

  const emailTargets = [
    {
      type: "registered",
      label: "Registered Students",
      description: `Send to all ${
        attendance.filter((s) => s.status !== "not_registered").length
      } registered students`,
      icon: FileText,
      color: "blue",
      students: attendance.filter((s) => s.status !== "not_registered"),
    },
    {
      type: "present",
      label: "Present Students",
      description: `Send to all ${
        attendance.filter((s) => s.status === "present").length
      } students who were present`,
      icon: CheckCircle,
      color: "green",
      students: attendance.filter((s) => s.status === "present"),
    },
    {
      type: "absent",
      label: "Absent Students",
      description: `Send to all ${
        attendance.filter((s) => s.status === "absent").length
      } absent students`,
      icon: XCircle,
      color: "red",
      students: attendance.filter((s) => s.status === "absent"),
    },
    {
      type: "late",
      label: "Late Students",
      description: `Send to all ${
        attendance.filter((s) => s.status === "late").length
      } students who were late`,
      icon: Clock,
      color: "yellow",
      students: attendance.filter((s) => s.status === "late"),
    },
  ];

  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    green: "bg-green-50 border-green-200 hover:bg-green-100",
    red: "bg-red-50 border-red-200 hover:bg-red-100",
    yellow: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
  };

  const iconColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
  };

  const handleSelect = async (target) => {
    try {
      setLoading(true);

      if (target.students.length === 0) {
        toast.error(`No ${target.label.toLowerCase()} found`);
        setLoading(false);
        return;
      }

      // Extract student_ids from the students array (using studentId field)
      const student_ids = target.students.map((s) => s.studentId);

      // Prepare email data to match the company listing format
      const emailData = {
        companyName: selectedEvent.company,
        companyId: selectedEvent.company_id,
        // Include both student_ids and students arrays
        student_ids: student_ids,
        students: target.students,
        total_count: target.students.length,
        batch_year: selectedEvent.targetAcademicYears?.[0] || null,
        targetType: target.type,
      };

      sessionStorage.setItem("emailData", JSON.stringify(emailData));
      router.push("/email-management?from=company");
      onClose();
    } catch (error) {
      console.error("Error preparing email:", error);
      toast.error("Failed to prepare email");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedEvent) return null;

  return (
    <div className="fixed h-full inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Select Email Recipients
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedEvent.company} • {selectedEvent.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Select which group of students you want to send an email to:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {emailTargets.map((target) => {
              const IconComponent = target.icon;
              return (
                <button
                  key={target.type}
                  onClick={() => handleSelect(target)}
                  disabled={loading || target.students.length === 0}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    colorClasses[target.color]
                  } ${
                    target.students.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent
                      className={`w-5 h-5 mt-1 ${iconColorClasses[target.color]}`}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {target.label}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {target.description}
                      </div>
                      <div
                        className={`text-sm font-bold mt-2 ${iconColorClasses[target.color]}`}
                      >
                        {target.students.length} student
                        {target.students.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
