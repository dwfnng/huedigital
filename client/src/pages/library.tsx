import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Book, Image, Video, FileAudio, Box } from "lucide-react";
import type { Resource, ResourceType } from "@shared/schema";

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="hover:bg-accent transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="aspect-video rounded-md overflow-hidden mb-4 bg-muted">
          <img 
            src={resource.thumbnailUrl || '/images/placeholder.jpg'} 
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-semibold mb-1">{resource.title}</h3>
        <p className="text-sm text-muted-foreground">{resource.description}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{resource.type}</span>
          {resource.culturalPeriod && (
            <>
              <span>•</span>
              <span>{resource.culturalPeriod}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ResourceType | "all">("all");

  const { data: resources = [] } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "all" || resource.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Kho học liệu số</h1>
        <p className="text-muted-foreground mb-6">
          Khám phá kho tàng tư liệu lịch sử và văn hóa Huế
        </p>

        {/* Search and filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm tư liệu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6" onValueChange={(value) => setSelectedType(value as ResourceType | "all")}>
          <TabsList>
            <TabsTrigger value="all" className="flex gap-2">
              <Book className="h-4 w-4" />
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="image" className="flex gap-2">
              <Image className="h-4 w-4" />
              Hình ảnh
            </TabsTrigger>
            <TabsTrigger value="video" className="flex gap-2">
              <Video className="h-4 w-4" />
              Video
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex gap-2">
              <FileAudio className="h-4 w-4" />
              Âm thanh
            </TabsTrigger>
            <TabsTrigger value="3d_model" className="flex gap-2">
              <Box className="h-4 w-4" />
              Mô hình 3D
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Book className="h-12 w-12 mx-auto mb-4" />
                <p>Không tìm thấy tư liệu phù hợp</p>
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}