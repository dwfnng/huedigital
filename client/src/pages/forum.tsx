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
import { MessageSquare, Award, Plus, Search, BookOpen, School, Heart, Shield, Trash2, MapPin } from 'lucide-react';

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

interface User {
  id: number;
  name: string;
  isAdmin: boolean;
}

export default function ForumPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('heritage');
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const categories: Category[] = [
    {
      id: 'heritage',
      name: 'Di sản văn hóa',
      icon: BookOpen,
      description: 'Thảo luận về các di sản văn hóa vật thể và phi vật thể tại Huế'
    },
    {
      id: 'research',
      name: 'Nghiên cứu học thuật',
      icon: School,
      description: 'Chia sẻ và thảo luận các nghiên cứu học thuật về Huế'
    },
    {
      id: 'experience',
      name: 'Trải nghiệm du lịch',
      icon: Heart,
      description: 'Chia sẻ trải nghiệm khi tham quan các địa điểm tại Huế'
    },
    {
      id: 'preservation',
      name: 'Bảo tồn di sản',
      icon: Shield,
      description: 'Thảo luận về các vấn đề bảo tồn và phát huy giá trị di sản'
    }
  ];

  const getAvatarUrl = (name: string) => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
  };

  const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const { data: discussions = [] } = useQuery({
    queryKey: ['/api/discussions'],
    queryFn: async () => {
      const response = await fetch('/api/discussions');
      if (!response.ok) throw new Error('Failed to fetch discussions');
      return response.json();
    }
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['/api/comments', selectedDiscussion?.id],
    queryFn: async () => {
      if (!selectedDiscussion) return [];
      const response = await fetch(`/api/comments?discussionId=${selectedDiscussion.id}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    },
    enabled: !!selectedDiscussion
  });

  const createDiscussionMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; category: string }) => {
      const discussion = {
        ...data,
        author: currentUser.name,
        views: 0,
        comments: 0,
        points: 0,
        createdAt: new Date().toISOString()
      };
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discussion)
      });
      if (!response.ok) throw new Error('Failed to create discussion');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/discussions'] });
      setIsDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Bài viết mới đã được tạo.",
      });
    }
  });

  const deleteDiscussionMutation = useMutation({
    mutationFn: async (discussionId: number) => {
      const response = await fetch(`/api/discussions/${discussionId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete discussion');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/discussions'] });
      if (selectedDiscussion) setSelectedDiscussion(null);
      toast({
        title: "Thành công",
        description: "Đã xóa bài viết.",
      });
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: async (comment: { content: string; discussionId: number }) => {
      const newComment = {
        ...comment,
        author: currentUser.name,
        createdAt: new Date().toISOString()
      };
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

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments'] });
      toast({
        title: "Thành công",
        description: "Đã xóa bình luận.",
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

  const handleDeleteDiscussion = async (discussionId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      deleteDiscussionMutation.mutate(discussionId);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const currentUser: User = {
    id: 1,
    name: "Nguyễn Văn A",
    isAdmin: true
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="page-header mb-8">
          <div className="page-header-content flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold">Diễn đàn cộng đồng</h1>
              <p className="mt-1">
                Trao đổi, thảo luận về di sản văn hóa Huế
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 royal-button">
                  <Plus className="h-4 w-4" />
                  Tạo bài viết mới
                </Button>
              </DialogTrigger>
              <DialogContent className="dialog-gradient">
                <DialogHeader className="dialog-header rounded-lg p-4 mb-4">
                  <DialogTitle>Tạo bài viết mới</DialogTitle>
                  <DialogDescription>
                    Chia sẻ kiến thức, đặt câu hỏi hoặc thảo luận về di sản văn hóa Huế
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateDiscussion} className="space-y-4">
                  <div className="space-y-2 content-section p-4 rounded-lg">
                    <Label htmlFor="title">Tiêu đề</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      required 
                      placeholder="Nhập tiêu đề bài viết..." 
                      className="enhanced-input"
                    />
                  </div>
                  <div className="space-y-2 content-section p-4 rounded-lg">
                    <Label htmlFor="content">Nội dung</Label>
                    <Textarea
                      id="content"
                      name="content"
                      required
                      placeholder="Nhập nội dung bài viết..."
                      className="min-h-[200px] enhanced-textarea"
                    />
                  </div>
                  <div className="flex justify-end gap-2 content-section p-4 rounded-lg">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit" className="royal-button">Đăng bài</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 enhanced-search"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-amber-900" />
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
                          className={`cursor-pointer hover:shadow-md transition-shadow enhanced-card ${
                            selectedDiscussion?.id === discussion.id ? 'border-amber-700' : ''
                          }`}
                          onClick={() => setSelectedDiscussion(discussion)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <Avatar>
                                  <AvatarImage src={getAvatarUrl(discussion.author)} />
                                  <AvatarFallback>{getAvatarFallback(discussion.author)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg mb-1 text-amber-900">{discussion.title}</h3>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{discussion.author}</span>
                                    <span>•</span>
                                    <span>{new Date(discussion.createdAt).toLocaleDateString('vi-VN')}</span>
                                  </div>
                                </div>
                              </div>
                              {currentUser.isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive/80"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDiscussion(discussion.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
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
              <Card className="mt-6 enhanced-card">
                <CardHeader>
                  <CardTitle>Bình luận</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="flex justify-between items-start p-3 rounded-lg content-section">
                        <div className="flex gap-3">
                          <Avatar>
                            <AvatarImage src={getAvatarUrl(comment.author)} />
                            <AvatarFallback>{getAvatarFallback(comment.author)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-amber-900">{comment.author}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <p className="mt-1">{comment.content}</p>
                          </div>
                        </div>
                        {currentUser.isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <form onSubmit={handleCreateComment} className="mt-4">
                      <div className="flex gap-2">
                        <Input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Viết bình luận..."
                          className="enhanced-input"
                        />
                        <Button type="submit" className="royal-button">Gửi</Button>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="enhanced-card">
              <CardHeader>
                <CardTitle>Chủ đề thảo luận</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-start gap-3 interactive-element p-2 rounded-lg content-section">
                      <category.icon className="h-5 w-5 text-amber-700 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-900">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="enhanced-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-700" />
                  Điểm tích lũy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Tích điểm qua việc đóng góp bài viết và tham gia thảo luận
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm p-2 content-section rounded-lg transition-colors">
                    <span>Tạo bài viết mới</span>
                    <span className="font-medium text-amber-700">+10 điểm</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 content-section rounded-lg transition-colors">
                    <span>Bình luận hữu ích</span>
                    <span className="font-medium text-amber-700">+5 điểm</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 content-section rounded-lg transition-colors">
                    <span>Được đánh giá cao</span>
                    <span className="font-medium text-amber-700">+15 điểm</span>
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