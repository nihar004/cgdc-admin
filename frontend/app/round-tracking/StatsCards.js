import { useState, useEffect } from "react";
import { Users, CheckCircle, Building2 } from "lucide-react";
import axios from "axios";
import { useBatchContext } from "../../context/BatchContext";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeCompanies: 0,
    totalPlacements: 0,
  });
  const [loading, setLoading] = useState(true);
  const { selectedBatch } = useBatchContext();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/round-tracking/stats/${selectedBatch}`
      );
      setStats({
        totalApplications: data.totalApplications || 0,
        activeCompanies: data.activeCompanies || 0,
        totalPlacements: data.totalPlacements || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-900",
    },
    {
      title: "Active Companies",
      value: stats.activeCompanies,
      icon: Building2,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      textColor: "text-purple-900",
    },
    {
      title: "Total Placements",
      value: stats.totalPlacements,
      icon: CheckCircle,
      color: "emerald",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-900",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-lg p-4 h-24 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-lg p-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`${stat.bgColor} rounded-full p-3`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
