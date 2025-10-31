import { FileText, AlertCircle } from "lucide-react";
import { LogSheetVisual } from "./LogSheetVisual";
import { ActivitySummary } from "./ActivitySummary";

interface TimelineEvent {
  type: string;
  start_time: string;
  duration: number;
  distance?: number;
  location?: string;
  status: string;
}

interface ELDRecordsProps {
  timeline: TimelineEvent[];
}

export const ELDRecords = ({ timeline }: ELDRecordsProps) => {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        Electronic Logging Device (ELD) Records
      </h2>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 shrink-0 mt-0.5 sm:mt-1" />
          <div>
            <p className="text-xs sm:text-sm text-blue-800 font-medium">
              <strong>HOS Rules Applied:</strong> 70-hour/8-day cycle | 11-hour
              driving limit | 14-hour on-duty window | 10-hour off-duty rest |
              30-min break after 8 hours
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="border-b-2 border-gray-300 pb-3 sm:pb-4 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Daily Log Sheet - Day 1
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            Wednesday, October 30, 2024
          </p>
        </div>

        <LogSheetVisual />
        <ActivitySummary timeline={timeline} />
      </div>
    </div>
  );
};
