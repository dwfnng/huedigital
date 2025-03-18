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
      <div className="page-header">
        <div className="page-header-content bg-[#B5935A]/10 p-6 rounded-lg border border-[#B5935A]/20 mb-6">
          <h1 className="text-2xl font-bold mb-2 text-[#B5935A]">Bản đồ số</h1>
          <p className="text-[#B5935A]/80">
            Khám phá các di tích, danh lam thắng cảnh và địa điểm du lịch tại Huế
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Map area */}
        <div className="md:col-span-2 h-[calc(100vh-16rem)]">
          <Map onMarkerClick={handleMarkerClick} />
        </div>

        {/* Location details */}
        <Card className="md:col-span-1 h-[calc(100vh-16rem)] border border-[#B5935A]/20 shadow-md">
          <CardContent className="p-4 bg-[#B5935A]/5">
            {selectedLocation ? (
              <div className="space-y-4">
                <div className="w-full h-48 relative rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={selectedLocation.imageUrl} 
                    alt={selectedLocation.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="content-section">
                  <h2 className="text-xl font-semibold text-[#B5935A]">{selectedLocation.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedLocation.nameEn}</p>
                  <div className="text-sm text-muted-foreground mt-2">
                    <strong className="text-[#B5935A]">Loại di tích:</strong> {selectedLocation.type}
                  </div>
                  <p className="text-sm mt-3">{selectedLocation.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">{selectedLocation.descriptionEn}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center content-section">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto text-[#B5935A]/60 mb-4" />
                  <p className="text-muted-foreground">Chọn một địa điểm trên bản đồ để xem thông tin chi tiết</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
