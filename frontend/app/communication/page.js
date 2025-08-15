'use client';

import React, { useState } from 'react';
import { Plus, Send, Mail, FileText, Users, Eye, Edit, Trash2, Download, Link, Calendar, Filter, Search, X, ExternalLink, CheckCircle, Clock, AlertCircle, Copy } from 'lucide-react';

const CommunicationSystem = () => {
  const [activeTab, setActiveTab] = useState('mail');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data for emails
  const [emails, setEmails] = useState([
    {
      id: 1,
      subject: 'Microsoft Recruitment Drive - Apply Now',
      recipients: 'CSE, IT Students (CGPA 8.0+)',
      sentTo: 156,
      opened: 142,
      clicked: 89,
      status: 'sent',
      sentDate: '2024-08-03',
      type: 'company_notification',
      company: 'Microsoft'
    },
    {
      id: 2,
      subject: 'Placement Preparation Workshop',
      recipients: 'All Final Year Students',
      sentTo: 320,
      opened: 298,
      clicked: 201,
      status: 'sent',
      sentDate: '2024-08-01',
      type: 'event_notification',
      company: null
    },
    {
      id: 3,
      subject: 'Google Interview Schedule',
      recipients: 'Selected Students (Round 1)',
      sentTo: 45,
      opened: 45,
      clicked: 43,
      status: 'sent',
      sentDate: '2024-08-02',
      type: 'interview_schedule',
      company: 'Google'
    }
  ]);

  // Sample data for forms
  const [forms, setForms] = useState([
    {
      id: 1,
      title: 'Amazon Recruitment Registration',
      description: 'Registration form for Amazon campus placement drive',
      formUrl: 'https://forms.google.com/amazon-recruitment',
      responses: 187,
      status: 'active',
      createdDate: '2024-07-28',
      deadline: '2024-08-10',
      company: 'Amazon',
      branches: ['CSE', 'IT', 'ECE'],
      cgpa: '7.0+',
      type: 'registration'
    },
    {
      id: 2,
      title: 'Placement Feedback Survey',
      description: 'Student feedback on placement process and improvements',
      formUrl: 'https://forms.google.com/placement-feedback',
      responses: 89,
      status: 'active',
      createdDate: '2024-08-01',
      deadline: '2024-08-15',
      company: null,
      branches: ['All'],
      cgpa: 'Any',
      type: 'feedback'
    },
    {
      id: 3,
      title: 'TCS Pre-placement Talk Registration',
      description: 'Register for TCS pre-placement presentation',
      formUrl: 'https://forms.google.com/tcs-ppt',
      responses: 245,
      status: 'closed',
      createdDate: '2024-07-20',
      deadline: '2024-07-30',
      company: 'TCS',
      branches: ['All'],
      cgpa: '6.5+',
      type: 'event'
    }
  ]);

  const [newEmail, setNewEmail] = useState({
    subject: '',
    recipients: 'all',
    customRecipients: '',
    content: '',
    type: 'general',
    company: '',
    sendDate: 'now'
  });

  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    type: 'registration',
    company: '',
    branches: [],
    cgpa: '',
    deadline: '',
    formType: 'google_forms'
  });

  const statusColors = {
    sent: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    closed: 'bg-red-100 text-red-800',
    draft_form: 'bg-gray-100 text-gray-800'
  };

  const typeColors = {
    company_notification: 'bg-blue-50 text-blue-700',
    event_notification: 'bg-purple-50 text-purple-700',
    interview_schedule: 'bg-orange-50 text-orange-700',
    general: 'bg-gray-50 text-gray-700',
    registration: 'bg-green-50 text-green-700',
    feedback: 'bg-yellow-50 text-yellow-700',
    event: 'bg-indigo-50 text-indigo-700'
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || email.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || form.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getEmailStats = () => {
    const totalSent = emails.reduce((sum, email) => sum + email.sentTo, 0);
    const totalOpened = emails.reduce((sum, email) => sum + email.opened, 0);
    const totalClicked = emails.reduce((sum, email) => sum + email.clicked, 0);
    const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0;
    
    return { totalSent, totalOpened, totalClicked, openRate };
  };

  const getFormStats = () => {
    const totalForms = forms.length;
    const activeForms = forms.filter(f => f.status === 'active').length;
    const totalResponses = forms.reduce((sum, form) => sum + form.responses, 0);
    const avgResponses = totalForms > 0 ? Math.round(totalResponses / totalForms) : 0;
    
    return { totalForms, activeForms, totalResponses, avgResponses };
  };

  const emailStats = getEmailStats();
  const formStats = getFormStats();

  const handleSendEmail = () => {
    if (newEmail.subject && newEmail.content) {
      const email = {
        ...newEmail,
        id: emails.length + 1,
        sentTo: 150, // Mock data
        opened: 0,
        clicked: 0,
        status: newEmail.sendDate === 'now' ? 'sent' : 'scheduled',
        sentDate: new Date().toISOString().split('T')[0]
      };
      setEmails([...emails, email]);
      setNewEmail({
        subject: '', recipients: 'all', customRecipients: '', content: '',
        type: 'general', company: '', sendDate: 'now'
      });
      setShowCreateModal(false);
    }
  };

  const handleCreateForm = () => {
    if (newForm.title && newForm.description) {
      const form = {
        ...newForm,
        id: forms.length + 1,
        formUrl: `https://forms.google.com/${newForm.title.toLowerCase().replace(/\s+/g, '-')}`,
        responses: 0,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        branches: Array.isArray(newForm.branches) ? newForm.branches : [newForm.branches]
      };
      setForms([...forms, form]);
      setNewForm({
        title: '', description: '', type: 'registration', company: '',
        branches: [], cgpa: '', deadline: '', formType: 'google_forms'
      });
      setShowFormModal(false);
    }
  };

  const copyFormLink = (url) => {
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Communication System</h1>
              <p className="text-gray-600 mt-1">Manage emails and forms for student communications</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Mail size={20} />
                Send Email
              </button>
              <button
                onClick={() => setShowFormModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FileText size={20} />
                Create Form
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {activeTab === 'mail' ? (
              <>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Send className="text-blue-600" size={24} />
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Sent</p>
                      <p className="text-2xl font-bold text-blue-900">{emailStats.totalSent}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="text-green-600" size={24} />
                    <div>
                      <p className="text-green-600 text-sm font-medium">Open Rate</p>
                      <p className="text-2xl font-bold text-green-900">{emailStats.openRate}%</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="text-purple-600" size={24} />
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Total Opened</p>
                      <p className="text-2xl font-bold text-purple-900">{emailStats.totalOpened}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="text-orange-600" size={24} />
                    <div>
                      <p className="text-orange-600 text-sm font-medium">Total Clicked</p>
                      <p className="text-2xl font-bold text-orange-900">{emailStats.totalClicked}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="text-green-600" size={24} />
                    <div>
                      <p className="text-green-600 text-sm font-medium">Total Forms</p>
                      <p className="text-2xl font-bold text-green-900">{formStats.totalForms}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-blue-600" size={24} />
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Active Forms</p>
                      <p className="text-2xl font-bold text-blue-900">{formStats.activeForms}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="text-purple-600" size={24} />
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Total Responses</p>
                      <p className="text-2xl font-bold text-purple-900">{formStats.totalResponses}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-yellow-600" size={24} />
                    <div>
                      <p className="text-yellow-600 text-sm font-medium">Avg Responses</p>
                      <p className="text-2xl font-bold text-yellow-900">{formStats.avgResponses}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['mail', 'forms'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab === 'mail' ? <Mail size={20} /> : <FileText size={20} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {activeTab === 'mail' ? (
                  <>
                    <option value="sent">Sent</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                  </>
                ) : (
                  <>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft_form">Draft</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'mail' ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmails.map((email) => (
                    <tr key={email.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{email.subject}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[email.type]}`}>
                              {email.type.replace('_', ' ')}
                            </span>
                            {email.company && (
                              <span className="text-xs text-gray-500">• {email.company}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{email.recipients}</div>
                          <div className="text-gray-500">{email.sentTo} students</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[email.status]}`}>
                          {email.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} className="text-gray-400" />
                          {new Date(email.sentDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Opened:</span>
                            <span className="font-medium">{email.opened}/{email.sentTo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Clicked:</span>
                            <span className="font-medium">{email.clicked}/{email.sentTo}</span>
                          </div>
                        </div>
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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div key={form.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{form.description}</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[form.status]}`}>
                        {form.status}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[form.type]}`}>
                        {form.type}
                      </span>
                    </div>

                    {form.company && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Company:</strong> {form.company}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Branches:</strong> {form.branches.join(', ')}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <strong>CGPA:</strong> {form.cgpa}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Created: {new Date(form.createdDate).toLocaleDateString()}</span>
                      {form.deadline && (
                        <span className="text-red-600">
                          Deadline: {new Date(form.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-blue-600">
                        {form.responses} responses
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyFormLink(form.formUrl)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Copy link"
                        >
                          <Copy size={16} />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900" title="View form">
                          <ExternalLink size={16} />
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Download responses">
                          <Download size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit form">
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Email Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Send Email</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={newEmail.subject}
                    onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Email subject"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                    <select
                      value={newEmail.recipients}
                      onChange={(e) => setNewEmail({...newEmail, recipients: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Students</option>
                      <option value="final_year">Final Year Students</option>
                      <option value="cse">CSE Students</option>
                      <option value="it">IT Students</option>
                      <option value="ece">ECE Students</option>
                      <option value="placed">Placed Students</option>
                      <option value="unplaced">Unplaced Students</option>
                      <option value="custom">Custom List</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={newEmail.type}
                      onChange={(e) => setNewEmail({...newEmail, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="company_notification">Company Notification</option>
                      <option value="event_notification">Event Notification</option>
                      <option value="interview_schedule">Interview Schedule</option>
                    </select>
                  </div>
                </div>

                {newEmail.type === 'company_notification' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={newEmail.company}
                      onChange={(e) => setNewEmail({...newEmail, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Company name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Content *</label>
                  <textarea
                    value={newEmail.content}
                    onChange={(e) => setNewEmail({...newEmail, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="8"
                    placeholder="Write your email content here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Send Time</label>
                  <select
                    value={newEmail.sendDate}
                    onChange={(e) => setNewEmail({...newEmail, sendDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="now">Send Now</option>
                    <option value="schedule">Schedule for Later</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Send size={16} />
                  Send Email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Form Modal */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Create New Form</h2>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Form Title *</label>
                  <input
                    type="text"
                    value={newForm.title}
                    onChange={(e) => setNewForm({...newForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter form title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={newForm.description}
                    onChange={(e) => setNewForm({...newForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Form description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Form Type</label>
                    <select
                      value={newForm.type}
                      onChange={(e) => setNewForm({...newForm, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="registration">Registration</option>
                      <option value="feedback">Feedback</option>
                      <option value="event">Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company (if applicable)</label>
                    <input
                      type="text"
                      value={newForm.company}
                      onChange={(e) => setNewForm({...newForm, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eligible Branches</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'].map((branch) => (
                      <label key={branch} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newForm.branches.includes(branch)}
                          onChange={(e) => {
                            const updatedBranches = e.target.checked
                              ? [...newForm.branches, branch]
                              : newForm.branches.filter(b => b !== branch);
                            setNewForm({...newForm, branches: updatedBranches});
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{branch}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={newForm.cgpa}
                      onChange={(e) => setNewForm({...newForm, cgpa: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Minimum CGPA required"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <input
                      type="datetime-local"
                      value={newForm.deadline}
                      onChange={(e) => setNewForm({...newForm, deadline: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Form Platform</label>
                  <select
                    value={newForm.formType}
                    onChange={(e) => setNewForm({...newForm, formType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="google_forms">Google Forms</option>
                    <option value="microsoft_forms">Microsoft Forms</option>
                    <option value="custom">Custom Form</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateForm}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <FileText size={16} />
                  Create Form
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationSystem;