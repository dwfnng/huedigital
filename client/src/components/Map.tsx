import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayersControl, LayerGroup } from 'react-leaflet';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Navigation, CornerDownLeft, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Location } from "@shared/schema";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES, createMarkerIcon } from "@/lib/mapUtils";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { motion, AnimatePresence } from "framer-motion";

// Custom hook for routing control
function useRoutingControl(map: L.Map | null, start?: [number, number], end?: [number, number]) {
  useEffect(() => {
    if (!map || !start || !end) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: true,
      showAlternatives: true,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#6366f1', weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      altLineOptions: {
        styles: [{ color: '#94a3b8', weight: 3, opacity: 0.7 }]
      },
      createMarker: () => null // Don't create markers for waypoints
    }).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map, start, end]);
}

function RoutingMachine({ start, end }: { start?: [number, number]; end?: [number, number] }) {
  const map = useMap();
  useRoutingControl(map, start, end);
  return null;
}

function FlyToMarker({ position, zoom = 17 }: { position: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, zoom, {
      duration: 1,
      easeLinearity: 0.25
    });
  }, [map, position, zoom]);
  return null;
}

export default function Map({ onMarkerClick }: { onMarkerClick?: (location: Location) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [startLocation, setStartLocation] = useState<[number, number] | undefined>();
  const [endLocation, setEndLocation] = useState<[number, number] | undefined>();
  const [isRoutingMode, setIsRoutingMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const memoizedFilteredLocations = useMemo(() => {
    if (searchQuery.trim() === "") return locations;

    const query = searchQuery.toLowerCase();
    return locations.filter(location =>
      location.name.toLowerCase().includes(query) ||
      location.nameEn.toLowerCase().includes(query) ||
      location.description.toLowerCase().includes(query) ||
      location.descriptionEn.toLowerCase().includes(query)
    );
  }, [searchQuery, locations]);

  useEffect(() => {
    setFilteredLocations(memoizedFilteredLocations);
  }, [memoizedFilteredLocations]);

  const handleLocationSelect = (location: Location) => {
    const position: [number, number] = [parseFloat(location.latitude), parseFloat(location.longitude)];
    setActiveMarkerId(location.id);
    setSelectedLocation(location);

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

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: isFullScreen ? '1fr' : '300px 1fr',
    gap: '1rem',
    height: '100%',
    transition: 'all 0.3s ease-in-out'
  };

  return (
    <div style={containerStyle}>
      <AnimatePresence>
        {!isFullScreen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full overflow-hidden glass">
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
                      title={isFullScreen ? "Thu nhỏ bản đồ" : "Mở rộng bản đồ"}
                      onClick={() => setIsFullScreen(!isFullScreen)}
                    >
                      {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Vị trí của bạn"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              const pos: [number, number] = [position.coords.latitude, position.coords.longitude];
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
                                setActiveMarkerId('current-location');
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
                </div>
                <ScrollArea className="h-[calc(100%-5rem)] custom-scrollbar">
                  <div className="divide-y">
                    {filteredLocations.map((location, index) => (
                      <motion.div
                        key={location.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-3 cursor-pointer transition-all hover:bg-primary/5 ${
                          selectedLocation?.id === location.id ? 'bg-primary/10' : ''
                        }`}
                        onClick={() => handleLocationSelect(location)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                            <img
                              src={location.imageUrl || 'https://placehold.co/600x400/png?text=No+Image'}
                              alt={location.name}
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
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card 
        className="h-full overflow-hidden glass"
        style={{
          transition: 'all 0.3s ease-in-out',
          position: 'relative'
        }}
      >
        <CardContent className="p-0 h-full">
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            className="w-full h-full"
            zoomControl={false}
            ref={setMapRef}
          >
            <ZoomControl position="bottomright" />

            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 z-[1000] bg-background/80 backdrop-blur-sm"
              onClick={() => setIsFullScreen(!isFullScreen)}
            >
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Mặc định">
                <TileLayer
                  url={MAP_STYLES.default.url}
                  attribution={MAP_STYLES.attribution}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Chi tiết">
                <TileLayer
                  url={MAP_STYLES.detailed.url}
                  attribution={MAP_STYLES.attribution}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Vệ tinh">
                <TileLayer
                  url={MAP_STYLES.satellite.url}
                  attribution={MAP_STYLES.attribution}
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            <LayerGroup>
              {locations.map(location => (
                <Marker
                  key={location.id}
                  position={[parseFloat(location.latitude), parseFloat(location.longitude)]}
                  icon={createMarkerIcon(location)}
                  eventHandlers={{
                    click: () => {
                      handleLocationSelect(location);
                      setActiveMarkerId(location.id);
                    }
                  }}
                >
                  {(activeMarkerId === location.id || selectedLocation?.id === location.id) && (
                    <Popup
                      className="custom-popup"
                      closeButton={false}
                      autoClose={false}
                      closeOnClick={false}
                    >
                      <div className="text-sm p-2">
                        <h3 className="font-medium">{location.name}</h3>
                        <p className="text-xs text-muted-foreground">{location.nameEn}</p>
                      </div>
                    </Popup>
                  )}
                </Marker>
              ))}
            </LayerGroup>

            {selectedLocation && !isRoutingMode && (
              <FlyToMarker
                position={[
                  parseFloat(selectedLocation.latitude),
                  parseFloat(selectedLocation.longitude)
                ]}
                zoom={17}
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