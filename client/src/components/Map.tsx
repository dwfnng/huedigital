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
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, Search, Navigation, Layers, 
  Info, Phone, Clock, ExternalLink 
} from "lucide-react";
import type { Location } from "@shared/schema";

interface MapProps {
  className?: string;
}

export default function Map({ className }: MapProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  
  useEffect(() => {
    // Fetch locations from API
    fetch("/api/locations")
      .then(response => response.json())
      .then(data => {
        setLocations(data);
        setFilteredLocations(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
        setIsLoading(false);
      });
  }, []);
  
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
  
  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
  };
  
  const handleOpenGoogleMaps = (location: Location) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`,
      "_blank"
    );
  };
  
  const renderLocationTypeIcon = (type: string) => {
    switch (type) {
      case "historical_site":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "restaurant":
        return <Phone className="h-4 w-4 text-orange-500" />;
      case "hotel":
        return <Clock className="h-4 w-4 text-green-500" />;
      default:
        return <MapPin className="h-4 w-4 text-primary" />;
    }
  };
  
  return (
    <div className={`map-container h-[calc(100vh-10rem)] flex flex-col ${className}`}>
      <div className="flex gap-2 mb-4">
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
        <Button variant="outline" size="icon" title="Vị trí của bạn">
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 flex-1 h-full">
        <Card className="md:col-span-1 h-full overflow-hidden">
          <CardContent className="p-0 h-full">
            <div className="locations-list overflow-auto h-full p-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">Đang tải địa điểm...</p>
                </div>
              ) : filteredLocations.length > 0 ? (
                <div className="divide-y">
                  {filteredLocations.map((location) => (
                    <div 
                      key={location.id}
                      className={`py-3 cursor-pointer transition-colors duration-200 ${
                        selectedLocation?.id === location.id ? 'bg-secondary/30' : 'hover:bg-secondary/10'
                      }`}
                      onClick={() => handleSelectLocation(location)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{location.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {location.nameEn}
                          </p>
                          <div className="flex items-center mt-1">
                            {renderLocationTypeIcon(location.type)}
                            <span className="text-xs text-muted-foreground ml-1 capitalize">
                              {location.type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">Không tìm thấy địa điểm nào</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 h-full overflow-hidden flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            {selectedLocation ? (
              <div className="h-full flex flex-col">
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img 
                    src={selectedLocation.imageUrl} 
                    alt={selectedLocation.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/placeholder-image.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h2 className="text-xl font-bold">{selectedLocation.name}</h2>
                      <p className="text-sm opacity-90">{selectedLocation.nameEn}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex-1 overflow-auto">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Mô tả</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedLocation.description}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedLocation.descriptionEn}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={() => handleOpenGoogleMaps(selectedLocation)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Mở Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-4">
                <div className="bg-muted/30 rounded-full p-4 mb-4">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-1">Chọn một địa điểm</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Hãy chọn một địa điểm từ danh sách bên trái để xem thông tin chi tiết và vị trí trên bản đồ.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
