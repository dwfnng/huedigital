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
  Book,
  Palette,
  Coffee,
  Hammer,
  History
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface FilterState {
  type?: string;
  category?: string;
  searchQuery: string;
}

const categories = [
  { 
    id: "heritage_site", 
    label: "Di tích lịch sử", 
    icon: <History />,
    description: "Các di tích và công trình lịch sử quan trọng của Huế"
  },
  { 
    id: "performing_arts", 
    label: "Nghệ thuật biểu diễn", 
    icon: <Music />,
    description: "Ca Huế và các loại hình nghệ thuật truyền thống"
  },
  { 
    id: "culture", 
    label: "Văn hóa", 
    icon: <Book />,
    description: "Các giá trị văn hóa phi vật thể của Huế"
  },
  { 
    id: "culinary_arts", 
    label: "Ẩm thực", 
    icon: <Coffee />,
    description: "Ẩm thực cung đình và dân gian Huế"
  },
  { 
    id: "traditional_crafts", 
    label: "Nghề thủ công", 
    icon: <Hammer />,
    description: "Các nghề thủ công truyền thống"
  }
];

export default function DigitalLibrary() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: ""
  });

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
        resource.description?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Kho học liệu số</h1>
            <p className="text-muted-foreground mt-1">
              Khám phá kho tàng di sản văn hóa Huế qua tư liệu số
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

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
              <div className="flex flex-col gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{category.label}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
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
      </div>

      {/* Content Tabs */}
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
                    <h3 className="font-semibold text-lg">{resource.title}</h3>
                    {resource.description && (
                      <p className="text-sm mt-2 line-clamp-3 text-muted-foreground">
                        {resource.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {resource.keywords?.map((keyword, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}