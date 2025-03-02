import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Navigation, Layers, MapPin, Info, Camera } from "lucide-react";
import type { Location } from "@shared/schema";

interface MapProps {
  onMarkerClick?: (location: Location) => void;
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
    if (onMarkerClick) {
      onMarkerClick(location);
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
              <Button variant="outline" size="icon" title="Lớp bản đồ">
                <Layers className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Vị trí của bạn">
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
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={location.imageUrl}
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
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 h-full overflow-hidden glass">
        <CardContent className="p-0 h-full relative">
          {selectedLocation ? (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm p-6 overflow-auto custom-scrollbar">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <img
                    src={selectedLocation.imageUrl}
                    alt={selectedLocation.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="absolute bottom-0 p-6 text-white">
                      <h2 className="text-2xl font-bold mb-2">{selectedLocation.name}</h2>
                      <p className="text-sm opacity-90">{selectedLocation.nameEn}</p>
                    </div>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground">{selectedLocation.description}</p>
                  <p className="text-muted-foreground">{selectedLocation.descriptionEn}</p>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="gap-2">
                    <Camera className="h-4 w-4" />
                    Thư viện ảnh
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Info className="h-4 w-4" />
                    Thông tin thêm
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-muted/30 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Chọn một địa điểm để xem thông tin chi tiết</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}