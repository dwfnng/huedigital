import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Location } from "@shared/schema";
import { getMarkerIcon } from "@/lib/mapUtils";

interface LocationListProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}

export default function LocationList({ locations, onLocationSelect }: LocationListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-4 p-4">
        {locations.map((location) => (
          <Card
            key={location.id}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onLocationSelect(location)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getMarkerIcon(location.type)}</span>
                <div>
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-sm text-muted-foreground">{location.nameEn}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
