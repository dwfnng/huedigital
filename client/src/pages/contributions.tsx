import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Image, 
  Video, 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Search,
  Award
} from 'lucide-react';

const contributionTypes = [
  {
    id: 'image',
    name: 'Hình ảnh',
    icon: Image,
    description: 'Ảnh tư liệu, hình ảnh lịch sử'
  },
  {
    id: 'video',
    name: 'Video',
    icon: Video,
    description: 'Video tư liệu, phim tài liệu'
  },
  {
    id: 'document',
    name: 'Tài liệu',
    icon: FileText,
    description: 'Văn bản, tài liệu nghiên cứu'
  }
];

const mockContributions = [
  {
    id: 1,
    title: "Bộ ảnh Kỳ Đài năm 1900",
    description: "Bộ sưu tập ảnh quý về Kỳ Đài Huế từ đầu thế kỷ 20",
    type: "image",
    author: "NguyenVanA",
    status: "approved",
    points: 15,
    createdAt: "2024-02-28T15:30:00.000Z",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Kỳ_đài_Huế.jpg"
  },
  {
    id: 2,
    title: "Tư liệu về hoạt động giảng dạy tại Quốc Tử Giám",
    description: "Tài liệu nghiên cứu về phương pháp giảng dạy tại trường Quốc Tử Giám thời Nguyễn",
    type: "document",
    author: "TranThiB",
    status: "pending",
    points: 0,
    createdAt: "2024-02-27T10:15:00.000Z",
    thumbnailUrl: "https://media.mia.vn/uploads/blog-du-lich/truong-quoc-tu-giam-hue-ngoi-truong-danh-gia-nhat-cua-trieu-nguyen-xua-1-1637922298.jpg"
  }
];

export default function ContributionsPage() {
  const [selectedType, setSelectedType] = useState("image");
  const [searchTerm, setSearchTerm] = useState("");

  // TODO: Replace with actual API calls
  const { data: contributions = mockContributions } = useQuery({
    queryKey: ['/api/contributions', selectedType],
    enabled: false // Disabled until API is implemented
  });

  const filteredContributions = contributions.filter(contribution =>
    contribution.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-primary">Đóng góp tư liệu số</h1>
            <p className="text-lg text-muted-foreground">
              Chia sẻ tư liệu lịch sử, góp phần bảo tồn di sản Huế
            </p>
          </div>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Đóng góp tư liệu
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm tư liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>

            <Tabs defaultValue={selectedType} onValueChange={setSelectedType}>
              <TabsList className="grid grid-cols-3 mb-6">
                {contributionTypes.map(type => (
                  <TabsTrigger key={type.id} value={type.id}>
                    <type.icon className="h-4 w-4 mr-2" />
                    {type.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {contributionTypes.map(type => (
                <TabsContent key={type.id} value={type.id}>
                  <ScrollArea className="h-[600px]">
                    <div className="grid grid-cols-1 gap-4">
                      {filteredContributions.map(contribution => (
                        <Card key={contribution.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-40 h-32 relative rounded-lg overflow-hidden">
                                <img
                                  src={contribution.thumbnailUrl}
                                  alt={contribution.title}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{contribution.title}</h3>
                                  {getStatusIcon(contribution.status)}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {contribution.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={`https://avatar.vercel.sh/${contribution.author}`} />
                                      <AvatarFallback>{contribution.author[0]}</AvatarFallback>
                                    </Avatar>
                                    <span>{contribution.author}</span>
                                  </div>
                                  <span>•</span>
                                  <span>{new Date(contribution.createdAt).toLocaleDateString('vi-VN')}</span>
                                  {contribution.points > 0 && (
                                    <>
                                      <span>•</span>
                                      <div className="flex items-center gap-1">
                                        <Award className="h-4 w-4" />
                                        {contribution.points} điểm
                                      </div>
                                    </>
                                  )}
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
                <CardTitle>Loại tư liệu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contributionTypes.map(type => (
                    <div key={type.id} className="flex items-start gap-3">
                      <type.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
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
                  Điểm thưởng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Nhận điểm thưởng khi đóng góp tư liệu được duyệt
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hình ảnh lịch sử</span>
                    <span>+15 điểm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Video tư liệu</span>
                    <span>+20 điểm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tài liệu nghiên cứu</span>
                    <span>+25 điểm</span>
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
