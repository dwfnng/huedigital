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
import { motion } from "framer-motion";

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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

export default function ResourceDetails({
  resource,
  onClose,
}: ResourceDetailsProps) {
  if (!resource) return null;

  const formatMetadata = (metadata: ResourceMetadata | null) => {
    if (!metadata) return null;
    const entries = Object.entries(metadata);
    return (
      <motion.div 
        className="space-y-2"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm hover:bg-accent/50 p-2 rounded-lg transition-colors">
            <span className="text-muted-foreground capitalize">
              {key.replace(/_/g, ' ')}
            </span>
            <span className="font-medium">{String(value)}</span>
          </div>
        ))}
      </motion.div>
    );
  };

  const renderContent = () => {
    switch (resource.type) {
      case "image":
        return (
          <motion.div 
            className="relative bg-black/5 rounded-lg overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="relative pt-[56.25%]">
              <img
                src={resource.contentUrl}
                alt={resource.title}
                className="absolute inset-0 w-full h-full object-contain transition-transform hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  const imgEl = e.currentTarget;
                  imgEl.onerror = null;
                  imgEl.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"%3E%3Cpath fill="%23999" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/%3E%3C/svg%3E';
                }}
              />
            </div>
            {(resource.metadata as ResourceMetadata)?.resolution && (
              <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs">
                {(resource.metadata as ResourceMetadata).resolution}
              </div>
            )}
          </motion.div>
        );
      case "video":
        return (
          <motion.div 
            className="relative bg-black/5 rounded-lg overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="relative pt-[56.25%]">
              <video
                src={resource.contentUrl}
                poster={resource.thumbnailUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"%3E%3Cpath fill="%23999" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/%3E%3C/svg%3E'}
                controls
                preload="metadata"
                className="absolute inset-0 w-full h-full object-contain bg-black"
                controlsList="nodownload"
                onError={(e) => {
                  const videoEl = e.currentTarget;
                  videoEl.onerror = null;
                  const parent = videoEl.parentElement;
                  if (parent) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'absolute inset-0 flex items-center justify-center bg-muted/90 backdrop-blur-sm rounded-lg';
                    errorDiv.innerHTML = '<p class="text-sm text-muted-foreground">Video không khả dụng</p>';
                    parent.appendChild(errorDiv);
                  }
                }}
              />
            </div>
            {(resource.metadata as ResourceMetadata)?.resolution && (
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs">
                {(resource.metadata as ResourceMetadata).resolution}
              </div>
            )}
          </motion.div>
        );
      case "audio":
        return (
          <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {resource.thumbnailUrl && (
              <div className="relative overflow-hidden rounded-lg">
                <div className="relative pt-[56.25%]">
                  <img
                    src={resource.thumbnailUrl}
                    alt={resource.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      const imgEl = e.currentTarget;
                      imgEl.onerror = null;
                      imgEl.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"%3E%3Cpath fill="%23999" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}
            <div className="bg-muted/30 p-4 rounded-lg">
              <audio
                src={resource.contentUrl}
                controls
                className="w-full"
                preload="metadata"
                controlsList="nodownload"
                onError={(e) => {
                  const audioEl = e.currentTarget;
                  audioEl.onerror = null;
                  const parent = audioEl.parentElement;
                  if (parent) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'p-4 bg-muted/50 backdrop-blur-sm rounded-lg text-center';
                    errorDiv.innerHTML = '<p class="text-sm text-muted-foreground">Âm thanh không khả dụng</p>';
                    parent.appendChild(errorDiv);
                  }
                }}
              />
            </div>
          </motion.div>
        );
      default:
        return resource.thumbnailUrl ? (
          <motion.div 
            className="relative overflow-hidden rounded-lg"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="relative pt-[56.25%]">
              <img
                src={resource.thumbnailUrl}
                alt={resource.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
                onError={(e) => {
                  const imgEl = e.currentTarget;
                  imgEl.onerror = null;
                  imgEl.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"%3E%3Cpath fill="%23999" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/%3E%3C/svg%3E';
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>
        ) : null;
    }
  };

  return (
    <Sheet open={!!resource} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden">
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-2xl">{resource.title}</SheetTitle>
          <SheetDescription className="text-base">{resource.titleEn}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
          <div className="space-y-8">
            {renderContent()}

            <motion.div 
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                {resource.description}
              </p>
              {resource.descriptionEn && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {resource.descriptionEn}
                </p>
              )}
            </motion.div>

            {resource.metadata && (
              <motion.div 
                className="space-y-4 border-t pt-6"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Thông tin chi tiết</h4>
                </div>
                {formatMetadata(resource.metadata as ResourceMetadata)}
              </motion.div>
            )}

            <motion.div 
              className="flex gap-3 pt-4"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
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
            </motion.div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}