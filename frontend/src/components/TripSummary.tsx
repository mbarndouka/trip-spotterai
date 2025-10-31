import { Navigation, Clock, Fuel } from "lucide-react";
import { TripSummaryCard } from "./TripSummaryCard";
import { MapPlaceholder } from "./MapPlaceholder";

interface TripSummaryProps {
  totalDistance: number;
  totalDrivingTime: number;
  fuelStopsCount: number;
}

export const TripSummary = ({
  totalDistance,
  totalDrivingTime,
  fuelStopsCount,
}: TripSummaryProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Trip Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <TripSummaryCard
          icon={Navigation}
          label="Total Distance"
          value={`${totalDistance} mi`}
          colorScheme="blue"
        />

        <TripSummaryCard
          icon={Clock}
          label="Driving Time"
          value={`${totalDrivingTime} hrs`}
          colorScheme="green"
        />

        <div className="sm:col-span-2 lg:col-span-1">
          <TripSummaryCard
            icon={Fuel}
            label="Fuel Stops"
            value={fuelStopsCount}
            colorScheme="purple"
          />
        </div>
      </div>

      <MapPlaceholder />
    </div>
  );
};
