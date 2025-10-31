import type { LucideIcon } from "lucide-react";

interface TripSummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  colorScheme: "blue" | "green" | "purple";
}

const colorClasses = {
  blue: {
    background: "bg-linear-to-br from-blue-50 to-blue-100",
    border: "border-blue-200",
    iconBg: "bg-blue-600",
  },
  green: {
    background: "bg-linear-to-br from-green-50 to-green-100",
    border: "border-green-200",
    iconBg: "bg-green-600",
  },
  purple: {
    background: "bg-linear-to-br from-purple-50 to-purple-100",
    border: "border-purple-200",
    iconBg: "bg-purple-600",
  },
};

export const TripSummaryCard = ({
  icon: Icon,
  label,
  value,
  colorScheme,
}: TripSummaryCardProps) => {
  const colors = colorClasses[colorScheme];

  return (
    <div
      className={`${colors.background} rounded-xl p-4 sm:p-6 border-2 ${colors.border}`}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className={`${colors.iconBg} p-1.5 sm:p-2 rounded-lg`}>
          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
        <span className="text-xs sm:text-sm font-medium text-gray-600">
          {label}
        </span>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
};
