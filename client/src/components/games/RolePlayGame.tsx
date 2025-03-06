import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, MapPin, Building2, Wind, Scroll, Star, ChevronRight, Book, Swords, FileText, Anchor, Shield, Users, Coins, MessageCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Choice {
  id: string;
  text: string;
  result: string;
  score: number;
  icon: JSX.Element;
  historicalInfo?: string;
  consequence?: string;
  requiresPreviousChoice?: string;
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
    description: `Thưa bệ hạ, nơi đâu sẽ là vị trí lý tưởng để xây dựng kinh đô mới của triều Nguyễn? 

    Mỗi lựa chọn sẽ ảnh hưởng đến tương lai phát triển của vương triều.`,
    historicalContext: `Sau khi thống nhất đất nước năm 1802, vua Gia Long cần chọn một vị trí chiến lược để xây dựng kinh đô mới, đánh dấu sự khởi đầu của triều Nguyễn.`,
    choices: [
      {
        id: "hue",
        text: "Vùng đất Phú Xuân (Huế)",
        result: `Một lựa chọn sáng suốt! 

        Vùng đất Phú Xuân nằm ở vị trí trung tâm đất nước, có núi sông bao bọc, địa thế hiểm yếu, thuận lợi cho việc phòng thủ và phát triển.`,
        score: 10,
        icon: <MapPin className="h-5 w-5" />,
        historicalInfo: `Phú Xuân từng là kinh đô của chúa Nguyễn từ thế kỷ 17. 

        Vị trí này nằm giữa hai miền Nam - Bắc, thuận lợi cho việc kiểm soát toàn bộ lãnh thổ.`,
        consequence: `Việc chọn Phú Xuân làm kinh đô giúp triều Nguyễn dễ dàng quản lý cả nước và phát triển quan hệ ngoại giao với các nước láng giềng.`,
        learnMore: {
          title: "Lịch sử Phú Xuân",
          content: `Phú Xuân là vùng đất địa linh nhân kiệt, nơi hội tụ những giá trị văn hóa độc đáo. 

          Với hệ thống sông Hương và núi Ngự Bình, đây là nơi có địa thế đẹp, hợp phong thủy theo quan niệm thời bấy giờ.`,
          image: "/assets/images/phu-xuan.jpg"
        }
      },
      {
        id: "thanh-hoa",
        text: "Vùng đất Thanh Hóa",
        result: "Thanh Hóa tuy có truyền thống lịch sử lâu đời và từng là căn cứ của nhiều triều đại, nhưng vị trí này không thuận lợi cho việc kiểm soát toàn bộ lãnh thổ.",
        score: 4,
        icon: <Shield className="h-5 w-5" />,
        historicalInfo: "Thanh Hóa là vùng đất có truyền thống văn hóa lâu đời, từng là quê hương của triều Hậu Lê.",
        consequence: "Việc đặt kinh đô ở Thanh Hóa có thể gây khó khăn trong việc kiểm soát các vùng đất phía Nam.",
      },
      {
        id: "hanoi",
        text: "Giữ nguyên Thăng Long (Hà Nội)",
        result: `Thăng Long tuy là kinh đô cổ với nhiều lợi thế về văn hóa và kinh tế, nhưng nằm quá xa phương Nam, khó kiểm soát toàn bộ lãnh thổ.`,
        score: 5,
        icon: <Building2 className="h-5 w-5" />,
        historicalInfo: `Thăng Long là kinh đô của các triều đại từ thời Lý, với hệ thống thành quách đồ sộ và nền văn hóa lâu đời.`,
        consequence: `Việc giữ Thăng Long làm kinh đô có thể gây khó khăn trong việc kiểm soát các vùng đất phía Nam và ảnh hưởng đến sự ổn định của triều đại.`,
        learnMore: {
          title: "Di sản Thăng Long",
          content: `Thăng Long - Hà Nội là trung tâm văn hóa, chính trị lâu đời với hơn 1000 năm lịch sử phát triển. 

          Tuy nhiên, vị trí này không còn phù hợp với bối cảnh mới của đất nước sau thống nhất.`,
          image: "/assets/images/thang-long.jpg"
        }
      },
      {
        id: "saigon",
        text: "Chọn Gia Định (Sài Gòn)",
        result: `Gia Định tuy là vùng đất mới phát triển với tiềm năng thương mại lớn, nhưng vị trí quá xa trung tâm, không thuận lợi cho việc cai quản đất nước.`,
        score: 3,
        icon: <Anchor className="h-5 w-5" />,
        historicalInfo: `Gia Định là vùng đất trù phú, có cảng sông thuận lợi cho giao thương, nhưng chưa có cơ sở hạ tầng và truyền thống văn hóa đủ mạnh.`,
        consequence: `Việc đặt kinh đô ở Gia Định sẽ gây khó khăn trong việc quản lý các vùng miền khác, đặc biệt là khu vực Bắc Bộ.`,
        learnMore: {
          title: "Tiềm năng Gia Định",
          content: `Gia Định có vị trí thuận lợi cho giao thương đường biển, nhưng chưa đủ điều kiện để trở thành trung tâm chính trị - văn hóa của cả nước vào thời điểm đó.`,
          image: "/assets/images/gia-dinh.jpg"
        }
      }
    ]
  },
  {
    id: "defense",
    title: "Chiến lược phòng thủ",
    description: `Bệ hạ cần quyết định phương án phòng thủ cho kinh thành. 

    Điều này sẽ ảnh hưởng trực tiếp đến an ninh của triều đình.`,
    historicalContext: `Kinh thành không chỉ là trung tâm chính trị mà còn phải là một pháo đài kiên cố, bảo vệ triều đình trước mọi hiểm họa.`,
    choices: [
      {
        id: "modern_defense",
        text: "Kết hợp phòng thủ truyền thống và hiện đại",
        result: `Sáng suốt! 

        Việc kết hợp hào lũy truyền thống với công sự theo kiểu Vauban sẽ tạo nên hệ thống phòng thủ vững chắc.`,
        score: 10,
        icon: <Swords className="h-5 w-5" />,
        historicalInfo: `Vua Gia Long đã học hỏi kỹ thuật xây dựng phòng thủ từ các chuyên gia phương Tây.`,
        learnMore: {
          title: "Kiến trúc Vauban",
          content: `Kiến trúc Vauban là phong cách xây dựng công sự phòng thủ tiên tiến của Pháp, được áp dụng trong xây dựng Kinh thành Huế.`,
          image: "/assets/images/vauban.jpg"
        }
      },
      {
        id: "traditional_defense",
        text: "Xây dựng theo phương thức truyền thống",
        result: "Phương án an toàn nhưng có thể không đủ hiệu quả trước các kỹ thuật chiến tranh hiện đại.",
        score: 5,
        icon: <Shield className="h-5 w-5" />,
        historicalInfo: "Phương thức phòng thủ truyền thống đã được sử dụng qua nhiều thế kỷ trong lịch sử Việt Nam.",
        consequence: "Hệ thống phòng thủ có thể không đủ mạnh để đối phó với vũ khí hiện đại của phương Tây.",
      },
      {
        id: "western_defense",
        text: "Áp dụng hoàn toàn công nghệ phương Tây",
        result: "Mặc dù hiện đại nhưng chi phí cao và có thể không phù hợp với điều kiện địa lý và khí hậu của Việt Nam.",
        score: 7,
        icon: <Building2 className="h-5 w-5" />,
        historicalInfo: "Công nghệ phòng thủ phương Tây đang phát triển mạnh mẽ với nhiều ưu điểm vượt trội.",
        consequence: "Việc áp dụng hoàn toàn công nghệ phương Tây có thể gặp khó khăn trong việc bảo trì và vận hành.",
      }
    ]
  },
  {
    id: "administration",
    title: "Tổ chức bộ máy hành chính",
    description: "Bệ hạ cần quyết định cách tổ chức và vận hành bộ máy hành chính của triều đình.",
    historicalContext: "Một bộ máy hành chính hiệu quả là nền tảng cho sự phát triển ổn định của vương triều.",
    choices: [
      {
        id: "reform",
        text: "Cải cách toàn diện theo hướng hiện đại",
        result: "Một quyết định táo bạo nhưng cần thiết, giúp nâng cao hiệu quả quản lý nhà nước.",
        score: 8,
        icon: <Users className="h-5 w-5" />,
        historicalInfo: "Các cải cách hành chính đã được thực hiện ở nhiều quốc gia châu Á thời kỳ này.",
        consequence: "Việc cải cách có thể gặp phải sự phản đối từ các quan lại bảo thủ.",
      },
      {
        id: "traditional",
        text: "Duy trì mô hình truyền thống",
        result: "An toàn nhưng có thể không đáp ứng được nhu cầu phát triển của đất nước.",
        score: 5,
        icon: <Scroll className="h-5 w-5" />,
        historicalInfo: "Mô hình hành chính truyền thống đã tồn tại qua nhiều triều đại.",
        consequence: "Bộ máy hành chính có thể trở nên cồng kềnh và kém hiệu quả.",
      },
      {
        id: "hybrid",
        text: "Kết hợp truyền thống và hiện đại",
        result: "Lựa chọn khôn ngoan! Giữ được những giá trị tốt đẹp của truyền thống trong khi vẫn có thể đổi mới.",
        score: 10,
        icon: <Crown className="h-5 w-5" />,
        historicalInfo: "Nhiều quốc gia đã thành công với mô hình kết hợp này.",
        consequence: "Tạo nền tảng vững chắc cho sự phát triển lâu dài của triều đại.",
      }
    ]
  },
  {
    id: "economy",
    title: "Chính sách kinh tế",
    description: "Bệ hạ cần lựa chọn định hướng phát triển kinh tế cho vương triều.",
    historicalContext: "Kinh tế phát triển là nền tảng cho sự thịnh vượng của đất nước.",
    choices: [
      {
        id: "trade",
        text: "Đẩy mạnh thương mại quốc tế",
        result: "Mở rộng giao thương sẽ mang lại nguồn thu lớn nhưng cũng tiềm ẩn nhiều rủi ro.",
        score: 8,
        icon: <Coins className="h-5 w-5" />,
        historicalInfo: "Việt Nam đã có truyền thống buôn bán với nhiều quốc gia trong khu vực.",
        consequence: "Tăng cường giao lưu văn hóa nhưng cũng phải đối mặt với áp lực từ các cường quốc.",
      },
      {
        id: "agriculture",
        text: "Tập trung phát triển nông nghiệp",
        result: "An toàn và phù hợp với điều kiện tự nhiên của đất nước.",
        score: 7,
        icon: <Wind className="h-5 w-5" />,
        historicalInfo: "Nông nghiệp luôn là nền tảng kinh tế của Việt Nam.",
        consequence: "Đảm bảo an ninh lương thực nhưng có thể bị tụt hậu về công nghệ.",
      },
      {
        id: "balanced",
        text: "Phát triển cân bằng các ngành",
        result: "Xuất sắc! Chiến lược này sẽ tạo nền tảng vững chắc cho sự phát triển toàn diện.",
        score: 10,
        icon: <Star className="h-5 w-5" />,
        historicalInfo: "Các quốc gia phát triển đều có nền kinh tế đa dạng.",
        consequence: "Tạo sự phát triển bền vững và giảm thiểu rủi ro.",
      }
    ]
  }
];

