import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LayersControl, LayerGroup } from 'react-leaflet';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Navigation, CornerDownLeft, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Location } from "@shared/schema";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES, createMarkerIcon } from "@/lib/mapUtils";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { apiRequest } from "@/lib/queryClient";

// Validate if a location has valid data
const isValidLocation = (location: Location): boolean => {
  return (
    location.name?.trim() !== '' &&
    location.type?.trim() !== '' &&
    !isNaN(parseFloat(location.latitude)) &&
    !isNaN(parseFloat(location.longitude)) &&
    location.imageUrl?.trim() !== ''
  );
};

// Custom hook for location filtering
function useFilteredLocations(locations: Location[], searchQuery: string) {
  return locations.filter(location => {
    // First filter out invalid locations
    if (!isValidLocation(location)) {
      return false;
    }

    // Then apply search filter if query exists
    if (searchQuery.trim() === "") {
      return true;
    }

    const query = searchQuery.toLowerCase();
    return (
      location.name.toLowerCase().includes(query) ||
      location.nameEn.toLowerCase().includes(query) ||
      location.description.toLowerCase().includes(query) ||
      location.descriptionEn.toLowerCase().includes(query)
    );
  });
}

function useRoutingControl(map: L.Map | null, start?: [number, number], end?: [number, number]) {
  const [routingControl, setRoutingControl] = useState<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map || !start || !end) return;

    // Validate coordinates before creating routing
    if (!isValidCoordinate(start[0], start[1]) || !isValidCoordinate(end[0], end[1])) {
      console.error('Invalid coordinates:', { start, end });
      toast({
        title: "Lỗi",
        description: "Tọa độ không hợp lệ cho chỉ đường",
        variant: "destructive"
      });
      return;
    }

    // Remove existing routing control if any
    if (routingControl) {
      map.removeControl(routingControl);
    }

    try {
      const control = L.Routing.control({
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

      setRoutingControl(control);
    } catch (error) {
      console.error('Error creating routing control:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo tuyến đường. Vui lòng thử lại.",
        variant: "destructive"
      });
    }

    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, start, end]);

  return routingControl;
}

function RoutingMachine({ start, end }: { start?: [number, number]; end?: [number, number] }) {
  const map = useMap();
  useRoutingControl(map, start, end);
  return null;
}

function FlyToMarker({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (position && isValidCoordinate(position[0], position[1])) {
      map.flyTo(position, 17);
    }
  }, [map, position]);
  return null;
}

