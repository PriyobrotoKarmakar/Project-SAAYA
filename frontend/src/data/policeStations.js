// ============================================================================
// POLICE STATION DATA - Import from comprehensive Police_Data.js
// ============================================================================
import { globalPoliceStations } from './Police_Data';

// Re-export with the original name for backward compatibility
export const policeStations = globalPoliceStations;

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Find nearest police station to given coordinates
 */
export const findNearestPoliceStation = (coordinates) => {
  let nearest = null;
  let minDistance = Infinity;

  policeStations.forEach(station => {
    const distance = calculateDistance(coordinates, station.coordinates);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...station, distance };
    }
  });

  return nearest;
};
