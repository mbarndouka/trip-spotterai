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
    blue: {
      bg: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      text: "text-blue-900",
    },
    green: {
      bg: "from-green-50 to-green-100",
      border: "border-green-200",
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
      text: "text-green-900",
    },
    purple: {
      bg: "from-purple-50 to-purple-100",
      border: "border-purple-200",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      text: "text-purple-900",
    },
  };

  const classes = colorClasses[color];

  return (
    <div
      className={`bg-linear-to-br ${classes.bg} rounded-2xl p-6 border-2 ${classes.border} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </span>
        <div className={`${classes.iconBg} p-3 rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className={`text-4xl font-bold ${classes.text}`}>{value}</p>
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
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="font-medium">Real road routing • HOS compliant</span>
      </div>
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