// Validate coordinates
const isValidCoordinate = (lat: number, lng: number): boolean => {
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Trình duyệt không hỗ trợ định vị"));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

export default function Map({ onMarkerClick }: { onMarkerClick?: (location: Location) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [startLocation, setStartLocation] = useState<[number, number] | undefined>();
  const [endLocation, setEndLocation] = useState<[number, number] | undefined>();
  const [isRoutingMode, setIsRoutingMode] = useState(false);
  const [isSaveRouteDialogOpen, setIsSaveRouteDialogOpen] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const queryClient = useQueryClient();

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  // Use the custom hook for filtered locations
  const filteredLocations = useFilteredLocations(locations, searchQuery);

  const handleLocationSelect = (location: Location) => {
    try {
      const latitude = parseFloat(location.latitude);
      const longitude = parseFloat(location.longitude);

      if (!isValidCoordinate(latitude, longitude)) {
        console.error('Invalid coordinates:', location);
        toast({
          title: "Lỗi",
          description: "Tọa độ địa điểm không hợp lệ",
          variant: "destructive"
        });
        return;
      }

      const position: [number, number] = [latitude, longitude];

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
    } catch (error) {
      console.error('Error handling location selection:', error);
      toast({
        title: "Lỗi",
        description: "Không thể chọn địa điểm. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const { data: favoriteRoutes = [] } = useQuery({
    queryKey: ["/api/favorite-routes"],
  });

  const saveRouteMutation = useMutation({
    mutationFn: async (route: any) => { // Updated type to any for flexibility
      const response = await apiRequest("/api/favorite-routes", {
        method: "POST",
        body: JSON.stringify(route),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorite-routes"] });
      toast({
        title: "Lưu thành công",
        description: "Tuyến đường đã được lưu vào danh sách yêu thích",
      });
      setIsSaveRouteDialogOpen(false);
      setRouteName("");
      setRouteDescription("");
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể lưu tuyến đường. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    },
  });


  const handleSaveRoute = () => {
    if (!startLocation || !endLocation) return;

    const routeData = {
      start: startLocation,
      end: endLocation,
    };

    saveRouteMutation.mutate({
      name: routeName,
      description: routeDescription,
      startLocationId: 1, // We'll need to get the actual location IDs
      endLocationId: 2,
      routeData,
    });
  };

  const resetRouting = () => {
    setStartLocation(undefined);
    setEndLocation(undefined);
    setIsRoutingMode(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const container = img.parentElement;

    // Hide the image container if image fails to load
    if (container) {
      container.style.display = 'none';
    }
  };

  const handleLocationClick = async () => {
    try {
      toast({
        title: "Đang xác định vị trí",
        description: "Vui lòng đợi trong giây lát...",
      });

      const position = await getCurrentPosition();
      const { latitude, longitude, accuracy } = position.coords;

      if (!isValidCoordinate(latitude, longitude)) {
        throw new Error("Tọa độ không hợp lệ");
      }

      const pos: [number, number] = [latitude, longitude];

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
          description: `Độ chính xác: ${Math.round(accuracy)}m`,
          descriptionEn: `Accuracy: ${Math.round(accuracy)}m`,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          imageUrl: '',
          isActive: true
        });

        // Center map with appropriate zoom based on accuracy
        const map = document.querySelector('.leaflet-container')?._leaflet_map;
        if (map) {
          const zoomLevel = accuracy < 100 ? 17 : 15;
          map.flyTo(pos, zoomLevel);
        }
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      let errorMessage = "Không thể xác định vị trí của bạn.";

      if (error instanceof GeolocationPositionError) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Vui lòng cho phép truy cập vị trí để sử dụng tính năng này.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Không thể xác định vị trí. Vui lòng thử lại sau.";
            break;
          case error.TIMEOUT:
            errorMessage = "Hết thời gian chờ xác định vị trí. Vui lòng thử lại.";
            break;
        }
      }

      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive"
      });
    }
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
                onClick={handleLocationClick}
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
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={resetRouting}
                    >
                      Đặt lại
                    </Button>
                    {startLocation && endLocation && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1"
                        onClick={() => setIsSaveRouteDialogOpen(true)}
                      >
                        <Star className="h-3 w-3" />
                        Lưu tuyến đường
                      </Button>
                    )}
                  </div>
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
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="flex items-start gap-3">
                    {location.imageUrl && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted relative">
                        <img
                          src={location.imageUrl}
                          alt={location.name}
                          onError={handleImageError}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
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
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  url={MAP_STYLES.default.url}
                  attribution={MAP_STYLES.attribution}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite">
                <TileLayer
                  url={MAP_STYLES.satellite.url}
                  attribution={MAP_STYLES.attribution}
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            <LayerGroup>
              {filteredLocations.map(location => {
                const lat = parseFloat(location.latitude);
                const lng = parseFloat(location.longitude);

                return (
                  <Marker
                    key={location.id}
                    position={[lat, lng]}
                    icon={createMarkerIcon(location)}
                    eventHandlers={{
                      click: () => handleLocationSelect(location)
                    }}
                  >
                    <Popup className="custom-popup">
                      <div className="text-sm">
                        <h3 className="font-medium text-center">{location.name}</h3>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </LayerGroup>
            {selectedLocation && !isRoutingMode && isValidCoordinate(parseFloat(selectedLocation.latitude), parseFloat(selectedLocation.longitude)) && (
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

      <Dialog open={isSaveRouteDialogOpen} onOpenChange={setIsSaveRouteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lưu tuyến đường</DialogTitle>
            <DialogDescription>
              Đặt tên và mô tả cho tuyến đường để lưu vào danh sách yêu thích
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="route-name">Tên tuyến đường</Label>
              <Input
                id="route-name"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="Ví dụ: Đường đến Đại Nội"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="route-description">Mô tả (tùy chọn)</Label>
              <Textarea
                id="route-description"
                value={routeDescription}
                onChange={(e) => setRouteDescription(e.target.value)}
                placeholder="Thêm ghi chú về tuyến đường này"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsSaveRouteDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSaveRoute}
                disabled={!routeName.trim()}
              >
                Lưu lại
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}