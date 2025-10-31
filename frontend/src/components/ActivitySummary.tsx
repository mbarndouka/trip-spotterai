interface TimelineEvent {
  type: string;
  start_time: string;
  duration: number;
  distance?: number;
  location?: string;
  status: string;
}

interface ActivitySummaryProps {
  timeline: TimelineEvent[];
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Off Duty":
      return "bg-gray-400";
    case "Sleeper Berth":
      return "bg-blue-500";
    case "Driving":
      return "bg-green-500";
    case "On Duty (Not Driving)":
      return "bg-yellow-500";
    default:
      return "bg-gray-300";
  }
};

export const ActivitySummary = ({ timeline }: ActivitySummaryProps) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      <h4 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">
        Activity Summary:
      </h4>
      {timeline.map((event, idx) => (
        <div
          key={idx}
          className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg"
        >
          <div
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mt-0.5 sm:mt-1 shrink-0 ${getStatusColor(
              event.status
            )}`}
          ></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs sm:text-sm">
              <span className="font-semibold text-gray-800">
                {formatTime(event.start_time)}
              </span>
              <span className="text-gray-600">-</span>
              <span className="text-gray-700">{event.status}</span>
              {event.location && (
                <span className="text-gray-600">
                  at <span className="font-medium">{event.location}</span>
                </span>
              )}
              <span className="text-gray-500 text-xs">({event.duration}h)</span>
            </div>
            {event.distance && (
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                Distance: {event.distance} miles
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
