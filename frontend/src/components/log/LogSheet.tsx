import React from "react";
import LogCanvas from "./LogCanvas";
import ActivitySummary from "./ActivitySummary";
import { formatDate } from "../../../utils/formatter";
import type { LogSheet as LogSheetType } from "../../../types";

interface LogSheetProps {
  logSheet: LogSheetType;
  dayNumber: number;
}

const LogSheet: React.FC<LogSheetProps> = ({ logSheet, dayNumber }) => {
  const { date, events } = logSheet;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="border-b-2 border-gray-300 pb-4 mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Daily Log Sheet - Day {dayNumber}
        </h3>
        <p className="text-gray-600">{formatDate(date.toISOString())}</p>
      </div>

      <LogCanvas events={events} date={date} />

      <ActivitySummary events={events} />
    </div>
  );
};

export default LogSheet;
