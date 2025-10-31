/**
 * Card Component (TypeScript)
 * Reusable card container
 */

import React from "react";
import { type LucideIcon } from "lucide-react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  icon?: LucideIcon;
  padding?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  icon: Icon,
  className = "",
  padding = "p-6",
  ...props
}) => {
  return (
    <div
      className={`glass rounded-2xl shadow-2xl border border-white/20 ${padding} ${className} transition-all hover:shadow-3xl`}
      {...props}
    >
      {title && (
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            {Icon && <Icon className="w-7 h-7 text-indigo-600" />}
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
