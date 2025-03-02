import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Award, Plus, Search, BookOpen, School, Heart, Shield } from 'lucide-react';

const categories = [
  {
    id: 'heritage',
    name: 'Di sản văn hóa',
    icon: BookOpen,
    description: 'Thảo luận về di sản văn hóa Huế'
  },
  {
    id: 'research',
    name: 'Nghiên cứu học thuật',
    icon: School,
    description: 'Chia sẻ nghiên cứu về lịch sử, văn hóa Huế'
  },
  {
    id: 'experience',
    name: 'Trải nghiệm tham quan',
    icon: Heart,
    description: 'Chia sẻ kinh nghiệm tham quan, khám phá Huế'
  },
  {
    id: 'preservation',
    name: 'Bảo tồn di tích',
    icon: Shield,
    description: 'Thảo luận về công tác bảo tồn di tích'
  }
];

const mockDiscussions = [
  {
    id: 1,
    title: "Giá trị kiến trúc của Kỳ Đài qua các thời kỳ lịch sử",
    author: "NguyenVanA",
    category: "heritage",
    views: 156,
    comments: 23,
    points: 45,
    createdAt: "2024-02-28T15:30:00.000Z"
  },
  {
    id: 2,
    title: "Tư liệu mới về hoạt động giáo dục tại Trường Quốc Tử Giám",
    author: "TranThiB",
    category: "research",
    views: 89,
    comments: 12,
    points: 34,
    createdAt: "2024-02-27T10:15:00.000Z"
  }
];

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState("heritage");
  const [searchTerm, setSearchTerm] = useState("");

  // TODO: Replace with actual API calls
  const { data: discussions = mockDiscussions } = useQuery({
    queryKey: ['/api/discussions', selectedCategory],
    enabled: false // Disabled until API is implemented
  });

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-primary">Diễn đàn cộng đồng</h1>
            <p className="text-lg text-muted-foreground">
              Trao đổi, thảo luận về di sản văn hóa Huế
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tạo bài viết mới
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>

            <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-4 mb-6">
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map(category => (
                <TabsContent key={category.id} value={category.id}>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {filteredDiscussions.map(discussion => (
                        <Card key={discussion.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={`https://avatar.vercel.sh/${discussion.author}`} />
                                <AvatarFallback>{discussion.author[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">{discussion.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{discussion.author}</span>
                                  <span>•</span>
                                  <span>{new Date(discussion.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4" />
                                    {discussion.comments}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Award className="h-4 w-4" />
                                    {discussion.points} điểm
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chủ đề thảo luận</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-start gap-3">
                      <category.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Điểm tích lũy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Tích điểm qua việc đóng góp bài viết, tài liệu và tham gia thảo luận
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạo bài viết mới</span>
                    <span>+10 điểm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Bình luận hữu ích</span>
                    <span>+5 điểm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Đóng góp tài liệu</span>
                    <span>+15 điểm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
