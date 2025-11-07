"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Download,
  Calendar,
  Plus,
  RefreshCw,
  CheckCircle,
  CalendarClock,
  Clock,
  Users,
  ArrowLeft,
} from "lucide-react";
import * as XLSX from "xlsx";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

import EventCard from "./EventCard";
import StudentDetailModel from "./Student DetailModel";
import PaginationBar from "./PaginationBar";
import { useBatchContext } from "../../context/BatchContext";
import CreateEvent from "./CreateEvent";
import MarkAttendanceModal from "./MarkAttendanceModal";

const EventAttendancePage = () => {
  const { selectedBatch } = useBatchContext();
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    completedEvents: 0,
    ongoingEvents: 0,
    upcomingEvents: 0,
    companyRounds: 0,
    cdgcEvents: 0,
    averageAttendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
  });
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Fetch all events from backend with attendance data for specific batch
  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Use the new endpoint with batch year
      const response = await axios.get(
        `${backendUrl}/events/batch/${selectedBatch}`
      );

      if (response.data.success) {
        // Process events to calculate attendance statistics
        const eventsWithStats = response.data.data.map((event) => {
          const totalStudents = event.attendance.length;
          const attendedStudents = event.attendance.filter(
            (student) =>
              student.status === "present" || student.status === "late"
          ).length;
          const absentStudents = event.attendance.filter(
            (student) => student.status === "absent"
          ).length;
          const attendanceRate =
            totalStudents > 0
              ? Math.round((attendedStudents / totalStudents) * 100)
              : 0;

          return {
            ...event,
            totalStudents,
            attendedStudents,
            absentStudents,
            attendanceRate,
          };
        });

        setAllEvents(eventsWithStats);

        // Extract unique companies for filter dropdown
        const uniqueCompanies = [
          ...new Set(
            eventsWithStats
              .filter(
                (event) => event.company && event.type === "company_round"
              )
              .map((event) => event.company)
          ),
        ].sort();

        setCompanies(uniqueCompanies);
        filterAndPaginateEvents(eventsWithStats);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Selected batch:", selectedBatch);
  }, []);

  // Filter and paginate events locally
  const filterAndPaginateEvents = (eventsToFilter = allEvents, page = 1) => {
    let filteredEvents = [...eventsToFilter];

    // Apply type filter
    if (selectedEventType !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.type === selectedEventType
      );
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.status === selectedStatus
      );
    }

    // Apply company filter
    if (selectedCompany !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.company === selectedCompany
      );
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.venue?.toLowerCase().includes(searchLower) ||
          event.company?.toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination
    const limit = 10;
    const totalItems = filteredEvents.length;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    // Update state
    setEvents(filteredEvents.slice(startIndex, endIndex));
    setPagination({
      currentPage,
      totalPages,
      hasMore: currentPage < totalPages,
    });
  };

  // Fetch dashboard statistics - now calculate from events data
  const calculateStats = (eventsData) => {
    const totalEvents = eventsData.length;
    const completedEvents = eventsData.filter(
      (e) => e.status === "completed"
    ).length;
    const ongoingEvents = eventsData.filter(
      (e) => e.status === "ongoing"
    ).length;
    const upcomingEvents = eventsData.filter(
      (e) => e.status === "upcoming"
    ).length;
    const companyRounds = eventsData.filter(
      (e) => e.type === "company_round"
    ).length;
    const cdgcEvents = eventsData.filter((e) => e.type === "cdgc_event").length;

    const totalAttendance = eventsData.reduce(
      (sum, event) => sum + (event.attendedStudents || 0),
      0
    );
    const totalPossibleAttendance = eventsData.reduce(
      (sum, event) => sum + (event.totalStudents || 0),
      0
    );
    const averageAttendanceRate =
      totalPossibleAttendance > 0
        ? Math.round((totalAttendance / totalPossibleAttendance) * 100)
        : 0;

    setStats({
      totalEvents,
      completedEvents,
      ongoingEvents,
      upcomingEvents,
      companyRounds,
      cdgcEvents,
      averageAttendanceRate,
    });
  };

  // Initial data fetch
  useEffect(() => {
    if (selectedBatch) {
      fetchEvents();
    }
  }, [selectedBatch, showAttendanceModal]);

  // Calculate stats when events change
  useEffect(() => {
    if (allEvents.length > 0) {
      calculateStats(allEvents);
    }
  }, [allEvents]);

  // Effect for filtering
  useEffect(() => {
    filterAndPaginateEvents(allEvents, 1);
  }, [
    selectedEventType,
    selectedStatus,
    selectedCompany,
    searchTerm,
    allEvents,
  ]);

  const handlePageChange = (newPage) => {
    filterAndPaginateEvents(allEvents, newPage);
  };

  // Add handler for event creation/edit
  const handleEventSaved = () => {
    setShowCreateEvent(false);
    setEditingEvent(null);
    fetchEvents();
  };

  // Export report handler
  const handleExportReport = () => {
    try {
      // Prepare data for export
      const exportData = allEvents.map((event) => ({
        "Event Title": event.title,
        Type: event.type === "company_round" ? "Company Round" : "CDGC Event",
        Company: event.company || "-",
        Position: event.positionTitle || "-",
        Date: new Date(event.date).toLocaleDateString(),
        Time: `${event.time} - ${event.endTime}`,
        Venue: event.venue || "-",
        Mode: event.mode,
        Status: event.status.charAt(0).toUpperCase() + event.status.slice(1),
        "Total Students": event.totalStudents || 0,
        Present:
          event.attendance?.filter((s) => s.status === "present").length || 0,
        Late: event.attendance?.filter((s) => s.status === "late").length || 0,
        Absent:
          event.attendance?.filter((s) => s.status === "absent").length || 0,
        "Attendance Rate": `${event.attendanceRate || 0}%`,
        "Target Years": event.targetAcademicYears?.join(", ") || "-",
        "Target Departments":
          event.targetSpecializations?.replace(/[{}]/g, "") || "-",
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      ws["!cols"] = [
        { wch: 30 }, // Event Title
        { wch: 15 }, // Type
        { wch: 20 }, // Company
        { wch: 20 }, // Position
        { wch: 12 }, // Date
        { wch: 20 }, // Time
        { wch: 15 }, // Venue
        { wch: 10 }, // Mode
        { wch: 12 }, // Status
        { wch: 15 }, // Total Students
        { wch: 10 }, // Present
        { wch: 10 }, // Late
        { wch: 10 }, // Absent
        { wch: 15 }, // Attendance Rate
        { wch: 15 }, // Target Years
        { wch: 20 }, // Target Departments
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Events - Batch ${selectedBatch}`);

      // Generate filename
      const fileName = `events_report_batch_${selectedBatch}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Error exporting report:", error);
      alert("Failed to export events report");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main content */}
      <div className={showCreateEvent ? "filter blur-sm" : ""}>
        <div className="max-w-7xl mx-auto p-6">
          {/* Header - Updated to match CompanyListing style */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-6 w-6 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Round Creation and Attendance
                  </h1>
                  <p className="text-gray-600">
                    Track attendance for company rounds and CDGC events - Batch{" "}
                    {selectedBatch}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchEvents()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
                <button
                  onClick={() => setShowCreateEvent(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  Create Event
                </button>
                <button
                  onClick={handleExportReport}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Download className="h-4 w-4" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Enhanced Stats Cards - Updated to match CompanyListing style */}
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-4 mt-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <Calendar className="text-blue-600" size={24} />
                  <div>
                    <p className="text-blue-600 text-sm font-medium">
                      Total Events
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {stats.totalEvents}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={24} />
                  <div>
                    <p className="text-green-600 text-sm font-medium">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {stats.completedEvents}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
                <div className="flex items-center gap-3">
                  <CalendarClock className="text-yellow-600" size={24} />
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">
                      Ongoing
                    </p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {stats.ongoingEvents}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3">
                  <Clock className="text-purple-600" size={24} />
                  <div>
                    <p className="text-purple-600 text-sm font-medium">
                      Upcoming
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {stats.upcomingEvents}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-xl border border-rose-100">
                <div className="flex items-center gap-3">
                  <Users className="text-rose-600" size={24} />
                  <div>
                    <p className="text-rose-600 text-sm font-medium">
                      Company Rounds
                    </p>
                    <p className="text-2xl font-bold text-rose-900">
                      {stats.companyRounds}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-4 rounded-xl border border-cyan-100">
                <div className="flex items-center gap-3">
                  <Calendar className="text-cyan-600" size={24} />
                  <div>
                    <p className="text-cyan-600 text-sm font-medium">
                      CDGC Events
                    </p>
                    <p className="text-2xl font-bold text-cyan-900">
                      {stats.cdgcEvents}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <Users className="text-gray-600" size={24} />
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Avg Attendance
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.averageAttendanceRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search - Updated to match CompanyListing style */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Batch {selectedBatch}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {allEvents.length} events registered
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="sm:w-48">
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                >
                  <option value="all">All Companies</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">
                Loading events for batch {selectedBatch}...
              </span>
            </div>
          )}

          {/* Events List */}
          {!loading && (
            <>
              <div className="space-y-6">
                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No events found for batch {selectedBatch}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your filters or search terms, or check if
                      events are targeted for this batch year.
                    </p>
                  </div>
                ) : (
                  events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      setSelectedEvent={setSelectedEvent}
                      fetchEvents={fetchEvents}
                      selectedBatch={selectedBatch}
                      setEditingEvent={setEditingEvent}
                      onAttendanceClick={() => {
                        setSelectedEvent(event);
                        setShowAttendanceModal(true);
                      }}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <PaginationBar
                  pagination={pagination}
                  handlePageChange={handlePageChange}
                />
              )}
            </>
          )}

          {/* Student Details Modal */}
          {selectedEvent && (
            <StudentDetailModel
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
            />
          )}
        </div>
      </div>

      {/* Create/Edit Event Modal */}
      {(showCreateEvent || editingEvent) && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/30 to-purple-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateEvent
              onBack={() => {
                setShowCreateEvent(false);
                setEditingEvent(null);
              }}
              onEventCreated={handleEventSaved}
              isEditing={!!editingEvent}
              eventData={editingEvent}
            />
          </div>
        </div>
      )}

      {/* Mark Attendance Modal */}
      {showAttendanceModal && (
        <MarkAttendanceModal
          event={selectedEvent}
          onClose={() => setShowAttendanceModal(false)}
          onAttendanceMarked={() => {
            // Refresh your data if needed
            fetchEvents();
          }}
        />
      )}
    </div>
  );
};

export default EventAttendancePage;
