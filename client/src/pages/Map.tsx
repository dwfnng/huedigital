import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Info, Calendar, Navigation2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface Location {
  id: string;
  name: string;
  description: string;
  type: string;
  imageUrl: string;
  yearBuilt: string;
  address: string;
}

const locations: Location[] = [
  {
    id: "ky-dai",
    name: "Kỳ Đài",
    description: "Kỳ Đài (Flag Tower) là công trình kiến trúc được xây dựng năm 1807 dưới thời vua Gia Long. Đây là nơi thường trực treo cờ của triều đình nhà Nguyễn, một biểu tượng quan trọng của quyền lực hoàng gia. Công trình cao 17,5m, có kiến trúc hình bát giác với ba tầng chồng lên nhau, mỗi tầng đều có lan can bao quanh.",
    type: "Di tích lịch sử",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Kỳ_đài_Huế.jpg",
    yearBuilt: "1807",
    address: "Thành phố Huế, Thừa Thiên Huế"
  },
  {
    id: "truong-quoc-tu-giam",
    name: "Trường Quốc Tử Giám",
    description: "Trường Quốc Tử Giám Huế, được xây dựng năm 1821 dưới thời vua Minh Mạng, là trường đại học đầu tiên của triều Nguyễn. Nơi đây đào tạo các nhân tài cho triều đình, với hệ thống giáo dục Nho học nghiêm túc. Công trình mang đậm dấu ấn kiến trúc truyền thống, với các dãy nhà học, thư viện và đền thờ Khổng Tử.",
    type: "Di tích giáo dục",
    imageUrl: "https://media.mia.vn/uploads/blog-du-lich/truong-quoc-tu-giam-hue-ngoi-truong-danh-gia-nhat-cua-trieu-nguyen-xua-1-1637922298.jpg",
    yearBuilt: "1821",
    address: "Thành phố Huế, Thừa Thiên Huế"
  },
  {
    id: "dien-long-an",
    name: "Điện Long An",
    description: "Điện Long An, xây dựng năm 1845 dưới triều Thiệu Trị, là nơi trưng bày và bảo quản các cổ vật quý giá của triều Nguyễn. Công trình mang phong cách kiến trúc cung đình Huế truyền thống, với mái ngói lưu ly xanh đặc trưng và hệ thống chạm khắc tinh xảo.",
    type: "Di tích kiến trúc",
    imageUrl: "https://media.mia.vn/uploads/blog-du-lich/dien-long-an-net-dep-co-kinh-cua-co-do-hue-1-1637901682.jpg",
    yearBuilt: "1845",
    address: "Đại Nội, Thành phố Huế"
  },
  {
    id: "dien-thai-hoa",
    name: "Điện Thái Hòa",
    description: "Điện Thái Hòa là công trình quan trọng nhất trong Hoàng thành Huế, nơi diễn ra các đại lễ và thiết triều của vua quan triều Nguyễn. Xây dựng năm 1805 và trùng tu nhiều lần, điện mang đậm phong cách kiến trúc cung đình với 80 cột sơn son thiếp vàng và hệ thống họa tiết rồng phượng tinh xảo.",
    type: "Di tích cung đình",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/25/Dien_Thai_Hoa.jpg",
    yearBuilt: "1805",
    address: "Đại Nội, Thành phố Huế"
  }
];

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-primary">Bản đồ số</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Khám phá các di tích, danh lam thắng cảnh và địa điểm du lịch tại Huế
        </p>

        <div className="relative mb-8">
          <Input
            type="text"
            placeholder="Tìm kiếm địa điểm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
          <Search className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <AnimatePresence>
              {filteredLocations.map((location) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedLocation?.id === location.id
                        ? 'ring-2 ring-primary shadow-lg'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-32 h-32 relative rounded-lg overflow-hidden">
                          <img
                            src={location.imageUrl}
                            alt={location.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            {location.name}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Info className="h-4 w-4 mr-1" />
                            {location.type}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4 mr-1" />
                            Xây dựng: {location.yearBuilt}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Navigation2 className="h-4 w-4 mr-1" />
                            {location.address}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:sticky lg:top-4 h-[calc(100vh-2rem)] rounded-xl overflow-hidden bg-card">
            <AnimatePresence mode="wait">
              {selectedLocation ? (
                <motion.div
                  key={selectedLocation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full p-6 overflow-y-auto"
                >
                  <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
                    <img
                      src={selectedLocation.imageUrl}
                      alt={selectedLocation.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{selectedLocation.name}</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Info className="h-4 w-4 mr-2" />
                        {selectedLocation.type}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        Xây dựng: {selectedLocation.yearBuilt}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Navigation2 className="h-4 w-4 mr-2" />
                        {selectedLocation.address}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {selectedLocation.description}
                  </p>
                  <Button className="w-full">Xem chi tiết</Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-full text-muted-foreground"
                >
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Chọn một địa điểm để xem thông tin chi tiết</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}