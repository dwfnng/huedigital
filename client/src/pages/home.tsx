import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import ResourceList from "@/components/ResourceList";
import ResourceDetails from "@/components/ResourceDetails";
import CategoryList from "@/components/CategoryList";
import ResourceTypeFilter from "@/components/ResourceTypeFilter";
import { motion } from "framer-motion";
import { Library } from "lucide-react";
import type { Resource, ResourceType, Category } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ResourceType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: resources = [] } = useQuery<Resource[]>({
    queryKey: ["/api/resources/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery) {
        const res = await apiRequest("GET", "/api/resources");
        return res.json();
      }
      const res = await apiRequest(
        "GET", 
        `/api/resources/search/${searchQuery}`
      );
      return res.json();
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredResources = resources.filter(resource => {
    if (selectedType && resource.type !== selectedType) return false;
    if (selectedCategory && resource.category !== selectedCategory) return false;
    return true;
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <motion.div
      className="container mx-auto p-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div variants={item} className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-primary/10">
            <Library className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Kho học liệu số</h1>
            <p className="text-muted-foreground mt-1">
              Khám phá bộ sưu tập tài liệu số hóa, hình ảnh, video và âm thanh về di sản văn hóa Huế
            </p>
          </div>
        </motion.div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Tabs defaultValue="browse" className="w-full">
              <motion.div variants={item} className="px-4 pt-4">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="browse" className="text-base">
                    Duyệt tài liệu
                  </TabsTrigger>
                  <TabsTrigger value="categories" className="text-base">
                    Danh mục
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              <TabsContent value="browse" className="m-0">
                <div className="space-y-4 p-4">
                  <motion.div variants={item}>
                    <SearchBar 
                      onSearch={handleSearch}
                      placeholder="Tìm kiếm tài liệu..."
                    />
                  </motion.div>

                  <motion.div variants={item}>
                    <ResourceTypeFilter
                      selectedType={selectedType}
                      onSelectType={setSelectedType}
                    />
                  </motion.div>

                  <motion.div variants={item}>
                    <ResourceList
                      resources={filteredResources}
                      onResourceSelect={setSelectedResource}
                    />
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="categories" className="m-0">
                <div className="p-4">
                  <motion.div variants={item}>
                    <CategoryList
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                    />
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <ResourceDetails
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      </div>
    </motion.div>
  );
}