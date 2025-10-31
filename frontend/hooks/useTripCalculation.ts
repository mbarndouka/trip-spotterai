/**
 * useTripCalculation Hook (TypeScript)
 * Custom hook for trip calculation logic
 */

import { useState, useCallback } from "react";
import tripService from "../api/tripService";
import { validateTripForm } from "../utils/validators";
import type { TripFormData, TripResult, ValidationErrors } from "../types";

interface UseTripCalculationReturn {
  loading: boolean;
  error: string | null;
  result: TripResult | null;
  validationErrors: ValidationErrors;
  calculateTrip: (formData: TripFormData) => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

/**
 * Hook for managing trip calculation state and logic
 */
export const useTripCalculation = (): UseTripCalculationReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TripResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  /**
   * Calculate trip
   */
  const calculateTrip = useCallback(async (formData: TripFormData) => {
    // Reset state
    setError(null);
    setValidationErrors({});

    // Validate form
    const validation = validateTripForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    // Start loading
    setLoading(true);

    try {
      // Call API
      const response = await tripService.calculateTrip(formData);

      if (response.success && response.data) {
        setResult(response.data);
        setError(null);
      } else {
        setError(response.error || "Failed to calculate trip");
        setResult(null);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset calculation state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
    setValidationErrors({});
  }, []);

  /**
   * Clear only error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    result,
    validationErrors,
    calculateTrip,
    reset,
    clearError,
  };
};

export default useTripCalculation;
