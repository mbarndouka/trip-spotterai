import { MapPin } from "lucide-react";

export const MapPlaceholder = () => {
  return (
    <div className="rounded-xl overflow-hidden border-2 sm:border-4 border-gray-200 bg-linear-to-br from-blue-100 to-green-100 relative">
      <div className="h-64 sm:h-80 md:h-96 flex items-center justify-center p-4">
        <div className="text-center">
          <MapPin className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-blue-600 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Interactive Map
          </h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-4">
            In the actual app, this shows a Leaflet.js map with:
          </p>
          <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
              <span>Current Location (Los Angeles)</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white"></div>
              <span>Pickup Location (Phoenix)</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
              <span>Dropoff Location (Las Vegas)</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white"></div>
              <span>Fuel Stops</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
