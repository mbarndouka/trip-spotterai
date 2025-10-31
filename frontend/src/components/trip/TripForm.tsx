/**
 * TripForm Component (Improved)
 * Form with better error messages and user guidance
 */

import React from 'react';
import { MapPin, Package, Clock, Navigation, AlertCircle, Info } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import type { TripFormData, ValidationErrors } from '../../../types';

interface TripFormProps {
  values: TripFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSubmit: (values: TripFormData) => void;
  validationErrors: ValidationErrors;
  loading: boolean;
  error: string | null;
}

const TripForm: React.FC<TripFormProps> = ({
  values,
  onChange,
  onBlur,
  onSubmit,
  validationErrors,
  loading,
  error,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  // Parse error for better user message
  const getErrorMessage = (error: string): { title: string; message: string } => {
    if (error.includes('geocode') || error.includes('Unable to geocode')) {
      return {
        title: 'Location Not Found',
        message: 'Unable to find one or more locations. Please use the format: "City, ST" (e.g., Los Angeles, CA)',
      };
    }
    if (error.includes('network') || error.includes('Network')) {
      return {
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your connection and try again.',
      };
    }
    return {
      title: 'Error',
      message: error,
    };
  };

  const errorInfo = error ? getErrorMessage(error) : null;

  return (
    <Card title="Trip Details" icon={Navigation}>
      {/* Helper Info */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Location Format Tips:</p>
          <p>
            Use full city and state format for best results:
            <span className="font-mono bg-blue-100 px-1 mx-1 rounded">Los Angeles, CA</span>
            <span className="font-mono bg-blue-100 px-1 mx-1 rounded">New York, NY</span>
            <span className="font-mono bg-blue-100 px-1 mx-1 rounded">Chicago, IL</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Current Location"
            name="currentLocation"
            value={values.currentLocation}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="e.g., Los Angeles, CA"
            icon={MapPin}
            error={validationErrors.currentLocation}
            required
          />

          <Input
            label="Pickup Location"
            name="pickupLocation"
            value={values.pickupLocation}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="e.g., Phoenix, AZ"
            icon={Package}
            error={validationErrors.pickupLocation}
            required
          />

          <Input
            label="Dropoff Location"
            name="dropoffLocation"
            value={values.dropoffLocation}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="e.g., Las Vegas, NV"
            icon={MapPin}
            error={validationErrors.dropoffLocation}
            required
          />

          <Input
            label="Current Cycle Used (Hours)"
            name="currentCycleUsed"
            type="number"
            value={values.currentCycleUsed}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="0-70"
            min="0"
            max="70"
            step="0.5"
            icon={Clock}
            error={validationErrors.currentCycleUsed}
            required
          />
        </div>

        <Button
          type="submit"
          onClick={handleSubmit}
          loading={loading}
          icon={Navigation}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Calculating Route (5-10 seconds)...' : 'Calculate Trip Plan'}
        </Button>

        {error && errorInfo && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">{errorInfo.title}</h4>
                <p className="text-sm text-red-800">{errorInfo.message}</p>
                
                {error.includes('geocode') && (
                  <div className="mt-3 p-2 bg-red-100 rounded">
                    <p className="text-xs text-red-900 font-medium mb-1">Try these locations:</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <span className="font-mono bg-white px-2 py-1 rounded">Los Angeles, CA</span>
                      <span className="font-mono bg-white px-2 py-1 rounded">Phoenix, AZ</span>
                      <span className="font-mono bg-white px-2 py-1 rounded">Las Vegas, NV</span>
                      <span className="font-mono bg-white px-2 py-1 rounded">Chicago, IL</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Processing your trip...</p>
                <p className="text-xs mt-1">
                  Geocoding locations and calculating HOS-compliant route. This may take 5-10 seconds.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TripForm;