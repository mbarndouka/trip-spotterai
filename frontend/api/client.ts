/**
 * API Client Configuration (TypeScript)
 * Centralized HTTP client for all API calls
 */

import type { ApiError as ApiErrorType, RequestConfig } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Custom API Error class
 */
export class ApiError extends Error implements ApiErrorType {
  status: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * HTTP Client wrapper
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Make HTTP request
   */
  async request<T = unknown>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      method: options.method,
      body: options.body,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || "An error occurred",
          response.status,
          data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or parsing error
      const errorDetails =
        error && typeof error === "object"
          ? (error as Record<string, unknown>)
          : undefined;

      throw new ApiError(
        "Network error. Please check your connection.",
        0,
        errorDetails
      );
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      ...options,
    });
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    data: unknown,
    options: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    data: unknown,
    options: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      ...options,
    });
  }
}

// Create and export singleton instance
const apiClient = new ApiClient(API_BASE_URL);

export { apiClient };
export default apiClient;
