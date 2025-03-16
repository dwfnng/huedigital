import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  BookOpen, 
  Info, 
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
  Cube,
  ImageIcon
} from "lucide-react";

// Exhibition data with 3D/AR content
const exhibitionItems = [
  {
    id: 1,
    title: "Điện Thái Hòa",
    titleEn: "Thai Hoa Palace",
    description: "Điện Thái Hòa là công trình kiến trúc chính trong Hoàng thành Huế, nơi diễn ra các nghi lễ quan trọng của triều đình nhà Nguyễn.",
    descriptionEn: "Thai Hoa Palace is the main architectural structure in Hue Imperial City, where important court ceremonies of the Nguyen Dynasty took place.",
    thumbnailUrl: "https://placehold.co/600x400/EEE/31343C?text=Di%E1%BB%87n+Th%C3%A1i+H%C3%B2a",
    panoramaUrl: "https://placehold.co/1200x800/EEE/31343C?text=Panorama+Di%E1%BB%87n+Th%C3%A1i+H%C3%B2a",
    model3dUrl: "https://placehold.co/600x400/EEE/31343C?text=3D+Model+Di%E1%BB%87n+Th%C3%A1i+H%C3%B2a",
    category: "palace",
    createPeriod: "1805-1833",
    dynasty: "Nguyễn",
    location: "Kinh thành Huế",
    virtualTourAvailable: true,
    arAvailable: true,
    historyInfo: "Điện Thái Hòa được xây dựng vào năm 1805 dưới triều vua Gia Long và hoàn thành vào năm 1833 dưới triều vua Minh Mạng. Đây là nơi diễn ra các lễ đăng quang, lễ mừng năm mới và các buổi thiết triều quan trọng.",
    architectureInfo: "Điện Thái Hòa theo kiểu kiến trúc cung đình truyền thống với nhiều chi tiết chạm khắc tinh xảo. Mái lợp ngói vàng, cột sơn đỏ. Bên trong điện có ngai vàng của vua đặt trên bệ cao.",
    restorationInfo: "Điện Thái Hòa đã trải qua nhiều đợt trùng tu lớn vào các năm 1923, 1968, và gần đây nhất là năm 2019 với sự hỗ trợ của UNESCO.",
    artifacts: [
      {
        name: "Ngai vàng",
        description: "Ngai vàng của các vị vua triều Nguyễn, được làm từ gỗ quý và dát vàng.",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=Ngai+v%C3%A0ng"
      },
      {
        name: "Cửu đỉnh",
        description: "Chín chiếc đỉnh đồng lớn tượng trưng cho quyền lực của các vị vua nhà Nguyễn.",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=C%E1%BB%ADu+%C4%91%E1%BB%89nh"
      }
    ]
  },
  {
    id: 2,
    title: "Lăng Tự Đức",
    titleEn: "Tu Duc Tomb",
    description: "Lăng Tự Đức là lăng tẩm của vua Tự Đức, vị vua thứ 4 của triều đại nhà Nguyễn, được xây dựng từ năm 1864 đến 1867.",
    descriptionEn: "Tu Duc Tomb is the mausoleum of Emperor Tu Duc, the 4th emperor of the Nguyen Dynasty, built from 1864 to 1867.",
    thumbnailUrl: "https://placehold.co/600x400/EEE/31343C?text=L%C4%83ng+T%E1%BB%B1+%C4%90%E1%BB%A9c",
    panoramaUrl: "https://placehold.co/1200x800/EEE/31343C?text=Panorama+L%C4%83ng+T%E1%BB%B1+%C4%90%E1%BB%A9c",
    model3dUrl: "https://placehold.co/600x400/EEE/31343C?text=3D+Model+L%C4%83ng+T%E1%BB%B1+%C4%90%E1%BB%A9c",
    category: "tomb",
    createPeriod: "1864-1867",
    dynasty: "Nguyễn",
    location: "Hương Thủy, Thừa Thiên Huế",
    virtualTourAvailable: true,
    arAvailable: true,
    historyInfo: "Lăng Tự Đức được vua Tự Đức cho xây dựng từ năm 1864. Đây không chỉ là nơi an nghỉ của vua sau khi băng hà mà còn là nơi vua thường lui tới để làm thơ, câu cá và thưởng ngoạn trong những năm cuối đời.",
    architectureInfo: "Lăng Tự Đức được xây dựng trong một thung lũng hẹp với hồ nước, đảo nhỏ và nhiều công trình kiến trúc như điện Luân Khiêm, điện Hòa Khiêm và Minh Khiêm Đường.",
    restorationInfo: "Lăng Tự Đức đã được UNESCO công nhận là Di sản Văn hóa Thế giới vào năm 1993 và đã trải qua nhiều đợt trùng tu để bảo tồn giá trị lịch sử và kiến trúc.",
    artifacts: [
      {
        name: "Bia Cáo Mệnh",
        description: "Bia đá ghi lại tiểu sử và công đức của vua Tự Đức, do chính vua soạn trước khi băng hà.",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=Bia+C%C3%A1o+M%E1%BB%87nh"
      },
      {
        name: "Tịnh Khiêm Các",
        description: "Thư viện của vua Tự Đức, nơi vua thường đọc sách và sáng tác thơ văn.",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=T%E1%BB%8Bnh+Khi%C3%AAm+C%C3%A1c"
      }
    ]
  },
  {
    id: 3,
    title: "Chùa Thiên Mụ",
    titleEn: "Thien Mu Pagoda",
    description: "Chùa Thiên Mụ hay còn gọi là chùa Linh Mụ, là một ngôi chùa cổ nằm trên đồi Hà Khê, bên bờ sông Hương, cách trung tâm thành phố Huế khoảng 5km về phía tây.",
    descriptionEn: "Thien Mu Pagoda, also known as Linh Mu Pagoda, is an ancient temple located on Ha Khe Hill, on the banks of the Perfume River, about 5km west of Hue city center.",
    thumbnailUrl: "https://placehold.co/600x400/EEE/31343C?text=Ch%C3%B9a+Thi%C3%AAn+M%E1%BB%A5",
    panoramaUrl: "https://placehold.co/1200x800/EEE/31343C?text=Panorama+Ch%C3%B9a+Thi%C3%AAn+M%E1%BB%A5",
    model3dUrl: "https://placehold.co/600x400/EEE/31343C?text=3D+Model+Ch%C3%B9a+Thi%C3%AAn+M%E1%BB%A5",
    category: "temple",
    createPeriod: "1601",
    dynasty: "Nguyễn",
    location: "Đồi Hà Khê, Huế",
    virtualTourAvailable: true,
    arAvailable: false,
    historyInfo: "Chùa Thiên Mụ được xây dựng đầu tiên vào năm 1601 dưới thời chúa Nguyễn Hoàng. Theo truyền thuyết, chúa Nguyễn Hoàng trong một lần tuần tra đã gặp một bà lão mặc áo đỏ, quần xanh xuất hiện trên đồi và nói rằng sẽ có một vị chân chúa đến đây dựng chùa để thúc đẩy hưng thịnh cho vùng đất này.",
    architectureInfo: "Chùa Thiên Mụ có kiến trúc độc đáo với tháp Phước Duyên 7 tầng cao 21m, mỗi tầng tháp thờ một vị Phật. Ngoài ra, chùa còn có nhiều công trình kiến trúc khác như điện Đại Hùng, nhà Thuyết Pháp và Tàng Kinh Các.",
    restorationInfo: "Chùa Thiên Mụ đã trải qua nhiều lần trùng tu dưới các triều vua khác nhau, đặc biệt là dưới thời vua Thiệu Trị năm 1844 và gần đây được bảo tồn và tôn tạo như một di tích lịch sử văn hóa quan trọng.",
    artifacts: [
      {
        name: "Tháp Phước Duyên",
        description: "Tháp 7 tầng cao 21m, được xây dựng năm 1844 dưới triều vua Thiệu Trị.",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=Th%C3%A1p+Ph%C6%B0%E1%BB%9Bc+Duy%C3%AAn"
      },
      {
        name: "Đại Hồng Chung",
        description: "Quả chuông đồng lớn đúc năm 1710, nặng khoảng 2,5 tấn.",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=%C4%90%E1%BA%A1i+H%E1%BB%93ng+Chung"
      }
    ]
  },
  {
    id: 4,
    title: "Cung An Định",
    titleEn: "An Dinh Palace",
    description: "Cung An Định là cung điện của vua Khải Định và sau đó là nơi ở của vua Bảo Đại - vị vua cuối cùng của triều Nguyễn cùng với Hoàng hậu Nam Phương và các con.",
    descriptionEn: "An Dinh Palace was the palace of King Khai Dinh and later the residence of King Bao Dai - the last king of the Nguyen Dynasty along with Queen Nam Phuong and their children.",
    thumbnailUrl: "https://placehold.co/600x400/EEE/31343C?text=Cung+An+%C4%90%E1%BB%8Bnh",
    panoramaUrl: "https://placehold.co/1200x800/EEE/31343C?text=Panorama+Cung+An+%C4%90%E1%BB%8Bnh",
    model3dUrl: "https://placehold.co/600x400/EEE/31343C?text=3D+Model+Cung+An+%C4%90%E1%BB%8Bnh",
    category: "palace",
    createPeriod: "1917-1918",
    dynasty: "Nguyễn",
    location: "Phường Vĩnh Ninh, Thành phố Huế",
    virtualTourAvailable: true,
    arAvailable: false,
    historyInfo: "Cung An Định được xây dựng vào những năm 1917-1918 dưới thời vua Khải Định. Sau khi vua Khải Định băng hà, cung điện trở thành nơi ở của Hoàng tử Vĩnh Thụy (sau này là vua Bảo Đại) cùng với Hoàng hậu Nam Phương và các con.",
    architectureInfo: "Cung An Định là sự kết hợp hài hòa giữa kiến trúc phương Đông và phương Tây với ba tầng và một tháp cao ở trung tâm. Các chi tiết trang trí trên tường và trần đều thể hiện sự tinh xảo và nghệ thuật cao.",
    restorationInfo: "Cung An Định đã được trùng tu và bảo tồn nhiều lần, đặc biệt là vào năm 2012 với sự hỗ trợ của chính phủ Pháp để khôi phục lại vẻ đẹp nguyên bản.",
    artifacts: [
      {
        name: "Tranh khảm sành sứ",
        description: "Những bức tranh khảm sành sứ trên tường thể hiện các cảnh vật thiên nhiên, lịch sử và văn học.",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=Tranh+kh%E1%BA%A3m+s%C3%A0nh+s%E1%BB%A9"
      },
      {
        name: "Bộ sưu tập đồ cổ",
        description: "Bộ sưu tập các đồ cổ của triều Nguyễn bao gồm đồ gốm, đồ đồng và các tác phẩm nghệ thuật.",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=B%E1%BB%99+s%C6%B0u+t%E1%BA%ADp+%C4%91%E1%BB%93+c%E1%BB%95"
      }
    ]
  },
  {
    id: 5,
    title: "Đại Nội Huế",
    titleEn: "Hue Imperial City",
    description: "Đại Nội Huế hay Hoàng thành Huế là một quần thể kiến trúc nằm trong Kinh thành Huế, được xây dựng dưới triều Nguyễn từ năm 1805 đến 1832.",
    descriptionEn: "Hue Imperial City is an architectural complex located within the Hue Citadel, built under the Nguyen Dynasty from 1805 to 1832.",
    thumbnailUrl: "https://placehold.co/600x400/EEE/31343C?text=%C4%90%E1%BA%A1i+N%E1%BB%99i+Hu%E1%BA%BF",
    panoramaUrl: "https://placehold.co/1200x800/EEE/31343C?text=Panorama+%C4%90%E1%BA%A1i+N%E1%BB%99i+Hu%E1%BA%BF",
    model3dUrl: "https://placehold.co/600x400/EEE/31343C?text=3D+Model+%C4%90%E1%BA%A1i+N%E1%BB%99i+Hu%E1%BA%BF",
    category: "palace",
    createPeriod: "1805-1832",
    dynasty: "Nguyễn",
    location: "Thành phố Huế",
    virtualTourAvailable: true,
    arAvailable: true,
    historyInfo: "Đại Nội Huế được khởi công xây dựng vào năm 1805 dưới triều vua Gia Long và hoàn thành vào năm 1832 dưới triều vua Minh Mạng. Đây là nơi sinh sống và làm việc của 13 vị vua triều Nguyễn trong giai đoạn từ 1802 đến 1945.",
    architectureInfo: "Đại Nội Huế được xây dựng theo nguyên tắc phong thủy và thể hiện triết lý âm dương của phương Đông. Quần thể này gồm nhiều công trình kiến trúc như Ngọ Môn, điện Thái Hòa, Tử Cấm Thành, Thế Miếu và nhiều cung điện khác.",
    restorationInfo: "Đại Nội Huế đã bị tàn phá nặng nề trong chiến tranh, đặc biệt là trong cuộc chiến tranh Việt Nam. Nhiều dự án trùng tu đã được thực hiện kể từ khi UNESCO công nhận nó là Di sản Văn hóa Thế giới vào năm 1993.",
    artifacts: [
      {
        name: "Ngọ Môn",
        description: "Cổng chính vào Hoàng thành Huế, được xây dựng năm 1833 dưới triều vua Minh Mạng.",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=Ng%E1%BB%8D+M%C3%B4n"
      },
      {
        name: "Cửu Đỉnh",
        description: "Chín đỉnh đồng lớn đúc dưới triều vua Minh Mạng, tượng trưng cho quyền lực vương triều.",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=C%E1%BB%ADu+%C4%90%E1%BB%89nh"
      }
    ]
  },
  {
    id: 6,
    title: "Cầu Ngói Thanh Toàn",
    titleEn: "Thanh Toan Bridge",
    description: "Cầu Ngói Thanh Toàn là một cây cầu cổ được xây dựng từ thế kỷ 18 tại Huế, nằm ở xã Thanh Thủy Chánh, huyện Hương Thủy.",
    descriptionEn: "Thanh Toan Bridge is an ancient bridge built in the 18th century in Hue, located in Thanh Thuy Chanh commune, Huong Thuy district.",
    thumbnailUrl: "https://placehold.co/600x400/EEE/31343C?text=C%E1%BA%A7u+Ng%C3%B3i+Thanh+To%C3%A0n",
    panoramaUrl: "https://placehold.co/1200x800/EEE/31343C?text=Panorama+C%E1%BA%A7u+Ng%C3%B3i+Thanh+To%C3%A0n",
    model3dUrl: "https://placehold.co/600x400/EEE/31343C?text=3D+Model+C%E1%BA%A7u+Ng%C3%B3i+Thanh+To%C3%A0n",
    category: "architecture",
    createPeriod: "1776",
    dynasty: "Nguyễn",
    location: "Hương Thủy, Thừa Thiên Huế",
    virtualTourAvailable: true,
    arAvailable: false,
    historyInfo: "Cầu Ngói Thanh Toàn được xây dựng vào năm 1776 dưới triều vua Lê Hiển Tông, bởi bà Trần Thị Đạo, vợ của một vị quan triều Lê. Cầu được xây nhằm tạo điều kiện thuận lợi cho việc đi lại và trao đổi hàng hóa của người dân trong vùng.",
    architectureInfo: "Cầu Ngói Thanh Toàn có kiến trúc đặc trưng của một cây cầu ngói truyền thống Việt Nam, với mái ngói cong và những cột gỗ chắc chắn. Cầu dài khoảng 17m, rộng 4m và có mái che toàn bộ, tạo thành một không gian trú mưa nắng cho người dân và khách du lịch.",
    restorationInfo: "Cầu Ngói Thanh Toàn đã trải qua nhiều đợt trùng tu vào các năm 1925, 1957, 1995 và gần đây nhất là năm 2016 để bảo tồn giá trị lịch sử và kiến trúc của nó.",
    artifacts: [
      {
        name: "Bia đá",
        description: "Bia đá ghi lại lịch sử xây dựng cầu và công đức của bà Trần Thị Đạo.",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=Bia+%C4%91%C3%A1"
      },
      {
        name: "Bảo tàng nông cụ",
        description: "Bảo tàng nhỏ gần cầu trưng bày các nông cụ truyền thống của người dân địa phương.",
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=B%E1%BA%A3o+t%C3%A0ng+n%C3%B4ng+c%E1%BB%A5"
      }
    ]
  }
];

