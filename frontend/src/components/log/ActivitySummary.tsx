import React from "react";
import { formatTime } from "../../../utils/formatter";
import { DUTY_STATUS_COLORS } from "../../../utils/constant";
import { Clock, MapPin, Gauge } from "lucide-react";
import type { TimelineEvent } from "../../../types";

interface ActivitySummaryProps {
  events: TimelineEvent[];
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ events }) => {
  // Calculate totals
  const totals = events.reduce(
    (acc, event) => {
      if (event.status === "Driving") {
        acc.drivingTime += event.duration;
        acc.distance += event.distance || 0;
      }
      acc.totalTime += event.duration;
      return acc;
    },
    { drivingTime: 0, totalTime: 0, distance: 0 }
  );

  return (
    <div className="mt-6 space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-semibold">Driving Time</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {totals.drivingTime.toFixed(1)}h
          </p>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Gauge className="w-5 h-5" />
            <span className="text-sm font-semibold">Distance</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {totals.distance.toFixed(0)} mi
          </p>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-semibold">Total Time</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {totals.totalTime.toFixed(1)}h
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Activity Timeline
        </h4>
        <div className="space-y-3">
          {events.map((event, idx) => {
            const statusColor =
              DUTY_STATUS_COLORS[event.status]?.bg || "bg-gray-400";
            const textColor =
              DUTY_STATUS_COLORS[event.status]?.text || "text-gray-700";

            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 bg-linear-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {/* Status Indicator */}
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div
                    className={`w-5 h-5 rounded-full ${statusColor} border-2 border-white shadow-lg`}
                  />
                  {idx < events.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-300" />
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-indigo-600">
                      {formatTime(event.start_time)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor} ${textColor} border border-gray-300`}
                    >
                      {event.status}
                    </span>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                      {event.duration}h
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{event.location}</span>
                      </div>
                    )}
                    {event.distance && (
                      <div className="flex items-center gap-1">
                        <Gauge className="w-4 h-4 text-gray-500" />
                        <span>{event.distance.toFixed(1)} miles</span>
                      </div>
                    )}
                    {event.type && (
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium capitalize">
                        {event.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivitySummary;
