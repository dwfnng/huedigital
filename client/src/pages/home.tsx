import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchBar from "@/components/SearchBar";
import ResourceList from "@/components/ResourceList";
import ResourceDetails from "@/components/ResourceDetails";
import CategoryList from "@/components/CategoryList";
import ResourceTypeFilter from "@/components/ResourceTypeFilter";
import type { Resource, ResourceType, Category } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Kho học liệu số Huế</h1>

        <Tabs defaultValue="browse" className="space-y-4">
          <TabsList>
            <TabsTrigger value="browse">Duyệt tài liệu</TabsTrigger>
            <TabsTrigger value="categories">Danh mục</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Tìm kiếm tài liệu..."
            />

            <ResourceTypeFilter
              selectedType={selectedType}
              onSelectType={setSelectedType}
            />

            <ResourceList
              resources={filteredResources}
              onResourceSelect={setSelectedResource}
            />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </TabsContent>
        </Tabs>

        <ResourceDetails
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      </div>
    </div>
  );
}