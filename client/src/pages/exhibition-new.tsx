import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  BookOpen,
  RotateCw,
  Maximize,
  Camera,
  PanelLeft,
  Share2,
  Download,
  MapPin,
  Clock,
  Search,
  Layers3,
  History,
  Box,
  ImageIcon,
  ChevronLeft,
} from "lucide-react";

// Exhibition data with 3D/AR content
const exhibitionItems = [
  {
    id: 1,
    title: "Điện Thái Hòa",
    titleEn: "Thai Hoa Palace",
    description:
      "Điện Thái Hòa là công trình kiến trúc chính trong Hoàng thành Huế, nơi diễn ra các nghi lễ quan trọng của triều đình nhà Nguyễn.",
    descriptionEn:
      "Thai Hoa Palace is the main architectural structure in Hue Imperial City, where important court ceremonies of the Nguyen Dynasty took place.",
    thumbnailUrl:
      "https://tourdanangcity.vn/wp-content/uploads/2023/02/dien-thai-hoa.jpg.jpg",
    panoramaUrl:
      "https://placehold.co/1200x800/EEE/31343C?text=Panorama+Di%E1%BB%87n+Th%C3%A1i+H%C3%B2a",
    model3dUrl:
      "https://placehold.co/600x400/EEE/31343C?text=3D+Model+Di%E1%BB%87n+Th%C3%A1i+H%C3%B2a",
    category: "palace",
    createPeriod: "1805-1833",
    dynasty: "Nguyễn",
    location: "Kinh thành Huế",
    virtualTourAvailable: true,
    arAvailable: true,
    historyInfo:
      "Điện Thái Hòa được xây dựng vào năm 1805 dưới triều vua Gia Long và hoàn thành vào năm 1833 dưới triều vua Minh Mạng. Đây là nơi diễn ra các lễ đăng quang, lễ mừng năm mới và các buổi thiết triều quan trọng.",
    architectureInfo:
      "Điện Thái Hòa theo kiểu kiến trúc cung đình truyền thống với nhiều chi tiết chạm khắc tinh xảo. Mái lợp ngói vàng, cột sơn đỏ. Bên trong điện có ngai vàng của vua đặt trên bệ cao.",
    restorationInfo:
      "Điện Thái Hòa đã trải qua nhiều đợt trùng tu lớn vào các năm 1923, 1968, và gần đây nhất là năm 2019 với sự hỗ trợ của UNESCO.",
    artifacts: [
      {
        name: "Ngai vàng",
        description:
          "Ngai vàng của các vị vua triều Nguyễn, được làm từ gỗ quý và dát vàng.",
        imageUrl: "https://th.bing.com/th/id/OIP.qbQbv9pGqI50w1rUioaZRAHaE8?rs=1&pid=ImgDetMain",
      },
      {
        name: "Cửu đỉnh",
        description:
          "Chín chiếc đỉnh đồng lớn tượng trưng cho quyền lực của các vị vua nhà Nguyễn.",
        imageUrl:
          "https://diemhendulich.net/du-lich/Cache/Uploads/camnangdulich/2022/thang9/cuu-dinh-o-hue.jpg",
      },
    ],
  },
  {
    id: 2,
    title: "Lăng Tự Đức",
    titleEn: "Tu Duc Tomb",
    description:
      "Lăng Tự Đức là lăng tẩm của vua Tự Đức, vị vua thứ 4 của triều đại nhà Nguyễn, được xây dựng từ năm 1864 đến 1867.",
    descriptionEn:
      "Tu Duc Tomb is the mausoleum of Emperor Tu Duc, the 4th emperor of the Nguyen Dynasty, built from 1864 to 1867.",
    thumbnailUrl:
      "https://placehold.co/600x400/EEE/31343C?text=L%C4%83ng+T%E1%BB%B1+%C4%90%E1%BB%A9c",
    panoramaUrl:
      "https://placehold.co/1200x800/EEE/31343C?text=Panorama+L%C4%83ng+T%E1%BB%B1+%C4%90%E1%BB%A9c",
    model3dUrl:
      "https://placehold.co/600x400/EEE/31343C?text=3D+Model+L%C4%83ng+T%E1%BB%B1+%C4%90%E1%BB%A9c",
    category: "tomb",
    createPeriod: "1864-1867",
    dynasty: "Nguyễn",
    location: "Hương Thủy, Thừa Thiên Huế",
    virtualTourAvailable: true,
    arAvailable: true,
    historyInfo:
      "Lăng Tự Đức được vua Tự Đức cho xây dựng từ năm 1864. Đây không chỉ là nơi an nghỉ của vua sau khi băng hà mà còn là nơi vua thường lui tới để làm thơ, câu cá và thưởng ngoạn trong những năm cuối đời.",
    architectureInfo:
      "Lăng Tự Đức được xây dựng trong một thung lũng hẹp với hồ nước, đảo nhỏ và nhiều công trình kiến trúc như điện Luân Khiêm, điện Hòa Khiêm và Minh Khiêm Đường.",
    restorationInfo:
      "Lăng Tự Đức đã được UNESCO công nhận là Di sản Văn hóa Thế giới vào năm 1993 và đã trải qua nhiều đợt trùng tu để bảo tồn giá trị lịch sử và kiến trúc.",
    artifacts: [
      {
        name: "Bia Cáo Mệnh",
        description:
          "Bia đá ghi lại tiểu sử và công đức của vua Tự Đức, do chính vua soạn trước khi băng hà.",
        imageUrl:
          "https://placehold.co/600x400/EEE/31343C?text=Bia+C%C3%A1o+M%E1%BB%87nh",
      },
      {
        name: "Tịnh Khiêm Các",
        description:
          "Thư viện của vua Tự Đức, nơi vua thường đọc sách và sáng tác thơ văn.",
        imageUrl:
          "https://placehold.co/600x400/EEE/31343C?text=T%E1%BB%8Bnh+Khi%C3%AAm+C%C3%A1c",
      },
    ],
  },
  {
    id: 3,
    title: "Chùa Thiên Mụ",
    titleEn: "Thien Mu Pagoda",
    description:
      "Chùa Thiên Mụ hay còn gọi là chùa Linh Mụ, là một ngôi chùa cổ nằm trên đồi Hà Khê, bên bờ sông Hương, cách trung tâm thành phố Huế khoảng 5km về phía tây.",
    descriptionEn:
      "Thien Mu Pagoda, also known as Linh Mu Pagoda, is an ancient temple located on Ha Khe Hill, on the banks of the Perfume River, about 5km west of Hue city center.",
    thumbnailUrl:
      "https://placehold.co/600x400/EEE/31343C?text=Ch%C3%B9a+Thi%C3%AAn+M%E1%BB%A5",
    panoramaUrl:
      "https://placehold.co/1200x800/EEE/31343C?text=Panorama+Ch%C3%B9a+Thi%C3%AAn+M%E1%BB%A5",
    model3dUrl:
      "https://placehold.co/600x400/EEE/31343C?text=3D+Model+Ch%C3%B9a+Thi%C3%AAn+M%E1%BB%A5",
    category: "temple",
    createPeriod: "1601",
    dynasty: "Nguyễn",
    location: "Đồi Hà Khê, Huế",
    virtualTourAvailable: true,
    arAvailable: false,
    historyInfo:
      "Chùa Thiên Mụ được xây dựng đầu tiên vào năm 1601 dưới thời chúa Nguyễn Hoàng. Theo truyền thuyết, chúa Nguyễn Hoàng trong một lần tuần tra đã gặp một bà lão mặc áo đỏ, quần xanh xuất hiện trên đồi và nói rằng sẽ có một vị chân chúa đến đây dựng chùa để thúc đẩy hưng thịnh cho vùng đất này.",
    architectureInfo:
      "Chùa Thiên Mụ có kiến trúc độc đáo với tháp Phước Duyên 7 tầng cao 21m, mỗi tầng tháp thờ một vị Phật. Ngoài ra, chùa còn có nhiều công trình kiến trúc khác như điện Đại Hùng, nhà Thuyết Pháp và Tàng Kinh Các.",
    restorationInfo:
      "Chùa Thiên Mụ đã trải qua nhiều lần trùng tu dưới các triều vua khác nhau, đặc biệt là dưới thời vua Thiệu Trị năm 1844 và gần đây được bảo tồn và tôn tạo như một di tích lịch sử văn hóa quan trọng.",
    artifacts: [
      {
        name: "Tháp Phước Duyên",
        description:
          "Tháp 7 tầng cao 21m, được xây dựng năm 1844 dưới triều vua Thiệu Trị.",
        imageUrl:
          "https://placehold.co/600x400/EEE/31343C?text=Th%C3%A1p+Ph%C6%B0%E1%BB%9Bc+Duy%C3%AAn",
      },
      {
        name: "Đại Hồng Chung",
        description: "Quả chuông đồng lớn đúc năm 1710, nặng khoảng 2,5 tấn.",
        imageUrl:
          "https://placehold.co/600x400/EEE/31343C?text=%C4%90%E1%BA%A1i+H%E1%BB%93ng+Chung",
      },
    ],
  },
];

