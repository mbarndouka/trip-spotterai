import React from "react";
import { FileText, AlertCircle } from "lucide-react";
import LogSheet from "./LogSheet";
import type {
  TripResult,
  LogSheet as LogSheetType,
  TimelineEvent,
} from "../../../types";

interface LogSheetListProps {
  result: TripResult | null;
}

const LogSheetList: React.FC<LogSheetListProps> = ({ result }) => {
  if (!result) return null;

  const { timeline } = result;

  const generateLogSheets = (): LogSheetType[] => {
    const logSheets: LogSheetType[] = [];
    let currentDay = new Date(timeline[0].start_time);
    currentDay.setHours(0, 0, 0, 0);

    let dayEvents: TimelineEvent[] = [];

    timeline.forEach((event) => {
      const eventStart = new Date(event.start_time);
      const eventDay = new Date(eventStart);
      eventDay.setHours(0, 0, 0, 0);

      if (eventDay.getTime() !== currentDay.getTime()) {
        if (dayEvents.length > 0) {
          logSheets.push({
            date: new Date(currentDay),
            events: [...dayEvents],
          });
        }
        dayEvents = [];
        currentDay = new Date(eventDay);
      }

      dayEvents.push(event);
    });

    if (dayEvents.length > 0) {
      logSheets.push({ date: currentDay, events: dayEvents });
    }

    return logSheets;
  };

  const logSheets = generateLogSheets();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-600" />
        Electronic Logging Device (ELD) Records
      </h2>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
          <div>
            <p className="text-sm text-blue-800 font-medium">
              <strong>HOS Rules Applied:</strong> 70-hour/8-day cycle | 11-hour
              driving limit | 14-hour on-duty window | 10-hour off-duty rest |
              30-min break after 8 hours
            </p>
          </div>
        </div>
      </div>

      {logSheets.map((logSheet, index) => (
        <LogSheet key={index} logSheet={logSheet} dayNumber={index + 1} />
      ))}
    </div>
  );
};

export default LogSheetList;
