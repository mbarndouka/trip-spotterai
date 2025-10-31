/**
 * useForm Hook (TypeScript)
 * Custom hook for form state management
 */

import { useState, useCallback } from "react";
import type { InputChangeEvent, InputBlurEvent } from "../types";

interface UseFormReturn<T> {
  values: T;
  touched: Record<keyof T, boolean>;
  handleChange: (e: InputChangeEvent) => void;
  handleBlur: (e: InputBlurEvent) => void;
  setMultipleValues: (newValues: Partial<T>) => void;
  setValue: (name: keyof T, value: unknown) => void;
  reset: () => void;
  resetFields: (fieldNames: (keyof T)[]) => void;
  isTouched: (name: keyof T) => boolean;
}

/**
 * Hook for managing form state
 */
export const useForm = <T extends Record<string, unknown>>(
  initialValues: T
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>
  );

  /**
   * Handle input change
   */
  const handleChange = useCallback((e: InputChangeEvent) => {
    const name = "target" in e ? e.target?.name : e.name;
    const value = "target" in e ? e.target?.value : e.value;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Handle input blur (mark as touched)
   */
  const handleBlur = useCallback((e: InputBlurEvent) => {
    const name = typeof e === "string" ? e : e.target?.name;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  /**
   * Set multiple values at once
   */
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  /**
   * Set a single value
   */
  const setValue = useCallback((name: keyof T, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Reset form to initial values
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({} as Record<keyof T, boolean>);
  }, [initialValues]);

  /**
   * Reset specific fields
   */
  const resetFields = useCallback(
    (fieldNames: (keyof T)[]) => {
      setValues((prev) => {
        const newValues = { ...prev };
        fieldNames.forEach((name) => {
          newValues[name] = initialValues[name] || ("" as T[keyof T]);
        });
        return newValues;
      });

      setTouched((prev) => {
        const newTouched = { ...prev };
        fieldNames.forEach((name) => {
          delete newTouched[name];
        });
        return newTouched;
      });
    },
    [initialValues]
  );

  /**
   * Check if field has been touched
   */
  const isTouched = useCallback(
    (name: keyof T): boolean => {
      return !!touched[name];
    },
    [touched]
  );

  return {
    values,
    touched,
    handleChange,
    handleBlur,
    setMultipleValues,
    setValue,
    reset,
    resetFields,
    isTouched,
  };
};

export default useForm;
