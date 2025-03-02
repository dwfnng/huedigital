import Map from "@/components/Map";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Navigation, Layers } from "lucide-react";
import type { Location } from "@shared/schema";

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
        {/* Location sidebar */}
        <Card className="md:col-span-1 h-[calc(100vh-16rem)]">
          <CardContent className="p-4">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm địa điểm..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="icon" title="Lớp bản đồ">
                <Layers className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Vị trí của bạn">
                <Navigation className="h-4 w-4" />
              </Button>
            </div>

            {selectedLocation && (
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">{selectedLocation.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedLocation.description}</p>
                {selectedLocation.imageUrl && (
                  <img 
                    src={selectedLocation.imageUrl} 
                    alt={selectedLocation.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map */}
        <div className="md:col-span-2 h-[calc(100vh-16rem)]">
          <Map onMarkerClick={handleMarkerClick} />
        </div>
      </div>
    </div>
  );
}