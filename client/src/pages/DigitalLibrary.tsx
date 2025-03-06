import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, FileText, Video, Music } from "lucide-react";
import { ResourceDialog } from "@/components/ResourceDialog";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface FilterState {
  searchQuery: string;
}

export default function DigitalLibrary() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: ""
  });

  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: resources = [] } = useQuery({
    queryKey: ["/api/digital-library"],
  });

  const filteredResources = resources.filter(resource => {
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description?.toLowerCase().includes(searchLower) ||
        resource.keywords?.some(k => k.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const handleResourceClick = (resource: any) => {
    setSelectedResource(resource);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kho học liệu số</h1>
          <p className="text-muted-foreground mt-1">
            Khám phá kho tàng di sản văn hóa Huế qua tư liệu số
          </p>
        </div>
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tư liệu..."
            className="pl-10"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full"
              onClick={() => handleResourceClick(resource)}
            >
              <div className="aspect-video relative">
                <img
                  src={resource.thumbnailUrl || `/media/images/${resource.type}-placeholder.jpg`}
                  alt={resource.title}
                  className="w-full h-full object-cover"
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
              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-2">{resource.title}</h3>
                {resource.description && (
                  <p className="text-sm mt-2 line-clamp-3 text-muted-foreground">
                    {resource.description}
                  </p>
                )}
                {resource.keywords && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {resource.keywords.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  {resource.type.toUpperCase()}
                  {resource.author && (
                    <span className="ml-2">• {resource.author}</span>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filteredResources.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">Không tìm thấy tư liệu</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
      </div>

      <ResourceDialog
        resource={selectedResource}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}