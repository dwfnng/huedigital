import type { Location } from "@shared/schema";

// Updated coordinates for Hue City center
export const DEFAULT_CENTER = { lat: 16.4637, lng: 107.5909 };
export const DEFAULT_ZOOM = 15;

export const MAP_STYLES = [
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#000000" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      { color: "#b9d3c2" },
      { lightness: 40 }
    ]
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
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      { color: "#c5dac6" },
      { lightness: 20 }
    ]
  },
  {
    featureType: "poi.historic",
    elementType: "labels",
    stylers: [{ visibility: "on" }]
  }
];

export const getMarkerIcon = (type: string): {
  url: string;
  scaledSize: { width: number; height: number };
} => {
  const baseSize = { width: 32, height: 32 };
  const iconPath = (name: string) => `/icons/${name}.svg`;

  switch (type.toLowerCase()) {
    case "heritage_site":
      return { url: iconPath("heritage"), scaledSize: baseSize };
    case "temple":
      return { url: iconPath("temple"), scaledSize: baseSize };
    case "palace":
      return { url: iconPath("palace"), scaledSize: baseSize };
    case "tomb":
      return { url: iconPath("tomb"), scaledSize: baseSize };
    case "monument":
      return { url: iconPath("monument"), scaledSize: baseSize };
    case "museum":
      return { url: iconPath("museum"), scaledSize: baseSize };
    case "education":
      return { url: iconPath("education"), scaledSize: baseSize };
    default:
      return { url: iconPath("default"), scaledSize: baseSize };
  }
};

export interface MapOptions extends google.maps.MapOptions {
  styles?: google.maps.MapTypeStyle[];
}

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export const calculateRoute = async (
  origin: LatLngLiteral,
  destination: LatLngLiteral,
  directionsService: google.maps.DirectionsService
): Promise<google.maps.DirectionsResult | null> => {
  return new Promise((resolve) => {
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.WALKING,
        optimizeWaypoints: true,
        provideRouteAlternatives: true
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          resolve(result);
        } else {
          console.error("Directions request failed:", status);
          resolve(null);
        }
      }
    );
  });
};