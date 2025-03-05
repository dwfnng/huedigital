import type { Location } from "@shared/schema";
import { Icon } from 'leaflet';

// Updated coordinates for Hue City center
export const DEFAULT_CENTER: [number, number] = [16.4637, 107.5909];
export const DEFAULT_ZOOM = 15;

// Update map tile layer to use HTTPS
export const MAP_STYLES = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Update marker icon paths to use absolute URLs
const getIconUrl = (type: string): string => {
  switch (type) {
    case 'heritage_site':
      return 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
    case 'museum':
      return 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
    case 'temple':
      return 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png';
    case 'palace':
      return 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png';
    default:
      return 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
  }
};

// Helper function to create marker icons based on location type
export const createMarkerIcon = (location: Location): Icon => {
  return new Icon({
    iconUrl: getIconUrl(location.type),
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};