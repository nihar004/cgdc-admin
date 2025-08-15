"use client";

import React, { useState } from 'react';
import { 
  Users, 
  UserCheck,
  UserX,
  Clock,
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  Award,
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export default function StudentManagement() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024-25');

  const academicYears = [
    '2024-25',
    '2023-24', 
    '2022-23',
    '2021-22'
  ];

  const students = [
    {
      id: 1,
      name: 'Rahul Sharma',
      rollNo: '21BCS001',
      branch: 'Computer Science',
      batch: '2021-2025',
      cgpa: 8.5,
      email: 'rahul.sharma@college.edu',
      phone: '+91-9876543210',
      status: 'placed',
      company: 'TCS',
      package: 7.5,
      offerDate: '2024-07-15',
      joiningDate: '2024-08-01',
      placementType: 'on-campus',
      rounds: ['Aptitude', 'Technical', 'HR'],
      currentRound: 'Completed',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      internships: 2,
      eligibilityStatus: 'Eligible',
      backlogs: 0,
      attendancePercentage: 92
    },
    {
      id: 2,
      name: 'Priya Singh',
      rollNo: '21BCS002',
      branch: 'Computer Science',
      batch: '2021-2025',
      cgpa: 9.2,
      email: 'priya.singh@college.edu',
      phone: '+91-9876543211',
      status: 'in-process',
      company: 'Infosys',
      package: null,
      offerDate: null,
      joiningDate: null,
      placementType: 'on-campus',
      rounds: ['Aptitude', 'Technical', 'HR'],
      currentRound: 'Technical',
      skills: ['Python', 'Django', 'PostgreSQL'],
      internships: 1,
      eligibilityStatus: 'Eligible',
      backlogs: 0,
      attendancePercentage: 95
    },
    {
      id: 3,
      name: 'Amit Kumar',
      rollNo: '21BCS003',
      branch: 'Computer Science',
      batch: '2021-2025',
      cgpa: 7.8,
      email: 'amit.kumar@college.edu',
      phone: '+91-9876543212',
      status: 'unplaced',
      company: null,
      package: null,
      offerDate: null,
      joiningDate: null,
      placementType: null,
      rounds: [],
      currentRound: null,
      skills: ['JavaScript', 'React', 'Node.js'],
      internships: 0,
      eligibilityStatus: 'Eligible',
      backlogs: 1,
      attendancePercentage: 78
    },
    {
      id: 4,
      name: 'Sneha Patel',
      rollNo: '21IT004',
      branch: 'Information Technology',
      batch: '2021-2025',
      cgpa: 8.9,
      email: 'sneha.patel@college.edu',
      phone: '+91-9876543213',
      status: 'placed',
      company: 'Wipro',
      package: 6.5,
      offerDate: '2024-07-20',
      joiningDate: '2024-08-15',
      placementType: 'on-campus',
      rounds: ['Aptitude', 'Technical', 'HR'],
      currentRound: 'Completed',
      skills: ['C++', 'Data Structures', 'Algorithms'],
      internships: 2,
      eligibilityStatus: 'Eligible',
      backlogs: 0,
      attendancePercentage: 88
    },
    {
      id: 5,
      name: 'Arjun Reddy',
      rollNo: '21ECE005',
      branch: 'Electronics',
      batch: '2021-2025',
      cgpa: 6.8,
      email: 'arjun.reddy@college.edu',
      phone: '+91-9876543214',
      status: 'ineligible',
      company: null,
      package: null,
      offerDate: null,
      joiningDate: null,
      placementType: null,
      rounds: [],
      currentRound: null,
      skills: ['VLSI', 'Embedded Systems'],
      internships: 0,
      eligibilityStatus: 'Ineligible - Low CGPA',
      backlogs: 3,
      attendancePercentage: 65
    },
    {
      id: 6,
      name: 'Kavya Nair',
      rollNo: '21BCS006',
      branch: 'Computer Science',
      batch: '2021-2025',
      cgpa: 9.5,
      email: 'kavya.nair@college.edu',
      phone: '+91-9876543215',
      status: 'multiple-offers',
      company: 'Microsoft',
      package: 25.0,
      offerDate: '2024-07-10',
      joiningDate: '2024-07-25',
      placementType: 'on-campus',
      rounds: ['Aptitude', 'Technical-1', 'Technical-2', 'Managerial', 'HR'],
      currentRound: 'Completed',
      skills: ['Machine Learning', 'Python', 'TensorFlow'],
      internships: 3,
      eligibilityStatus: 'Eligible',
      backlogs: 0,
      attendancePercentage: 98,
      additionalOffers: [
        { company: 'Google', package: 30.0 },
        { company: 'Amazon', package: 22.0 }
      ]
    }
  ];

  const placementRules = {
    eligibilityCriteria: {
      minimumCGPA: 7.0,
      maximumBacklogs: 2,
      minimumAttendance: 75
    },
    categories: {
      'Super Dream': { minPackage: 20 },
      'Dream': { minPackage: 10, maxPackage: 19.99 },
      'Day 1': { minPackage: 7, maxPackage: 9.99 },
      'Day 2': { minPackage: 4, maxPackage: 6.99 },
      'Pool Campus': { minPackage: 0, maxPackage: 3.99 }
    }
  };

  const getStatistics = () => {
    const totalStudents = students.length;
    const placedStudents = students.filter(s => s.status === 'placed' || s.status === 'multiple-offers').length;
    const inProcessStudents = students.filter(s => s.status === 'in-process').length;
    const unplacedStudents = students.filter(s => s.status === 'unplaced').length;
    const ineligibleStudents = students.filter(s => s.status === 'ineligible').length;
    const placementPercentage = ((placedStudents / totalStudents) * 100).toFixed(1);
    
    const avgPackage = students
      .filter(s => s.package)
      .reduce((acc, s) => acc + s.package, 0) / 
      students.filter(s => s.package).length;
    
    const highestPackage = Math.max(...students.filter(s => s.package).map(s => s.package));

    return {
      totalStudents,
      placedStudents,
      inProcessStudents,
      unplacedStudents,
      ineligibleStudents,
      placementPercentage,
      avgPackage: avgPackage.toFixed(1),
      highestPackage
    };
  };

  const stats = getStatistics();

  const getFilteredStudents = () => {
    let filtered = students;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(student => student.status === selectedCategory);
    }

    if (selectedBranch !== 'all') {
      filtered = filtered.filter(student => student.branch === selectedBranch);
    }

    if (selectedBatch !== 'all') {
      filtered = filtered.filter(student => student.batch === selectedBatch);
    }

    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.company && student.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'rollNo':
          aValue = a.rollNo;
          bValue = b.rollNo;
          break;
        case 'cgpa':
          aValue = a.cgpa;
          bValue = b.cgpa;
          break;
        case 'package':
          aValue = a.package || 0;
          bValue = b.package || 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'placed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'multiple-offers':
        return <Award className="h-4 w-4 text-purple-600" />;
      case 'in-process':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'unplaced':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'ineligible':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'placed': return 'bg-green-100 text-green-800';
      case 'multiple-offers': return 'bg-purple-100 text-purple-800';
      case 'in-process': return 'bg-blue-100 text-blue-800';
      case 'unplaced': return 'bg-red-100 text-red-800';
      case 'ineligible': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryFromPackage = (packageAmount) => {
    if (!packageAmount) return 'N/A';
    if (packageAmount >= 20) return 'Super Dream';
    if (packageAmount >= 10) return 'Dream';
    if (packageAmount >= 7) return 'Day 1';
    if (packageAmount >= 4) return 'Day 2';
    return 'Pool Campus';
  };

  const checkEligibility = (student) => {
    const { minimumCGPA, maximumBacklogs, minimumAttendance } = placementRules.eligibilityCriteria;
    
    if (student.cgpa < minimumCGPA) return { eligible: false, reason: 'Ineligible' };
    if (student.backlogs > maximumBacklogs) return { eligible: false, reason: 'Too many backlogs' };
    if (student.attendancePercentage < minimumAttendance) return { eligible: false, reason: 'Low attendance' };
    
    return { eligible: true, reason: 'Eligible' };
  };

  const filteredStudents = getFilteredStudents();
  const branches = [...new Set(students.map(s => s.branch))];
  const batches = [...new Set(students.map(s => s.batch))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm font-medium"
              >
                {academicYears.map(year => (
                  <option key={year} value={year}>
                    Batch {year}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-gray-600 mt-1">
              Manage and categorize students based on placement status and college rules
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Import Data</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interested</p>
                <p className="text-sm font-medium text-gray-600">(for Placement)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents-2}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Placed</p>
                <p className="text-2xl font-bold text-green-600">{stats.placedStudents}</p>
                <p className="text-xs text-green-600">{stats.placementPercentage}%</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Process</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProcessStudents}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unplaced</p>
                <p className="text-2xl font-bold text-red-600">{stats.unplacedStudents}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg CTC</p>
                <p className="text-xl font-bold text-purple-600">{stats.avgPackage} LPA</p>
                <p className="text-xs text-gray-500">Highest: {stats.highestPackage} LPA</p>
                <p className="text-xs text-gray-500">Medium: 12 LPA</p>
                <p className="text-xs text-gray-500">Lowest: 6 LPA</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All Students', count: stats.totalStudents },
                  { key: 'placed', label: 'Placed', count: stats.placedStudents },
                  { key: 'multiple-offers', label: 'Multiple Offers', count: students.filter(s => s.status === 'multiple-offers').length },
                  { key: 'in-process', label: 'In Process', count: stats.inProcessStudents },
                  { key: 'unplaced', label: 'Unplaced', count: stats.unplacedStudents },
                  { key: 'ineligible', label: 'Ineligible', count: stats.ineligibleStudents }
                ].map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.key
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, roll number, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select 
              value={selectedBranch} 
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            
            <select 
              value={selectedBatch} 
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Batches</option>
              {batches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="rollNo">Sort by Roll No</option>
              <option value="cgpa">Sort by CGPA</option>
              <option value="package">Sort by Package</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-1"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="text-sm">{sortOrder === 'asc' ? 'ASC' : 'DESC'}</span>
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placement Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eligibility</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const eligibility = checkEligibility(student);
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.rollNo}</div>
                          <div className="text-xs text-gray-400">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{student.branch}</div>
                          <div className="text-sm text-gray-500">CGPA: {student.cgpa}</div>
                          <div className="text-xs text-gray-400">
                            Backlogs: {student.backlogs} | Attendance: {student.attendancePercentage}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(student.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                            {student.status.replace('-', ' ')}
                          </span>
                        </div>
                        {student.currentRound && (
                          <div className="text-xs text-gray-500 mt-1">
                            Round: {student.currentRound}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.company ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.company}</div>
                            {student.package && (
                              <div className="text-sm text-green-600">{student.package} LPA</div>
                            )}
                            {student.package && (
                              <div className="text-xs text-purple-600">
                                {getCategoryFromPackage(student.package)}
                              </div>
                            )}
                            {student.additionalOffers && (
                              <div className="text-xs text-blue-600">
                                +{student.additionalOffers.length} more offers
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Not placed</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center space-x-1 ${
                          eligibility.eligible ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {eligibility.eligible ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          <span className="text-xs">{eligibility.reason}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="text-center text-sm text-gray-500">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>
    </div>
  );
}