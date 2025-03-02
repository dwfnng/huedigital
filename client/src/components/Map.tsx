import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Navigation, Layers, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Location } from "@shared/schema";
import { Loader } from "@googlemaps/js-api-loader";
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES, getMarkerIcon } from "@/lib/mapUtils";

interface MapProps {
  onMarkerClick?: (location: Location) => void;
}

export default function Map({ onMarkerClick }: MapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["places"]
        });

        const google = await loader.load();

        if (!mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          styles: MAP_STYLES,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          gestureHandling: "cooperative"
        });

        const directionsRenderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          preserveViewport: true
        });

        setMap(map);
        setDirectionsRenderer(directionsRenderer);
        setMapError(null);
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setMapError("Không thể tải bản đồ. Vui lòng thử lại sau.");
        toast({
          title: "Lỗi",
          description: "Không thể tải bản đồ. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!map || !locations.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add markers for all locations
    locations.forEach(location => {
      const position = {
        lat: parseFloat(location.latitude),
        lng: parseFloat(location.longitude)
      };

      const marker = new google.maps.Marker({
        position,
        map,
        title: location.name,
        icon: getMarkerIcon(location.type),
        animation: google.maps.Animation.DROP
      });

      marker.addListener("click", () => {
        handleLocationSelect(location);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [map, locations]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLocations(locations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = locations.filter(location => 
        location.name.toLowerCase().includes(query) ||
        location.nameEn.toLowerCase().includes(query) ||
        location.description.toLowerCase().includes(query) ||
        location.descriptionEn.toLowerCase().includes(query)
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery, locations]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    const position = {
      lat: parseFloat(location.latitude),
      lng: parseFloat(location.longitude)
    };

    if (map) {
      map.panTo(position);
      map.setZoom(17);
    }

    if (onMarkerClick) {
      onMarkerClick(location);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/images/placeholder-location.jpg';
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
                      () => {
                        toast({
                          title: "Lỗi",
                          description: "Không thể xác định vị trí của bạn.",
                          variant: "destructive"
                        });
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
                  className={`p-3 cursor-pointer transition-all hover:bg-primary/5 ${
                    selectedLocation?.id === location.id ? 'bg-primary/10' : ''
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
          {mapError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center p-4">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">{mapError}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Tải lại trang
                </Button>
              </div>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}