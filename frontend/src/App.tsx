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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Input Form */}
        <div className="mb-8">
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
          <>
            {/* Trip Summary Stats */}
            <div className="mb-8">
              <TripSummary result={result} />
            </div>

            {/* Map */}
            <div className="mb-8">
              <TripMap result={result} />
            </div>

            {/* ELD Log Sheets */}
            <LogSheetList result={result} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
