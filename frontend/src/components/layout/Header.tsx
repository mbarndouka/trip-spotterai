import React from 'react';
import { Truck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur">
            <Truck className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">ELD Trip Planner</h1>
            <p className="text-blue-100 text-sm">
              Hours of Service Compliance & Route Planning
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;