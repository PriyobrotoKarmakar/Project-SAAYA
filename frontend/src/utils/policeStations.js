import { globalPoliceStations } from "./policeData";

export const policeStations = globalPoliceStations;

export const calculateDistance = (coord1, coord2) => {
  const R = 6371;
  const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1[0] * Math.PI) / 180) *
      Math.cos((coord2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const findNearestPoliceStation = (coordinates) => {
  let nearest = null;
  let minDistance = Infinity;

  policeStations.forEach((station) => {
    const distance = calculateDistance(coordinates, station.coordinates);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...station, distance };
    }
  });

  return nearest;
};

export const getRouteColor = (index) => {
  const colors = ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  return colors[index % colors.length];
};
