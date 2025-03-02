import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import type { Resource } from "@shared/schema";

interface ResourceDetailsProps {
  resource: Resource | null;
  onClose: () => void;
}

export default function ResourceDetails({
  resource,
  onClose,
}: ResourceDetailsProps) {
  if (!resource) return null;

  const formatMetadata = (metadata: Record<string, unknown> | null) => {
    if (!metadata) return null;
    const entries = Object.entries(metadata);
    return (
      <div className="space-y-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="text-muted-foreground capitalize">{key}</span>
            <span>{String(value)}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (resource.type) {
      case "image":
        return (
          <img
            src={resource.contentUrl}
            alt={resource.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        );
      case "video":
        return (
          <video
            src={resource.contentUrl}
            controls
            className="w-full rounded-lg"
          />
        );
      case "audio":
        return (
          <audio
            src={resource.contentUrl}
            controls
            className="w-full mt-4"
          />
        );
      default:
        return resource.thumbnailUrl ? (
          <img
            src={resource.thumbnailUrl}
            alt={resource.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : null;
    }
  };

  return (
    <Sheet open={!!resource} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{resource.title}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {renderContent()}

          <div>
            <h3 className="font-medium mb-2">{resource.titleEn}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {resource.description}
            </p>
            {resource.descriptionEn && (
              <p className="text-sm text-muted-foreground">
                {resource.descriptionEn}
              </p>
            )}
          </div>

          {resource.metadata && (
            <div className="space-y-2 border-t pt-4">
              <h4 className="font-medium mb-2">Thông tin chi tiết</h4>
              {formatMetadata(resource.metadata as Record<string, unknown>)}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              onClick={() => window.open(resource.contentUrl, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Xem
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(resource.contentUrl, '_blank')}
            >
              <Download className="mr-2 h-4 w-4" />
              Tải xuống
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}