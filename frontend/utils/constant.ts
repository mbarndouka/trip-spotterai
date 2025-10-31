/**
 * Application Constants (TypeScript)
 * Centralized configuration and constants
 */

import type { DutyStatus, DutyStatusColor } from "../types";

export const HOS_RULES = {
  MAX_DRIVING_HOURS: 11,
  MAX_ON_DUTY_WINDOW: 14,
  REQUIRED_OFF_DUTY: 10,
  BREAK_AFTER_DRIVING: 8,
  BREAK_DURATION: 0.5,
  MAX_WEEKLY_HOURS: 70,
  CYCLE_DAYS: 8,
} as const;

export const DUTY_STATUS: Record<string, DutyStatus> = {
  OFF_DUTY: "Off Duty",
  SLEEPER_BERTH: "Sleeper Berth",
  DRIVING: "Driving",
  ON_DUTY: "On Duty (Not Driving)",
} as const;

export const DUTY_STATUS_COLORS: Record<DutyStatus, DutyStatusColor> = {
  "Off Duty": {
    bg: "bg-gray-400",
    canvas: "#9ca3af",
    text: "text-gray-700",
  },
  "Sleeper Berth": {
    bg: "bg-blue-500",
    canvas: "#3b82f6",
    text: "text-blue-700",
  },
  Driving: {
    bg: "bg-green-500",
    canvas: "#10b981",
    text: "text-green-700",
  },
  "On Duty (Not Driving)": {
    bg: "bg-yellow-500",
    canvas: "#f59e0b",
    text: "text-yellow-700",
  },
};

export const MAP_CONFIG = {
  DEFAULT_ZOOM: 6,
  TILE_LAYER: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  ATTRIBUTION: "© OpenStreetMap contributors",
  MARKER_COLORS: {
    CURRENT: "#10b981",
    PICKUP: "#f59e0b",
    DROPOFF: "#ef4444",
    FUEL: "#8b5cf6",
  },
} as const;

export const FORM_VALIDATION = {
  MIN_CYCLE_HOURS: 0,
  MAX_CYCLE_HOURS: 70,
  REQUIRED_FIELDS: [
    "currentLocation",
    "pickupLocation",
    "dropoffLocation",
    "currentCycleUsed",
  ] as const,
} as const;

export const UI_MESSAGES = {
  LOADING: "Calculating Route...",
  ERROR_GENERIC: "An error occurred. Please try again.",
  ERROR_NETWORK: "Network error. Please check your connection.",
  ERROR_INVALID_INPUT: "Please fill in all required fields correctly.",
  SUCCESS: "Trip calculated successfully!",
} as const;

export const LOG_SHEET = {
  HOURS_PER_DAY: 24,
  STATUS_ROWS: 4,
  CANVAS_WIDTH: 1000,
  CANVAS_HEIGHT: 320,
} as const;

export default {
  HOS_RULES,
  DUTY_STATUS,
  DUTY_STATUS_COLORS,
  MAP_CONFIG,
  FORM_VALIDATION,
  UI_MESSAGES,
  LOG_SHEET,
};
