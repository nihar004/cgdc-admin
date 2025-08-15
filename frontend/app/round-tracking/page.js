'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Users, TrendingDown, TrendingUp, Calendar } from 'lucide-react';

const RoundTrackingPage = () => {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedRound, setSelectedRound] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for companies and their rounds
  const companies = [
    {
      id: 1,
      name: 'TCS',
      totalApplied: 150,
      currentRound: 3,
      totalRounds: 4,
      status: 'ongoing',
      rounds: [
        { round: 1, name: 'Online Assessment', applied: 150, appearedForAssessment: 150, qualified: 80 },
        { round: 2, name: 'Technical Interview', applied: 80, appearedForAssessment: 75, qualified: 45},
        { round: 3, name: 'HR Interview', applied: 45, appearedForAssessment: 45, qualified: 25},
        { round: 4, name: 'Final Selection', applied: 25, appearedForAssessment: 24, qualified: 20}
      ]
    },
    { 
      id: 2,
      name: 'Infosys',
      totalApplied: 120,
      currentRound: 2,
      totalRounds: 3,
      status: 'ongoing',
      rounds: [
        { round: 1, name: 'Aptitude Test', applied: 120, appearedForAssessment: 110, qualified: 65},
        { round: 2, name: 'Technical Round', applied: 65, appearedForAssessment: 60, qualified: 35},
        { round: 3, name: 'HR Round', applied: 35, appearedForAssessment: 35, qualified: 0}
      ]
    },
    {
      id: 3,
      name: 'Wipro',
      totalApplied: 90,
      currentRound: 4,
      totalRounds: 4,
      status: 'completed',
      rounds: [
        { round: 1, name: 'Online Test', applied: 90, appearedForAssessment: 90, qualified: 50},
        { round: 2, name: 'Group Discussion', applied: 50, appearedForAssessment: 50, qualified: 30},
        { round: 3, name: 'Technical Interview', applied: 30, appearedForAssessment: 30, qualified: 18},
        { round: 4, name: 'Final Interview', applied: 18, appearedForAssessment: 18, qualified: 15}
      ]
    }
  ];

  const filteredCompanies = companies.filter(company => 
    (selectedCompany === 'all' || company.name === selectedCompany) &&
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoundProgress = (currentRound, totalRounds) => {
    return (currentRound / totalRounds) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Round Tracking</h1>
              <p className="mt-2 text-gray-600">Monitor student progress through interview rounds</p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="all">All Companies</option>
                {companies.map(company => (
                  <option key={company.id} value={company.name}>{company.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedRound}
                onChange={(e) => setSelectedRound(e.target.value)}
              >
                <option value="all">All Rounds</option>
                <option value="1">Round 1</option>
                <option value="2">Round 2</option>
                <option value="3">Round 3</option>
                <option value="4">Round 4</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">360</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Currently Qualified</p>
                <p className="text-2xl font-bold text-gray-900">85</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Companies</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Round Details */}
        <div className="space-y-6">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Company Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
                      {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      Progress: {company.currentRound}/{company.totalRounds} rounds
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getRoundProgress(company.currentRound, company.totalRounds)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rounds Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Round
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied for Assessment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actually Appeared
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qualified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {company.rounds.map((round) => (
                      <tr key={round.round} className={round.round <= company.currentRound ? '' : 'opacity-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              round.round < company.currentRound ? 'bg-green-100 text-green-800' :
                              round.round === company.currentRound ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {round.round}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{round.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {round.applied}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {round.appearedForAssessment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          {round.qualified}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Company Summary */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Applied:</span>
                    <span className="ml-2 font-medium text-gray-900">{company.totalApplied}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Currently Qualified:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {company.rounds[company.currentRound - 1]?.qualified || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Overall Success Rate:</span>
                    <span className="ml-2 font-medium text-blue-600">
                      {((company.rounds[company.currentRound - 1]?.qualified || 0) / company.totalApplied * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoundTrackingPage;