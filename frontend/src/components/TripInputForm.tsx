import { MapPin, Package, Clock, Navigation } from "lucide-react";

export const TripInputForm = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
        <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        Trip Input Form
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
            Current Location
          </label>
          <input
            type="text"
            value="Los Angeles, CA"
            readOnly
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg bg-gray-50 font-medium text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            <Package className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
            Pickup Location
          </label>
          <input
            type="text"
            value="Phoenix, AZ"
            readOnly
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg bg-gray-50 font-medium text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
            Dropoff Location
          </label>
          <input
            type="text"
            value="Las Vegas, NV"
            readOnly
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg bg-gray-50 font-medium text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
            Current Cycle Used (Hours)
          </label>
          <input
            type="number"
            value="20"
            readOnly
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg bg-gray-50 font-medium text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  );
};
