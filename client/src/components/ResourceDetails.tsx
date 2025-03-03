import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  ExternalLink,
  Info,
  Calendar,
  MapPin,
  Clock,
  Bookmark,
  Users,
  History,
  Globe,
  Tag,
  BookOpen
} from "lucide-react";
import type { Resource } from "@shared/schema";
import { motion } from "framer-motion";
import ShareButton from "@/components/ShareButton";

interface ResourceMetadata {
  format?: string;
  resolution?: string;
  duration?: string;
  size?: string;
  technique?: string;
  materials?: string[];
  conservation?: string;
  culturalSignificance?: string;
  historicalEvents?: string[];
  ritualUse?: string;
  seasonalContext?: string;
  traditionalPractices?: string;
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

    const renderSection = (title: string, content: React.ReactNode) => (
      <div className="space-y-2">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          {title}
        </h4>
        {content}
      </div>
    );

    return (
      <motion.div 
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {metadata.technique && renderSection(
          "Kỹ thuật",
          <p className="text-sm text-muted-foreground">{metadata.technique}</p>
        )}

        {metadata.materials && metadata.materials.length > 0 && renderSection(
          "Chất liệu",
          <div className="flex flex-wrap gap-2">
            {metadata.materials.map((material, index) => (
              <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {material}
              </span>
            ))}
          </div>
        )}

        {metadata.culturalSignificance && renderSection(
          "Ý nghĩa văn hóa",
          <p className="text-sm text-muted-foreground">{metadata.culturalSignificance}</p>
        )}

        {metadata.historicalEvents && metadata.historicalEvents.length > 0 && renderSection(
          "Sự kiện lịch sử liên quan",
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            {metadata.historicalEvents.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        )}

        {metadata.ritualUse && renderSection(
          "Nghi lễ sử dụng",
          <p className="text-sm text-muted-foreground">{metadata.ritualUse}</p>
        )}

        {metadata.seasonalContext && renderSection(
          "Bối cảnh theo mùa",
          <p className="text-sm text-muted-foreground">{metadata.seasonalContext}</p>
        )}

        {metadata.traditionalPractices && renderSection(
          "Thực hành truyền thống",
          <p className="text-sm text-muted-foreground">{metadata.traditionalPractices}</p>
        )}

        {metadata.conservation && renderSection(
          "Bảo tồn",
          <p className="text-sm text-muted-foreground">{metadata.conservation}</p>
        )}
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
          <div className="space-y-6">
            {resource.contentUrl && renderContent()}

            {/* Cultural Period Information */}
            {resource.culturalPeriod && (
              <motion.div 
                className="rounded-lg bg-primary/5 p-4"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="flex items-center gap-2 mb-2">
                  <History className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Thời kỳ văn hóa</h4>
                </div>
                <p className="text-sm text-muted-foreground">{resource.culturalPeriod}</p>
              </motion.div>
            )}


            {/* Description */}
            <motion.div 
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <p className="text-sm leading-relaxed">{resource.description}</p>
              {resource.descriptionEn && (
                <p className="text-sm leading-relaxed text-muted-foreground">{resource.descriptionEn}</p>
              )}
            </motion.div>

            {/* Historical Context */}
            {resource.historicalContext && (
              <motion.div 
                className="space-y-2 border-t pt-4"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Bối cảnh lịch sử</h4>
                </div>
                <p className="text-sm text-muted-foreground">{resource.historicalContext}</p>
              </motion.div>
            )}

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <motion.div 
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Từ khóa</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Related Location */}
            {resource.relatedLocationId && (
              <motion.div 
                className="space-y-2 border-t pt-4"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Địa điểm liên quan</h4>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    // Handle navigation to location
                  }}
                >
                  Xem trên bản đồ
                </Button>
              </motion.div>
            )}

            {/* Author & Source Information */}
            <motion.div 
              className="space-y-4 border-t pt-4"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {resource.authorInfo && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Tác giả</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{resource.authorInfo}</p>
                </div>
              )}

              {resource.sourceInfo && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Nguồn tư liệu</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{resource.sourceInfo}</p>
                </div>
              )}
            </motion.div>

            {/* Languages */}
            {resource.languages && resource.languages.length > 0 && (
              <motion.div 
                className="space-y-2 border-t pt-4"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Ngôn ngữ</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resource.languages.map((language, index) => (
                    <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {language}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Technical Metadata */}
            {resource.metadata && (
              <motion.div 
                className="space-y-4 border-t pt-4"
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

            {/* Action Buttons */}
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
              <ShareButton
                title={resource.title}
                description={resource.description}
                url={resource.contentUrl}
              />
            </motion.div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}