/**
 * Input Validation Utilities (TypeScript)
 * Validation functions for form inputs
 */

import type { 
  ValidationResult, 
  FormValidationResult, 
  TripFormData 
} from '../types';
import { FORM_VALIDATION } from './constant';

/**
 * Validate location string
 */
export const validateLocation = (location: string): ValidationResult => {
  if (!location || location.trim().length === 0) {
    return {
      isValid: false,
      error: 'Location is required',
    };
  }

  if (location.trim().length < 2) {
    return {
      isValid: false,
      error: 'Location must be at least 2 characters',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate cycle hours
 */
export const validateCycleHours = (hours: string | number): ValidationResult => {
  const numHours = typeof hours === 'string' ? parseFloat(hours) : hours;

  if (isNaN(numHours)) {
    return {
      isValid: false,
      error: 'Cycle hours must be a number',
    };
  }

  if (numHours < FORM_VALIDATION.MIN_CYCLE_HOURS) {
    return {
      isValid: false,
      error: `Cycle hours must be at least ${FORM_VALIDATION.MIN_CYCLE_HOURS}`,
    };
  }

  if (numHours > FORM_VALIDATION.MAX_CYCLE_HOURS) {
    return {
      isValid: false,
      error: `Cycle hours cannot exceed ${FORM_VALIDATION.MAX_CYCLE_HOURS}`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate entire trip form
 */
export const validateTripForm = (
  formData: TripFormData
): FormValidationResult => {
  const errors: Record<string, string> = {};

  // Validate current location
  const currentLocationValidation = validateLocation(formData.currentLocation);
  if (!currentLocationValidation.isValid && currentLocationValidation.error) {
    errors.currentLocation = currentLocationValidation.error;
  }

  // Validate pickup location
  const pickupLocationValidation = validateLocation(formData.pickupLocation);
  if (!pickupLocationValidation.isValid && pickupLocationValidation.error) {
    errors.pickupLocation = pickupLocationValidation.error;
  }

  // Validate dropoff location
  const dropoffLocationValidation = validateLocation(formData.dropoffLocation);
  if (!dropoffLocationValidation.isValid && dropoffLocationValidation.error) {
    errors.dropoffLocation = dropoffLocationValidation.error;
  }

  // Validate cycle hours
  const cycleHoursValidation = validateCycleHours(formData.currentCycleUsed);
  if (!cycleHoursValidation.isValid && cycleHoursValidation.error) {
    errors.currentCycleUsed = cycleHoursValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize location input
 */
export const sanitizeLocation = (location: string): string => {
  return location.trim().replace(/\s+/g, ' ');
};

export default {
  validateLocation,
  validateCycleHours,
  validateTripForm,
  sanitizeLocation,
};