import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Navigation } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Location } from "@shared/schema";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES, createMarkerIcon } from "@/lib/mapUtils";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/icons/marker-icon-2x.png',
  iconUrl: '/icons/marker-icon.png',
  shadowUrl: '/icons/marker-shadow.png',
});

interface MapProps {
  onMarkerClick?: (location: Location) => void;
}

function FlyToMarker({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 17);
  }, [map, position]);
  return null;
}

export default function Map({ onMarkerClick }: MapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

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
                        const pos: [number, number] = [
                          position.coords.latitude,
                          position.coords.longitude,
                        ];
                        setSelectedLocation({
                          id: 'current-location',
                          name: 'Vị trí của bạn',
                          nameEn: 'Your location',
                          type: 'current_location',
                          description: '',
                          descriptionEn: '',
                          latitude: pos[0].toString(),
                          longitude: pos[1].toString(),
                          imageUrl: ''
                        });
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
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              url={MAP_STYLES.url}
              attribution={MAP_STYLES.attribution}
            />
            {locations.map(location => (
              <Marker
                key={location.id}
                position={[parseFloat(location.latitude), parseFloat(location.longitude)]}
                icon={createMarkerIcon(location)}
                eventHandlers={{
                  click: () => handleLocationSelect(location)
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-medium">{location.name}</h3>
                    <p className="text-muted-foreground">{location.nameEn}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {selectedLocation && (
              <FlyToMarker 
                position={[
                  parseFloat(selectedLocation.latitude),
                  parseFloat(selectedLocation.longitude)
                ]} 
              />
            )}
          </MapContainer>
        </CardContent>
      </Card>
    </div>
  );
}