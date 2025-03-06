import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  FileText,
  Image,
  Video,
  Music,
  GraduationCap,
  Box,
  Calendar,
  Clock,
  FileAudio,
  File3D,
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
  const getFallbackImageUrl = (type: string) => {
    return `/placeholders/${type}-placeholder.jpg`;
  };

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
                    {(resource.thumbnailUrl || resource.type === 'image') && (
                      <div className="mb-3 relative">
                        <img
                          src={resource.thumbnailUrl || getFallbackImageUrl(resource.type)}
                          alt={resource.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getFallbackImageUrl(resource.type);
                          }}
                        />
                      </div>
                    )}
                    <h3 className="font-semibold truncate">{resource.title}</h3>
                    {resource.titleEn && (
                      <p className="text-sm text-muted-foreground truncate">
                        {resource.titleEn}
                      </p>
                    )}
                    {resource.description && (
                      <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">
                        {resource.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      {resource.type && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {resource.type.toUpperCase()}
                        </div>
                      )}
                      {resource.metadata?.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {typeof resource.metadata.duration === 'string' 
                            ? resource.metadata.duration 
                            : new Date(resource.metadata.duration).toLocaleTimeString()}
                        </div>
                      )}
                      {resource.createdAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(resource.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </ScrollArea>
  );
}