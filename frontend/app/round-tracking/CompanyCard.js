import { useState } from "react";
import { ChevronDown, ChevronRight, Calendar } from "lucide-react";
import RoundsTable from "./RoundsTable";

const CompanyCard = ({ company, onToggle, isExpanded }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div
        className="px-6 py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => onToggle(company.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isExpanded ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {company.company_name}
              </h3>
              <p className="text-sm text-gray-600">
                {company.positions?.length || 0} active positions
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(company.status)}`}
            >
              {company.status?.charAt(0).toUpperCase() +
                company.status?.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-lg font-semibold text-gray-900">
                {company.total_applications || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200">
          {company.positions?.map((position) => (
            <PositionSection
              key={position.id}
              position={position}
              companyName={company.company_name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PositionSection = ({ position, companyName }) => {
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="px-6 py-4 bg-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              {position.position_title}
            </h4>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm text-gray-600">
                Package: ₹{position.package_range}L
              </span>
              <span className="text-sm text-gray-600">
                Type: {position.job_type}
              </span>
              {position.internship_stipend_monthly > 0 && (
                <span className="text-sm text-gray-600">
                  Stipend: ₹{position.internship_stipend_monthly}/month
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Selected</p>
            <p className="text-lg font-semibold text-green-600">
              {position.selected_students || 0}
            </p>
          </div>
        </div>
      </div>

      {position.events && position.events.length > 0 ? (
        <RoundsTable
          events={position.events}
          positionId={position.id}
          companyName={companyName}
          positionTitle={position.position_title}
        />
      ) : (
        <div className="px-6 py-8 text-center text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No rounds scheduled for this position yet</p>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
