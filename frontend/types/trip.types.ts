/**
 * Trip Type Definitions
 * Types for trip data structures
 */

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Location {
  coords: Coordinates;
  name: string;
}

export interface Locations {
  current: Location;
  pickup: Location;
  dropoff: Location;
}

export interface Route {
  total_distance: number;
  total_driving_time: number;
  geometry: number[][];
}

export interface FuelStop {
  location: string;
  coordinates: Coordinates;
  distance_from_start: number;
  duration: number;
}

export type DutyStatus = 
  | 'Off Duty' 
  | 'Sleeper Berth' 
  | 'Driving' 
  | 'On Duty (Not Driving)';

export type TimelineEventType = 
  | 'driving' 
  | 'fuel' 
  | 'break' 
  | 'rest' 
  | 'pickup' 
  | 'dropoff';

export interface TimelineEvent {
  type: TimelineEventType;
  start_time: string;
  duration: number;
  distance?: number;
  location?: string;
  status: DutyStatus;
}

export interface TripResult {
  locations: Locations;
  route: Route;
  fuel_stops: FuelStop[];
  timeline: TimelineEvent[];
}

export interface TripRequest {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_used: number;
}

export interface LogSheet {
  date: Date;
  events: TimelineEvent[];
}

export interface DutyStatusColor {
  bg: string;
  canvas: string;
  text: string;
}