import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapIcon, Pin } from "lucide-react";
import type { Location } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useState } from 'react';

const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

// Simple map coordinates for Hue's historical area
const MAP_BOUNDS = {
  minLat: 16.4454,
  maxLat: 16.4898,
  minLng: 107.5446,
  maxLng: 107.5978
};

function convertToPixel(lat: number, lng: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * MAP_WIDTH;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * MAP_HEIGHT;
  return { x, y };
}

export default function MapPage() {
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Bản đồ di tích Cố đô Huế</h1>
        <p className="text-muted-foreground mb-6">
          Khám phá vị trí các di tích lịch sử quan trọng trong khu vực Cố đô Huế
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-card rounded-lg overflow-hidden border">
            <div className="relative" style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
              {/* Base map image */}
              <img 
                src="/map-hue.jpg" 
                alt="Bản đồ Cố đô Huế"
                className="w-full h-full object-cover"
              />

              {/* Location markers */}
              <svg 
                className="absolute top-0 left-0 w-full h-full"
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                style={{ pointerEvents: 'none' }}
              >
                {locations.map(location => {
                  const pos = convertToPixel(
                    Number(location.latitude), 
                    Number(location.longitude)
                  );
                  return (
                    <g 
                      key={location.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      className="cursor-pointer"
                      style={{ pointerEvents: 'all' }}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <circle
                        r="6"
                        className="fill-primary"
                      />
                      <text
                        x="10"
                        y="4"
                        className="text-xs fill-foreground font-medium"
                      >
                        {location.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Location details sidebar */}
          <Card>
            <CardContent className="p-6">
              {selectedLocation ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Pin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{selectedLocation.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedLocation.description}
                  </p>
                  <img
                    src={selectedLocation.imageUrl}
                    alt={selectedLocation.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <MapIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chọn một địa điểm trên bản đồ để xem thông tin chi tiết</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import Map from "@/components/Map";

export default function MapPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Bản đồ số</h1>
      <p className="text-muted-foreground mb-6">
        Khám phá các di tích, danh lam thắng cảnh và địa điểm du lịch tại Huế
      </p>
      
      <Map />
    </div>
  );
}
