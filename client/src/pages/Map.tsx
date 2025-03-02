import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from 'lucide-react';
import type { Location } from "@shared/schema";
import Map from "@/components/Map";

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Bản đồ số</h1>
      <p className="text-muted-foreground mb-6">
        Khám phá các di tích, danh lam thắng cảnh và địa điểm du lịch tại Huế
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Map area */}
        <div className="md:col-span-2 h-[calc(100vh-16rem)]">
          <Map onMarkerClick={handleMarkerClick} />
        </div>

        {/* Location details */}
        <Card className="md:col-span-1 h-[calc(100vh-16rem)]">
          <CardContent className="p-4">
            {selectedLocation ? (
              <div className="space-y-4">
                <div className="w-full h-48 relative rounded-lg overflow-hidden">
                  <img 
                    src={selectedLocation.imageUrl} 
                    alt={selectedLocation.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold">{selectedLocation.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedLocation.nameEn}</p>
                <div className="text-sm text-muted-foreground">
                  <strong>Loại di tích:</strong> {selectedLocation.type}
                </div>
                <p className="text-sm">{selectedLocation.description}</p>
                <p className="text-sm text-muted-foreground">{selectedLocation.descriptionEn}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Chọn một địa điểm trên bản đồ để xem thông tin chi tiết</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Location {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  type: string;
  latitude: string;
  longitude: string;
  imageUrl: string;
  isActive: boolean;
}

export function Map() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['/api/locations'],
    queryFn: () => fetch('/api/locations').then(res => res.json())
  });

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getImagePath(imageUrl: string) {
    // Handle relative paths by making them absolute
    if (imageUrl.startsWith('/attached_assets')) {
      return imageUrl;
    }
    return imageUrl;
  }

  return (
    <div className="container py-6 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h1 className="text-2xl font-bold">Bản đồ số</h1>
          <p className="text-muted-foreground">Khám phá các di tích, danh lam thắng cảnh và địa điểm du lịch tại Huế</p>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm địa điểm..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredLocations.map(location => (
              <div 
                key={location.id} 
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors ${selectedLocation?.id === location.id ? 'bg-muted' : ''}`}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={getImagePath(location.imageUrl)}
                    alt={location.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const imgEl = e.target as HTMLImageElement;
                      imgEl.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"%3E%3Cpath fill="%23999" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{location.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {location.nameEn}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {location.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-muted/30 rounded-lg overflow-hidden relative min-h-[500px]">
          {selectedLocation ? (
            <>
              <div 
                className="relative w-full h-48 md:h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${getImagePath(selectedLocation.imageUrl)})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-xl font-bold">{selectedLocation.name}</h2>
                  <p className="text-sm opacity-90">{selectedLocation.nameEn}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>Loại di tích: {selectedLocation.type.replace('_', ' ')}</span>
                </div>
                <p className="mb-4">{selectedLocation.description}</p>
                <p className="text-sm text-muted-foreground">{selectedLocation.descriptionEn}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium text-lg">Chọn một địa điểm</h3>
                <p className="text-muted-foreground">Chọn một địa điểm từ danh sách để xem chi tiết</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Map;
