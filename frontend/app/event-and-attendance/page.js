'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Users, Calendar, Clock, MapPin, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const EventAttendancePage = () => {
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Sample data for events
  const events = [
    {
      id: 1,
      title: 'TCS Technical Interview Round 1',
      type: 'company_round',
      company: 'TCS',
      date: '2024-12-15',
      time: '09:00 AM',
      venue: 'Computer Lab A',
      totalStudents: 80,
      attendedStudents: 72,
      absentStudents: 8,
      status: 'completed',
      description: 'First round of technical interviews for TCS placement drive',
      attendanceRate: 90.0,
      students: [
        { id: 1, name: 'Rahul Sharma', rollNo: 'CS001', status: 'present', checkInTime: '08:55 AM' },
        { id: 2, name: 'Priya Singh', rollNo: 'CS002', status: 'present', checkInTime: '09:02 AM' },
        { id: 3, name: 'Amit Kumar', rollNo: 'CS003', status: 'absent', checkInTime: null },
        { id: 4, name: 'Sneha Patel', rollNo: 'CS004', status: 'present', checkInTime: '08:58 AM' },
        { id: 5, name: 'Vikash Yadav', rollNo: 'CS005', status: 'late', checkInTime: '09:15 AM' }
      ]
    },
    {
      id: 2,
      title: 'Resume Building Workshop',
      type: 'cdgc_event',
      company: null,
      date: '2024-12-18',
      time: '02:00 PM',
      venue: 'Auditorium',
      totalStudents: 150,
      attendedStudents: 145,
      absentStudents: 5,
      status: 'completed',
      description: 'Workshop on effective resume writing and LinkedIn profile optimization',
      attendanceRate: 96.7,
      students: []
    },
    {
      id: 3,
      title: 'Infosys HR Interview Round',
      type: 'company_round',
      company: 'Infosys',
      date: '2024-12-20',
      time: '10:00 AM',
      venue: 'Conference Room B',
      totalStudents: 35,
      attendedStudents: 0,
      absentStudents: 0,
      status: 'upcoming',
      description: 'Final HR interview round for Infosys placement',
      attendanceRate: 0,
      students: []
    },
    {
      id: 4,
      title: 'Mock Interview Session',
      type: 'cdgc_event',
      company: null,
      date: '2024-12-22',
      time: '11:00 AM',
      venue: 'Seminar Hall',
      totalStudents: 60,
      attendedStudents: 55,
      absentStudents: 5,
      status: 'ongoing',
      description: 'Practice interview sessions with industry experts',
      attendanceRate: 91.7,
      students: []
    },
    {
      id: 5,
      title: 'Wipro Group Discussion',
      type: 'company_round',
      company: 'Wipro',
      date: '2024-12-25',
      time: '09:30 AM',
      venue: 'Discussion Room 1',
      totalStudents: 30,
      attendedStudents: 28,
      absentStudents: 2,
      status: 'completed',
      description: 'Group discussion round for Wipro recruitment process',
      attendanceRate: 93.3,
      students: []
    }
  ];

  const filteredEvents = events.filter(event => 
    (selectedEventType === 'all' || event.type === selectedEventType) &&
    (selectedStatus === 'all' || event.status === selectedStatus) &&
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEventTypeIcon = (type) => {
    return type === 'company_round' ? '🏢' : '🎓';
  };

  const getAttendanceStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'late': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const totalAttendance = events.reduce((sum, event) => sum + event.attendedStudents, 0);
  const averageAttendance = events.length > 0 ? 
    (events.reduce((sum, event) => sum + event.attendanceRate, 0) / events.length).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event & Attendance Management</h1>
              <p className="mt-2 text-gray-600">Track attendance for company rounds and CDGC events (QR Code Based)</p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Events</p>
                <p className="text-2xl font-bold text-gray-900">{completedEvents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Attendance</p>
                <p className="text-2xl font-bold text-gray-900">{totalAttendance}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">%</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{averageAttendance}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
              >
                <option value="all">All Event Types</option>
                <option value="company_round">Company Rounds</option>
                <option value="cdgc_event">CDGC Events</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Event Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{event.venue}</span>
                  </div>
                  {event.company && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-600">{event.company}</span>
                    </div>
                  )}
                </div>

                {/* Attendance Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{event.totalStudents}</p>
                      <p className="text-sm text-gray-600">Total Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{event.attendedStudents}</p>
                      <p className="text-sm text-gray-600">Present</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{event.absentStudents}</p>
                      <p className="text-sm text-gray-600">Absent</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getAttendanceColor(event.attendanceRate)}`}>
                        {event.attendanceRate}%
                      </p>
                      <p className="text-sm text-gray-600">Attendance Rate</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Attendance Progress</span>
                    <span>{event.attendanceRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        event.attendanceRate >= 90 ? 'bg-green-500' :
                        event.attendanceRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${event.attendanceRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button 
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </button>
                    {event.status !== 'completed' && (
                      <button className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700">
                        <Users className="h-3 w-3 mr-1" />
                        Mark Attendance
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Student Details Modal (when an event is selected) */}
        {selectedEvent && selectedEvent.students.length > 0 && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Student Attendance - {selectedEvent.title}
                </h3>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedEvent(null)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedEvent.students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.rollNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getAttendanceStatusIcon(student.status)}
                            <span className={`text-sm font-medium ${
                              student.status === 'present' ? 'text-green-800' :
                              student.status === 'absent' ? 'text-red-800' :
                              'text-yellow-800'
                            }`}>
                              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.checkInTime || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventAttendancePage;