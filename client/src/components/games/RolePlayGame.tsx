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
    backgroundImage: "/images/hue-landscape.jpg",
    choices: [
      {
        id: "hue",
        text: "Vùng đất Phú Xuân (Huế)",
        result: "Một lựa chọn sáng suốt! Vùng đất Phú Xuân nằm ở vị trí trung tâm đất nước, có núi sông bao bọc, địa thế hiểm yếu, thuận lợi cho việc phòng thủ và phát triển.",
        score: 10,
        icon: <MapPin className="h-6 w-6" />,
        imageUrl: "/images/phu-xuan.jpg",
        historicalInfo: "Phú Xuân từng là kinh đô của chúa Nguyễn từ thế kỷ 17, với vị trí địa lý đắc địa nằm giữa hai miền Nam - Bắc. Địa thế này giúp kiểm soát toàn bộ lãnh thổ và phát triển thương mại thuận lợi."
      },
      {
        id: "hanoi",
        text: "Giữ nguyên Thăng Long (Hà Nội)",
        result: "Thăng Long tuy là kinh đô cũ nhưng nằm quá xa phương Nam, khó kiểm soát toàn bộ lãnh thổ. Các di tích của nhà Lê cũng có thể gây ảnh hưởng tới sự chính thống của triều Nguyễn.",
        score: 5,
        icon: <Building2 className="h-6 w-6" />,
        imageUrl: "/images/thang-long.jpg",
        historicalInfo: "Thăng Long là kinh đô của các triều đại phong kiến từ thời Lý, với hệ thống thành quách và cung điện đồ sộ. Tuy nhiên, vị trí này không phù hợp với chiến lược cai trị của triều Nguyễn."
      },
      {
        id: "saigon",
        text: "Vùng đất Gia Định (Sài Gòn)",
        result: "Gia Định tuy là căn cứ địa cũ nhưng nằm quá xa phương Bắc, không thuận lợi cho việc cai quản toàn quốc. Khí hậu nhiệt đới và địa hình đồng bằng cũng không lý tưởng cho việc xây dựng cung điện.",
        score: 5,
        icon: <Building2 className="h-6 w-6" />,
        imageUrl: "/images/gia-dinh.jpg",
        historicalInfo: "Gia Định là vùng đất trù phú, từng là căn cứ địa của chúa Nguyễn trong thời kỳ Nam-Bắc phân tranh. Tuy nhiên, vị trí này quá xa trung tâm đất nước và thiếu yếu tố phong thủy cần thiết cho một kinh đô."
      }
    ]
  },
  {
    id: "geomancy",
    title: "Chọn phương án phong thủy",
    description: "Các nhà phong thủy đã khảo sát địa thế, bệ hạ chọn phương án nào để xây dựng kinh thành?",
    backgroundImage: "/images/hue-aerial.jpg",
    choices: [
      {
        id: "mountain_river",
        text: "Dựa vào núi Ngự Bình, sông Hương",
        result: "Xuất sắc! Núi Ngự Bình như án ngự phía Nam, sông Hương uốn quanh như rồng chầu, tạo nên thế đất 'tọa sơn hướng thủy' hoàn hảo theo phong thủy.",
        score: 10,
        icon: <Wind className="h-6 w-6" />,
        imageUrl: "/images/ngu-binh.jpg",
        historicalInfo: "Núi Ngự Bình và sông Hương tạo nên địa thế 'tọa sơn hướng thủy' lý tưởng. Theo quan niệm phong thủy, đây là cách bố trí mang lại sự thịnh vượng và bền vững cho triều đại."
      },
      {
        id: "flat_land",
        text: "Chọn vùng đất bằng phẳng",
        result: "Đất bằng phẳng tuy dễ xây dựng nhưng thiếu các yếu tố phong thủy quan trọng, không tạo được thế đất vững mạnh cho kinh đô.",
        score: 5,
        icon: <Wind className="h-6 w-6" />,
        imageUrl: "/images/flat-land.jpg",
        historicalInfo: "Theo nguyên lý phong thủy cổ đại, địa thế bằng phẳng thiếu sự che chắn tự nhiên và không có điểm nhấn địa lý để tạo nên khí thế cho một kinh đô."
      },
      {
        id: "coast",
        text: "Gần biển để thuận tiện giao thương",
        result: "Vị trí quá gần biển không tốt cho phong thủy, dễ bị ảnh hưởng bởi bão tố và thủy triều, không phù hợp làm kinh đô.",
        score: 5,
        icon: <Wind className="h-6 w-6" />,
        imageUrl: "/images/coastal-area.jpg",
        historicalInfo: "Mặc dù thuận lợi cho giao thương, nhưng vị trí ven biển thường chịu ảnh hưởng của thiên tai và không phù hợp với quan niệm 'an cư' của một kinh đô."
      }
    ]
  }
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
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
    }, 2000);
  };

  const getGameResult = () => {
    if (score >= 18) {
      return {
        title: "Minh quân anh minh!",
        description: "Bệ hạ đã có những quyết định sáng suốt trong việc chọn vị trí và quy hoạch kinh đô. Huế sẽ trở thành một kinh đô hùng vĩ, xứng đáng là trung tâm của đất nước!",
        icon: <Star className="h-8 w-8 text-yellow-500" />
      };
    } else if (score >= 12) {
      return {
        title: "Quyết định tạm được",
        description: "Các quyết định của bệ hạ có những điểm hợp lý, nhưng vẫn còn một số lựa chọn có thể tốt hơn để xây dựng một kinh đô vững mạnh.",
        icon: <Scroll className="h-8 w-8 text-blue-500" />
      };
    } else {
      return {
        title: "Cần cân nhắc kỹ hơn",
        description: "Những quyết định này có thể gây khó khăn cho việc xây dựng và phát triển kinh đô trong tương lai. Có lẽ bệ hạ nên tham khảo ý kiến của các quan văn võ thêm.",
        icon: <Crown className="h-8 w-8 text-red-500" />
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/images/placeholder.jpg';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
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
              {gameSteps[currentStep].backgroundImage && (
                <div className="absolute inset-0 rounded-lg overflow-hidden -z-10 opacity-20">
                  <img
                    src={gameSteps[currentStep].backgroundImage}
                    alt="background"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{gameSteps[currentStep].title}</h3>
                <p className="text-muted-foreground">{gameSteps[currentStep].description}</p>
              </div>

              <ScrollArea className="h-[500px] rounded-md border p-4">
                <div className="space-y-4">
                  {gameSteps[currentStep].choices.map((choice) => (
                    <motion.div
                      key={choice.id}
                      variants={slideIn}
                      className="relative"
                    >
                      <Button
                        variant="outline"
                        className={`w-full justify-start gap-4 h-auto p-4 text-left transition-all ${
                          selectedChoice?.id === choice.id ? 'border-primary' : ''
                        }`}
                        onClick={() => handleChoice(choice)}
                        disabled={selectedChoice !== null}
                      >
                        <div className="flex items-start gap-4 w-full">
                          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                            {choice.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{choice.text}</p>
                            {choice.imageUrl && (
                              <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={choice.imageUrl}
                                  alt={choice.text}
                                  onError={handleImageError}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            {selectedChoice?.id === choice.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-4 space-y-3"
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
              className="text-center"
            >
              <div className="mb-6">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  {getGameResult().icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{getGameResult().title}</h3>
                <p className="text-muted-foreground">{getGameResult().description}</p>
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Điểm số của bệ hạ: {score}/{gameSteps.length * 10}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Button onClick={resetGame} className="hover-lift">
                  Chơi lại
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}