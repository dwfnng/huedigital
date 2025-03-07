import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LayersControl, LayerGroup } from 'react-leaflet';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Navigation, CornerDownLeft, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Location, InsertFavoriteRoute } from "@shared/schema";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES, createMarkerIcon } from "@/lib/mapUtils";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { apiRequest } from "@/lib/queryClient";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

interface MapProps {
  onMarkerClick?: (location: Location) => void;
}

// Validate coordinates
const isValidCoordinate = (lat: number, lng: number): boolean => {
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// Custom hook for routing control
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

export default function Map({ onMarkerClick }: MapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
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
    mutationFn: async (route: InsertFavoriteRoute) => {
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
    const originalSrc = img.src;
    const location = locations.find(loc => loc.imageUrl === originalSrc);

    console.log('Image failed to load:', originalSrc);

    // Thử dùng proxy để tải hình ảnh
    const proxyUrl = 'https://corsproxy.io/?';

    if (!img.src.includes('corsproxy.io')) {
      // Thử tải lại với CORS proxy
      img.src = `${proxyUrl}${encodeURIComponent(originalSrc)}`;

      // Thêm loading skeleton
      const container = img.parentElement;
      if (container) {
        container.classList.add('animate-pulse');
      }

      // Thêm sự kiện load để xử lý khi hình ảnh tải thành công
      img.onload = () => {
        if (container) {
          container.classList.remove('animate-pulse');
        }
        img.style.opacity = '1';
      };

      // Thêm fallback khi proxy cũng không hoạt động
      img.onerror = () => {
        // Fallback images dựa trên loại địa điểm
        const fallbackImages = {
          palace: 'https://images.pexels.com/photos/5227440/pexels-photo-5227440.jpeg',
          temple: 'https://images.pexels.com/photos/5227442/pexels-photo-5227442.jpeg',
          tomb: 'https://images.pexels.com/photos/5227444/pexels-photo-5227444.jpeg',
          default: 'https://images.pexels.com/photos/2161449/pexels-photo-2161449.jpeg'
        };

        const type = location?.type || 'default';
        img.src = fallbackImages[type as keyof typeof fallbackImages] || fallbackImages.default;

        if (container) {
          container.classList.remove('animate-pulse');
        }
      };
    }

    // Thêm hiệu ứng loading và transition
    img.style.transition = 'opacity 0.3s ease-in-out';
    img.style.opacity = '0.7';
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
                    // Show loading toast
                    toast({
                      title: "Đang xác định vị trí",
                      description: "Vui lòng đợi trong giây lát...",
                    });

                    // Configure high accuracy options
                    const options = {
                      enableHighAccuracy: true,
                      timeout: 10000,
                      maximumAge: 0
                    };

                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const pos: [number, number] = [
                          position.coords.latitude,
                          position.coords.longitude,
                        ];

                        if (!isValidCoordinate(pos[0], pos[1])) {
                          toast({
                            title: "Lỗi",
                            description: "Không thể xác định chính xác vị trí của bạn.",
                            variant: "destructive"
                          });
                          return;
                        }

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
                            description: `Độ chính xác: ${Math.round(position.coords.accuracy)}m`,
                            descriptionEn: `Accuracy: ${Math.round(position.coords.accuracy)}m`,
                            latitude: pos[0].toString(),
                            longitude: pos[1].toString(),
                            imageUrl: '',
                            isActive: true
                          });

                          // Center map on current location with appropriate zoom based on accuracy
                          const map = document.querySelector('.leaflet-container')?._leaflet_map;
                          if (map) {
                            const zoomLevel = position.coords.accuracy < 100 ? 17 : 15;
                            map.flyTo(pos, zoomLevel);
                          }
                        }
                      },
                      (error) => {
                        console.error('Geolocation error:', error);
                        let errorMessage = "Không thể xác định vị trí của bạn.";

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

                        toast({
                          title: "Lỗi",
                          description: errorMessage,
                          variant: "destructive"
                        });
                      },
                      options
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
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted relative">
                      {/* Loading skeleton */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />

                      {/* Image with error handling */}
                      <img
                        src={location.imageUrl}
                        alt={location.name}
                        onError={handleImageError}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 relative z-10"
                        loading="lazy"
                        style={{
                          opacity: 0,
                          transition: 'opacity 0.3s ease-in-out'
                        }}
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          img.style.opacity = '1';
                        }}
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
              {locations.map(location => {
                const lat = parseFloat(location.latitude);
                const lng = parseFloat(location.longitude);

                if (!isValidCoordinate(lat, lng)) {
                  console.warn(`Invalid coordinates for location ${location.id}:`, { lat, lng });
                  return null;
                }

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