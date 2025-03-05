import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Book, Image, Video, FileAudio, Box, GraduationCap, BookOpen, ExternalLink } from "lucide-react";
import type { Resource, ResourceType } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function ResourceCard({ resource, onClick }: { resource: Resource; onClick: () => void }) {
  return (
    <Card className="hover:bg-accent transition-colors cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="aspect-video rounded-md overflow-hidden mb-4 bg-muted">
          <img 
            src={resource.thumbnailUrl || '/images/placeholder.jpg'} 
            alt={resource.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-2">{resource.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {resource.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {resource.type && (
              <Badge variant="secondary" className="capitalize text-xs">
                {resource.type.replace(/_/g, ' ')}
              </Badge>
            )}
            {resource.culturalPeriod && (
              <Badge variant="outline" className="text-xs">
                {resource.culturalPeriod}
              </Badge>
            )}
          </div>

          {resource.academicLevel && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <GraduationCap className="h-4 w-4" />
              <span className="capitalize">{resource.academicLevel}</span>
            </div>
          )}

          {resource.metadata && (
            <div className="text-xs text-muted-foreground mt-2 space-y-1">
              {resource.metadata.language && <p>Ngôn ngữ: {resource.metadata.language}</p>}
              {resource.metadata.pages && <p>Số trang: {resource.metadata.pages}</p>}
              {resource.metadata.year && <p>Năm: {resource.metadata.year}</p>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ResourceType | "all">("all");
  const [academicLevel, setAcademicLevel] = useState<string>("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "all" || resource.type === selectedType;

    const matchesLevel = academicLevel === "all" || resource.academicLevel === academicLevel;

    return matchesSearch && matchesType && matchesLevel;
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Book className="h-12 w-12 mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Kho học liệu số</h1>
        <p className="text-sm md:text-base text-muted-foreground mb-6">
          Kho tàng tư liệu lịch sử và văn hóa Huế dành cho nghiên cứu và học tập
        </p>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm tư liệu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={academicLevel} onValueChange={setAcademicLevel}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Trình độ học thuật" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="undergraduate">Đại học</SelectItem>
                <SelectItem value="graduate">Sau đại học</SelectItem>
                <SelectItem value="research">Nghiên cứu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6" onValueChange={(value) => setSelectedType(value as ResourceType | "all")}>
          <TabsList className="w-full overflow-x-auto flex-nowrap justify-start md:justify-center">
            <TabsTrigger value="all" className="flex gap-2">
              <Book className="h-4 w-4" />
              <span className="whitespace-nowrap">Tất cả</span>
            </TabsTrigger>
            <TabsTrigger value="academic_paper" className="flex gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="whitespace-nowrap">Bài nghiên cứu</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex gap-2">
              <Image className="h-4 w-4" />
              <span className="whitespace-nowrap">Hình ảnh</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex gap-2">
              <Video className="h-4 w-4" />
              <span className="whitespace-nowrap">Video</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex gap-2">
              <FileAudio className="h-4 w-4" />
              <span className="whitespace-nowrap">Âm thanh</span>
            </TabsTrigger>
            <TabsTrigger value="3d_model" className="flex gap-2">
              <Box className="h-4 w-4" />
              <span className="whitespace-nowrap">Mô hình 3D</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map(resource => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  onClick={() => setSelectedResource(resource)}
                />
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Không tìm thấy tư liệu phù hợp</p>
              </div>
            )}
          </ScrollArea>
        </Tabs>

        <Dialog 
          open={selectedResource !== null} 
          onOpenChange={(open) => !open && setSelectedResource(null)}
        >
          <DialogContent className="max-w-lg md:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-4 md:p-6">
            {selectedResource && (
              <>
                <DialogHeader className="px-2">
                  <DialogTitle className="text-lg md:text-xl">
                    {selectedResource.title}
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-sm md:text-base">
                    {selectedResource.description}
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 px-2">
                  <div className="space-y-6 py-4">
                    {selectedResource.thumbnailUrl && (
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={selectedResource.thumbnailUrl} 
                          alt={selectedResource.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-base md:text-lg font-semibold mb-2">
                            Thông tin chung
                          </h3>
                          <div className="space-y-2 text-sm">
                            {selectedResource.culturalPeriod && (
                              <p>
                                <span className="font-medium">Thời kỳ:</span>{" "}
                                {selectedResource.culturalPeriod}
                              </p>
                            )}
                            {selectedResource.academicLevel && (
                              <p>
                                <span className="font-medium">Trình độ:</span>{" "}
                                {selectedResource.academicLevel}
                              </p>
                            )}
                            {selectedResource.researchDomain && (
                              <p>
                                <span className="font-medium">Lĩnh vực:</span>{" "}
                                {selectedResource.researchDomain}
                              </p>
                            )}
                          </div>
                        </div>

                        {selectedResource.learningObjectives && 
                         selectedResource.learningObjectives.length > 0 && (
                          <div>
                            <h3 className="text-base md:text-lg font-semibold mb-2">
                              Mục tiêu học tập
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {selectedResource.learningObjectives.map((objective, index) => (
                                <li key={index} className="text-muted-foreground">
                                  {objective}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {selectedResource.culturalSignificance && (
                          <div>
                            <h3 className="text-base md:text-lg font-semibold mb-2">
                              Ý nghĩa văn hóa
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {selectedResource.culturalSignificance}
                            </p>
                          </div>
                        )}

                        {selectedResource.references && 
                         selectedResource.references.length > 0 && (
                          <div>
                            <h3 className="text-base md:text-lg font-semibold mb-2">
                              Tài liệu tham khảo
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {selectedResource.references.map((ref, index) => (
                                <li key={index} className="text-muted-foreground">
                                  {ref}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {selectedResource.metadata && (
                          <div>
                            <h3 className="text-base md:text-lg font-semibold mb-2">
                              Thông tin tài liệu
                            </h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              {selectedResource.metadata.format && (
                                <p>Định dạng: {selectedResource.metadata.format}</p>
                              )}
                              {selectedResource.metadata.pages && (
                                <p>Số trang: {selectedResource.metadata.pages}</p>
                              )}
                              {selectedResource.metadata.language && (
                                <p>Ngôn ngữ: {selectedResource.metadata.language}</p>
                              )}
                              {selectedResource.metadata.year && (
                                <p>Năm xuất bản: {selectedResource.metadata.year}</p>
                              )}
                              {selectedResource.metadata.publisher && (
                                <p>Nhà xuất bản: {selectedResource.metadata.publisher}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedResource(null)} className="text-sm">
                    Đóng
                  </Button>
                  <Button 
                    variant="default" 
                    className="gap-2 text-sm"
                    onClick={() => window.open(selectedResource.contentUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Xem tài liệu
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}