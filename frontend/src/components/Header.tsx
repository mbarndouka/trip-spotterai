import { Truck } from "lucide-react";

export const Header = () => {
  return (
    <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg rounded-xl mb-4 sm:mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
          <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
            <Truck className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              ELD Trip Planner
            </h1>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg">
              Hours of Service Compliance & Route Planning
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
