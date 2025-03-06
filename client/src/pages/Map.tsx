import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
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

  // Improved image error handling
  const handleImageLoadError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const fallbackUrl = 'https://placehold.co/600x400/f1f5f9/64748b?text=Di+tich+Hue';

    if (!img.src.includes('placehold.co')) {
      img.src = fallbackUrl;
      img.alt = 'Hình ảnh tạm thời';
      img.style.transition = 'opacity 0.3s ease-in-out';
      img.style.opacity = '0.9';
    }
  };

  return (
    <div className="container mx-auto p-2 md:p-4">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 slide-in">Bản đồ số</h1>
          <p className="text-sm md:text-base text-muted-foreground slide-in" style={{ animationDelay: '0.1s' }}>
            Khám phá các di tích, danh lam thắng cảnh và địa điểm du lịch tại Huế
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Map area */}
        <div className="md:col-span-2 h-[60vh] md:h-[70vh] rounded-lg overflow-hidden">
          <Map onMarkerClick={handleMarkerClick} />
        </div>

        {/* Location details */}
        <Card className="md:col-span-1 h-[60vh] md:h-[70vh] overflow-hidden glass">
          <CardContent className="p-3 md:p-4 h-full overflow-auto custom-scrollbar">
            {selectedLocation ? (
              <div className="space-y-4">
                <div className="w-full aspect-video relative rounded-lg overflow-hidden bg-muted">
                  {/* Add loading skeleton */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                  <img 
                    src={selectedLocation.imageUrl} 
                    alt={selectedLocation.name}
                    onError={handleImageLoadError}
                    className="relative z-10 w-full h-full object-cover transition-transform hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <p className="text-sm opacity-90">{selectedLocation.type.replace('_', ' ')}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2">{selectedLocation.name}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{selectedLocation.nameEn}</p>

                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm">{selectedLocation.description}</p>
                    <p className="text-sm text-muted-foreground mt-2">{selectedLocation.descriptionEn}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.latitude},${selectedLocation.longitude}`, '_blank');
                  }}>
                    <Navigation className="mr-2 h-4 w-4" />
                    Chỉ đường
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Camera className="mr-2 h-4 w-4" />
                    Ảnh 360°
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Info className="mr-2 h-4 w-4" />
                    Chi tiết
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                <div>
                  <MapPin className="h-8 w-8 mx-auto mb-3" />
                  <p className="text-sm">Chọn một địa điểm trên bản đồ để xem thông tin chi tiết</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}