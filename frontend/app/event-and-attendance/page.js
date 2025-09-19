"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Download, Calendar, Plus, RefreshCw } from "lucide-react";

import EventCard from "./EventCard";
import Stats from "./Stats";
import StudentDetailModel from "./StudentDetailModel";
import PaginationBar from "./PaginationBar";
import { useBatchContext, BatchProvider } from "../../context/BatchContext";
import CreateEvent from "./CreateEvent";

const EventAttendancePage = () => {
  const { selectedBatch } = useBatchContext();
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
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

  // Fetch all events from backend with attendance data for specific batch
  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Use the new endpoint with batch year
      const response = await axios.get(
        `http://localhost:5000/events/batch/${selectedBatch}`
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
        filterAndPaginateEvents(eventsWithStats);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

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
  }, [selectedBatch]);

  // Calculate stats when events change
  useEffect(() => {
    if (allEvents.length > 0) {
      calculateStats(allEvents);
    }
  }, [allEvents]);

  // Effect for filtering
  useEffect(() => {
    filterAndPaginateEvents(allEvents, 1);
  }, [selectedEventType, selectedStatus, searchTerm, allEvents]);

  const handlePageChange = (newPage) => {
    filterAndPaginateEvents(allEvents, newPage);
  };

  // Add handler for event creation/edit
  const handleEventSaved = () => {
    setShowCreateEvent(false);
    setEditingEvent(null);
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div className={showCreateEvent ? "filter blur-sm" : ""}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Event & Attendance Management
                </h1>
                <p className="mt-2 text-gray-600">
                  Track attendance for company rounds and CDGC events - Batch{" "}
                  {selectedBatch}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => fetchEvents()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
                <button
                  onClick={() => setShowCreateEvent(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
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
          <Stats stats={stats} />

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
                  <option value="cancelled">Cancelled</option>
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
              selectedBatch={selectedBatch}
              isEditing={!!editingEvent}
              eventData={editingEvent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const EventAttendanceLayout = () => (
  <BatchProvider>
    <EventAttendancePage />
  </BatchProvider>
);

export default EventAttendanceLayout;
