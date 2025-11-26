import { useState } from "react";
import { X, Users, Star, TrendingUp } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function EmailTargetModal({ company, onClose, onSelect }) {
  const [loading, setLoading] = useState(false);

  const handleSelect = async (type) => {
    try {
      setLoading(true);
      let endpoint;

      switch (type) {
        case "eligible":
          endpoint = `/eligibility/companies/${company.id}/batch/${company.batch_year}/email-targets/eligible-only`;
          break;
        case "dream":
          endpoint = `/eligibility/companies/${company.id}/batch/${company.batch_year}/email-targets/dream-only`;
          break;
        case "upgrade":
          endpoint = `/eligibility/companies/${company.id}/batch/${company.batch_year}/email-targets/upgrade-only`;
          break;
        default:
          toast.error("Invalid target type");
          return;
      }

      const response = await axios.get(`${backendUrl}${endpoint}`);

      if (response.data.success) {
        // Check if there are students
        if (response.data.total_count === 0) {
          toast.error("No students found in selected group");
          return;
        }

        const emailData = {
          companyName: company.company_name,
          companyId: company.id,
          student_ids: response.data.student_ids,
          students: response.data.students,
          total_count: response.data.total_count,
          batch_year: response.data.batch_year,
          targetType: type,
        };
        onSelect(emailData);
      } else {
        toast.error("Failed to get eligible students");
      }
    } catch (error) {
      console.error("Error fetching email targets:", error);
      toast.error(error.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Email Recipients
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Eligible Students */}
          <button
            onClick={() => handleSelect("eligible")}
            disabled={loading}
            className="w-full p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">
                  Eligible Students
                </h4>
                <p className="text-sm text-gray-600">
                  Send to all eligible students for this company
                </p>
              </div>
            </div>
          </button>

          {/* Dream Company Option */}
          <button
            onClick={() => handleSelect("dream")}
            disabled={loading}
            className="w-full p-4 border border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">
                  Dream Company Option
                </h4>
                <p className="text-sm text-gray-600">
                  Placed students who haven't used dream company
                </p>
              </div>
            </div>
          </button>

          {/* Upgrade Opportunity */}
          <button
            onClick={() => handleSelect("upgrade")}
            disabled={loading}
            className="w-full p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">
                  Upgrade Opportunity
                </h4>
                <p className="text-sm text-gray-600">
                  Placed students (≤6 LPA) with upgrade opportunities left
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
