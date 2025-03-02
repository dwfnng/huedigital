import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Award, Plus, Search, BookOpen, School, Heart, Shield } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

interface Discussion {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  views: number;
  comments: number;
  points: number;
  createdAt: string;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  discussionId: number;
  createdAt: string;
}

const categories: Category[] = [
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

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState("heritage");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: discussions = [] } = useQuery<Discussion[]>({
    queryKey: ['/api/discussions', selectedCategory],
    enabled: true
  });

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ['/api/comments', selectedDiscussion?.id],
    enabled: !!selectedDiscussion
  });

  const createDiscussionMutation = useMutation({
    mutationFn: async (newDiscussion: { title: string; content: string; category: string }) => {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDiscussion)
      });
      if (!response.ok) throw new Error('Failed to create discussion');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/discussions'] });
      setIsDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Bài viết đã được tạo.",
      });
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: async (comment: { content: string; discussionId: number }) => {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment)
      });
      if (!response.ok) throw new Error('Failed to create comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments'] });
      setNewComment("");
      toast({
        title: "Thành công",
        description: "Bình luận đã được thêm.",
      });
    }
  });

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDiscussion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    createDiscussionMutation.mutate({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: selectedCategory
    });
  };

  const handleCreateComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDiscussion) return;
    createCommentMutation.mutate({
      content: newComment,
      discussionId: selectedDiscussion.id
    });
  };

  const getAvatarUrl = (author: string) => {
    try {
      return `https://avatar.vercel.sh/${encodeURIComponent(author || 'anonymous')}`;
    } catch (error) {
      return 'https://avatar.vercel.sh/anonymous';
    }
  };

  const getAvatarFallback = (author: string) => {
    try {
      return (author?.[0] || 'A').toUpperCase();
    } catch (error) {
      return 'A';
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary slide-in">Diễn đàn cộng đồng</h1>
            <p className="text-lg text-muted-foreground slide-in" style={{ animationDelay: '0.1s' }}>
              Trao đổi, thảo luận về di sản văn hóa Huế
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 hover-lift">
                <Plus className="h-4 w-4" />
                Tạo bài viết mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo bài viết mới</DialogTitle>
                <DialogDescription>
                  Chia sẻ kiến thức, đặt câu hỏi hoặc thảo luận về di sản văn hóa Huế
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDiscussion} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input id="title" name="title" required placeholder="Nhập tiêu đề bài viết..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Nội dung</Label>
                  <Textarea
                    id="content"
                    name="content"
                    required
                    placeholder="Nhập nội dung bài viết..."
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">Đăng bài</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
                        <Card 
                          key={discussion.id} 
                          className={`cursor-pointer hover:shadow-md transition-shadow ${
                            selectedDiscussion?.id === discussion.id ? 'border-primary' : ''
                          }`}
                          onClick={() => setSelectedDiscussion(discussion)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={getAvatarUrl(discussion.author)} />
                                <AvatarFallback>{getAvatarFallback(discussion.author)}</AvatarFallback>
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

            {selectedDiscussion && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Bình luận</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50">
                        <Avatar>
                          <AvatarImage src={getAvatarUrl(comment.author)} />
                          <AvatarFallback>{getAvatarFallback(comment.author)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    <form onSubmit={handleCreateComment} className="mt-4">
                      <div className="flex gap-2">
                        <Input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Viết bình luận..."
                        />
                        <Button type="submit">Gửi</Button>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chủ đề thảo luận</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-start gap-3 interactive-element">
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
                  Tích điểm qua việc đóng góp bài viết và tham gia thảo luận
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm p-2 hover:bg-primary/5 rounded-lg transition-colors">
                    <span>Tạo bài viết mới</span>
                    <span className="font-medium">+10 điểm</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 hover:bg-primary/5 rounded-lg transition-colors">
                    <span>Bình luận hữu ích</span>
                    <span className="font-medium">+5 điểm</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 hover:bg-primary/5 rounded-lg transition-colors">
                    <span>Được đánh giá cao</span>
                    <span className="font-medium">+15 điểm</span>
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