const RolePlayGame = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [confirmedChoice, setConfirmedChoice] = useState<Choice | null>(null);
  const [readyForNext, setReadyForNext] = useState(false);
  const { toast } = useToast();

  const handleChoice = async (choice: Choice) => {
    if (!confirmedChoice) {
      setSelectedChoice(choice);
      setConfirmedChoice(choice);
      setScore(score + choice.score);
      setSelectedChoices([...selectedChoices, choice.id]);
    }
  };

  const handleNext = () => {
    setReadyForNext(true);
    setTimeout(() => {
      if (currentStep < gameSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        setSelectedChoice(null);
        setConfirmedChoice(null);
        setReadyForNext(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const getGameResult = () => {
    const maxScore = gameSteps.length * 10;
    const percentage = (score / maxScore) * 100;

    if (percentage >= 80) {
      return {
        title: "Minh quân anh minh!",
        description: "Bệ hạ đã có những quyết định sáng suốt trong việc xây dựng và phát triển vương triều. Những lựa chọn này sẽ tạo nền móng vững chắc cho sự phát triển lâu dài của triều Nguyễn.",
        icon: <Crown className="h-8 w-8 text-yellow-500" />
      };
    } else if (percentage >= 60) {
      return {
        title: "Hoàng đế tài năng",
        description: "Các quyết định của bệ hạ thể hiện sự cân nhắc kỹ lưỡng. Tuy có một số điểm cần cải thiện, nhưng nhìn chung vương triều sẽ phát triển ổn định.",
        icon: <Star className="h-8 w-8 text-blue-500" />
      };
    } else {
      return {
        title: "Cần cân nhắc kỹ hơn",
        description: "Một số quyết định có thể gây khó khăn cho sự phát triển của vương triều. Bệ hạ nên xem xét kỹ hơn các yếu tố về địa lý, chiến lược và văn hóa.",
        icon: <Scroll className="h-8 w-8 text-red-500" />
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
    setReadyForNext(false);
  };

  return (
    <div className="container mx-auto px-4">
      <Card className="w-full max-w-4xl mx-auto bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="p-4 md:p-6">
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Nhập vai vua Gia Long</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Đưa ra những quyết định quan trọng trong việc chọn vị trí và xây dựng kinh đô mới
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative"
              >
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                    <h3 className="text-lg font-medium">{gameSteps[currentStep].title}</h3>
                    <span className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                      Bước {currentStep + 1}/{gameSteps.length}
                    </span>
                  </div>

                  {gameSteps[currentStep].historicalContext && (
                    <div className="p-4 bg-accent/10 rounded-lg mb-4">
                      <p className="text-sm italic">
                        {gameSteps[currentStep].historicalContext}
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-card rounded-lg border mb-6">
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {gameSteps[currentStep].description}
                    </p>
                  </div>
                </div>

                <ScrollArea className="h-[350px] md:h-[400px] rounded-lg border p-4">
                  <div className="space-y-3">
                    {gameSteps[currentStep].choices.map((choice) => (
                      <motion.div
                        key={choice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Button
                          variant={confirmedChoice?.id === choice.id ? "secondary" : "outline"}
                          className={cn(
                            "w-full justify-start gap-3 h-auto p-4 text-left transition-all",
                            confirmedChoice?.id === choice.id && "border-primary bg-primary/10",
                            !confirmedChoice && "hover:border-primary/50"
                          )}
                          onClick={() => !confirmedChoice && handleChoice(choice)}
                          disabled={confirmedChoice !== null && confirmedChoice.id !== choice.id}
                        >
                          <div className="flex items-start gap-3 w-full min-w-0">
                            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                              {choice.icon}
                            </div>
                            <div className="flex-1 min-w-0 break-words">
                              <p className="font-medium mb-1">{choice.text}</p>
                              {confirmedChoice?.id === choice.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="mt-3 space-y-3"
                                >
                                  <div className="p-3 bg-green-500/10 dark:bg-green-500/20 rounded-lg">
                                    <p className="text-sm break-words">{choice.result}</p>
                                  </div>
                                  {choice.historicalInfo && (
                                    <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
                                      <h4 className="text-sm font-medium mb-1">Bối cảnh lịch sử:</h4>
                                      <p className="text-sm break-words">{choice.historicalInfo}</p>
                                    </div>
                                  )}
                                  {choice.consequence && (
                                    <div className="p-3 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-lg">
                                      <h4 className="text-sm font-medium mb-1">Hệ quả lịch sử:</h4>
                                      <p className="text-sm break-words">{choice.consequence}</p>
                                    </div>
                                  )}
                                  {choice.learnMore && (
                                    <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Tìm hiểu thêm: {choice.learnMore.title}
                                      </h4>
                                      <p className="text-sm break-words whitespace-pre-line">
                                        {choice.learnMore.content}
                                      </p>
                                    </div>
                                  )}

                                  {/* Forum Integration */}
                                  <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full justify-center gap-2"
                                      onClick={() => {
                                        toast({
                                          title: "Diễn đàn thảo luận",
                                          description: "Tính năng diễn đàn sẽ sớm được ra mắt!",
                                          duration: 3000,
                                        });
                                      }}
                                    >
                                      <MessageCircle className="h-4 w-4" />
                                      <span>Thảo luận về lựa chọn này</span>
                                    </Button>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                {confirmedChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex justify-end"
                  >
                    <Button
                      onClick={handleNext}
                      className="gap-2"
                      size="lg"
                      disabled={readyForNext}
                    >
                      {currentStep === gameSteps.length - 1 ? 'Xem kết quả' : 'Bước tiếp theo'}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}

                <Progress
                  value={(currentStep / (gameSteps.length - 1)) * 100}
                  className="h-2 mt-6"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                    {getGameResult().icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{getGameResult().title}</h3>
                  <p className="text-muted-foreground mb-4 max-w-2xl mx-auto px-4">
                    {getGameResult().description}
                  </p>
                  <div className="inline-block px-4 py-2 bg-card rounded-lg border">
                    <p className="text-sm font-medium">
                      Điểm số của bệ hạ: {score}/{gameSteps.length * 10}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={resetGame}
                  size="lg"
                  className="min-w-[200px]"
                >
                  Chơi lại
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolePlayGame;