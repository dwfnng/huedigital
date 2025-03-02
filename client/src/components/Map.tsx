import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Navigation, Layers, MapPin, Info, Camera } from "lucide-react";
import type { Location } from "@shared/schema";
import { Loader } from "@googlemaps/js-api-loader";
import { DEFAULT_CENTER, DEFAULT_ZOOM, getMarkerIcon } from "@/lib/mapUtils";

interface MapProps {
  onMarkerClick?: (location: Location) => void;
}

export default function Map({ onMarkerClick }: MapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
      });

      try {
        const google = await loader.load();
        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
          });
          setMap(map);
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initMap();
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map || !locations.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    locations.forEach(location => {
      const marker = new google.maps.Marker({
        position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
        map,
        title: location.name,
        animation: google.maps.Animation.DROP,
      });

      marker.addListener("click", () => {
        handleLocationSelect(location);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [map, locations]);

  // Filter locations based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLocations(locations);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = locations.filter(location => 
        location.name.toLowerCase().includes(lowercasedQuery) ||
        location.nameEn.toLowerCase().includes(lowercasedQuery) ||
        location.description.toLowerCase().includes(lowercasedQuery) ||
        location.descriptionEn.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery, locations]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    if (map) {
      map.panTo({ lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) });
      map.setZoom(17);
    }
    if (onMarkerClick) {
      onMarkerClick(location);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/attached_assets/placeholder-image.jpg';
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 h-full">
      <Card className="md:col-span-1 h-full overflow-hidden glass">
        <CardContent className="p-0 h-full">
          <div className="p-4 border-b">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm địa điểm..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" title="Lớp bản đồ">
                <Layers className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                title="Vị trí của bạn"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const pos = {
                          lat: position.coords.latitude,
                          lng: position.coords.longitude,
                        };
                        if (map) {
                          map.panTo(pos);
                          map.setZoom(15);
                        }
                      },
                      (error) => {
                        console.error("Error getting location:", error);
                      }
                    );
                  }
                }}
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-5rem)] custom-scrollbar">
            <div className="divide-y">
              {filteredLocations.map((location, index) => (
                <div 
                  key={location.id}
                  className={`p-3 cursor-pointer transition-all duration-300 slide-in ${
                    selectedLocation?.id === location.id ? 'bg-primary/10' : 'hover:bg-primary/5'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={location.imageUrl}
                        alt={location.name}
                        onError={handleImageError}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{location.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {location.nameEn}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 rounded-full bg-primary/5">
                          {location.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 h-full overflow-hidden glass">
        <CardContent className="p-0 h-full relative">
          <div ref={mapRef} className="w-full h-full" />
        </CardContent>
      </Card>
    </div>
  );
}