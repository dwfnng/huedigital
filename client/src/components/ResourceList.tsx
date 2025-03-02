import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  GraduationCap, 
  Box 
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
      return <Music className="h-6 w-6" />;
    case "research":
      return <GraduationCap className="h-6 w-6" />;
    case "3d_model":
      return <Box className="h-6 w-6" />;
    default:
      return <FileText className="h-6 w-6" />;
  }
};

export default function ResourceList({ resources, onResourceSelect }: ResourceListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-4 p-4">
        {resources.map((resource) => (
          <Card
            key={resource.id}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onResourceSelect(resource)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary">
                  {getResourceIcon(resource.type)}
                </div>
                <div>
                  <h3 className="font-semibold">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {resource.titleEn}
                  </p>
                  {resource.description && (
                    <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">
                      {resource.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}