import React from "react";

export default function FilterSection({
  selectedDepartment,
  setSelectedDepartment,
  timeRange,
  setTimeRange,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="cse">Computer Science</option>
            <option value="ece">Electronics</option>
            <option value="me">Mechanical</option>
          </select>
        </div>
        <div className="sm:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last 1 Year</option>
            <option value="2years">Last 2 Years</option>
          </select>
        </div>
      </div>
    </div>
  );
}
