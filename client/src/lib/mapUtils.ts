import type { Location } from "@shared/schema";

export const DEFAULT_CENTER = { lat: 16.4637, lng: 107.5909 };
export const DEFAULT_ZOOM = 14;

export const MAP_STYLES = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      { color: "#f5f5f5" },
      { lightness: 20 }
    ]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      { color: "#e9e9e9" },
      { lightness: 17 }
    ]
  }
];

export const getMarkerIcon = (type: string): string => {
  switch (type) {
    case "heritage_site":
      return "🏛️";
    case "temple":
      return "⛩️";
    case "palace":
      return "🏰";
    case "tomb":
      return "🗿";
    case "monument":
      return "🏛️";
    case "museum":
      return "🏛️";
    case "communal_house":
      return "🏤";
    case "education":
      return "🏫";
    case "ritual":
      return "⛩️";
    case "government":
      return "🏛️";
    default:
      return "📍";
  }
};

export interface MapOptions extends google.maps.MapOptions {
  styles?: google.maps.MapTypeStyle[];
}

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export const calculateRoute = (
  origin: LatLngLiteral,
  destination: LatLngLiteral,
  directionsService: google.maps.DirectionsService,
  callback: (result: google.maps.DirectionsResult | null) => void
): void => {
  directionsService.route(
    {
      origin,
      destination,
      travelMode: google.maps.TravelMode.WALKING,
    },
    (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        callback(result);
      } else {
        callback(null);
      }
    }
  );
};