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
  Box,
  File3D
} from "lucide-react";
import type { Resource } from "@shared/schema";
import { motion } from "framer-motion";
import ShareButton from "@/components/ShareButton";

// Add support for 3D model viewer
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage } from '@react-three/drei';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

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
  const handleError = (e: any) => {
    console.error("Failed to load media:", e);
    // Implement more sophisticated error handling here, e.g., display a custom error message.
  };

  switch (resource.type) {
    case "image":
      return (
        <div className="relative bg-black/5 rounded-lg overflow-hidden">
          <img
            src={resource.contentUrl || 'https://placehold.co/600x400/png?text=No+Image'}
            alt={resource.title}
            className="w-full h-auto object-contain"
            loading="lazy"
            onError={handleError}
          />
          {resource.metadata?.dimensions && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded-full">
              {resource.metadata.dimensions}
            </div>
          )}
        </div>
      );

    case "video":
      return (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            src={resource.contentUrl}
            controls
            className="w-full"
            poster={resource.thumbnailUrl}
            onError={handleError}
          >
            <track
              kind="captions"
              src={resource.metadata?.transcription}
              label="Vietnamese"
            />
          </video>
          {resource.metadata?.quality && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded-full">
              {resource.metadata.quality}
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
              className="w-full rounded-lg"
              onError={handleError}
            />
          )}
          <div className="bg-muted/30 p-4 rounded-lg">
            <audio
              src={resource.contentUrl}
              controls
              className="w-full"
              onError={handleError}
            />
            {resource.metadata?.transcription && (
              <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
                <h4 className="font-medium mb-2">Lời thoại:</h4>
                <p>{resource.metadata.transcription}</p>
              </div>
            )}
          </div>
        </div>
      );

    case "3d_model":
      return (
        <div className="relative bg-black/5 rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <Canvas>
            <Stage environment="city" intensity={0.6}>
              <Model url={resource.contentUrl} />
            </Stage>
            <OrbitControls autoRotate />
          </Canvas>
          {resource.metadata?.model3d && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded-full">
              {resource.metadata.model3d.fileFormat}
            </div>
          )}
        </div>
      );

    default:
      return null;
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
  quality?: string;
  transcription?: string;
  model3d?: { fileFormat: string };
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

  return (
    <Sheet open={!!resource} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden">
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-2xl">{resource.title}</SheetTitle>
          <SheetDescription className="text-base">{resource.titleEn}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
          <div className="space-y-6">
            {resource.contentUrl && <MediaViewer resource={resource} />}

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