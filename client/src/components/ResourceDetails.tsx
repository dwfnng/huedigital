
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ExternalLink, Info, Box } from "lucide-react";
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
            <audio
              src={resource.contentUrl}
              controls
              className="w-full"
              onError={(e) => {
                const audioEl = e.currentTarget;
                audioEl.style.display = "none";
                
                // Display error message
                const errorMsg = document.createElement("div");
                errorMsg.textContent = "Audio không khả dụng";
                errorMsg.className = "p-4 bg-gray-100 text-gray-700 rounded-lg text-center";
                
                const container = audioEl.parentNode;
                if (container) {
                  container.appendChild(errorMsg);
                }
              }}
            />
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
            <Info className="h-16 w-16 text-gray-500" />
          </div>
        );
    }
  };

  return (
    <Sheet open={!!resource} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle>{resource.title}</SheetTitle>
          {resource.description && (
            <SheetDescription>{resource.description}</SheetDescription>
          )}
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="space-y-6 py-4">
            {renderContent()}
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(resource.contentUrl, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Mở trực tiếp
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(resource.contentUrl, '_blank', 'download')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Tải xuống
                </Button>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <h3 className="font-medium text-sm">Thông tin tài liệu</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Loại</span>
                    <span className="capitalize">{resource.type.replace(/_/g, ' ')}</span>
                  </div>
                  {resource.category && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Danh mục</span>
                      <span>{resource.category}</span>
                    </div>
                  )}
                  {resource.sourceUrl && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nguồn</span>
                      <a 
                        href={resource.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate max-w-[200px]"
                      >
                        Xem nguồn
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {resource.metadata && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <h3 className="font-medium text-sm">Metadata</h3>
                  {formatMetadata(resource.metadata)}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
