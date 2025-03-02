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
          <div className="relative">
            <img
              src={resource.contentUrl}
              alt={resource.title}
              className="w-full rounded-lg"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/fallback-image.png";
                e.currentTarget.onerror = null;
              }}
            />
            {resource.metadata?.resolution && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {resource.metadata.resolution}
              </div>
            )}
          </div>
        );
      case "video":
        return (
          <div className="relative">
            <div className="video-container">
              <video
                key={resource.contentUrl}
                src={resource.contentUrl}
                poster={resource.thumbnailUrl || "/fallback-video-poster.png"}
                controls
                className="w-full rounded-lg"
                preload="metadata"
                onError={(e) => {
                  const videoEl = e.currentTarget;
                  videoEl.style.display = "none";
                  
                  // If content URL fails, try to use a working sample video
                  const fallbackVideo = document.createElement("video");
                  fallbackVideo.src = "https://filesamples.com/samples/video/mp4/sample_640x360.mp4";
                  fallbackVideo.controls = true;
                  fallbackVideo.className = "w-full rounded-lg";
                  fallbackVideo.poster = "/fallback-video-poster.png";
                  
                  // Display message
                  const errorMsg = document.createElement("div");
                  errorMsg.textContent = "Video chính không khả dụng - Đang hiển thị video thay thế";
                  errorMsg.className = "p-4 bg-gray-100 text-gray-700 rounded-lg text-center mb-3";
                  
                  const container = videoEl.parentNode;
                  if (container) {
                    container.appendChild(errorMsg);
                    container.appendChild(fallbackVideo);
                  }
                }}
            />
            {resource.metadata?.resolution && (
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {resource.metadata.resolution}
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
                  e.currentTarget.src = "/fallback-audio-image.png";
                  e.currentTarget.onerror = null;
                }}
              />
            )}
            <div className="audio-container">
              <audio
                key={resource.contentUrl}
                src={resource.contentUrl}
                controls
                className="w-full"
                preload="metadata"
                onError={(e) => {
                  const audioEl = e.currentTarget;
                  audioEl.style.display = "none";
                  
                  // If content URL fails, try to use a working sample audio
                  const fallbackAudio = document.createElement("audio");
                  fallbackAudio.src = "https://filesamples.com/samples/audio/mp3/sample1.mp3";
                  fallbackAudio.controls = true;
                  fallbackAudio.className = "w-full";
                  
                  // Display message
                  const errorMsg = document.createElement("div");
                  errorMsg.textContent = "Âm thanh chính không khả dụng - Đang hiển thị âm thanh thay thế";
                  errorMsg.className = "p-4 bg-gray-100 text-gray-700 rounded-lg text-center mb-3";
                  
                  const container = audioEl.parentNode;
                  if (container) {
                    container.appendChild(errorMsg);
                    container.appendChild(fallbackAudio);
                  }
                }}
              />
            </div>
          </div>
        );
      case "3d_model":
        return (
          <div className="space-y-4">
            {resource.thumbnailUrl ? (
              <img
                src={resource.thumbnailUrl}
                alt={resource.title}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/fallback-3d-image.png";
                  e.currentTarget.onerror = null;
                }}
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <Box className="h-16 w-16 text-gray-500" />
              </div>
            )}
            <div className="p-4 bg-gray-100 rounded-lg">
              <a 
                href={resource.contentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
              >
                Xem mô hình 3D
              </a>
            </div>
          </div>
        );
      default:
        return resource.thumbnailUrl ? (
          <img
            src={resource.thumbnailUrl}
            alt={resource.title}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "/fallback-document.png";
              e.currentTarget.onerror = null;
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <FileText className="h-16 w-16 text-gray-500" />
          </div>
        );
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}