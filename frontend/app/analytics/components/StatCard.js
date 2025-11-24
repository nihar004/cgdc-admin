import React from "react";
import { TrendingUp } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  subtext2,
  subtext3,
  subtext4,
  color = "blue",
}) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 ${colorMap[color]} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-0.5">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
        {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
        {subtext2 && <div className="text-xs text-gray-500">{subtext2}</div>}
        {subtext3 && <div className="text-xs text-gray-500">{subtext3}</div>}
      </div>
    </div>
  );
}
