import React from "react";
import { Truck } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="glass border-b border-white/20 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Trip Planner Pro
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                🚛 HOS Compliance & Smart Route Planning
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              System Active
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
