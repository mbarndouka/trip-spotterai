export const LogSheetVisual = () => {
  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-4 sm:mb-6 overflow-x-auto">
      <div className="bg-gray-50 p-2 sm:p-4 grid grid-cols-24 gap-0 border-b-2 border-gray-300 min-w-[600px]">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="text-center text-[10px] sm:text-xs text-gray-600 font-medium"
          >
            {i}
          </div>
        ))}
      </div>

      <div className="p-2 sm:p-4 space-y-2 min-w-[600px]">
        <div className="flex items-center gap-1 sm:gap-2 mb-2">
          <div className="w-16 sm:w-24 text-xs sm:text-sm font-medium text-gray-700">
            Off Duty
          </div>
          <div className="flex-1 h-6 sm:h-8 bg-gray-100 rounded"></div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 mb-2">
          <div className="w-16 sm:w-24 text-xs sm:text-sm font-medium text-gray-700">
            Sleeper
          </div>
          <div className="flex-1 h-6 sm:h-8 bg-gray-100 rounded"></div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 mb-2">
          <div className="w-16 sm:w-24 text-xs sm:text-sm font-medium text-gray-700">
            Driving
          </div>
          <div className="flex-1 h-6 sm:h-8 bg-gray-100 rounded relative">
            <div
              className="absolute left-1/3 top-0 h-full bg-green-500 rounded"
              style={{ width: "18%" }}
            ></div>
            <div
              className="absolute left-1/2 top-0 h-full bg-green-500 rounded"
              style={{ width: "4%" }}
            ></div>
            <div
              className="absolute right-1/5 top-0 h-full bg-green-500 rounded"
              style={{ width: "17%" }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-16 sm:w-24 text-xs sm:text-sm font-medium text-gray-700">
            On Duty
          </div>
          <div className="flex-1 h-6 sm:h-8 bg-gray-100 rounded relative">
            <div
              className="absolute left-1/2 top-0 h-full bg-yellow-500 rounded"
              style={{ width: "2%" }}
            ></div>
            <div
              className="absolute left-7/12 top-0 h-full bg-yellow-500 rounded"
              style={{ width: "4%" }}
            ></div>
            <div
              className="absolute right-1/12 top-0 h-full bg-yellow-500 rounded"
              style={{ width: "4%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
