import { ChevronDown, ChevronRight, Calendar } from "lucide-react";
import RoundsTable from "./RoundsTable";

const formatPackage = (amount) => {
  if (amount == null || isNaN(amount)) {
    return "Not Disclosed";
  }

  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(1)} Cr`;
  } else if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(1)} LPA`;
  }
  return `₹ ${amount.toLocaleString()}`;
};

const CompanyCard = ({ company, onToggle, isExpanded, onUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "upcoming":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div
        className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white cursor-pointer hover:from-slate-100 hover:to-slate-50 transition-colors"
        onClick={() => onToggle(company.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isExpanded ? (
              <ChevronDown size={18} className="text-slate-600" />
            ) : (
              <ChevronRight size={18} className="text-slate-600" />
            )}
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {company.company_name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {company.positions?.length || 0} positions
              </p>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusColor(company.status)}`}
            >
              {company.status?.charAt(0).toUpperCase() +
                company.status?.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-slate-500">Applications</p>
              <p className="text-base font-semibold text-slate-900">
                {company.total_applications || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-200">
          {company.positions?.map((position) => (
            <PositionSection
              key={position.id}
              position={position}
              companyName={company.company_name}
              companyId={company.id}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PositionSection = ({ position, companyName, companyId, onUpdate }) => {
  const renderPackageInfo = () => {
    switch (position.job_type) {
      case "internship":
        return position.internship_stipend_monthly > 0 ? (
          <span className="text-xs text-slate-600">
            {formatPackage(position.internship_stipend_monthly)}/month
          </span>
        ) : (
          <span className="text-xs text-slate-600">Stipend not disclosed</span>
        );

      case "full_time":
        return (
          <span className="text-xs text-slate-600">
            {formatPackage(position.package_range)}
          </span>
        );

      case "internship_plus_ppo":
        return (
          <>
            <span className="text-xs text-slate-600">
              {position.internship_stipend_monthly > 0
                ? `${formatPackage(position.internship_stipend_monthly)}/month stipend`
                : "Stipend not disclosed"}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600">
              PPO: {formatPackage(position.package_range)}
            </span>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <div className="px-5 py-3 bg-blue-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              {position.position_title}
            </h4>
            <div className="flex items-center space-x-3 mt-1">
              {renderPackageInfo()}
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600">
                {position.job_type?.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Selected</p>
            <p className="text-base font-semibold text-emerald-600">
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
          companyId={companyId}
          positionTitle={position.position_title}
          onUpdate={onUpdate}
        />
      ) : (
        <div className="px-5 py-6 text-center text-slate-500">
          <Calendar size={32} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm">No rounds scheduled yet</p>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
