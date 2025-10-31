import React from "react";
import { Navigation, Clock, Fuel } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Card from "../common/Card";
import type { TripResult } from "../../../types";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: "blue" | "green" | "purple";
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  color,
}) => {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 bg-blue-600",
    green: "from-green-50 to-green-100 border-green-200 bg-green-600",
    purple: "from-purple-50 to-purple-100 border-purple-200 bg-purple-600",
  };

  return (
    <div
      className={`bg-linear
        -to-br ${colorClasses[color]} rounded-xl p-6 border-2`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`${colorClasses[color].split(" ")[2]} p-2 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

interface TripSummaryProps {
  result: TripResult | null;
}

const TripSummary: React.FC<TripSummaryProps> = ({ result }) => {
  if (!result) return null;

  const { route, fuel_stops } = result;

  return (
    <Card title="Trip Summary">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Navigation}
          label="Total Distance"
          value={`${route.total_distance} mi`}
          color="blue"
        />
        <StatCard
          icon={Clock}
          label="Driving Time"
          value={`${route.total_driving_time} hrs`}
          color="green"
        />
        <StatCard
          icon={Fuel}
          label="Fuel Stops"
          value={fuel_stops.length}
          color="purple"
        />
      </div>
    </Card>
  );
};

export default TripSummary;
