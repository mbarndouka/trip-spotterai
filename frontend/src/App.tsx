/**
 * Main Application Component
 * Orchestrates all components and state
 */
import Header from "./components/layout/Header";
import TripForm from "./components/trip/TripForm";
import TripSummary from "./components/trip/TripSummary";
import TripMap from "./components/trip/TripMap";
import LogSheetList from "./components/log/LogSheetList";
import { useForm } from "../hooks/useForm";
import { useTripCalculation } from "../hooks/useTripCalculation";
import type { TripFormData } from "../types";

const App = () => {
  // Form state management
  const { values, handleChange, handleBlur } = useForm({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    currentCycleUsed: "",
  });

  // Trip calculation logic
  const { loading, error, result, validationErrors, calculateTrip } =
    useTripCalculation();

  // Handle form submission
  const handleSubmit = (formData: TripFormData) => {
    calculateTrip(formData);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Input Form */}
        <div className="mb-8 animate-fadeIn">
          <TripForm
            values={values}
            onChange={handleChange}
            onBlur={handleBlur}
            onSubmit={handleSubmit}
            validationErrors={validationErrors}
            loading={loading}
            error={error}
          />
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-slideUp">
            {/* Trip Summary Stats */}
            <TripSummary result={result} />

            {/* Map */}
            <TripMap result={result} />

            {/* ELD Log Sheets */}
            <LogSheetList result={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
