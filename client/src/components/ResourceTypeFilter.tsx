import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  GraduationCap, 
  Box 
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 }
};

export default function ResourceTypeFilter({ selectedType, onSelectType }: ResourceTypeFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-card p-1">
      <motion.div 
        className="flex space-x-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Button
            variant={selectedType === null ? "default" : "outline"}
            onClick={() => onSelectType(null)}
            className="shrink-0"
          >
            Tất cả
          </Button>
        </motion.div>
        {resourceTypes.map(({ type, icon, label }) => (
          <motion.div key={type} variants={item}>
            <Button
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => onSelectType(type)}
              className="shrink-0 transition-all hover:bg-primary/90"
            >
              {icon}
              <span className="ml-2">{label}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}