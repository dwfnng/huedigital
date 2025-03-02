import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, MapPin, Building2, Wind, Scroll, Star } from "lucide-react";

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
        icon: <MapPin className="h-4 w-4" />
      },
      {
        id: "hanoi",
        text: "Giữ nguyên Thăng Long (Hà Nội)",
        result: "Thăng Long tuy là kinh đô cũ nhưng nằm quá xa phương Nam, khó kiểm soát toàn bộ lãnh thổ.",
        score: 5,
        icon: <Building2 className="h-4 w-4" />
      },
      {
        id: "saigon",
        text: "Vùng đất Gia Định (Sài Gòn)",
        result: "Gia Định tuy là căn cứ địa cũ nhưng nằm quá xa phương Bắc, không thuận lợi cho việc cai quản toàn quốc.",
        score: 5,
        icon: <Building2 className="h-4 w-4" />
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
        result: "Xuất sắc! Núi Ngự Bình như án ngự phía Nam, sông Hương uốn quanh như rồng chầu, tạo nên thế đất 'tọa sơn hướng thủy' hoàn hảo.",
        score: 10,
        icon: <Wind className="h-4 w-4" />
      },
      {
        id: "flat_land",
        text: "Chọn vùng đất bằng phẳng",
        result: "Đất bằng phẳng tuy dễ xây dựng nhưng thiếu các yếu tố phong thủy quan trọng.",
        score: 5,
        icon: <Wind className="h-4 w-4" />
      },
      {
        id: "coast",
        text: "Gần biển để thuận tiện giao thương",
        result: "Vị trí quá gần biển không tốt cho phong thủy, dễ bị ảnh hưởng bởi bão tố.",
        score: 5,
        icon: <Wind className="h-4 w-4" />
      }
    ]
  }
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function RolePlayGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  const handleChoice = (choice: Choice) => {
    setSelectedChoice(choice);
    setScore(score + choice.score);
    setSelectedChoices([...selectedChoices, choice.id]);

    setTimeout(() => {
      if (currentStep < gameSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        setSelectedChoice(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const getGameResult = () => {
    if (score >= 18) {
      return {
        title: "Minh quân anh minh!",
        description: "Bệ hạ đã có những quyết định sáng suốt trong việc chọn vị trí và quy hoạch kinh đô.",
        icon: <Star className="h-4 w-4 text-yellow-500" />
      };
    } else if (score >= 12) {
      return {
        title: "Quyết định tạm được",
        description: "Các quyết định của bệ hạ có những điểm hợp lý, nhưng vẫn còn điểm cần cải thiện.",
        icon: <Scroll className="h-4 w-4 text-blue-500" />
      };
    } else {
      return {
        title: "Cần cân nhắc kỹ hơn",
        description: "Những quyết định này có thể gây khó khăn cho việc phát triển kinh đô.",
        icon: <Crown className="h-4 w-4 text-red-500" />
      };
    }
  };

  const resetGame = () => {
    setCurrentStep(0);
    setScore(0);
    setSelectedChoices([]);
    setShowResult(false);
    setSelectedChoice(null);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-3">
        <div className="text-center mb-3">
          <div className="inline-block p-1.5 bg-primary/10 rounded-full mb-2">
            <Crown className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-base font-semibold">Nhập vai vua Gia Long</h2>
          <p className="text-xs text-muted-foreground">
            Quyết định lịch sử: Chọn vị trí xây dựng kinh đô mới
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentStep}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
            >
              <div className="mb-3">
                <h3 className="text-sm font-medium mb-1">{gameSteps[currentStep].title}</h3>
                <p className="text-xs text-muted-foreground">{gameSteps[currentStep].description}</p>
              </div>

              <ScrollArea className="h-[300px] rounded-md border p-2">
                <div className="space-y-2">
                  {gameSteps[currentStep].choices.map((choice) => (
                    <motion.div key={choice.id} variants={fadeIn}>
                      <Button
                        variant="outline"
                        className={`w-full justify-start gap-2 h-auto p-2 text-left text-sm ${
                          selectedChoice?.id === choice.id ? 'border-primary' : ''
                        }`}
                        onClick={() => handleChoice(choice)}
                        disabled={selectedChoice !== null}
                      >
                        <div className="p-1 bg-primary/10 rounded-lg shrink-0">
                          {choice.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">{choice.text}</p>
                          {selectedChoice?.id === choice.id && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="text-xs text-muted-foreground mt-1"
                            >
                              {choice.result}
                            </motion.p>
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
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center py-3"
            >
              <div className="mb-3">
                <div className="inline-block p-2 bg-primary/10 rounded-full mb-2">
                  {getGameResult().icon}
                </div>
                <h3 className="text-sm font-semibold mb-1">{getGameResult().title}</h3>
                <p className="text-xs text-muted-foreground">{getGameResult().description}</p>
                <div className="mt-2 p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs">Điểm số của bệ hạ: {score}/{gameSteps.length * 10}</p>
                </div>
              </div>

              <Button size="sm" onClick={resetGame} className="text-xs">
                Chơi lại
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}