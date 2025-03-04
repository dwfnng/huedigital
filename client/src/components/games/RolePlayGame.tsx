import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, MapPin, Building2, Wind, Scroll, Star, ChevronRight, Book, Swords, FileText, Anchor } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Choice {
  id: string;
  text: string;
  result: string;
  score: number;
  icon: JSX.Element;
  historicalInfo?: string;
  consequence?: string;
  learnMore?: {
    title: string;
    content: string;
    image?: string;
  };
}

interface GameStep {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
  background?: string;
  historicalContext?: string;
}

const gameSteps: GameStep[] = [
  {
    id: "location",
    title: "Chọn vị trí xây dựng kinh đô",
    description: "Thưa bệ hạ, nơi đâu sẽ là vị trí lý tưởng để xây dựng kinh đô mới của triều Nguyễn? Mỗi lựa chọn sẽ ảnh hưởng đến tương lai phát triển của vương triều.",
    historicalContext: "Sau khi thống nhất đất nước năm 1802, vua Gia Long cần chọn một vị trí chiến lược để xây dựng kinh đô mới, đánh dấu sự khởi đầu của triều Nguyễn.",
    choices: [
      {
        id: "hue",
        text: "Vùng đất Phú Xuân (Huế)",
        result: "Một lựa chọn sáng suốt! Vùng đất Phú Xuân nằm ở vị trí trung tâm đất nước, có núi sông bao bọc, địa thế hiểm yếu, thuận lợi cho việc phòng thủ và phát triển.",
        score: 10,
        icon: <MapPin className="h-5 w-5" />,
        historicalInfo: "Phú Xuân từng là kinh đô của chúa Nguyễn từ thế kỷ 17. Vị trí này nằm giữa hai miền Nam - Bắc, thuận lợi cho việc kiểm soát toàn bộ lãnh thổ.",
        consequence: "Việc chọn Phú Xuân làm kinh đô giúp triều Nguyễn dễ dàng quản lý cả nước và phát triển quan hệ ngoại giao với các nước láng giềng.",
        learnMore: {
          title: "Lịch sử Phú Xuân",
          content: "Phú Xuân là vùng đất địa linh nhân kiệt, nơi hội tụ những giá trị văn hóa độc đáo. Với hệ thống sông Hương và núi Ngự Bình, đây là nơi có địa thế đẹp, hợp phong thủy theo quan niệm thời bấy giờ.",
          image: "/assets/images/phu-xuan.jpg"
        }
      },
      {
        id: "hanoi",
        text: "Giữ nguyên Thăng Long (Hà Nội)",
        result: "Thăng Long tuy là kinh đô cổ với nhiều lợi thế về văn hóa và kinh tế, nhưng nằm quá xa phương Nam, khó kiểm soát toàn bộ lãnh thổ.",
        score: 5,
        icon: <Building2 className="h-5 w-5" />,
        historicalInfo: "Thăng Long là kinh đô của các triều đại từ thời Lý, với hệ thống thành quách đồ sộ và nền văn hóa lâu đời.",
        consequence: "Việc giữ Thăng Long làm kinh đô có thể gây khó khăn trong việc kiểm soát các vùng đất phía Nam và ảnh hưởng đến sự ổn định của triều đại.",
        learnMore: {
          title: "Di sản Thăng Long",
          content: "Thăng Long - Hà Nội là trung tâm văn hóa, chính trị lâu đời với hơn 1000 năm lịch sử phát triển. Tuy nhiên, vị trí này không còn phù hợp với bối cảnh mới của đất nước sau thống nhất.",
          image: "/assets/images/thang-long.jpg"
        }
      },
      {
        id: "saigon",
        text: "Chọn Gia Định (Sài Gòn)",
        result: "Gia Định tuy là vùng đất mới phát triển với tiềm năng thương mại lớn, nhưng vị trí quá xa trung tâm, không thuận lợi cho việc cai quản đất nước.",
        score: 3,
        icon: <Anchor className="h-5 w-5" />,
        historicalInfo: "Gia Định là vùng đất trù phú, có cảng sông thuận lợi cho giao thương, nhưng chưa có cơ sở hạ tầng và truyền thống văn hóa đủ mạnh.",
        consequence: "Việc đặt kinh đô ở Gia Định sẽ gây khó khăn trong việc quản lý các vùng miền khác, đặc biệt là khu vực Bắc Bộ.",
        learnMore: {
          title: "Tiềm năng Gia Định",
          content: "Gia Định có vị trí thuận lợi cho giao thương đường biển, nhưng chưa đủ điều kiện để trở thành trung tâm chính trị - văn hóa của cả nước vào thời điểm đó.",
          image: "/assets/images/gia-dinh.jpg"
        }
      }
    ]
  },
  {
    id: "defense",
    title: "Chiến lược phòng thủ",
    description: "Bệ hạ cần quyết định phương án phòng thủ cho kinh thành. Điều này sẽ ảnh hưởng trực tiếp đến an ninh của triều đình.",
    historicalContext: "Kinh thành không chỉ là trung tâm chính trị mà còn phải là một pháo đài kiên cố, bảo vệ triều đình trước mọi hiểm họa.",
    choices: [
      {
        id: "modern_defense",
        text: "Kết hợp phòng thủ truyền thống và hiện đại",
        result: "Sáng suốt! Việc kết hợp hào lũy truyền thống với công sự theo kiểu Vauban sẽ tạo nên hệ thống phòng thủ vững chắc.",
        score: 10,
        icon: <Swords className="h-5 w-5" />,
        historicalInfo: "Vua Gia Long đã học hỏi kỹ thuật xây dựng phòng thủ từ các chuyên gia phương Tây.",
        learnMore: {
          title: "Kiến trúc Vauban",
          content: "Kiến trúc Vauban là phong cách xây dựng công sự phòng thủ tiên tiến của Pháp, được áp dụng trong xây dựng Kinh thành Huế.",
          image: "/assets/images/vauban.jpg"
        }
      }
    ]
  },
  {
    id: "culture",
    title: "Phát triển văn hóa",
    description: "Kinh đô mới cần có những định hướng phát triển văn hóa. Bệ hạ chọn phương án nào?",
    historicalContext: "Văn hóa không chỉ là nền tảng tinh thần mà còn là sức mạnh mềm của một vương triều.",
    choices: [
      {
        id: "traditional",
        text: "Bảo tồn và phát triển văn hóa truyền thống",
        result: "Xuất sắc! Việc giữ gìn bản sắc văn hóa dân tộc sẽ tạo nền tảng vững chắc cho sự phát triển của triều đại.",
        score: 10,
        icon: <Book className="h-5 w-5" />,
        historicalInfo: "Triều Nguyễn đã có những đóng góp to lớn trong việc bảo tồn và phát triển văn hóa Việt Nam.",
        learnMore: {
          title: "Văn hóa cung đình Huế",
          content: "Văn hóa cung đình Huế là sự kết hợp hài hòa giữa truyền thống và những tinh hoa văn hóa mới.",
          image: "/assets/images/culture.jpg"
        }
      }
    ]
  }
];

export default function RolePlayGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [confirmedChoice, setConfirmedChoice] = useState<Choice | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [readyForNext, setReadyForNext] = useState(false);

  const handleChoice = (choice: Choice) => {
    if (!confirmedChoice) {
      setSelectedChoice(choice);
    }
  };

  const confirmChoice = () => {
    if (selectedChoice) {
      setConfirmedChoice(selectedChoice);
      setScore(score + selectedChoice.score);
      setSelectedChoices([...selectedChoices, selectedChoice.id]);
      setShowNextButton(true);
    }
  };

  const changeChoice = () => {
    setSelectedChoice(null);
    setConfirmedChoice(null);
    setShowNextButton(false);
  };

  const handleNext = () => {
    setReadyForNext(true);
    setTimeout(() => {
      if (currentStep < gameSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        setSelectedChoice(null);
        setConfirmedChoice(null);
        setShowNextButton(false);
        setReadyForNext(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const getGameResult = () => {
    if (score >= 18) {
      return {
        title: "Minh quân anh minh!",
        description: "Bệ hạ đã có những quyết định sáng suốt trong việc chọn vị trí và quy hoạch kinh đô. Những lựa chọn này sẽ tạo nền móng vững chắc cho sự phát triển lâu dài của triều Nguyễn.",
        icon: <Star className="h-6 w-6 text-yellow-500" />
      };
    } else if (score >= 12) {
      return {
        title: "Quyết định tạm được",
        description: "Các quyết định của bệ hạ có những điểm hợp lý, nhưng vẫn còn những điểm cần cải thiện để đảm bảo sự thịnh vượng lâu dài của vương triều.",
        icon: <Scroll className="h-6 w-6 text-blue-500" />
      };
    } else {
      return {
        title: "Cần cân nhắc kỹ hơn",
        description: "Những quyết định này có thể gây khó khăn cho việc phát triển kinh đô. Bệ hạ nên xem xét lại các yếu tố về địa lý, phong thủy và chiến lược để có quyết định tốt hơn.",
        icon: <Crown className="h-6 w-6 text-red-500" />
      };
    }
  };

  const resetGame = () => {
    setCurrentStep(0);
    setScore(0);
    setSelectedChoices([]);
    setShowResult(false);
    setSelectedChoice(null);
    setConfirmedChoice(null);
    setShowNextButton(false);
    setReadyForNext(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background/95 backdrop-blur-md">
      <CardContent className="p-2 md:p-6">
        <div className="text-center mb-4 md:mb-6">
          <div className="inline-block p-2 md:p-3 bg-primary/10 rounded-full mb-2 md:mb-3">
            <Crown className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Nhập vai vua Gia Long</h2>
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
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base md:text-lg font-medium">{gameSteps[currentStep].title}</h3>
                  <span className="text-sm text-muted-foreground">
                    Bước {currentStep + 1}/{gameSteps.length}
                  </span>
                </div>

                {gameSteps[currentStep].historicalContext && (
                  <div className="p-3 md:p-4 bg-primary/5 rounded-lg mb-4">
                    <p className="text-sm italic">
                      {gameSteps[currentStep].historicalContext}
                    </p>
                  </div>
                )}

                <div className="p-3 md:p-4 bg-accent/20 rounded-lg mb-4 md:mb-6">
                  <p className="text-sm md:text-base">{gameSteps[currentStep].description}</p>
                </div>
              </div>

              <ScrollArea className="h-[350px] md:h-[500px] rounded-md border p-2 md:p-4">
                <div className="space-y-2 md:space-y-3">
                  {gameSteps[currentStep].choices.map((choice) => (
                    <motion.div
                      key={choice.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <Button
                        variant={selectedChoice?.id === choice.id ? "secondary" : "outline"}
                        className={`w-full justify-start gap-2 md:gap-3 h-auto p-3 md:p-4 text-left ${
                          confirmedChoice?.id === choice.id ? 'border-primary bg-primary/10' : ''
                        } touch-manipulation`}
                        onClick={() => !confirmedChoice && handleChoice(choice)}
                        disabled={confirmedChoice !== null && confirmedChoice.id !== choice.id}
                      >
                        <div className="flex items-start gap-2 md:gap-3 w-full">
                          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                            {choice.icon}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm md:text-base font-medium">{choice.text}</p>
                            {(confirmedChoice?.id === choice.id || selectedChoice?.id === choice.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-2 md:mt-3 space-y-2"
                              >
                                {confirmedChoice?.id === choice.id && (
                                  <div className="p-2 md:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <p className="text-sm md:text-base">{choice.result}</p>
                                  </div>
                                )}
                                {choice.historicalInfo && (
                                  <div className="p-2 md:p-3 bg-muted/30 rounded-lg">
                                    <p className="text-xs md:text-sm text-muted-foreground">
                                      {choice.historicalInfo}
                                    </p>
                                  </div>
                                )}
                                {choice.consequence && confirmedChoice?.id === choice.id && (
                                  <div className="p-2 md:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <h4 className="text-sm font-medium mb-1">Hệ quả lịch sử:</h4>
                                    <p className="text-xs md:text-sm">{choice.consequence}</p>
                                  </div>
                                )}
                                {choice.learnMore && confirmedChoice?.id === choice.id && (
                                  <div className="mt-3 md:mt-4 p-3 md:p-4 bg-primary/5 rounded-lg">
                                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                      <FileText className="h-4 w-4" />
                                      Tìm hiểu thêm: {choice.learnMore.title}
                                    </h4>
                                    <p className="text-xs md:text-sm">{choice.learnMore.content}</p>
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

              {selectedChoice && !confirmedChoice && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex justify-end gap-2"
                >
                  <Button 
                    variant="outline" 
                    onClick={changeChoice}
                    className="text-sm md:text-base py-2 md:py-3"
                  >
                    Đổi lựa chọn
                  </Button>
                  <Button 
                    onClick={confirmChoice}
                    className="text-sm md:text-base py-2 md:py-3"
                  >
                    Xác nhận lựa chọn
                  </Button>
                </motion.div>
              )}

              {showNextButton && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex justify-end"
                >
                  <Button 
                    onClick={handleNext} 
                    className="gap-2 text-sm md:text-base py-2 md:py-3" 
                    disabled={readyForNext}
                  >
                    {currentStep === gameSteps.length - 1 ? 'Kết thúc' : 'Tiếp theo'}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              <Progress value={(currentStep / gameSteps.length) * 100} className="h-2 mt-4" />
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
              }}
              className="text-center py-4 md:py-6"
            >
              <div className="mb-4 md:mb-6">
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

              <Button 
                onClick={resetGame} 
                size="lg" 
                className="text-sm md:text-base py-2 md:py-3"
              >
                Chơi lại
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}