import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Building2, Columns, PaintBucket, Ruler, Award, Info } from "lucide-react";

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
      historicalInfo: "Đá xanh Thanh Hóa được sử dụng phổ biến trong kiến trúc cung đình Huế vì độ bền và vẻ đẹp tự nhiên",
      score: 10,
      icon: <Building2 className="h-6 w-6" />
    },
    {
      id: "brick_base",
      name: "Nền gạch nung",
      description: "Nền móng từ gạch nung truyền thống",
      historicalInfo: "Gạch nung là vật liệu phổ biến trong xây dựng dân gian",
      score: 5,
      icon: <Building2 className="h-6 w-6" />
    }
  ],
  columns: [
    {
      id: "wooden_columns",
      name: "Cột gỗ lim",
      description: "Cột từ gỗ lim quý, được chạm khắc hoa văn truyền thống",
      historicalInfo: "Gỗ lim được coi là loại gỗ quý, thường dùng trong các công trình quan trọng của triều Nguyễn",
      score: 10,
      icon: <Columns className="h-6 w-6" />
    },
    {
      id: "stone_columns",
      name: "Cột đá granite",
      description: "Cột đá granite bền vững",
      historicalInfo: "Đá granite ít được sử dụng trong kiến trúc cung đình Huế thời Nguyễn",
      score: 5,
      icon: <Columns className="h-6 w-6" />
    }
  ],
  decoration: [
    {
      id: "dragon_phoenix",
      name: "Rồng Phượng",
      description: "Hoa văn rồng phượng tượng trưng cho quyền uy hoàng gia",
      historicalInfo: "Rồng và Phượng là biểu tượng của vua và hoàng hậu trong văn hóa phong kiến Việt Nam",
      score: 10,
      icon: <PaintBucket className="h-6 w-6" />
    },
    {
      id: "lotus",
      name: "Hoa Sen",
      description: "Hoa văn hoa sen thanh tao",
      historicalInfo: "Hoa sen thường xuất hiện trong nghệ thuật trang trí Phật giáo",
      score: 5,
      icon: <PaintBucket className="h-6 w-6" />
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
    <div className="space-y-4">
      {elements.map((element) => (
        <motion.div key={element.id} variants={fadeIn}>
          <div className="relative">
            <Button
              variant={selectedElements[category] === element.id ? "default" : "outline"}
              className="w-full justify-start gap-4 h-auto p-4 text-left"
              onClick={() => handleElementSelect(category, element.id)}
            >
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                {element.icon}
              </div>
              <div>
                <p className="font-medium">{element.name}</p>
                <p className="text-sm text-muted-foreground">{element.description}</p>
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
              className="mt-2 p-4 bg-muted/50 rounded-lg"
            >
              <p className="text-sm">{element.historicalInfo}</p>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Xây dựng Điện Cần Chánh</h2>
          <p className="text-muted-foreground">
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
            <Tabs defaultValue="foundation" className="space-y-6">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="foundation">Nền móng</TabsTrigger>
                <TabsTrigger value="columns">Cột trụ</TabsTrigger>
                <TabsTrigger value="decoration">Trang trí</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px] rounded-md border p-4">
                <TabsContent value="foundation" className="mt-0">
                  {renderCategorySection("foundation", architecturalElements.foundation)}
                </TabsContent>
                <TabsContent value="columns" className="mt-0">
                  {renderCategorySection("columns", architecturalElements.columns)}
                </TabsContent>
                <TabsContent value="decoration" className="mt-0">
                  {renderCategorySection("decoration", architecturalElements.decoration)}
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => setShowResult(true)}
                disabled={Object.keys(selectedElements).length < 3}
              >
                <Ruler className="mr-2 h-4 w-4" />
                Hoàn thành công trình
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center"
          >
            <div className="mb-6">
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {getEvaluation(calculateScore()).title}
              </h3>
              <p className="text-muted-foreground">
                {getEvaluation(calculateScore()).description}
              </p>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium">Điểm số của bạn: {calculateScore()}/30</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Dựa trên sự phù hợp với kiến trúc cung đình thời Nguyễn
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={() => {
                setSelectedElements({});
                setShowResult(false);
              }}>
                Thử lại
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
