import type { Location } from "@shared/schema";
import { Icon } from 'leaflet';

export const DEFAULT_CENTER: [number, number] = [16.4637, 107.5909];
export const DEFAULT_ZOOM = 15;

export const MAP_STYLES = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Helper function to get icon configuration based on location type
const getIconConfig = (type: string): { color: string, size: number } => {
  switch (type) {
    case 'heritage_site':
      return { color: 'red', size: 35 };
    case 'museum':
      return { color: 'green', size: 35 };
    case 'temple':
      return { color: 'gold', size: 35 };
    case 'palace':
      return { color: 'purple', size: 35 };
    case 'education':
      return { color: 'blue', size: 35 };
    default:
      return { color: 'blue', size: 30 };
  }
};

// Helper function to create marker icons based on location type
export const createMarkerIcon = (location: Location): Icon => {
  const config = getIconConfig(location.type);
  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${config.color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [config.size, config.size * 1.5],
    iconAnchor: [config.size/2, config.size * 1.5],
    popupAnchor: [0, -config.size],
    shadowSize: [config.size * 1.5, config.size * 1.5]
  });
};