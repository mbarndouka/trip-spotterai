/**
 * Formatting Utilities (TypeScript)
 * Pure functions for formatting data
 */

/**
 * Format time from ISO string
 */
export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date from ISO string
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format distance
 */
export const formatDistance = (miles: number): string => {
  return `${miles.toFixed(1)} mi`;
};

/**
 * Format duration
 */
export const formatDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes}m`;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, max: number): string => {
  const percentage = (value / max) * 100;
  return `${percentage.toFixed(1)}%`;
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format location name
 */
export const formatLocation = (location: string): string => {
  // Extract city and state (e.g., "Los Angeles, California, USA" -> "Los Angeles, CA")
  const parts = location.split(',').map((s) => s.trim());
  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[1]}`;
  }
  return location;
};

export default {
  formatTime,
  formatDate,
  formatDistance,
  formatDuration,
  formatPercentage,
  truncateText,
  formatLocation,
};