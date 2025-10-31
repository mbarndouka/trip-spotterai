/**
 * Form Type Definitions
 * Types for form data and validation
 */

export interface TripFormData {
  currentLocation: string;
  pickupLocation: string;
  dropoffLocation: string;
  currentCycleUsed: string;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface ValidationErrors {
  currentLocation?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  currentCycleUsed?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export interface FormState<T> {
  values: T;
  touched: Record<keyof T, boolean>;
}

export type InputChangeEvent = 
  | React.ChangeEvent<HTMLInputElement>
  | { name: string; value: string };

export type InputBlurEvent = 
  | React.FocusEvent<HTMLInputElement>
  | string;