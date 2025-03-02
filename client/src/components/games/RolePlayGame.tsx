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
  imageUrl?: string;
  historicalInfo?: string;
}

interface GameStep {
  id: string;
  title: string;
  description: string;
  backgroundImage?: string;
  choices: Choice[];
}

const gameSteps: GameStep[] = [
  {
    id: "location",
    title: "Chọn vị trí xây dựng kinh đô",
    description: "Thưa bệ hạ, nơi đâu sẽ là vị trí lý tưởng để xây dựng kinh đô mới của triều Nguyễn?",
    backgroundImage: "/images/backgrounds/hue-landscape.jpg",
    choices: [
      {
        id: "hue",
        text: "Vùng đất Phú Xuân (Huế)",
        result: "Một lựa chọn sáng suốt! Vùng đất Phú Xuân nằm ở vị trí trung tâm đất nước, có núi sông bao bọc, địa thế hiểm yếu, thuận lợi cho việc phòng thủ và phát triển.",
        score: 10,
        icon: <MapPin className="h-5 w-5" />,
        imageUrl: "/images/locations/phu-xuan.jpg",
        historicalInfo: "Phú Xuân từng là kinh đô của chúa Nguyễn từ thế kỷ 17. Vị trí này nằm giữa hai miền Nam - Bắc, thuận lợi cho việc kiểm soát toàn bộ lãnh thổ. Địa thế được bao bọc bởi núi Ngự Bình và sông Hương, tạo nên thế phòng thủ tự nhiên."
      },
      {
        id: "hanoi",
        text: "Giữ nguyên Thăng Long (Hà Nội)",
        result: "Thăng Long tuy là kinh đô cũ nhưng nằm quá xa phương Nam, khó kiểm soát toàn bộ lãnh thổ.",
        score: 5,
        icon: <Building2 className="h-5 w-5" />,
        imageUrl: "/images/locations/thang-long.jpg",
        historicalInfo: "Thăng Long là kinh đô của các triều đại từ thời Lý, với hệ thống thành quách đồ sộ. Tuy nhiên, vị trí này quá xa phía Nam và còn nhiều dấu ấn của triều Lê, không phù hợp với chiến lược cai trị của triều Nguyễn."
      },
      {
        id: "saigon",
        text: "Vùng đất Gia Định (Sài Gòn)",
        result: "Gia Định tuy là căn cứ địa cũ nhưng nằm quá xa phương Bắc, không thuận lợi cho việc cai quản toàn quốc.",
        score: 5,
        icon: <Building2 className="h-5 w-5" />,
        imageUrl: "/images/locations/gia-dinh.jpg",
        historicalInfo: "Gia Định là một vùng đất giàu tiềm năng nhưng vị trí quá xa Thăng Long, không thuận lợi cho việc quản lý toàn quốc của triều Nguyễn."
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
        icon: <Wind className="h-5 w-5" />,
        imageUrl: "/images/geomancy/mountain-river.jpg",
        historicalInfo: "Việc lựa chọn dựa vào thế đất 'tọa sơn hướng thủy' thể hiện sự am hiểu về phong thủy của bệ hạ. Núi Ngự Bình và sông Hương tạo nên thế đất vững chắc và thịnh vượng."
      },
      {
        id: "flat_land",
        text: "Chọn vùng đất bằng phẳng",
        result: "Đất bằng phẳng tuy dễ xây dựng nhưng thiếu các yếu tố phong thủy quan trọng.",
        score: 5,
        icon: <Wind className="h-5 w-5" />,
        imageUrl: "/images/geomancy/flat-land.jpg",
        historicalInfo: "Mặc dù đất bằng phẳng thuận tiện cho việc xây dựng, nhưng thiếu đi yếu tố 'tọa sơn hướng thủy' quan trọng trong phong thủy, dẫn đến sự thiếu ổn định và thịnh vượng."
      },
      {
        id: "coast",
        text: "Gần biển để thuận tiện giao thương",
        result: "Vị trí quá gần biển không tốt cho phong thủy, dễ bị ảnh hưởng bởi bão tố.",
        score: 5,
        icon: <Wind className="h-5 w-5" />,
        imageUrl: "/images/geomancy/coast.jpg",
        historicalInfo: "Vị trí gần biển thuận lợi cho giao thương, nhưng lại dễ bị ảnh hưởng bởi thiên tai và không phù hợp với nguyên tắc phong thủy."
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
        icon: <Star className="h-5 w-5 text-yellow-500" />
      };
    } else if (score >= 12) {
      return {
        title: "Quyết định tạm được",
        description: "Các quyết định của bệ hạ có những điểm hợp lý, nhưng vẫn còn điểm cần cải thiện.",
        icon: <Scroll className="h-5 w-5 text-blue-500" />
      };
    } else {
      return {
        title: "Cần cân nhắc kỹ hơn",
        description: "Những quyết định này có thể gây khó khăn cho việc phát triển kinh đô.",
        icon: <Crown className="h-5 w-5 text-red-500" />
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <div className="inline-block p-2 bg-primary/10 rounded-full mb-2">
            <Crown className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Nhập vai vua Gia Long</h2>
          <p className="text-sm text-muted-foreground">
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
              className="relative"
            >
              <div className="mb-4">
                <h3 className="text-base font-medium mb-2">{gameSteps[currentStep].title}</h3>
                <p className="text-sm text-muted-foreground">{gameSteps[currentStep].description}</p>
              </div>

              <ScrollArea className="h-[400px] rounded-md border p-3">
                <div className="space-y-3">
                  {gameSteps[currentStep].choices.map((choice) => (
                    <motion.div key={choice.id} variants={fadeIn}>
                      <Button
                        variant="outline"
                        className={`w-full justify-start gap-3 h-auto p-3 text-left ${
                          selectedChoice?.id === choice.id ? 'border-primary' : ''
                        }`}
                        onClick={() => handleChoice(choice)}
                        disabled={selectedChoice !== null}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                            {choice.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{choice.text}</p>
                            {choice.imageUrl && (
                              <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={choice.imageUrl}
                                  alt={choice.text}
                                  onError={(e) => e.currentTarget.src = '/images/placeholder-location.jpg'}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            {selectedChoice?.id === choice.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-3 space-y-2"
                              >
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                  <p className="text-sm">{choice.result}</p>
                                </div>
                                {choice.historicalInfo && (
                                  <div className="p-3 bg-muted/30 rounded-lg">
                                    <p className="text-sm text-muted-foreground">{choice.historicalInfo}</p>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </div>
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
              className="text-center py-4"
            >
              <div className="mb-3">
                <div className="inline-block p-2 bg-primary/10 rounded-full mb-2">
                  {getGameResult().icon}
                </div>
                <h3 className="text-lg font-semibold mb-1">{getGameResult().title}</h3>
                <p className="text-sm text-muted-foreground">{getGameResult().description}</p>
                <div className="mt-2 p-2 bg-muted/30 rounded-lg">
                  <p className="text-sm">Điểm số của bệ hạ: {score}/{gameSteps.length * 10}</p>
                </div>
              </div>

              <Button size="sm" onClick={resetGame} className="text-sm">
                Chơi lại
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}