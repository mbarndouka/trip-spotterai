/**
 * Input Component (TypeScript)
 * Reusable input field with validation
 */

import React from "react";
import { type LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: string;
  icon?: LucideIcon;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  icon: Icon,
  min,
  max,
  step,
  className = "",
  ...props
}) => {
  const hasError = !!error;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="flex text-sm font-semibold text-gray-700 mb-2 items-center gap-1"
        >
          {Icon && <Icon className="w-4 h-4 text-indigo-600" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder:text-gray-400 bg-white shadow-sm ${
            hasError
              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
              : "border-gray-300 hover:border-gray-400"
          }`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          {...props}
        />
      </div>

      {hasError && (
        <p
          id={`${name}-error`}
          className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1"
          role="alert"
        >
          <span className="text-red-500">⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default Input;
