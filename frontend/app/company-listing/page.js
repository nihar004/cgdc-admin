"use client";

import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, MapPin, Users, DollarSign, Clock, Building2, ChevronDown, X } from 'lucide-react';

const CompanyListing = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Sample data for companies
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'Google India',
      logo: 'https://via.placeholder.com/40x40/4285f4/ffffff?text=G',
      status: 'active',
      type: 'current',
      visitDate: '2024-08-15',
      arrivalDate: '2024-08-20',
      package: '25-30 LPA',
      positions: 15,
      location: 'Bangalore, Hyderabad',
      requirements: 'CSE, IT, ECE',
      cgpa: '7.5+',
      rounds: 4,
      applied: 120,
      description: 'Software Development Engineer roles',
      glassdoorRating: 4.5,
      profilesOffered: ['SDE', 'Product Manager', 'Data Scientist']
    },
    {
      id: 2,
      name: 'Microsoft',
      logo: 'https://via.placeholder.com/40x40/00a1f1/ffffff?text=M',
      status: 'upcoming',
      type: 'current',
      visitDate: '2024-08-22',
      arrivalDate: '2024-08-22',
      package: '22-28 LPA',
      positions: 12,
      location: 'Noida, Pune',
      requirements: 'CSE, IT',
      cgpa: '8.0+',
      rounds: 3,
      applied: 0,
      description: 'Full Stack Developer positions',
      glassdoorRating: 4.2,
      profilesOffered: ['SDE', 'Intern']
    },
    {
      id: 3,
      name: 'Amazon',
      logo: 'https://via.placeholder.com/40x40/ff9900/ffffff?text=A',
      status: 'completed',
      type: 'current',
      visitDate: '2024-07-30',
      arrivalDate: '2024-08-2',
      package: '20-25 LPA',
      positions: 20,
      location: 'Chennai, Bangalore',
      requirements: 'All Branches',
      cgpa: '7.0+',
      rounds: 4,
      applied: 180,
      description: 'SDE-1 and Support Engineer roles',
      glassdoorRating: 4.0,
      profilesOffered: ['SDE', 'Support Engineer']
    },
    {
      id: 4,
      name: 'Infosys',
      logo: 'https://via.placeholder.com/40x40/0066cc/ffffff?text=I',
      status: 'pipeline',
      type: 'upcoming',
      visitDate: '2024-09-10',
      arrivalDate: '2024-09-21',
      package: '12-18 LPA',
      positions: 50,
      location: 'Multiple Locations',
      requirements: 'All Branches',
      cgpa: '6.5+',
      rounds: 3,
      applied: 0,
      description: 'Systems Engineer and Specialist Programmer',
      glassdoorRating: 3.8,
      profilesOffered: ['Systems Engineer', 'Specialist Programmer']
    }
  ]);

  const [newCompany, setNewCompany] = useState({
    name: '',
    visitDate: '',
    package: '',
    positions: '',
    location: '',
    requirements: '',
    cgpa: '',
    rounds: '',
    description: '',
    status: 'upcoming'
  });

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    pipeline: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const filteredCompanies = companies.filter(company => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'current' && company.type === 'current') ||
      (activeTab === 'upcoming' && company.type === 'upcoming');
    
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || company.status === filterStatus;
    
    return matchesTab && matchesSearch && matchesFilter;
  });

  const handleAddCompany = () => {
    if (newCompany.name && newCompany.visitDate) {
      const company = {
        ...newCompany,
        id: companies.length + 1,
        logo: `https://via.placeholder.com/40x40/6366f1/ffffff?text=${newCompany.name.charAt(0)}`,
        type: newCompany.status === 'pipeline' ? 'upcoming' : 'current',
        applied: 0,
        positions: parseInt(newCompany.positions) || 0,
        rounds: parseInt(newCompany.rounds) || 1
      };
      setCompanies([...companies, company]);
      setNewCompany({
        name: '', visitDate: '', package: '', positions: '', location: '',
        requirements: '', cgpa: '', rounds: '', description: '', status: 'upcoming'
      });
      setShowAddModal(false);
    }
  };

  const getStats = () => {
    const total = companies.length;
    const active = companies.filter(c => c.status === 'active').length;
    const upcoming = companies.filter(c => c.status === 'upcoming' || c.status === 'pipeline').length;
    const completed = companies.filter(c => c.status === 'completed').length;
    
    return { total, active, upcoming, completed };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
              <p className="text-gray-600 mt-1">Manage current and upcoming recruitment drives</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Company
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="text-blue-600" size={24} />
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Companies</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="text-green-600" size={24} />
                <div>
                  <p className="text-green-600 text-sm font-medium">Active</p>
                  <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="text-yellow-600" size={24} />
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Upcoming</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.upcoming}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-600" size={24} />
                <div>
                  <p className="text-gray-600 text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['current', 'upcoming', 'all'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Companies
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter size={20} />
                Filters
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="pipeline">Pipeline</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Companies List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profiles</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Glassdoor Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Visit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Arrival</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Vacancies</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-lg" src={company.logo} alt={company.name} />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-500">{company.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[company.status]}`}>
                        {company.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {company.profilesOffered?.map((profile, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                            {profile}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-medium ${
                          company.glassdoorRating >= 4 ? 'text-green-600' : 
                          company.glassdoorRating >= 3 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {company.glassdoorRating}
                        </span>
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-gray-400" />
                        {new Date(company.visitDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-gray-400" />
                        {company.arrivalDate ? new Date(company.arrivalDate).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        ₹ {company.package}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Users size={16} className="text-gray-400" />
                        {company.positions}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">{company.applied}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No companies found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Add Company Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Company</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Google India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visit Date *</label>
                  <input
                    type="date"
                    value={newCompany.visitDate}
                    onChange={(e) => setNewCompany({...newCompany, visitDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Range</label>
                  <input
                    type="text"
                    value={newCompany.package}
                    onChange={(e) => setNewCompany({...newCompany, package: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 12-18 LPA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Positions</label>
                  <input
                    type="number"
                    value={newCompany.positions}
                    onChange={(e) => setNewCompany({...newCompany, positions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={newCompany.location}
                    onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Bangalore, Chennai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch Requirements</label>
                  <input
                    type="text"
                    value={newCompany.requirements}
                    onChange={(e) => setNewCompany({...newCompany, requirements: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., CSE, IT, ECE"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum CGPA</label>
                  <input
                    type="text"
                    value={newCompany.cgpa}
                    onChange={(e) => setNewCompany({...newCompany, cgpa: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 7.5+"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rounds</label>
                  <input
                    type="number"
                    value={newCompany.rounds}
                    onChange={(e) => setNewCompany({...newCompany, rounds: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newCompany.status}
                    onChange={(e) => setNewCompany({...newCompany, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="pipeline">Pipeline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Glassdoor Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={newCompany.glassdoorRating}
                    onChange={(e) => setNewCompany({...newCompany, glassdoorRating: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 4.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profiles Offered</label>
                  <input
                    type="text"
                    value={newCompany.profilesOffered}
                    onChange={(e) => setNewCompany({...newCompany, profilesOffered: e.target.value.split(',')})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., SDE, Data Scientist, Product Manager"
                  />
                  <p className="mt-1 text-xs text-gray-500">Separate multiple profiles with commas</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                  <textarea
                    value={newCompany.description}
                    onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Brief description of the role and company"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCompany}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Company
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyListing;