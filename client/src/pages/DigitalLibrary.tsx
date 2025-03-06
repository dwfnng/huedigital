import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  FileText, Image, Video, Music, Search,
  History, BookOpen, Coffee, Heart
} from "lucide-react";
import { ResourceDialog } from "@/components/ResourceDialog";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface FilterState {
  type?: string;
  category?: string;
  searchQuery: string;
}

const categories = [
  {
    id: "heritage",
    label: "Di sản văn hóa",
    icon: <History />,
    description: "Di tích lịch sử, kiến trúc và văn hóa phi vật thể"
  },
  {
    id: "arts",
    label: "Nghệ thuật",
    icon: <Music />,
    description: "Ca Huế, Bài chòi, nhã nhạc cung đình và nghệ thuật truyền thống"
  },
  {
    id: "lifestyle",
    label: "Đời sống",
    icon: <Heart />,
    description: "Ẩm thực, trang phục, nghề thủ công truyền thống"
  },
  {
    id: "documents",
    label: "Tư liệu",
    icon: <BookOpen />,
    description: "Sách, hình ảnh, video về lịch sử và văn hóa Huế"
  }
];

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
    if (filters.category && resource.category !== filters.category) return false;
    if (filters.type && resource.type !== filters.type) return false;
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
    <div className="container mx-auto py-6 space-y-6">
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
            placeholder="Tìm kiếm tài liệu..."
            className="pl-10"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`p-4 hover:bg-accent transition-colors cursor-pointer ${
              filters.category === category.id ? 'bg-accent' : ''
            }`}
            onClick={() => setFilters(prev => ({
              ...prev,
              category: prev.category === category.id ? undefined : category.id
            }))}
          >
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {category.icon}
              </div>
              <div>
                <h3 className="font-semibold">{category.label}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {category.description}
                </p>
                <p className="text-sm mt-2 text-muted-foreground">
                  {filteredResources.filter(r => r.category === category.id).length} tài liệu
                </p>
              </div>
            </div>
          </Card>
        ))}
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
                  src={resource.thumbnailUrl || `/placeholders/${resource.type}-placeholder.jpg`}
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
                  <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">
                    {resource.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {resource.keywords?.slice(0, 3).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {categories.find(c => c.id === resource.category)?.label || resource.category}
                  </div>
                  {resource.period && (
                    <div className="flex items-center gap-1">
                      <History className="h-3 w-3" />
                      {resource.period}
                    </div>
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
            <h3 className="font-semibold">Không tìm thấy tài liệu</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
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