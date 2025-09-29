import { TrendingUp, Calendar, CheckCircle, Users } from "lucide-react";

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3">
          <Users className="text-blue-600" size={24} />
          <div>
            <p className="text-blue-600 text-sm font-medium">
              Total Applications
            </p>
            <p className="text-2xl font-bold text-blue-900">
              {stats.totalApplications || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-green-600" size={24} />
          <div>
            <p className="text-green-600 text-sm font-medium">
              Currently Qualified
            </p>
            <p className="text-2xl font-bold text-green-900">
              {stats.currentlyQualified || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
        <div className="flex items-center gap-3">
          <Calendar className="text-purple-600" size={24} />
          <div>
            <p className="text-purple-600 text-sm font-medium">
              Active Companies
            </p>
            <p className="text-2xl font-bold text-purple-900">
              {stats.activeCompanies || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-orange-600" size={24} />
          <div>
            <p className="text-orange-600 text-sm font-medium">
              Total Placements
            </p>
            <p className="text-2xl font-bold text-orange-900">
              {stats.totalPlacements || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
