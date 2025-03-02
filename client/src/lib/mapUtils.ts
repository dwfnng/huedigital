import type { Location } from "@shared/schema";

export const DEFAULT_CENTER = { lat: 16.4637, lng: 107.5909 };
export const DEFAULT_ZOOM = 14;

export const getMarkerIcon = (type: string) => {
  switch (type) {
    case "historical_site":
      return "🏛️";
    case "restaurant":
      return "🍽️";
    case "hotel":
      return "🏨";
    case "restroom":
      return "🚻";
    case "parking":
      return "🅿️";
    default:
      return "📍";
  }
};

export const calculateRoute = (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral,
  directionsService: google.maps.DirectionsService,
  callback: (result: google.maps.DirectionsResult | null) => void
) => {
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
