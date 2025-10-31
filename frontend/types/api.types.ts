/**
 * API Type Definitions
 * Types for API requests and responses
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, unknown>;
}

export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface HealthResponse {
  status: string;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: string;
}