// Filter component
const ExhibitionFilter = ({ 
  onCategoryChange, 
  onPeriodChange,
  onSearch,
  selectedCategory,
  selectedPeriod,
  searchTerm
}: { 
  onCategoryChange: (category: string | null) => void,
  onPeriodChange: (period: string | null) => void,
  onSearch: (term: string) => void,
  selectedCategory: string | null,
  selectedPeriod: string | null,
  searchTerm: string
}) => {
  const categories = [
    { id: "palace", name: "Cung điện" },
    { id: "tomb", name: "Lăng tẩm" },
    { id: "temple", name: "Chùa/Đền" },
    { id: "architecture", name: "Kiến trúc" }
  ];

  const periods = [
    { id: "1700s", name: "Thế kỷ 18" },
    { id: "1800-1850", name: "1800-1850" },
    { id: "1850-1900", name: "1850-1900" },
    { id: "1900s", name: "Thế kỷ 20" }
  ];

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

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Loại di tích</h3>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onCategoryChange(null)}
            >
              Tất cả
            </Badge>
            {categories.map(category => (
              <Badge 
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onCategoryChange(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Thời kỳ</h3>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedPeriod === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onPeriodChange(null)}
            >
              Tất cả
            </Badge>
            {periods.map(period => (
              <Badge 
                key={period.id}
                variant={selectedPeriod === period.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onPeriodChange(period.id)}
              >
                {period.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Exhibition card component
const ExhibitionCard = ({ item }: { item: typeof exhibitionItems[0] }) => {
  return (
    <Card className="hover-translate overflow-hidden">
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
              <Badge variant="secondary" className="bg-emerald-600/90 text-white">
                <Cube className="h-3 w-3 mr-1" /> AR
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
            {item.category === 'palace' ? 'Cung điện' :
             item.category === 'tomb' ? 'Lăng tẩm' :
             item.category === 'temple' ? 'Chùa/Đền' : 'Kiến trúc'}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3">
          {item.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-[#B5935A] px-2">
            <Info className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-[#B5935A] px-2">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <Eye className="h-4 w-4" />
          <span>Khám phá</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Detailed view component
const ExhibitionDetail = ({ item, onBack }: { item: typeof exhibitionItems[0], onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState('panorama');

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center mb-2">
        <Button variant="ghost" onClick={onBack} className="gap-2 hover:bg-transparent p-0">
          <span>←</span>
          <span>Quay lại</span>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#B5935A]">{item.title}</h1>
        <p className="text-muted-foreground">{item.titleEn}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="panorama" className="gap-2">
            <Eye className="h-4 w-4" />
            <span>Panorama 360°</span>
          </TabsTrigger>
          <TabsTrigger value="3d" className="gap-2">
            <Cube className="h-4 w-4" />
            <span>Mô hình 3D</span>
          </TabsTrigger>
          <TabsTrigger value="info" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Thông tin</span>
          </TabsTrigger>
          <TabsTrigger value="artifacts" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Hiện vật</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="panorama" className="space-y-4">
          <div className="relative h-[70vh] bg-muted rounded-lg overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src={item.panoramaUrl} 
                alt={`Panorama ${item.title}`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button variant="secondary" size="sm" className="gap-1 bg-black/50 hover:bg-black/70 text-white">
                <RotateCw className="h-4 w-4" />
                <span>Xoay</span>
              </Button>
              <Button variant="secondary" size="sm" className="gap-1 bg-black/50 hover:bg-black/70 text-white">
                <Maximize className="h-4 w-4" />
                <span>Toàn màn hình</span>
              </Button>
              <Button variant="secondary" size="sm" className="gap-1 bg-black/50 hover:bg-black/70 text-white">
                <Camera className="h-4 w-4" />
                <span>Chụp ảnh</span>
              </Button>
            </div>
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-black/50 text-white">
                Nhấn và kéo để xoay góc nhìn
              </Badge>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span>Tải xuống hình ảnh</span>
            </Button>
            <Button variant="default" size="sm" className="gap-1 bg-[#B5935A] hover:bg-[#9F8054]">
              <PanelLeft className="h-4 w-4" />
              <span>Bật thuyết minh</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="3d" className="space-y-4">
          <div className="relative h-[70vh] bg-muted rounded-lg overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src={item.model3dUrl} 
                alt={`3D Model ${item.title}`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button variant="secondary" size="sm" className="gap-1 bg-black/50 hover:bg-black/70 text-white">
                <RotateCw className="h-4 w-4" />
                <span>Xoay mô hình</span>
              </Button>
              <Button variant="secondary" size="sm" className="gap-1 bg-black/50 hover:bg-black/70 text-white">
                <Maximize className="h-4 w-4" />
                <span>Toàn màn hình</span>
              </Button>
            </div>
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-black/50 text-white">
                Nhấn và kéo để xoay mô hình
              </Badge>
            </div>
          </div>
          
          {item.arAvailable && (
            <div className="flex justify-center">
              <Button variant="default" size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                <Cube className="h-4 w-4" />
                <span>Xem bằng AR</span>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="bg-card p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <History className="h-5 w-5 text-[#B5935A] mr-2" />
                  <h3 className="text-lg font-medium">Lịch sử</h3>
                </div>
                <p className="text-muted-foreground">{item.historyInfo}</p>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Layers3 className="h-5 w-5 text-[#B5935A] mr-2" />
                  <h3 className="text-lg font-medium">Kiến trúc</h3>
                </div>
                <p className="text-muted-foreground">{item.architectureInfo}</p>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <RotateCw className="h-5 w-5 text-[#B5935A] mr-2" />
                  <h3 className="text-lg font-medium">Trùng tu và bảo tồn</h3>
                </div>
                <p className="text-muted-foreground">{item.restorationInfo}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-card p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Thông tin cơ bản</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Phân loại:</dt>
                    <dd className="font-medium">
                      {item.category === 'palace' ? 'Cung điện' :
                       item.category === 'tomb' ? 'Lăng tẩm' :
                       item.category === 'temple' ? 'Chùa/Đền' : 'Kiến trúc'}
                    </dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Thời kỳ xây dựng:</dt>
                    <dd className="font-medium">{item.createPeriod}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Triều đại:</dt>
                    <dd className="font-medium">{item.dynasty}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Vị trí:</dt>
                    <dd className="font-medium">{item.location}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-card p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Trải nghiệm khác</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <MapPin className="h-4 w-4 text-[#B5935A]" />
                    <span>Xem trên bản đồ</span>
                  </Button>
                  {item.arAvailable && (
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Cube className="h-4 w-4 text-[#B5935A]" />
                      <span>Trải nghiệm thực tế ảo tăng cường</span>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Download className="h-4 w-4 text-[#B5935A]" />
                    <span>Tải xuống thông tin</span>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
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
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={artifact.imageUrl} 
                    alt={artifact.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{artifact.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{artifact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Main exhibition page
export default function ExhibitionPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<typeof exhibitionItems[0] | null>(null);

  // Filter items based on search and filters
  const filteredItems = exhibitionItems.filter(item => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesPeriod = selectedPeriod ? item.createPeriod.includes(selectedPeriod) : true;
    const matchesSearch = searchTerm ? 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) : 
      true;

    return matchesCategory && matchesPeriod && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#B5935A]">Triển lãm 3D/AR</h1>
        <p className="text-muted-foreground mt-2">
          Khám phá không gian 3D và thực tế ảo tăng cường của các di tích lịch sử và kiến trúc Huế
        </p>
      </div>

      {!selectedItem ? (
        <>
          <ExhibitionFilter 
            onCategoryChange={setSelectedCategory}
            onPeriodChange={setSelectedPeriod}
            onSearch={setSearchTerm}
            selectedCategory={selectedCategory}
            selectedPeriod={selectedPeriod}
            searchTerm={searchTerm}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer">
                <ExhibitionCard item={item} />
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không tìm thấy kết quả phù hợp với bộ lọc hiện tại.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedPeriod(null);
                  setSearchTerm('');
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </>
      ) : (
        <ExhibitionDetail 
          item={selectedItem} 
          onBack={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}