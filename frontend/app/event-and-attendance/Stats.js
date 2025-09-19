import { Users, Calendar, CheckCircle } from "lucide-react";

function Stats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Total Events
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalEvents}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Completed Events
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.completedEvents}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Ongoing Events
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.ongoingEvents}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            <Users className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Upcoming Events
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.upcomingEvents}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              CDGC Events
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.cdgcEvents}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            <div className="h-6 w-6 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-xs">%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Avg Attendance
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.averageAttendanceRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
