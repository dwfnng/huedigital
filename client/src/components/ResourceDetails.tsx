import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  BookOpen,
  Video,
  Image as ImageIcon,
  FileAudio,
  File
} from "lucide-react";
import type { Resource } from "@shared/schema";
import { motion } from "framer-motion";
import ShareButton from "@/components/ShareButton";

function ResourceMetadataSection({ title, content }: { title: string, content: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm flex items-center gap-2">
        <Info className="h-4 w-4 text-primary" />
        {title}
      </h4>
      {content}
    </div>
  );
}

const MediaViewer = ({ resource }: { resource: Resource }) => {
  const formatImageUrl = (url: string | null) => {
    if (!url) return 'https://placehold.co/600x400/png?text=No+Image';

    // Handle relative paths
    if (url.startsWith('./') || url.startsWith('../')) {
      return new URL(url, window.location.origin).toString();
    }

    // Handle already absolute URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Handle paths without protocol
    if (url.startsWith('//')) {
      return `https:${url}`;
    }

    // Default case: assume it's a relative path
    return `${window.location.origin}/${url.replace(/^\//, '')}`;
  };

  switch (resource.type) {
    case "image":
      return (
        <div className="relative bg-black/5 rounded-lg overflow-hidden">
          <img
            src={formatImageUrl(resource.contentUrl)}
            alt={resource.title}
            className="w-full h-auto object-contain"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallbackUrl = 'https://placehold.co/600x400/png?text=Image+Not+Found';
              if (target.src !== fallbackUrl) {
                target.src = fallbackUrl;
              }
            }}
          />
        </div>
      );

    case "video":
      return (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            src={formatImageUrl(resource.videoUrl || resource.contentUrl)}
            controls
            className="w-full"
            poster={formatImageUrl(resource.thumbnailUrl)}
          >
            {resource.transcript && (
              <track
                kind="captions"
                src={resource.transcript}
                label="Vietnamese"
              />
            )}
          </video>
        </div>
      );

    case "audio":
      return (
        <div className="space-y-4">
          {resource.thumbnailUrl && (
            <img
              src={formatImageUrl(resource.thumbnailUrl)}
              alt={resource.title}
              className="w-full rounded-lg"
            />
          )}
          <div className="bg-muted/30 p-4 rounded-lg">
            <audio
              src={formatImageUrl(resource.contentUrl)}
              controls
              className="w-full"
            />
            {resource.transcript && (
              <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
                <h4 className="font-medium mb-2">Lời thoại:</h4>
                <p>{resource.transcript}</p>
              </div>
            )}
          </div>
        </div>
      );

    case "document":
    default:
      return (
        <div className="space-y-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {resource.textContent && (
              <div 
                className="formatted-content"
                dangerouslySetInnerHTML={{ __html: resource.textContent }} 
              />
            )}
          </div>
          {resource.imageUrls && resource.imageUrls.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={formatImageUrl(url)}
                    alt={`${resource.title} - Hình ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallbackUrl = 'https://placehold.co/600x400/png?text=Image+Not+Found';
                      if (target.src !== fallbackUrl) {
                        target.src = fallbackUrl;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
  }
};

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
  dimensions?: string;
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
      <ResourceMetadataSection title={title} content={content} />
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

        {metadata.conservation && renderSection(
          "Bảo tồn",
          <p className="text-sm text-muted-foreground">{metadata.conservation}</p>
        )}
      </motion.div>
    );
  };

  return (
    <Sheet open={!!resource} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden">
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-2xl">{resource.title}</SheetTitle>
          {resource.titleEn && (
            <SheetDescription className="text-base">{resource.titleEn}</SheetDescription>
          )}
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
          <div className="space-y-6">
            {(resource.contentUrl || resource.videoUrl || resource.imageUrls || resource.textContent) && 
              <MediaViewer resource={resource} />
            }

            {/* Description */}
            {resource.description && (
              <motion.div
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="prose prose-sm dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: resource.description }} />
                </div>
                {resource.descriptionEn && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {resource.descriptionEn}
                  </p>
                )}
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
                description={resource.description || ''}
                url={resource.contentUrl}
              />
            </motion.div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}