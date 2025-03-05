import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Navigation, CornerDownLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Location } from "@shared/schema";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES, createMarkerIcon } from "@/lib/mapUtils";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/icons/marker-icon-2x.png',
  iconUrl: '/icons/marker-icon.png',
  shadowUrl: '/icons/marker-shadow.png',
});

interface MapProps {
  onMarkerClick?: (location: Location) => void;
}

function RoutingMachine({ start, end }: { start?: [number, number]; end?: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: true,
      showAlternatives: true,
      lineOptions: {
        styles: [{ color: '#6366f1', weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      altLineOptions: {
        styles: [{ color: '#94a3b8', weight: 3, opacity: 0.7 }]
      }
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
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
  const [startLocation, setStartLocation] = useState<[number, number] | undefined>();
  const [endLocation, setEndLocation] = useState<[number, number] | undefined>();
  const [isRoutingMode, setIsRoutingMode] = useState(false);

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
    const position: [number, number] = [parseFloat(location.latitude), parseFloat(location.longitude)];

    if (isRoutingMode) {
      if (!startLocation) {
        setStartLocation(position);
        toast({
          title: "Điểm đi",
          description: `Đã chọn ${location.name} làm điểm bắt đầu`,
        });
      } else {
        setEndLocation(position);
        toast({
          title: "Điểm đến",
          description: `Đã chọn ${location.name} làm điểm kết thúc`,
        });
      }
    } else {
      setSelectedLocation(location);
      if (onMarkerClick) {
        onMarkerClick(location);
      }
    }
  };

  const resetRouting = () => {
    setStartLocation(undefined);
    setEndLocation(undefined);
    setIsRoutingMode(false);
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
                        if (isRoutingMode && !startLocation) {
                          setStartLocation(pos);
                          toast({
                            title: "Điểm đi",
                            description: "Đã chọn vị trí hiện tại làm điểm bắt đầu",
                          });
                        } else {
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
              <Button
                variant={isRoutingMode ? "default" : "outline"}
                size="icon"
                title="Chỉ đường"
                onClick={() => {
                  setIsRoutingMode(!isRoutingMode);
                  if (!isRoutingMode) {
                    toast({
                      title: "Chế độ chỉ đường",
                      description: "Chọn điểm bắt đầu và điểm kết thúc trên bản đồ",
                    });
                  } else {
                    resetRouting();
                  }
                }}
              >
                <CornerDownLeft className="h-4 w-4" />
              </Button>
            </div>
            {isRoutingMode && (
              <div className="mt-2 text-sm">
                <p className="text-muted-foreground">
                  {!startLocation 
                    ? "Chọn điểm bắt đầu" 
                    : !endLocation 
                    ? "Chọn điểm kết thúc"
                    : "Đã chọn cả hai điểm"}
                </p>
                {(startLocation || endLocation) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-xs"
                    onClick={resetRouting}
                  >
                    Đặt lại
                  </Button>
                )}
              </div>
            )}
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
            {selectedLocation && !isRoutingMode && (
              <FlyToMarker 
                position={[
                  parseFloat(selectedLocation.latitude),
                  parseFloat(selectedLocation.longitude)
                ]} 
              />
            )}
            {startLocation && endLocation && (
              <RoutingMachine start={startLocation} end={endLocation} />
            )}
          </MapContainer>
        </CardContent>
      </Card>
    </div>
  );
}