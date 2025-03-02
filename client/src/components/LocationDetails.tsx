import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import type { Location } from "@shared/schema";

interface LocationDetailsProps {
  location: Location | null;
  onClose: () => void;
  onNavigate: (location: Location) => void;
}

export default function LocationDetails({
  location,
  onClose,
  onNavigate,
}: LocationDetailsProps) {
  if (!location) return null;

  return (
    <Sheet open={!!location} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{location.name}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <img
            src={location.imageUrl}
            alt={location.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div>
            <h3 className="font-medium mb-2">{location.nameEn}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {location.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {location.descriptionEn}
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => onNavigate(location)}
          >
            <Navigation className="mr-2 h-4 w-4" />
            Navigate
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
