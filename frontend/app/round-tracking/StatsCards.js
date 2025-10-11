"use client";
import { useState, useEffect } from "react";
import { TrendingUp, Calendar, CheckCircle, Users } from "lucide-react";
import axios from "axios";

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    currentlyQualified: 0,
    activeCompanies: 0,
    totalPlacements: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/round_tracking/stats"
        );
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-50 animate-pulse p-4 rounded-xl border border-slate-100"
          >
            <div className="h-6 bg-slate-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-slate-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mt-6">
        <p className="text-sm">Failed to load statistics: {error}</p>
      </div>
    );
  }

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
              {stats.totalApplications}
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
              {stats.currentlyQualified}
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
              {stats.activeCompanies}
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
              {stats.totalPlacements}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
