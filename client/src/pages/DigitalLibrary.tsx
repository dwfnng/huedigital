import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Image,
  Video,
  Music,
  Box,
  Search,
  Filter
} from "lucide-react";
import type { DigitalLibraryResource } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface FilterState {
  type?: string;
  category?: string;
  searchQuery: string;
}

export default function DigitalLibrary() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: ""
  });

  const { data: resources = [] } = useQuery<DigitalLibraryResource[]>({
    queryKey: ["/api/digital-library"],
  });

  const filteredResources = resources.filter(resource => {
    if (filters.type && resource.type !== filters.type) return false;
    if (filters.category && resource.category !== filters.category) return false;
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description?.toLowerCase().includes(searchLower) ||
        resource.titleEn?.toLowerCase().includes(searchLower) ||
        resource.descriptionEn?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const categories = [
    { id: "heritage", label: "Di tích lịch sử", icon: <FileText /> },
    { id: "art", label: "Nghệ thuật", icon: <Image /> },
    { id: "music", label: "Âm nhạc", icon: <Music /> },
    { id: "architecture", label: "Kiến trúc", icon: <Box /> }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Kho học liệu số</h1>
            <p className="text-muted-foreground mt-1">
              Khám phá kho tàng tư liệu lịch sử và văn hóa Huế
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tài liệu..."
                className="pl-10 w-[300px]"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="p-6 hover:bg-accent transition-colors cursor-pointer"
              onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{category.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredResources.filter(r => r.category === category.id).length} tài liệu
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setFilters(prev => ({ ...prev, type: undefined }))}>
            Tất cả
          </TabsTrigger>
          <TabsTrigger value="document" onClick={() => setFilters(prev => ({ ...prev, type: "document" }))}>
            <FileText className="mr-2 h-4 w-4" />
            Tài liệu
          </TabsTrigger>
          <TabsTrigger value="image" onClick={() => setFilters(prev => ({ ...prev, type: "image" }))}>
            <Image className="mr-2 h-4 w-4" />
            Hình ảnh
          </TabsTrigger>
          <TabsTrigger value="video" onClick={() => setFilters(prev => ({ ...prev, type: "video" }))}>
            <Video className="mr-2 h-4 w-4" />
            Video
          </TabsTrigger>
          <TabsTrigger value="audio" onClick={() => setFilters(prev => ({ ...prev, type: "audio" }))}>
            <Music className="mr-2 h-4 w-4" />
            Âm thanh
          </TabsTrigger>
          <TabsTrigger value="3d_model" onClick={() => setFilters(prev => ({ ...prev, type: "3d_model" }))}>
            <Box className="mr-2 h-4 w-4" />
            Mô hình 3D
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
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
                      <div className="flex items-center gap-1">
                        {resource.category}
                      </div>
                      {resource.period && (
                        <div className="flex items-center gap-1">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}