/**
 * Trip Service (TypeScript)
 * Handles all trip-related API calls
 */

import apiClient from './client';
import type { 
  ApiResponse, 
  TripFormData, 
  TripResult, 
  TripRequest, 
  HealthResponse 
} from '../types';

/**
 * Trip Service
 */
const tripService = {
  /**
   * Calculate trip plan
   */
  async calculateTrip(
    tripData: TripFormData
  ): Promise<ApiResponse<TripResult>> {
    try {
      const requestData: TripRequest = {
        current_location: tripData.currentLocation,
        pickup_location: tripData.pickupLocation,
        dropoff_location: tripData.dropoffLocation,
        current_cycle_used: parseFloat(tripData.currentCycleUsed),
      };

      const response = await apiClient.post<TripResult>(
        '/api/calculate-trip/',
        requestData
      );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
        console.error("Error calculating trip:", error);
      return {
        success: false,
      };
    }
  },

  /**
   * Check API health
   */
  async checkHealth(): Promise<ApiResponse<HealthResponse>> {
    try {
      const response = await apiClient.get<HealthResponse>('/api/health/');
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error checking API health:", error);
      return {
        success: false,
      };
    }
  },
};

export default tripService;