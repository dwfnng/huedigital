import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  GraduationCap, 
  Box, 
  Cube 
} from "lucide-react";
import type { ResourceType } from "@shared/schema";

interface ResourceTypeFilterProps {
  selectedType: ResourceType | null;
  onSelectType: (type: ResourceType | null) => void;
}

const resourceTypes: { type: ResourceType; icon: React.ReactNode; label: string }[] = [
  { type: "document", icon: <FileText className="h-4 w-4" />, label: "Văn bản" },
  { type: "image", icon: <Image className="h-4 w-4" />, label: "Hình ảnh" },
  { type: "video", icon: <Video className="h-4 w-4" />, label: "Video" },
  { type: "audio", icon: <Music className="h-4 w-4" />, label: "Âm thanh" },
  { type: "research", icon: <GraduationCap className="h-4 w-4" />, label: "Nghiên cứu" },
  { type: "3d_model", icon: <Box className="h-4 w-4" />, label: "Mô hình 3D" },
];

export default function ResourceTypeFilter({ selectedType, onSelectType }: ResourceTypeFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 p-1">
        <Button
          variant={selectedType === null ? "default" : "outline"}
          onClick={() => onSelectType(null)}
          className="shrink-0"
        >
          Tất cả
        </Button>
        {resourceTypes.map(({ type, icon, label }) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => onSelectType(type)}
            className="shrink-0"
          >
            {icon}
            <span className="ml-2">{label}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
