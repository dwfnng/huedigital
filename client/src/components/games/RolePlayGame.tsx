import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Crown, MapPin, Building2, Wind } from "lucide-react";

interface Choice {
  id: string;
  text: string;
  result: string;
  score: number;
  icon: JSX.Element;
}

interface GameStep {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
}

const gameSteps: GameStep[] = [
  {
    id: "location",
    title: "Chọn vị trí xây dựng kinh đô",
    description: "Thưa bệ hạ, nơi đâu sẽ là vị trí lý tưởng để xây dựng kinh đô mới của triều Nguyễn?",
    choices: [
      {
        id: "hue",
        text: "Vùng đất Phú Xuân (Huế)",
        result: "Một lựa chọn sáng suốt! Vùng đất Phú Xuân nằm ở vị trí trung tâm đất nước, có núi sông bao bọc, địa thế hiểm yếu, thuận lợi cho việc phòng thủ và phát triển.",
        score: 10,
        icon: <MapPin className="h-6 w-6" />
      },
      {
        id: "hanoi",
        text: "Giữ nguyên Thăng Long (Hà Nội)",
        result: "Thăng Long tuy là kinh đô cũ nhưng nằm quá xa phương Nam, khó kiểm soát toàn bộ lãnh thổ. Các di tích của nhà Lê cũng có thể gây ảnh hưởng tới sự chính thống của triều Nguyễn.",
        score: 5,
        icon: <Building2 className="h-6 w-6" />
      },
      {
        id: "saigon",
        text: "Vùng đất Gia Định (Sài Gòn)",
        result: "Gia Định tuy là căn cứ địa cũ nhưng nằm quá xa phương Bắc, không thuận lợi cho việc cai quản toàn quốc. Khí hậu nhiệt đới và địa hình đồng bằng cũng không lý tưởng cho việc xây dựng cung điện.",
        score: 5,
        icon: <Building2 className="h-6 w-6" />
      }
    ]
  },
  {
    id: "geomancy",
    title: "Chọn phương án phong thủy",
    description: "Các nhà phong thủy đã khảo sát địa thế, bệ hạ chọn phương án nào để xây dựng kinh thành?",
    choices: [
      {
        id: "mountain_river",
        text: "Dựa vào núi Ngự Bình, sông Hương",
        result: "Xuất sắc! Núi Ngự Bình như án ngự phía Nam, sông Hương uốn quanh như rồng chầu, tạo nên thế đất 'tọa sơn hướng thủy' hoàn hảo theo phong thủy.",
        score: 10,
        icon: <Wind className="h-6 w-6" />
      },
      {
        id: "flat_land",
        text: "Chọn vùng đất bằng phẳng",
        result: "Đất bằng phẳng tuy dễ xây dựng nhưng thiếu các yếu tố phong thủy quan trọng, không tạo được thế đất vững mạnh cho kinh đô.",
        score: 5,
        icon: <Wind className="h-6 w-6" />
      },
      {
        id: "coast",
        text: "Gần biển để thuận tiện giao thương",
        result: "Vị trí quá gần biển không tốt cho phong thủy, dễ bị ảnh hưởng bởi bão tố và thủy triều, không phù hợp làm kinh đô.",
        score: 5,
        icon: <Wind className="h-6 w-6" />
      }
    ]
  }
];

export default function RolePlayGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = (choice: Choice) => {
    setScore(score + choice.score);
    setSelectedChoices([...selectedChoices, choice.id]);
    
    if (currentStep < gameSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const getGameResult = () => {
    if (score >= 18) {
      return {
        title: "Minh quân anh minh!",
        description: "Bệ hạ đã có những quyết định sáng suốt trong việc chọn vị trí và quy hoạch kinh đô. Huế sẽ trở thành một kinh đô hùng vĩ, xứng đáng là trung tâm của đất nước!",
      };
    } else if (score >= 12) {
      return {
        title: "Quyết định tạm được",
        description: "Các quyết định của bệ hạ có những điểm hợp lý, nhưng vẫn còn một số lựa chọn có thể tốt hơn để xây dựng một kinh đô vững mạnh.",
      };
    } else {
      return {
        title: "Cần cân nhắc kỹ hơn",
        description: "Những quyết định này có thể gây khó khăn cho việc xây dựng và phát triển kinh đô trong tương lai. Có lẽ bệ hạ nên tham khảo ý kiến của các quan văn võ thêm.",
      };
    }
  };

  const resetGame = () => {
    setCurrentStep(0);
    setScore(0);
    setSelectedChoices([]);
    setShowResult(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Nhập vai vua Gia Long</h2>
          <p className="text-muted-foreground">
            Quyết định lịch sử: Chọn vị trí xây dựng kinh đô mới
          </p>
        </div>

        {!showResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentStep}
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{gameSteps[currentStep].title}</h3>
              <p className="text-muted-foreground">{gameSteps[currentStep].description}</p>
            </div>

            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-4">
                {gameSteps[currentStep].choices.map((choice) => (
                  <motion.div
                    key={choice.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-4 h-auto p-4 text-left"
                      onClick={() => handleChoice(choice)}
                    >
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        {choice.icon}
                      </div>
                      <div>
                        <p className="font-medium">{choice.text}</p>
                        {selectedChoices.includes(choice.id) && (
                          <p className="text-sm text-muted-foreground mt-2">{choice.result}</p>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">{getGameResult().title}</h3>
              <p className="text-muted-foreground">{getGameResult().description}</p>
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={resetGame}>
                Chơi lại
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
