import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Building2, Columns, PaintBucket, Ruler, Award, Info, Palette, TreePine } from "lucide-react";

interface ArchitecturalElement {
  id: string;
  name: string;
  description: string;
  historicalInfo: string;
  score: number;
  icon: JSX.Element;
}

const architecturalElements = {
  foundation: [
    {
      id: "stone_base",
      name: "Nền đá xanh Thanh Hóa",
      description: "Nền móng vững chắc từ đá xanh Thanh Hóa, tạo độ bền và thoát nước tốt",
      historicalInfo: "Đá xanh Thanh Hóa được sử dụng phổ biến trong kiến trúc cung đình Huế vì độ bền và vẻ đẹp tự nhiên. Đây là loại đá có độ cứng cao, khả năng chống thấm tốt.",
      score: 10,
      icon: <Building2 className="h-6 w-6" />
    },
    {
      id: "brick_base",
      name: "Nền gạch nung",
      description: "Nền móng từ gạch nung truyền thống",
      historicalInfo: "Gạch nung là vật liệu phổ biến trong xây dựng dân gian, tuy nhiên ít được sử dụng trong các công trình hoàng gia do độ bền thấp hơn.",
      score: 5,
      icon: <Building2 className="h-6 w-6" />
    },
    {
      id: "elevated_platform",
      name: "Nền tảng cao",
      description: "Nền được nâng cao tạo không gian thoáng đãng và tránh ẩm mốc",
      historicalInfo: "Việc nâng cao nền là đặc trưng của kiến trúc cung đình, thể hiện địa vị và quyền lực, đồng thời giúp bảo vệ công trình khỏi độ ẩm.",
      score: 8,
      icon: <Building2 className="h-6 w-6" />
    }
  ],
  columns: [
    {
      id: "wooden_columns",
      name: "Cột gỗ lim",
      description: "Cột từ gỗ lim quý, được chạm khắc hoa văn truyền thống",
      historicalInfo: "Gỗ lim được coi là loại gỗ quý, thường dùng trong các công trình quan trọng của triều Nguyễn. Cột gỗ lim có thể tồn tại hàng trăm năm.",
      score: 10,
      icon: <Columns className="h-6 w-6" />
    },
    {
      id: "stone_columns",
      name: "Cột đá granite",
      description: "Cột đá granite bền vững",
      historicalInfo: "Đá granite ít được sử dụng trong kiến trúc cung đình Huế thời Nguyễn, không phù hợp với phong cách kiến trúc truyền thống.",
      score: 5,
      icon: <Columns className="h-6 w-6" />
    },
    {
      id: "lacquered_columns",
      name: "Cột gỗ sơn then",
      description: "Cột gỗ được sơn then đỏ truyền thống",
      historicalInfo: "Sơn then đỏ là màu sắc đặc trưng trong kiến trúc cung đình, tượng trưng cho quyền uy và phước lộc.",
      score: 8,
      icon: <Columns className="h-6 w-6" />
    }
  ],
  decoration: [
    {
      id: "dragon_phoenix",
      name: "Rồng Phượng",
      description: "Hoa văn rồng phượng tượng trưng cho quyền uy hoàng gia",
      historicalInfo: "Rồng và Phượng là biểu tượng của vua và hoàng hậu trong văn hóa phong kiến Việt Nam. Hoa văn này chỉ được sử dụng trong cung điện.",
      score: 10,
      icon: <PaintBucket className="h-6 w-6" />
    },
    {
      id: "lotus",
      name: "Hoa Sen",
      description: "Hoa văn hoa sen thanh tao",
      historicalInfo: "Hoa sen thường xuất hiện trong nghệ thuật trang trí Phật giáo và kiến trúc dân gian, ít phổ biến trong cung điện chính.",
      score: 5,
      icon: <PaintBucket className="h-6 w-6" />
    },
    {
      id: "clouds_waves",
      name: "Mây và Sóng",
      description: "Họa tiết mây và sóng thể hiện sự vĩnh cửu",
      historicalInfo: "Văn mây và sóng là họa tiết phổ biến trong trang trí cung đình, tượng trưng cho sự trường tồn của triều đại.",
      score: 8,
      icon: <PaintBucket className="h-6 w-6" />
    }
  ],
  landscaping: [
    {
      id: "feng_shui",
      name: "Phong thủy truyền thống",
      description: "Bố cục theo nguyên tắc phong thủy cổ",
      historicalInfo: "Phong thủy đóng vai trò quan trọng trong việc xây dựng cung điện, đảm bảo sự hài hòa giữa con người và thiên nhiên.",
      score: 10,
      icon: <TreePine className="h-6 w-6" />
    },
    {
      id: "gardens",
      name: "Vườn cảnh",
      description: "Thiết kế vườn với cây cảnh và thủy đài",
      historicalInfo: "Vườn cảnh trong cung điện không chỉ để thưởng ngoạn mà còn thể hiện triết lý âm dương, ngũ hành.",
      score: 8,
      icon: <TreePine className="h-6 w-6" />
    }
  ],
  colors: [
    {
      id: "royal_yellow",
      name: "Hoàng thiếp",
      description: "Màu vàng hoàng gia truyền thống",
      historicalInfo: "Màu vàng là màu của hoàng gia, chỉ được sử dụng trong các công trình quan trọng của triều đình.",
      score: 10,
      icon: <Palette className="h-6 w-6" />
    },
    {
      id: "vermillion",
      name: "Son đỏ",
      description: "Màu đỏ son truyền thống",
      historicalInfo: "Màu đỏ son tượng trưng cho phúc lộc, thường được sử dụng trong các chi tiết trang trí quan trọng.",
      score: 8,
      icon: <Palette className="h-6 w-6" />
    }
  ]
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function BuildingGame() {
  const [selectedElements, setSelectedElements] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState("foundation");


  const handleElementSelect = (category: string, elementId: string) => {
    setSelectedElements(prev => ({ ...prev, [category]: elementId }));
  };

  const calculateScore = () => {
    let total = 0;
    Object.entries(selectedElements).forEach(([category, elementId]) => {
      const elements = architecturalElements[category as keyof typeof architecturalElements];
      const element = elements.find(e => e.id === elementId);
      if (element) {
        total += element.score;
      }
    });
    return total;
  };

  const getEvaluation = (score: number) => {
    if (score >= 28) {
      return {
        title: "Kiệt tác kiến trúc!",
        description: "Bạn đã tạo ra một công trình phù hợp với phong cách kiến trúc thời Nguyễn. Điện Cần Chánh của bạn thể hiện đúng các đặc trưng của kiến trúc cung đình Huế.",
      };
    } else if (score >= 20) {
      return {
        title: "Kiến trúc ấn tượng",
        description: "Công trình của bạn có nhiều điểm phù hợp với kiến trúc cung đình, nhưng vẫn còn một số chi tiết có thể cải thiện để hoàn hảo hơn.",
      };
    } else {
      return {
        title: "Cần tìm hiểu thêm",
        description: "Công trình của bạn chưa phản ánh đúng đặc trưng kiến trúc cung đình Huế. Hãy tìm hiểu thêm về các yếu tố kiến trúc truyền thống!",
      };
    }
  };

  const renderCategorySection = (category: string, elements: ArchitecturalElement[]) => (
    <div className="space-y-2">
      {elements.map((element) => (
        <motion.div key={element.id} variants={fadeIn}>
          <div className="relative">
            <Button
              variant={selectedElements[category] === element.id ? "default" : "outline"}
              className="w-full justify-start gap-3 h-auto p-3 text-left"
              onClick={() => handleElementSelect(category, element.id)}
            >
              <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                {element.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{element.name}</p>
                <p className="text-xs text-muted-foreground">{element.description}</p>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setShowInfo(showInfo === element.id ? null : element.id)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
          {showInfo === element.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-3 bg-muted/50 rounded-lg"
            >
              <p className="text-xs">{element.historicalInfo}</p>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <div className="inline-block p-2 bg-primary/10 rounded-full mb-2">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Xây dựng Điện Cần Chánh</h2>
          <p className="text-sm text-muted-foreground">
            Chọn các yếu tố kiến trúc để xây dựng lại Điện Cần Chánh theo phong cách cung đình Huế
          </p>
        </div>

        {!showResult ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            <Tabs defaultValue="foundation" className="space-y-4" onChange={setCurrentCategory}>
              <TabsList className="w-full grid grid-cols-5 gap-1">
                <TabsTrigger value="foundation" className="text-xs py-1.5">Nền móng</TabsTrigger>
                <TabsTrigger value="columns" className="text-xs py-1.5">Cột trụ</TabsTrigger>
                <TabsTrigger value="decoration" className="text-xs py-1.5">Trang trí</TabsTrigger>
                <TabsTrigger value="landscaping" className="text-xs py-1.5">Cảnh quan</TabsTrigger>
                <TabsTrigger value="colors" className="text-xs py-1.5">Màu sắc</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[360px] rounded-md border p-3">
                {renderCategorySection(currentCategory, architecturalElements[currentCategory as keyof typeof architecturalElements])}
              </ScrollArea>

              <div className="flex justify-center mt-4">
                <Button
                  size="sm"
                  onClick={() => setShowResult(true)}
                  disabled={Object.keys(selectedElements).length < 5}
                  className="gap-2"
                >
                  <Ruler className="h-4 w-4" />
                  Hoàn thành công trình
                </Button>
              </div>
            </Tabs>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center py-4"
          >
            <div className="mb-4">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-2">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                {getEvaluation(calculateScore()).title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {getEvaluation(calculateScore()).description}
              </p>
              <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium">Điểm số của bạn: {calculateScore()}/50</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Dựa trên sự phù hợp với kiến trúc cung đình thời Nguyễn
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => {
                setSelectedElements({});
                setShowResult(false);
              }}
              className="hover-lift"
            >
              Thử lại
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}