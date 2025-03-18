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
    <div className="container mx-auto p-4 relative">
      {/* Họa tiết nền */}
      <div className="absolute inset-0 bg-[url('/imperial-pattern.svg')] bg-repeat opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-[url('/corner-decoration.svg')] bg-no-repeat opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-[url('/corner-decoration.svg')] bg-no-repeat transform scale-x-[-1] opacity-10 pointer-events-none"></div>
      
      <div className="page-header relative z-10">
        <div className="bg-[#B5935A] rounded-lg px-6 py-4 mb-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black mb-1 flex items-center">
                <MapPin className="h-6 w-6 mr-2" />
                Bản đồ số
              </h1>
              <p className="text-black/90">
                Khám phá các di tích, danh lam thắng cảnh và địa điểm du lịch tại Huế
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative max-w-xs">
                <div className="flex">
                  <Input
                    type="text"
                    placeholder="Tìm địa điểm..."
                    className="border border-amber-300 rounded-l-lg bg-amber-50/70 text-black placeholder-amber-800/50 focus:outline-none focus:ring-2 focus:ring-[#B5935A]"
                  />
                  <Button className="bg-amber-700 text-black font-medium rounded-r-lg hover:bg-amber-800">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
