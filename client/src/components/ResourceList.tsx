import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  FileText,
  Image,
  Video,
  Music,
  Box,
  Calendar,
  Clock,
  FileAudio,
  Info
} from "lucide-react";
import type { Resource } from "@shared/schema";

interface ResourceListProps {
  resources: Resource[];
  onResourceSelect: (resource: Resource) => void;
}

const getResourceIcon = (type: string) => {
  switch (type) {
    case "document":
      return <FileText className="h-6 w-6" />;
    case "image":
      return <Image className="h-6 w-6" />;
    case "video":
      return <Video className="h-6 w-6" />;
    case "audio":
      return <FileAudio className="h-6 w-6" />;
    case "3d_model":
      return <Box className="h-6 w-6" />;
    default:
      return <Info className="h-6 w-6" />;
  }
};

const getPlaceholderImage = (type: string) => {
  switch (type) {
    case "image":
      return "/placeholders/image-placeholder.jpg";
    case "video":
      return "/placeholders/video-placeholder.jpg";
    case "audio":
      return "/placeholders/audio-placeholder.jpg";
    case "3d_model":
      return "/placeholders/3d-model-placeholder.jpg";
    default:
      return "/placeholders/document-placeholder.jpg";
  }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ResourceList({ resources, onResourceSelect }: ResourceListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <motion.div
        className="space-y-4 p-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {resources.map((resource) => (
          <motion.div key={resource.id} variants={item}>
            <Card
              className="cursor-pointer hover:bg-accent/50 transition-all hover:shadow-lg"
              onClick={() => onResourceSelect(resource)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 rounded-full bg-primary/10 text-primary">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-3 relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={resource.thumbnail_url || getPlaceholderImage(resource.type)}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getPlaceholderImage(resource.type);
                        }}
                      />
                      {resource.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Video className="h-12 w-12 text-white" />
                        </div>
                      )}
                      {resource.type === "audio" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Music className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold truncate">{resource.title}</h3>
                    {resource.title_en && (
                      <p className="text-sm text-muted-foreground truncate">
                        {resource.title_en}
                      </p>
                    )}
                    {resource.description && (
                      <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">
                        {resource.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        {resource.category.toUpperCase()}
                      </div>
                      {resource.metadata?.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resource.metadata.duration}
                        </div>
                      )}
                      {resource.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(resource.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {resources.length === 0 && (
          <div className="text-center py-12">
            <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Không tìm thấy tài liệu</p>
          </div>
        )}
      </motion.div>
    </ScrollArea>
  );
}