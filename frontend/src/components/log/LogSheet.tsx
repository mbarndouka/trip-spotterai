import React from "react";
import LogCanvas from "./LogCanvas";
import ActivitySummary from "./ActivitySummary";
import { formatDate } from "../../../utils/formatter";
import { Calendar } from "lucide-react";
import type { LogSheet as LogSheetType } from "../../../types";

interface LogSheetProps {
  logSheet: LogSheetType;
  dayNumber: number;
}

const LogSheet: React.FC<LogSheetProps> = ({ logSheet, dayNumber }) => {
  const { date, events } = logSheet;

  return (
    <div className="glass rounded-2xl shadow-2xl border border-white/20 p-8 mb-6 hover:shadow-3xl transition-all duration-300">
      <div className="border-b-2 border-indigo-200 pb-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <Calendar className="w-6 h-6 text-indigo-600" />
              Daily Log Sheet - Day {dayNumber}
            </h3>
            <p className="text-gray-600 mt-1 ml-9 font-medium">
              {formatDate(date.toISOString())}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              HOS Compliance
            </div>
            <div className="text-lg font-bold text-green-600 flex items-center gap-2 justify-end">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Compliant
            </div>
          </div>
        </div>
      </div>

      <LogCanvas events={events} date={date} />

      <ActivitySummary events={events} />
    </div>
  );
};

export default LogSheet;
