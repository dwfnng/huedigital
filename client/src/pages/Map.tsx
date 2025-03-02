import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Navigation, Info, Camera } from 'lucide-react';
import type { Location } from "@shared/schema";
import Map from "@/components/Map";
import { toast } from "@/hooks/use-toast";

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    toast({
      title: location.name,
      description: "Đã chọn địa điểm. Cuộn xuống để xem thông tin chi tiết.",
    });
  };

  const handleImageLoadError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/attached_assets/placeholder-image.jpg';
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 slide-in">Bản đồ số</h1>
          <p className="text-muted-foreground slide-in" style={{ animationDelay: '0.1s' }}>
            Khám phá các di tích, danh lam thắng cảnh và địa điểm du lịch tại Huế
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Map area */}
        <div className="md:col-span-2 h-[calc(100vh-16rem)]">
          <Map onMarkerClick={handleMarkerClick} />
        </div>

        {/* Location details */}
        <Card className="md:col-span-1 h-[calc(100vh-16rem)] overflow-hidden glass">
          <CardContent className="p-4 h-full overflow-auto custom-scrollbar">
            {selectedLocation ? (
              <div className="space-y-6">
                <div className="w-full aspect-video relative rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={selectedLocation.imageUrl} 
                    alt={selectedLocation.name}
                    onError={handleImageLoadError}
                    className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <p className="text-sm opacity-90">{selectedLocation.type.replace('_', ' ')}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-2">{selectedLocation.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{selectedLocation.nameEn}</p>

                  <div className="prose prose-sm max-w-none">
                    <p>{selectedLocation.description}</p>
                    <p className="text-muted-foreground">{selectedLocation.descriptionEn}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`, '_blank');
                  }}>
                    <Navigation className="mr-2 h-4 w-4" />
                    Chỉ đường
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Camera className="mr-2 h-4 w-4" />
                    Ảnh 360°
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Info className="mr-2 h-4 w-4" />
                    Chi tiết
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                <div>
                  <MapPin className="h-8 w-8 mx-auto mb-3" />
                  <p>Chọn một địa điểm trên bản đồ để xem thông tin chi tiết</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}