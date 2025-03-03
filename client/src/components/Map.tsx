import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { Location } from "@shared/schema";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "@/components/ui/use-toast";
import { DEFAULT_CENTER } from "@/lib/mapUtils";

// Fix Leaflet icon issue with webpack
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const getMarkerIcon = (type: string) => {
  // Có thể tùy chỉnh icon dựa trên loại địa điểm
  return DefaultIcon;
};

interface MapProps {
  onMarkerClick?: (location: Location) => void;
}

export default function Map({ onMarkerClick }: MapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    if (onMarkerClick) {
      onMarkerClick(location);
    }
  };

  useEffect(() => {
    if (locations && searchQuery) {
      const filtered = locations.filter(loc =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  }, [searchQuery, locations]);

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/50 rounded-lg">
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">{mapError}</p>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[parseFloat(location.latitude), parseFloat(location.longitude)]}
            eventHandlers={{
              click: () => {
                handleLocationSelect(location);
              },
            }}
          >
            <Popup>
              <div>
                <h3 className="font-medium">{location.name}</h3>
                <p className="text-sm text-muted-foreground">{location.type}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Search box */}
      <div className="absolute top-4 left-4 right-4 z-[1000] max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm địa điểm..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="absolute left-3 top-2.5">
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        {filteredLocations.length > 0 && (
          <Card className="mt-1 max-h-60 overflow-auto">
            <CardContent className="p-1">
              <ul>
                {filteredLocations.map(location => (
                  <li
                    key={location.id}
                    className="py-2 px-3 hover:bg-muted rounded-sm cursor-pointer"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <p className="font-medium">{location.name}</p>
                    <p className="text-xs text-muted-foreground">{location.type}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}