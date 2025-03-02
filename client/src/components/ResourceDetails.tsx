import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ExternalLink, Info } from "lucide-react";
import type { Resource } from "@shared/schema";

interface ResourceMetadata {
  format?: string;
  resolution?: string;
  duration?: string;
  size?: string;
  [key: string]: unknown;
}

interface ResourceDetailsProps {
  resource: Resource | null;
  onClose: () => void;
}

export default function ResourceDetails({
  resource,
  onClose,
}: ResourceDetailsProps) {
  if (!resource) return null;

  const formatMetadata = (metadata: ResourceMetadata | null) => {
    if (!metadata) return null;
    const entries = Object.entries(metadata);
    return (
      <div className="space-y-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="text-muted-foreground capitalize">
              {key.replace(/_/g, ' ')}
            </span>
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
          <div className="relative aspect-video">
            <img
              src={resource.contentUrl}
              alt={resource.title}
              className="w-full h-full object-contain rounded-lg"
              loading="lazy"
              onError={(e) => {
                const imgEl = e.currentTarget;
                imgEl.onerror = null;
                imgEl.src = 'https://placehold.co/600x400?text=Hình+ảnh+không+khả+dụng';
              }}
            />
            {(resource.metadata as ResourceMetadata)?.resolution && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {(resource.metadata as ResourceMetadata).resolution}
              </div>
            )}
          </div>
        );
      case "video":
        return (
          <div className="relative aspect-video">
            <video
              src={resource.contentUrl}
              poster={resource.thumbnailUrl || 'https://placehold.co/600x400?text=Video+không+khả+dụng'}
              controls
              className="w-full h-full object-contain rounded-lg"
              preload="metadata"
              onError={(e) => {
                const videoEl = e.currentTarget;
                videoEl.onerror = null;
                const parent = videoEl.parentElement;
                if (parent) {
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'absolute inset-0 flex items-center justify-center bg-muted rounded-lg';
                  errorDiv.innerHTML = '<p class="text-sm text-muted-foreground">Video không khả dụng</p>';
                  parent.appendChild(errorDiv);
                }
              }}
            />
            {(resource.metadata as ResourceMetadata)?.resolution && (
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {(resource.metadata as ResourceMetadata).resolution}
              </div>
            )}
          </div>
        );
      case "audio":
        return (
          <div className="space-y-4">
            {resource.thumbnailUrl && (
              <img
                src={resource.thumbnailUrl}
                alt={resource.title}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  const imgEl = e.currentTarget;
                  imgEl.onerror = null;
                  imgEl.src = 'https://placehold.co/600x400?text=Hình+ảnh+không+khả+dụng';
                }}
              />
            )}
            <audio
              src={resource.contentUrl}
              controls
              className="w-full"
              preload="metadata"
              onError={(e) => {
                const audioEl = e.currentTarget;
                audioEl.onerror = null;
                const parent = audioEl.parentElement;
                if (parent) {
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'p-4 bg-muted rounded-lg text-center';
                  errorDiv.innerHTML = '<p class="text-sm text-muted-foreground">Âm thanh không khả dụng</p>';
                  parent.appendChild(errorDiv);
                }
              }}
            />
          </div>
        );
      default:
        return resource.thumbnailUrl ? (
          <img
            src={resource.thumbnailUrl}
            alt={resource.title}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              const imgEl = e.currentTarget;
              imgEl.onerror = null;
              imgEl.src = 'https://placehold.co/600x400?text=Hình+ảnh+không+khả+dụng';
            }}
          />
        ) : null;
    }
  };

  return (
    <Sheet open={!!resource} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden">
        <SheetHeader className="space-y-1">
          <SheetTitle>{resource.title}</SheetTitle>
          <SheetDescription>{resource.titleEn}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
          <div className="space-y-6">
            {renderContent()}

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {resource.description}
              </p>
              {resource.descriptionEn && (
                <p className="text-sm text-muted-foreground">
                  {resource.descriptionEn}
                </p>
              )}
            </div>

            {resource.metadata && (
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">Thông tin chi tiết</h4>
                </div>
                {formatMetadata(resource.metadata as ResourceMetadata)}
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
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = resource.contentUrl;
                  link.download = resource.title;
                  link.click();
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Tải xuống
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}