import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Navigation, Layers, MapPin } from "lucide-react";
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
      <Card className="md:col-span-1 h-full overflow-hidden">
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

          <div className="locations-list overflow-auto h-[calc(100%-5rem)] p-3">
            <div className="divide-y">
              {filteredLocations.map((location) => (
                <div 
                  key={location.id}
                  className={`py-3 cursor-pointer transition-colors duration-200 ${
                    selectedLocation?.id === location.id ? 'bg-secondary/30' : 'hover:bg-secondary/10'
                  }`}
                  onClick={() => handleLocationSelect(location)}
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
                        <span className="text-xs text-muted-foreground capitalize">
                          {location.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 h-full">
        <CardContent className="p-0 h-full relative">
          <div className="absolute inset-0 bg-muted/30 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Bản đồ đang được cập nhật...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}