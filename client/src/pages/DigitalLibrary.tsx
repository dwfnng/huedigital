import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, FileText, CalendarDays, User, Landmark, Music, UtensilsCrossed, BookOpen, Newspaper } from "lucide-react";
import { ResourceDialog } from "@/components/ResourceDialog";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface FilterState {
  searchQuery: string;
  category: string | null;
}

// Define library categories as requested in the requirements
const categories = [
  { id: "historical_sites", name: "Di tích lịch sử", icon: <Landmark className="h-4 w-4" /> },
  { id: "music_arts", name: "Âm nhạc & Nghệ thuật", icon: <Music className="h-4 w-4" /> },
  { id: "cuisine", name: "Ẩm thực truyền thống", icon: <UtensilsCrossed className="h-4 w-4" /> },
  { id: "cultural_heritage", name: "Di sản văn hóa", icon: <BookOpen className="h-4 w-4" /> },
  { id: "current_affairs", name: "Thời sự & Sự kiện", icon: <Newspaper className="h-4 w-4" /> },
];

export default function DigitalLibrary() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    category: null
  });

  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: resources = [] } = useQuery({
    queryKey: ["/api/digital-library"],
  });

  const filteredResources = resources.filter(resource => {
    // Filter by search query
    const matchesSearch = !filters.searchQuery ? true : (
      resource.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      resource.keywords?.some(k => k.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    );
    
    // Filter by category
    const matchesCategory = !filters.category ? true : (
      (filters.category === "historical_sites" && resource.type === "historical_site") ||
      (filters.category === "music_arts" && ["traditional_music", "dance_performance", "performing_arts"].includes(resource.type)) ||
      (filters.category === "cuisine" && ["culinary_heritage"].includes(resource.type)) ||
      (filters.category === "cultural_heritage" && ["craft_technique", "ritual_description", "traditional_crafts", "folk_customs", "architectural_heritage"].includes(resource.type)) ||
      (filters.category === "current_affairs" && resource.keywords?.some(k => ["sự kiện", "thời sự", "hiện đại", "trung ương", "thành phố"].includes(k.toLowerCase())))
    );
    
    return matchesSearch && matchesCategory;
  });

  const handleResourceClick = (resource: any) => {
    setSelectedResource(resource);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="page-header">
        <div className="page-header-content flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Kho Tàng Di Sản Huế</h1>
            <p className="mt-1">
              Khám phá kho tàng di sản văn hóa Huế qua tư liệu số
            </p>
          </div>
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-900" />
            <Input
              placeholder="Tìm kiếm tư liệu..."
              className="pl-10 enhanced-search"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            />
          </div>
        </div>
      </div>
      
      {/* Category filters */}
      <div className="bg-card p-4 rounded-lg border border-[#B5935A]/20 lotus-pattern">
        <h2 className="text-lg font-medium mb-4">Danh mục tư liệu</h2>
        <Tabs 
          value={filters.category || "all"} 
          onValueChange={(value) => setFilters(prev => ({ 
            ...prev, 
            category: value === "all" ? null : value 
          }))}
          className="w-full"
        >
          <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-nowrap">
            <TabsTrigger value="all" className="gap-2">
              <Search className="h-4 w-4" />
              <span>Tất cả</span>
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="gap-2">
                {category.icon}
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              {categories.find(c => c.id === filters.category)?.name}
              <button 
                className="ml-1 rounded-full hover:bg-secondary/80" 
                onClick={() => setFilters(prev => ({ ...prev, category: null }))}
              >
                ×
              </button>
            </Badge>
          )}
          {filters.searchQuery && (
            <Badge variant="secondary" className="gap-1">
              "{filters.searchQuery}"
              <button 
                className="ml-1 rounded-full hover:bg-secondary/80" 
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: "" }))}
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="elegant-card p-6 hover-translate transition-all duration-300 cursor-pointer h-full overflow-hidden border-[#B5935A]/30"
              onClick={() => handleResourceClick(resource)}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg royal-gradient text-white shadow-md">
                  {resource.type === "historical_site" ? (
                    <Landmark className="h-5 w-5" />
                  ) : ["traditional_music", "dance_performance", "performing_arts"].includes(resource.type) ? (
                    <Music className="h-5 w-5" />
                  ) : ["culinary_heritage"].includes(resource.type) ? (
                    <UtensilsCrossed className="h-5 w-5" />
                  ) : ["craft_technique", "ritual_description", "traditional_crafts", "folk_customs", "architectural_heritage"].includes(resource.type) ? (
                    <BookOpen className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-[#9F8054]">{resource.title}</h3>
                    {resource.titleEn && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {resource.titleEn}
                      </p>
                    )}
                  </div>

                  <div className="imperial-divider"></div>

                  <p className="text-sm line-clamp-3 text-muted-foreground">
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {resource.author && (
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-[#B5935A]" />
                        {resource.author}
                      </div>
                    )}
                    {resource.yearCreated && (
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-[#B5935A]" />
                        {resource.yearCreated}
                      </div>
                    )}
                  </div>

                  {resource.keywords && (
                    <div className="flex flex-wrap gap-1.5">
                      {resource.keywords.slice(0, 3).map((keyword: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-[#B5935A]/10 text-[#9F8054] border border-[#B5935A]/20 rounded-full text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
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