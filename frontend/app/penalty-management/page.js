"use client";

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Search, Filter, AlertTriangle, Clock, CheckCircle, XCircle, MessageSquare, FileText, User, Calendar } from 'lucide-react';

const PenaltyManagement = () => {
  const [activeTab, setActiveTab] = useState('penalties');
  const [showAddRule, setShowAddRule] = useState(false);
  const [showAddPenalty, setShowAddPenalty] = useState(false);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for rules
  const [rules, setRules] = useState([
    {
      id: 1,
      title: 'Interview No-Show',
      description: 'Missing a scheduled interview without prior notice',
      category: 'Interview',
      severity: 'High',
      penaltyPoints: 50,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Late Submission',
      description: 'Submitting placement forms after deadline',
      category: 'Documentation',
      severity: 'Medium',
      penaltyPoints: 25,
      isActive: true,
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      title: 'Multiple Applications',
      description: 'Applying to competing companies simultaneously',
      category: 'Application',
      severity: 'Low',
      penaltyPoints: 15,
      isActive: false,
      createdAt: '2024-01-05'
    }
  ]);

  // Mock data for penalties
  const [penalties, setPenalties] = useState([
    {
      id: 1,
      studentId: 'CS001',
      studentName: 'John Doe',
      ruleId: 1,
      ruleTitle: 'Interview No-Show',
      points: 50,
      issueDate: '2024-02-15',
      status: 'Active',
      description: 'Did not attend Microsoft interview on 2024-02-14',
      issuedBy: 'Admin'
    },
    {
      id: 2,
      studentId: 'CS002',
      studentName: 'Jane Smith',
      ruleId: 2,
      ruleTitle: 'Late Submission',
      points: 25,
      issueDate: '2024-02-10',
      status: 'Under Appeal',
      description: 'Resume submitted 2 days after deadline',
      issuedBy: 'Coordinator'
    },
    {
      id: 3,
      studentId: 'CS003',
      studentName: 'Mike Johnson',
      ruleId: 1,
      ruleTitle: 'Interview No-Show',
      points: 50,
      issueDate: '2024-01-28',
      status: 'Resolved',
      description: 'Missed Google interview due to medical emergency',
      issuedBy: 'Admin'
    }
  ]);

  // Mock data for appeals
  const [appeals, setAppeals] = useState([
    {
      id: 1,
      penaltyId: 2,
      studentId: 'CS002',
      studentName: 'Jane Smith',
      reason: 'Technical issues with portal during submission',
      description: 'I was unable to submit due to server downtime which lasted for several hours on the deadline day.',
      evidence: 'Screenshot of error message, email to IT support',
      status: 'Under Review',
      submittedAt: '2024-02-12',
      reviewedBy: null,
      decision: null,
      reviewNotes: null
    },
    {
      id: 2,
      penaltyId: 3,
      studentId: 'CS003',
      studentName: 'Mike Johnson',
      reason: 'Medical emergency',
      description: 'Had to rush to hospital due to family emergency and could not attend the interview.',
      evidence: 'Medical certificate, hospital admission slip',
      status: 'Approved',
      submittedAt: '2024-01-30',
      reviewedBy: 'Dr. Sarah Wilson',
      decision: 'Penalty waived due to valid medical emergency',
      reviewNotes: 'Verified medical documentation. Penalty points removed.'
    }
  ]);

  const [newRule, setNewRule] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'Medium',
    penaltyPoints: 0,
    isActive: true
  });

  const [newPenalty, setNewPenalty] = useState({
    studentId: '',
    ruleId: '',
    description: '',
    issuedBy: 'Admin'
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-800';
      case 'Under Appeal': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddRule = () => {
    const rule = {
      id: rules.length + 1,
      ...newRule,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRules([...rules, rule]);
    setNewRule({
      title: '',
      description: '',
      category: '',
      severity: 'Medium',
      penaltyPoints: 0,
      isActive: true
    });
    setShowAddRule(false);
  };

  const handleAddPenalty = () => {
    const selectedRule = rules.find(r => r.id === parseInt(newPenalty.ruleId));
    if (selectedRule) {
      const penalty = {
        id: penalties.length + 1,
        ...newPenalty,
        studentName: `Student ${newPenalty.studentId}`,
        ruleTitle: selectedRule.title,
        points: selectedRule.penaltyPoints,
        issueDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      setPenalties([...penalties, penalty]);
      setNewPenalty({
        studentId: '',
        ruleId: '',
        description: '',
        issuedBy: 'Admin'
      });
      setShowAddPenalty(false);
    }
  };

  const handleAppealReview = (appealId, decision, notes) => {
    setAppeals(appeals.map(appeal => 
      appeal.id === appealId 
        ? {
            ...appeal,
            status: decision === 'approve' ? 'Approved' : 'Rejected',
            decision: notes,
            reviewedBy: 'Current Admin',
            reviewNotes: notes
          }
        : appeal
    ));
    
    if (decision === 'approve') {
      setPenalties(penalties.map(penalty =>
        penalty.id === appeals.find(a => a.id === appealId)?.penaltyId
          ? { ...penalty, status: 'Resolved' }
          : penalty
      ));
    }
    
    setShowAppealModal(false);
    setSelectedAppeal(null);
  };

  const filteredPenalties = penalties.filter(penalty =>
    penalty.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    penalty.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    penalty.ruleTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Penalty Management System</h1>
          <p className="text-gray-600 mt-2">Manage rules, track penalties, and review appeals</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'penalties', label: 'Active Penalties', icon: AlertTriangle },
                { key: 'rules', label: 'Penalty Rules', icon: FileText },
                { key: 'appeals', label: 'Appeals', icon: MessageSquare }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Penalties Tab */}
        {activeTab === 'penalties' && (
          <div className="space-y-6">
            {/* Search and Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search students or penalties..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowAddPenalty(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Penalty</span>
                </button>
              </div>
            </div>

            {/* Penalties Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule Violated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPenalties.map((penalty) => (
                      <tr key={penalty.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{penalty.studentName}</div>
                              <div className="text-sm text-gray-500">{penalty.studentId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{penalty.ruleTitle}</div>
                          <div className="text-sm text-gray-500">{penalty.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            -{penalty.points} pts
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {penalty.issueDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(penalty.status)}`}>
                            {penalty.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            {/* Add Rule Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddRule(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Rule</span>
              </button>
            </div>

            {/* Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rules.map((rule) => (
                <div key={rule.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{rule.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{rule.description}</p>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Category:</span>
                          <span className="text-sm font-medium text-gray-900">{rule.category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Severity:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(rule.severity)}`}>
                            {rule.severity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Penalty Points:</span>
                          <span className="text-sm font-medium text-red-600">-{rule.penaltyPoints} pts</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Status:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Created: {rule.createdAt}</span>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appeals Tab */}
        {activeTab === 'appeals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {appeals.map((appeal) => (
                <div key={appeal.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Appeal #{appeal.id}</h3>
                      <p className="text-sm text-gray-500">{appeal.studentName} ({appeal.studentId})</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appeal.status)}`}>
                      {appeal.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Reason:</span>
                      <p className="text-sm text-gray-600 mt-1">{appeal.reason}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Description:</span>
                      <p className="text-sm text-gray-600 mt-1">{appeal.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Evidence:</span>
                      <p className="text-sm text-gray-600 mt-1">{appeal.evidence}</p>
                    </div>
                    {appeal.decision && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Decision:</span>
                        <p className="text-sm text-gray-600 mt-1">{appeal.decision}</p>
                        <p className="text-xs text-gray-500 mt-1">Reviewed by: {appeal.reviewedBy}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Submitted: {appeal.submittedAt}</span>
                    {appeal.status === 'Under Review' && (
                      <button
                        onClick={() => {
                          setSelectedAppeal(appeal);
                          setShowAppealModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Review Appeal
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Rule Modal */}
        {showAddRule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Rule</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rule Title</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newRule.title}
                    onChange={(e) => setNewRule({...newRule, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    value={newRule.description}
                    onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newRule.category}
                    onChange={(e) => setNewRule({...newRule, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newRule.severity}
                    onChange={(e) => setNewRule({...newRule, severity: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Points</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newRule.penaltyPoints}
                    onChange={(e) => setNewRule({...newRule, penaltyPoints: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddRule(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Rule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Penalty Modal */}
        {showAddPenalty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Issue Penalty</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newPenalty.studentId}
                    onChange={(e) => setNewPenalty({...newPenalty, studentId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rule Violated</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newPenalty.ruleId}
                    onChange={(e) => setNewPenalty({...newPenalty, ruleId: e.target.value})}
                  >
                    <option value="">Select a rule</option>
                    {rules.filter(r => r.isActive).map(rule => (
                      <option key={rule.id} value={rule.id}>
                        {rule.title} (-{rule.penaltyPoints} pts)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    value={newPenalty.description}
                    onChange={(e) => setNewPenalty({...newPenalty, description: e.target.value})}
                    placeholder="Describe the violation..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddPenalty(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPenalty}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Issue Penalty
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appeal Review Modal - Corrected Version */}
        {showAppealModal && selectedAppeal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Review Appeal</h2>
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">Student: {selectedAppeal.studentName}</h3>
                  <p className="text-sm text-gray-600">ID: {selectedAppeal.studentId}</p>
                  <p className="text-sm text-gray-600">Appeal Reason: {selectedAppeal.reason}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Appeal Description:</h4>
                  <p className="text-gray-600">{selectedAppeal.description}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Evidence Provided:</h4>
                  <p className="text-gray-600">{selectedAppeal.evidence}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review Decision</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter your decision and reasoning..."
                    id="reviewNotes"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAppealModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const notes = document.getElementById('reviewNotes').value;
                    handleAppealReview(selectedAppeal.id, 'reject', notes);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject Appeal
                </button>
                <button
                  onClick={() => {
                    const notes = document.getElementById('reviewNotes').value;
                    handleAppealReview(selectedAppeal.id, 'approve', notes);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve Appeal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenaltyManagement;