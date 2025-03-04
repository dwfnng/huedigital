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
  historicalInfo?: string;
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
    description: "Thưa bệ hạ, nơi đâu sẽ là vị trí lý tưởng để xây dựng kinh đô mới của triều Nguyễn? Mỗi lựa chọn sẽ ảnh hưởng đến tương lai phát triển của vương triều.",
    choices: [
      {
        id: "hue",
        text: "Vùng đất Phú Xuân (Huế)",
        result: "Một lựa chọn sáng suốt! Vùng đất Phú Xuân nằm ở vị trí trung tâm đất nước, có núi sông bao bọc, địa thế hiểm yếu, thuận lợi cho việc phòng thủ và phát triển.",
        score: 10,
        icon: <MapPin className="h-5 w-5" />,
        historicalInfo: "Phú Xuân từng là kinh đô của chúa Nguyễn từ thế kỷ 17. Vị trí này nằm giữa hai miền Nam - Bắc, thuận lợi cho việc kiểm soát toàn bộ lãnh thổ. Địa thế được bao bọc bởi núi Ngự Bình và sông Hương, tạo nên thế phòng thủ tự nhiên. Đây cũng là nơi giao thoa của nhiều nền văn hóa, thích hợp cho việc xây dựng một kinh đô mới."
      },
      {
        id: "hanoi",
        text: "Giữ nguyên Thăng Long (Hà Nội)",
        result: "Thăng Long tuy là kinh đô cổ với nhiều lợi thế về văn hóa và kinh tế, nhưng nằm quá xa phương Nam, khó kiểm soát toàn bộ lãnh thổ.",
        score: 5,
        icon: <Building2 className="h-5 w-5" />,
        historicalInfo: "Thăng Long là kinh đô của các triều đại từ thời Lý, với hệ thống thành quách đồ sộ và nền văn hóa lâu đời. Tuy nhiên, vị trí này quá xa phía Nam và còn nhiều dấu ấn của triều Lê, không phù hợp với chiến lược cai trị của triều Nguyễn. Việc duy trì Thăng Long làm kinh đô có thể gây khó khăn trong việc thiết lập quyền uy mới."
      },
      {
        id: "saigon",
        text: "Vùng đất Gia Định (Sài Gòn)",
        result: "Gia Định tuy là căn cứ địa cũ với tiềm năng phát triển thương mại, nhưng nằm quá xa phương Bắc, không thuận lợi cho việc cai quản toàn quốc.",
        score: 5,
        icon: <Building2 className="h-5 w-5" />,
        historicalInfo: "Gia Định là vùng đất trù phú với tiềm năng thương mại lớn nhờ vị trí gần biển và hệ thống sông ngòi. Tuy nhiên, vị trí này quá xa Thăng Long, gây khó khăn trong việc kiểm soát các vùng miền phía Bắc. Ngoài ra, đây là vùng đất mới khai phá, chưa có nền tảng văn hóa và kiến trúc vững chắc để xây dựng kinh đô."
      }
    ]
  },
  {
    id: "geomancy",
    title: "Chọn phương án phong thủy",
    description: "Các nhà phong thủy đã khảo sát địa thế, bệ hạ chọn phương án nào để xây dựng kinh thành? Mỗi phương án đều có những ưu điểm riêng về mặt phong thủy và chiến lược.",
    choices: [
      {
        id: "mountain_river",
        text: "Dựa vào núi Ngự Bình, sông Hương",
        result: "Xuất sắc! Núi Ngự Bình như án ngự phía Nam, sông Hương uốn quanh như rồng chầu, tạo nên thế đất 'tọa sơn hướng thủy' hoàn hảo cho một kinh đô phồn thịnh.",
        score: 10,
        icon: <Wind className="h-5 w-5" />,
        historicalInfo: "Theo nguyên lý phong thủy truyền thống, thế đất 'tọa sơn hướng thủy' là lựa chọn lý tưởng cho kinh đô. Núi Ngự Bình được ví như bàn tay che chở, trong khi sông Hương uốn lượn như con rồng chầu, tạo nên khí thế hùng vĩ và cân bằng. Địa thế này không chỉ đẹp về mặt phong thủy mà còn có lợi thế về phòng thủ và giao thông đường thủy."
      },
      {
        id: "flat_land",
        text: "Chọn vùng đất bằng phẳng",
        result: "Đất bằng phẳng tuy dễ xây dựng nhưng thiếu các yếu tố phong thủy quan trọng, không tạo được thế đất vững mạnh cho kinh đô.",
        score: 5,
        icon: <Wind className="h-5 w-5" />,
        historicalInfo: "Vùng đất bằng phẳng có ưu điểm là dễ quy hoạch và xây dựng, nhưng lại thiếu các yếu tố phong thủy cốt lõi như núi non che chắn và dòng nước bao bọc. Theo quan niệm phong thủy cổ đại, địa thế này không đủ mạnh để tạo nên một kinh đô thịnh vượng lâu dài."
      },
      {
        id: "coast",
        text: "Gần biển để thuận tiện giao thương",
        result: "Vị trí quá gần biển không tốt cho phong thủy, dễ bị ảnh hưởng bởi bão tố và các yếu tố thời tiết khắc nghiệt.",
        score: 5,
        icon: <Wind className="h-5 w-5" />,
        historicalInfo: "Mặc dù vị trí gần biển có lợi thế về giao thương và phát triển kinh tế, nhưng theo phong thủy, đây không phải là lựa chọn tốt cho kinh đô. Vùng ven biển thường xuyên chịu ảnh hưởng của bão tố, thời tiết khắc nghiệt, và theo quan niệm cổ đại, năng lượng của biển quá mạnh có thể gây mất cân bằng cho vùng đất."
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
        description: "Bệ hạ đã có những quyết định sáng suốt trong việc chọn vị trí và quy hoạch kinh đô. Những lựa chọn này sẽ tạo nền móng vững chắc cho sự phát triển lâu dài của triều Nguyễn.",
        icon: <Star className="h-5 w-5 text-yellow-500" />
      };
    } else if (score >= 12) {
      return {
        title: "Quyết định tạm được",
        description: "Các quyết định của bệ hạ có những điểm hợp lý, nhưng vẫn còn những điểm cần cải thiện để đảm bảo sự thịnh vượng lâu dài của vương triều.",
        icon: <Scroll className="h-5 w-5 text-blue-500" />
      };
    } else {
      return {
        title: "Cần cân nhắc kỹ hơn",
        description: "Những quyết định này có thể gây khó khăn cho việc phát triển kinh đô. Bệ hạ nên xem xét lại các yếu tố về địa lý, phong thủy và chiến lược để có quyết định tốt hơn.",
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
    <Card className="w-full max-w-4xl mx-auto bg-background/95 backdrop-blur-md">
      <CardContent className="p-4 md:p-6">
        <div className="text-center mb-4 md:mb-6">
          <div className="inline-block p-2 md:p-3 bg-primary/10 rounded-full mb-2 md:mb-3">
            <Crown className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold">Nhập vai vua Gia Long</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Đưa ra những quyết định quan trọng trong việc chọn vị trí và xây dựng kinh đô mới
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentStep}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
              }}
              className="relative"
            >
              <div className="mb-4">
                <h3 className="text-base md:text-lg font-medium mb-2">{gameSteps[currentStep].title}</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  {gameSteps[currentStep].description}
                </p>
              </div>

              <ScrollArea className="h-[450px] md:h-[500px] rounded-md border p-4">
                <div className="space-y-3">
                  {gameSteps[currentStep].choices.map((choice) => (
                    <motion.div key={choice.id} variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}>
                      <Button
                        variant="outline"
                        className={`w-full justify-start gap-3 h-auto p-4 text-left ${
                          selectedChoice?.id === choice.id ? 'border-primary' : ''
                        }`}
                        onClick={() => handleChoice(choice)}
                        disabled={selectedChoice !== null}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                            {choice.icon}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm md:text-base font-medium">{choice.text}</p>
                            {selectedChoice?.id === choice.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-3 space-y-2"
                              >
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                  <p className="text-sm md:text-base">{choice.result}</p>
                                </div>
                                {choice.historicalInfo && (
                                  <div className="p-3 bg-muted/30 rounded-lg">
                                    <p className="text-xs md:text-sm text-muted-foreground">
                                      {choice.historicalInfo}
                                    </p>
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
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
              }}
              className="text-center py-6"
            >
              <div className="mb-6">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
                  {getGameResult().icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{getGameResult().title}</h3>
                <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                  {getGameResult().description}
                </p>
                <div className="mt-4 p-3 bg-muted/30 rounded-lg inline-block">
                  <p className="text-sm md:text-base">
                    Điểm số của bệ hạ: {score}/{gameSteps.length * 10}
                  </p>
                </div>
              </div>

              <Button onClick={resetGame} size="lg" className="text-sm md:text-base">
                Chơi lại
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}