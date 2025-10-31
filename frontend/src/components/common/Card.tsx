/**
 * Card Component (TypeScript)
 * Reusable card container
 */

import React from 'react';
import { type LucideIcon } from 'lucide-react';

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
  className = '',
  padding = 'p-6',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg ${padding} ${className}`}
      {...props}
    >
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {Icon && <Icon className="w-6 h-6 text-blue-600" />}
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;