import React from "react";
import { formatTime } from "../../../utils/formatter";
import { DUTY_STATUS_COLORS } from "../../../utils/constant";
import type { TimelineEvent } from "../../../types";

interface ActivitySummaryProps {
  events: TimelineEvent[];
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ events }) => {
  return (
    <div className="mt-4 space-y-2">
      <h4 className="font-semibold text-gray-700">Activity Summary:</h4>
      {events.map((event, idx) => {
        const statusColor =
          DUTY_STATUS_COLORS[event.status]?.bg || "bg-gray-400";

        return (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <div className={`w-3 h-3 rounded-full mt-1 ${statusColor}`} />
            <div>
              <span className="font-medium">
                {formatTime(event.start_time)}
              </span>
              {" - "}
              <span className="ml-1">{event.status}</span>
              {event.location && (
                <span className="ml-1 text-gray-600">
                  at <span className="font-medium">{event.location}</span>
                </span>
              )}
              <span className="ml-1 text-gray-500">({event.duration}h)</span>
              {event.distance && (
                <span className="ml-1 text-gray-500">
                  - {event.distance.toFixed(1)} miles
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivitySummary;
