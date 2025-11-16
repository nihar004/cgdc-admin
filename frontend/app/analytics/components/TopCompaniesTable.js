import React from "react";
import { Users, TrendingUp } from "lucide-react";

// Helper function to calculate average and highest package from positions
const calculatePackages = (positions) => {
  if (!positions || positions.length === 0) {
    return { avgPackage: "N/A", highestPackage: "N/A" };
  }

  // Use the lower end of the package (the 'package' field, not 'packageEnd')
  const packages = positions.map((pos) => pos.package || 0);

  if (packages.length === 0) {
    return { avgPackage: "N/A", highestPackage: "N/A" };
  }

  const avgPackage = (
    packages.reduce((sum, pkg) => sum + pkg, 0) / packages.length
  ).toFixed(2);

  const highestPackage = Math.max(...packages).toFixed(2);

  return {
    avgPackage: parseFloat(avgPackage),
    highestPackage: parseFloat(highestPackage),
  };
};

export default function TopCompaniesTable({ companies }) {
  if (!companies || companies.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            Top Recruiting Companies
          </h3>
        </div>
        <div className="p-6 text-center text-gray-500">
          No companies data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900">
          Top Recruiting Companies
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Sector
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Eligible
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Registered
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Selected
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Avg Package
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Highest Package
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company, index) => {
              const { avgPackage, highestPackage } = calculatePackages(
                company.positions
              );

              return (
                <tr
                  key={company.id || company.name}
                  className={`${
                    index < 3 ? "bg-blue-50" : ""
                  } hover:bg-gray-50 transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-sm font-bold text-white">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {company.company}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      <TrendingUp className="w-3 h-3" />
                      {company.sector || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-blue-600">
                      {company.totalEligible || 0}
                    </div>
                    <div className="text-xs text-gray-500">eligible</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-purple-600">
                      {company.totalRegistered || 0}
                    </div>
                    <div className="text-xs text-gray-500">registered</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-emerald-600">
                      {company.totalSelected || company.totalPlaced || 0}
                    </div>
                    <div className="text-xs text-gray-500">selected</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                    ₹{avgPackage} LPA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600">
                    ₹{highestPackage} LPA
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