// Filter component - Simplified version with only search function
const ExhibitionFilter = ({
  onSearch,
  searchTerm,
}: {
  onSearch: (term: string) => void;
  searchTerm: string;
}) => {
  return (
    <div className="bg-card rounded-lg p-4 mb-6">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm triển lãm..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

// Exhibition card component
const ExhibitionCard = ({ item }: { item: (typeof exhibitionItems)[0] }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-medium">{item.title}</h3>
            <p className="text-white/80 text-xs">{item.titleEn}</p>
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            {item.virtualTourAvailable && (
              <Badge variant="secondary" className="bg-[#B5935A]/90 text-white">
                <Eye className="h-3 w-3 mr-1" /> 360°
              </Badge>
            )}
            {item.arAvailable && (
              <Badge
                variant="secondary"
                className="bg-emerald-600/90 text-white"
              >
                <Box className="h-3 w-3 mr-1" /> AR
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>{item.createPeriod}</span>
              <span className="mx-2">•</span>
              <span>{item.dynasty}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{item.location}</span>
            </div>
          </div>

          <Badge variant="outline" className="text-xs">
            {item.category === "palace"
              ? "Cung điện"
              : item.category === "tomb"
                ? "Lăng tẩm"
                : item.category === "temple"
                  ? "Chùa/Đền"
                  : "Kiến trúc"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
};

// Detailed view component
const ExhibitionDetail = ({
  item,
  onBack,
}: {
  item: (typeof exhibitionItems)[0];
  onBack: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("panorama");

  return (
    <div className="relative">
      {/* Imperial corner decorations for detail view */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-[url('/corner-decoration.svg')] bg-no-repeat opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-[url('/corner-decoration.svg')] bg-no-repeat transform scale-x-[-1] opacity-20 pointer-events-none"></div>

      <div className="animate-fade-in space-y-6 bg-[#F5E1A4]/30 dark:bg-zinc-900/50 backdrop-blur-sm p-6 rounded-lg relative z-10">
        {/* Back button with imperial styling */}
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="gap-1 bg-[#B5935A] hover:bg-[#9E7C47] text-black border-[#8D6A3F]/50 hover:border-[#C49A44]"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-[#3A1A1A]/80 hover:bg-[#3A1A1A] text-[#F5E1A4] border-[#8D6A3F]/50 hover:border-[#C49A44]"
            >
              <Share2 className="h-4 w-4" />
              <span>Chia sẻ</span>
            </Button>
          </div>
        </div>

        {/* Title with imperial styling */}
        <div className="bg-[#6B2B2B]/90 text-white p-5 rounded-lg border border-[#8D6A3F]/50 shadow-lg mb-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-[#F5E1A4] mb-1">
              {item.title}
            </h1>
            <p className="text-white/80 text-sm">{item.titleEn}</p>

            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#C49A44] to-transparent my-3"></div>

            <div className="flex flex-wrap gap-3 mt-4 text-sm">
              <Badge className="bg-[#3A1A1A] text-[#F5E1A4] border-[#8D6A3F] hover:bg-[#3A1A1A]/80">
                <Clock className="h-3 w-3 mr-1" /> {item.createPeriod}
              </Badge>
              <Badge className="bg-[#3A1A1A] text-[#F5E1A4] border-[#8D6A3F] hover:bg-[#3A1A1A]/80">
                <History className="h-3 w-3 mr-1" /> {item.dynasty}
              </Badge>
              <Badge className="bg-[#3A1A1A] text-[#F5E1A4] border-[#8D6A3F] hover:bg-[#3A1A1A]/80">
                <MapPin className="h-3 w-3 mr-1" /> {item.location}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs with imperial styling */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="w-full bg-[#3A1A1A]/80 p-1 border border-[#8D6A3F]/50">
            <TabsTrigger
              value="panorama"
              className="gap-2 data-[state=active]:bg-[#6B2B2B] data-[state=active]:text-[#F5E1A4]"
            >
              <Eye className="h-4 w-4" />
              <span>Panorama 360°</span>
            </TabsTrigger>
            <TabsTrigger
              value="3d"
              className="gap-2 data-[state=active]:bg-[#6B2B2B] data-[state=active]:text-[#F5E1A4]"
            >
              <Box className="h-4 w-4" />
              <span>Mô hình 3D</span>
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="gap-2 data-[state=active]:bg-[#6B2B2B] data-[state=active]:text-[#F5E1A4]"
            >
              <BookOpen className="h-4 w-4" />
              <span>Thông tin</span>
            </TabsTrigger>
            <TabsTrigger
              value="artifacts"
              className="gap-2 data-[state=active]:bg-[#6B2B2B] data-[state=active]:text-[#F5E1A4]"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Hiện vật</span>
            </TabsTrigger>
          </TabsList>

          {/* Panorama tab content */}
          <TabsContent value="panorama" className="space-y-4">
            <div className="relative h-[70vh] bg-[#3A1A1A]/30 rounded-lg overflow-hidden border border-[#8D6A3F]/40">
              <div className="absolute inset-0">
                <img
                  src={item.panoramaUrl}
                  alt={`Panorama ${item.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1 bg-[#3A1A1A]/90 hover:bg-[#3A1A1A] text-[#F5E1A4] border border-[#8D6A3F]/50"
                >
                  <RotateCw className="h-4 w-4" />
                  <span>Xoay</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1 bg-[#3A1A1A]/90 hover:bg-[#3A1A1A] text-[#F5E1A4] border border-[#8D6A3F]/50"
                >
                  <Maximize className="h-4 w-4" />
                  <span>Toàn màn h �nh</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1 bg-[#3A1A1A]/90 hover:bg-[#3A1A1A] text-[#F5E1A4] border border-[#8D6A3F]/50"
                >
                  <Camera className="h-4 w-4" />
                  <span>Chụp ảnh</span>
                </Button>
              </div>
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="bg-[#3A1A1A]/90 text-[#F5E1A4] border border-[#8D6A3F]/50"
                >
                  Nhấn và kéo để xoay góc nhìn
                </Badge>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 bg-[#3A1A1A]/80 hover:bg-[#3A1A1A] text-[#F5E1A4] border-[#8D6A3F]/50"
              >
                <Download className="h-4 w-4" />
                <span>Tải xuống hình ảnh</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="gap-1 bg-[#6B2B2B] hover:bg-[#6B2B2B]/80 text-[#F5E1A4]"
              >
                <PanelLeft className="h-4 w-4" />
                <span>Bật thuyết minh</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="3d" className="space-y-4">
            <div className="relative h-[70vh] bg-[#3A1A1A]/30 rounded-lg overflow-hidden border border-[#8D6A3F]/40">
              <div className="absolute inset-0">
                <img
                  src={item.model3dUrl}
                  alt={`3D Model ${item.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1 bg-[#3A1A1A]/90 hover:bg-[#3A1A1A] text-[#F5E1A4] border border-[#8D6A3F]/50"
                >
                  <RotateCw className="h-4 w-4" />
                  <span>Xoay mô hình</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1 bg-[#3A1A1A]/90 hover:bg-[#3A1A1A] text-[#F5E1A4] border border-[#8D6A3F]/50"
                >
                  <Maximize className="h-4 w-4" />
                  <span>Toàn màn hình</span>
                </Button>
              </div>
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="bg-[#3A1A1A]/90 text-[#F5E1A4] border border-[#8D6A3F]/50"
                >
                  Nhấn và kéo để xoay mô hình
                </Badge>
              </div>
            </div>

            {item.arAvailable && (
              <div className="flex justify-center">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1 bg-[#6B2B2B] hover:bg-[#6B2B2B]/80 text-[#F5E1A4]"
                >
                  <Box className="h-4 w-4" />
                  <span>Xem bằng AR</span>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-[#F5E1A4]/50 dark:bg-[#3A1A1A]/70 p-4 rounded-lg border border-[#8D6A3F]/30">
                  <div className="flex items-center mb-3">
                    <History className="h-5 w-5 text-[#B5935A] mr-2" />
                    <h3 className="text-lg font-medium text-[#6B2B2B] dark:text-[#F5E1A4]">
                      Lịch sử
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{item.historyInfo}</p>
                </div>

                <div className="bg-[#F5E1A4]/50 dark:bg-[#3A1A1A]/70 p-4 rounded-lg border border-[#8D6A3F]/30">
                  <div className="flex items-center mb-3">
                    <Layers3 className="h-5 w-5 text-[#B5935A] mr-2" />
                    <h3 className="text-lg font-medium text-[#6B2B2B] dark:text-[#F5E1A4]">
                      Kiến trúc
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    {item.architectureInfo}
                  </p>
                </div>

                <div className="bg-[#F5E1A4]/50 dark:bg-[#3A1A1A]/70 p-4 rounded-lg border border-[#8D6A3F]/30">
                  <div className="flex items-center mb-3">
                    <RotateCw className="h-5 w-5 text-[#B5935A] mr-2" />
                    <h3 className="text-lg font-medium text-[#6B2B2B] dark:text-[#F5E1A4]">
                      Trùng tu và bảo tồn
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    {item.restorationInfo}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#F5E1A4]/50 dark:bg-[#3A1A1A]/70 p-4 rounded-lg border border-[#8D6A3F]/30">
                  <h3 className="text-lg font-medium mb-3 text-[#6B2B2B] dark:text-[#F5E1A4]">
                    Thông tin cơ bản
                  </h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Phân loại:</dt>
                      <dd className="font-medium">
                        {item.category === "palace"
                          ? "Cung điện"
                          : item.category === "tomb"
                            ? "Lăng tẩm"
                            : item.category === "temple"
                              ? "Chùa/Đền"
                              : "Kiến trúc"}
                      </dd>
                    </div>
                    <Separator className="bg-[#8D6A3F]/30" />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        Thời kỳ xây dựng:
                      </dt>
                      <dd className="font-medium">{item.createPeriod}</dd>
                    </div>
                    <Separator className="bg-[#8D6A3F]/30" />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Triều đại:</dt>
                      <dd className="font-medium">{item.dynasty}</dd>
                    </div>
                    <Separator className="bg-[#8D6A3F]/30" />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Vị trí:</dt>
                      <dd className="font-medium">{item.location}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-[#F5E1A4]/50 dark:bg-[#3A1A1A]/70 p-4 rounded-lg border border-[#8D6A3F]/30">
                  <h3 className="text-lg font-medium mb-3 text-[#6B2B2B] dark:text-[#F5E1A4]">
                    Trải nghiệm khác
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2 border-[#8D6A3F]/50 hover:border-[#C49A44] hover:bg-[#F5E1A4]/20"
                    >
                      <MapPin className="h-4 w-4 text-[#B5935A]" />
                      <span>Xem trên bản đồ</span>
                    </Button>
                    {item.arAvailable && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 border-[#8D6A3F]/50 hover:border-[#C49A44] hover:bg-[#F5E1A4]/20"
                      >
                        <Box className="h-4 w-4 text-[#B5935A]" />
                        <span>Trải nghiệm thực tế ảo tăng cường</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2 border-[#8D6A3F]/50 hover:border-[#C49A44] hover:bg-[#F5E1A4]/20"
                    >
                      <Download className="h-4 w-4 text-[#B5935A]" />
                      <span>Tải xuống thông tin</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2 border-[#8D6A3F]/50 hover:border-[#C49A44] hover:bg-[#F5E1A4]/20"
                    >
                      <Share2 className="h-4 w-4 text-[#B5935A]" />
                      <span>Chia sẻ</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="artifacts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {item.artifacts.map((artifact, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border border-[#8D6A3F]/30 bg-[#F5E1A4]/30 dark:bg-[#3A1A1A]/70"
                >
                  <div className="relative h-48">
                    <img
                      src={artifact.imageUrl}
                      alt={artifact.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2 text-[#6B2B2B] dark:text-[#F5E1A4]">
                      {artifact.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {artifact.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Main exhibition page
export default function ExhibitionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    (typeof exhibitionItems)[0] | null
  >(null);
  const [selectedTab, setSelectedTab] = useState<
    "3d-ar" | "3d-360" | "3d-model"
  >("3d-ar");

  // Filter items based on search only
  const filteredItems = exhibitionItems.filter((item) => {
    const matchesSearch = searchTerm
      ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesSearch;
  });

  return (
    <div className="min-h-screen relative">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('/imperial-pattern.svg')] bg-repeat opacity-10 pointer-events-none"></div>

      {/* Imperial corner decorations */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-[url('/corner-decoration.svg')] bg-no-repeat opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-[url('/corner-decoration.svg')] bg-no-repeat transform scale-x-[-1] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[url('/corner-decoration.svg')] bg-no-repeat transform scale-y-[-1] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[url('/corner-decoration.svg')] bg-no-repeat transform scale-x-[-1] scale-y-[-1] opacity-30 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {!selectedItem ? (
          <div className="bg-[#F5E1A4]/30 dark:bg-zinc-900/50 backdrop-blur-sm py-8 rounded-lg">
            {/* Imperial-style header */}
            <div className="bg-[#3A1A1A]/90 text-white p-6 rounded-t-xl border border-[#8D6A3F]/50 shadow-lg">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#F5E1A4]">
                  3D/AR EXHIBITION
                </h1>
                <p className="text-white/70 mb-2">
                  HOÀNG THÀNH HUẾ - HISTORICAL SITE
                </p>
                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#C49A44] to-transparent mx-auto my-4"></div>
                <p className="mt-4 text-white/80">
                  Khám phá không gian 3D và thực tế ảo tăng cường của các di
                  tích lịch sử và kiến trúc Huế
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto p-6">
              <div
                className="bg-[#3A1A1A]/60 hover:bg-[#3A1A1A]/80 transition-all p-5 rounded-lg border border-[#8D6A3F]/40 hover:border-[#C49A44] hover:shadow-md cursor-pointer group"
                onClick={() => setSelectedTab("3d-ar")}
              >
                <div className="text-[#F5E1A4] font-bold text-xl md:text-2xl mb-1 group-hover:text-[#F5E1A4]">
                  3D-AR
                </div>
                <div className="text-xs text-white/60 uppercase tracking-wider mb-3">
                  EXHIBITION
                </div>
                <p className="text-sm text-white/70 line-clamp-3">
                  Trải nghiệm thực tế ảo tăng cường giúp bạn khám phá di tích
                  ngay tại vị trí của mình
                </p>
              </div>

              <div
                className="bg-[#3A1A1A]/60 hover:bg-[#3A1A1A]/80 transition-all p-5 rounded-lg border border-[#8D6A3F]/40 hover:border-[#C49A44] hover:shadow-md cursor-pointer group"
                onClick={() => setSelectedTab("3d-360")}
              >
                <div className="text-[#F5E1A4] font-bold text-xl md:text-2xl mb-1 group-hover:text-[#F5E1A4]">
                  3D 360°
                </div>
                <div className="text-xs text-white/60 uppercase tracking-wider mb-3">
                  PANORAMIC VIEW
                </div>
                <p className="text-sm text-white/70 line-clamp-3">
                  Khám phá không gian 360 độ của các di tích, đền đài và cung
                  điện của cố đô Huế
                </p>
              </div>

              <div
                className="bg-[#3A1A1A]/60 hover:bg-[#3A1A1A]/80 transition-all p-5 rounded-lg border border-[#8D6A3F]/40 hover:border-[#C49A44] hover:shadow-md cursor-pointer group"
                onClick={() => setSelectedTab("3d-model")}
              >
                <div className="text-[#F5E1A4] font-bold text-xl md:text-2xl mb-1 group-hover:text-[#F5E1A4]">
                  3D Model
                </div>
                <div className="text-xs text-white/60 uppercase tracking-wider mb-3">
                  EXHIBITION
                </div>
                <p className="text-sm text-white/70 line-clamp-3">
                  Mô hình 3D chi tiết của các công trình kiến trúc lịch sử, giúp
                  bạn hiểu rõ hơn về cấu trúc
                </p>
              </div>
            </div>

            {/* Filter section */}
            <div className="bg-[#F5E1A4]/80 dark:bg-zinc-800/80 backdrop-blur-md py-4 px-6 border-x border-[#8D6A3F]/30">
              <ExhibitionFilter
                onSearch={setSearchTerm}
                searchTerm={searchTerm}
              />
            </div>

            {/* Exhibition categories */}

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="cursor-pointer transition-transform hover:-translate-y-1 duration-300"
                >
                  <ExhibitionCard item={item} />
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12 bg-white/70 dark:bg-zinc-800/70 rounded-lg backdrop-blur-sm">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#F5E1A4]/20 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-[#8D6A3F]" />
                </div>
                <h3 className="text-xl font-medium text-[#6B2B2B]">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-muted-foreground mt-2">
                  Không tìm thấy kết quả phù hợp với bộ lọc hiện tại.
                </p>
                <Button
                  variant="link"
                  className="text-[#8D6A3F] hover:text-[#6B2B2B] mt-2"
                  onClick={() => {
                    setSearchTerm("");
                  }}
                >
                  Xóa tìm kiếm
                </Button>
              </div>
            )}
          </div>
        ) : (
          <ExhibitionDetail
            item={selectedItem}
            onBack={() => setSelectedItem(null)}
          />
        )}
      </div>
    </div>
  );
}
