import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Location } from "@shared/schema";
import { DEFAULT_CENTER, DEFAULT_ZOOM, getMarkerIcon } from "@/lib/mapUtils";

interface MapProps {
  onMarkerClick: (location: Location) => void;
}

export default function Map({ onMarkerClick }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map>();
  const markersRef = useRef<google.maps.Marker[]>([]);

  const { data: locations } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  useEffect(() => {
    if (!mapRef.current) return;

    const mapOptions: google.maps.MapOptions = {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    };

    mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);

    // Initialize user location tracking
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          new google.maps.Marker({
            position: userLocation,
            map: mapInstanceRef.current,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (!locations || !mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    locations.forEach((location) => {
      const marker = new google.maps.Marker({
        position: { lat: Number(location.latitude), lng: Number(location.longitude) },
        map: mapInstanceRef.current,
        title: location.name,
        label: getMarkerIcon(location.type),
      });

      marker.addListener("click", () => onMarkerClick(location));
      markersRef.current.push(marker);
    });
  }, [locations, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[calc(100vh-4rem)] rounded-lg overflow-hidden"
    />
  );
}
