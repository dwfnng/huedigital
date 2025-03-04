import type { Location } from "@shared/schema";
import { Icon } from 'leaflet';

// Updated coordinates for Hue City center
export const DEFAULT_CENTER: [number, number] = [16.4637, 107.5909];
export const DEFAULT_ZOOM = 15;

export const MAP_STYLES = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

export const getMarkerIcon = (type: string): Icon => {
  const iconSize: [number, number] = [32, 32];
  const iconUrl = `/icons/${type.toLowerCase().replace('_', '-')}.svg`;

  return new Icon({
    iconUrl,
    iconSize,
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Helper function to create marker icons based on location type
export const createMarkerIcon = (location: Location): Icon => {
  return getMarkerIcon(location.type);
};