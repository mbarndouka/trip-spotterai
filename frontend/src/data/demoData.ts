import type { TripResult } from "../../types";

export const demoResult: TripResult = {
  locations: {
    current: {
      coords: { lat: 34.0522, lon: -118.2437 },
      name: "Los Angeles, CA",
    },
    pickup: { coords: { lat: 33.4484, lon: -112.074 }, name: "Phoenix, AZ" },
    dropoff: {
      coords: { lat: 36.1699, lon: -115.1398 },
      name: "Las Vegas, NV",
    },
  },
  route: {
    total_distance: 571.2,
    total_driving_time: 9.5,
    geometry: [],
  },
  fuel_stops: [
    {
      location: "Fuel Stop 1",
      coordinates: { lat: 34.5, lon: -114.5 },
      distance_from_start: 285.6,
      duration: 0.5,
    },
  ],
  timeline: [
    {
      type: "driving",
      start_time: "2024-10-30T08:00:00",
      duration: 4.5,
      distance: 270,
      status: "Driving",
    },
    {
      type: "fuel",
      start_time: "2024-10-30T12:30:00",
      duration: 0.5,
      location: "Fuel Stop 1",
      status: "On Duty (Not Driving)",
    },
    {
      type: "driving",
      start_time: "2024-10-30T13:00:00",
      duration: 1.0,
      distance: 60,
      status: "Driving",
    },
    {
      type: "pickup",
      start_time: "2024-10-30T14:00:00",
      duration: 1.0,
      location: "Phoenix, AZ",
      status: "On Duty (Not Driving)",
    },
    {
      type: "driving",
      start_time: "2024-10-30T15:00:00",
      duration: 4.0,
      distance: 240,
      status: "Driving",
    },
    {
      type: "dropoff",
      start_time: "2024-10-30T19:00:00",
      duration: 1.0,
      location: "Las Vegas, NV",
      status: "On Duty (Not Driving)",
    },
  ],
};
