
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Building2, Map, BookOpen, Check, ArrowRight } from "lucide-react";
import { useState } from "react";

interface GameCardProps {
  icon: any;
  title: string;
  description: string;
  onPlay?: () => void;
}

const GameCard = ({ icon: Icon, title, description, onPlay }: GameCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Button onClick={onPlay} className="w-full">
          Chơi ngay
        </Button>
      </CardContent>
    </Card>
  );
};

// A simple quiz game component
const QuizGame = ({ onBack }: { onBack: () => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "Ai là vị vua đầu tiên của triều Nguyễn?",
      options: ["Gia Long", "Minh Mạng", "Thiệu Trị", "Tự Đức"],
      answer: 0
    },
    {
      question: "Thành phố Huế nằm bên bờ sông nào?",
      options: ["Sông Cửu Long", "Sông Đà", "Sông Hồng", "Sông Hương"],
      answer: 3
    },
    {
      question: "Triều Nguyễn tồn tại trong khoảng thời gian nào?",
      options: ["1802-1945", "1858-1945", "1802-1885", "1885-1945"],
      answer: 0
    },
    {
      question: "Đại Nội Huế được xây dựng dưới thời vua nào?",
      options: ["Gia Long", "Minh Mạng", "Thiệu Trị", "Tự Đức"],
      answer: 0
    },
    {
      question: "Nhã nhạc cung đình Huế được UNESCO công nhận là di sản văn hóa phi vật thể vào năm nào?",
      options: ["2003", "2005", "2010", "2015"],
      answer: 0
    }
  ];

  const handleAnswer = (selectedOption: number) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <Button variant="outline" size="sm" onClick={onBack} className="w-24 mb-4">
          Quay lại
        </Button>
        <CardTitle className="text-2xl">Kiến thức về cố đô Huế</CardTitle>
        {!showResult && (
          <CardDescription>
            Câu hỏi {currentQuestion + 1} / {questions.length}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {!showResult ? (
          <div className="space-y-4">
            <div className="text-xl font-medium">
              {questions[currentQuestion].question}
            </div>
            <div className="grid gap-2">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left"
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="text-xl font-medium">Kết quả</div>
            <div className="text-3xl font-bold">
              {score} / {questions.length}
            </div>
            <div className="text-muted-foreground">
              {score === questions.length 
                ? "Tuyệt vời! Bạn đã trả lời đúng tất cả các câu hỏi." 
                : "Hãy thử lại để cải thiện kết quả của bạn."}
            </div>
            <Button onClick={resetQuiz} className="mt-4">
              Chơi lại
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// A simple role-playing game component
const RolePlayGame = ({ onBack }: { onBack: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);

  const scenario = [
    {
      text: "Năm 1802, bạn là vua Gia Long vừa thống nhất đất nước. Bạn cần chọn nơi đặt kinh đô mới.",
      options: [
        "Chọn Phú Xuân (Huế) vì lý do phong thủy và chiến lược",
        "Chọn Thăng Long (Hà Nội) vì đã là kinh đô lâu đời",
        "Chọn Gia Định (Sài Gòn) vì đã giúp bạn trong cuộc chiến với Tây Sơn"
      ]
    },
    {
      text: "Bạn đã chọn Phú Xuân làm kinh đô. Giờ bạn cần quyết định cách xây dựng cung điện.",
      options: [
        "Xây dựng theo kiểu Trung Hoa, thể hiện sự tôn trọng với nhà Thanh",
        "Kết hợp kiến trúc Việt Nam truyền thống với ảnh hưởng phương Tây",
        "Xây dựng hoàn toàn theo phong cách Việt Nam truyền thống"
      ]
    },
    {
      text: "Kinh đô đang được xây dựng. Bạn cần quyết định chiến lược phát triển đất nước.",
      options: [
        "Tăng cường quân sự để bảo vệ vương triều mới thành lập",
        "Đẩy mạnh nông nghiệp và thủy lợi để ổn định kinh tế",
        "Cải cách giáo dục, tổ chức thi cử tìm nhân tài"
      ]
    }
  ];

  const outcomes = [
    "Dưới sự lãnh đạo của bạn, kinh đô Huế trở thành một trong những thành phố đẹp nhất Đông Nam Á, với hệ thống phòng thủ kiên cố và kiến trúc độc đáo. Tuy nhiên, việc tập trung quá nhiều vào quân sự khiến kinh tế phát triển chậm.",
    "Kinh đô Huế phát triển cân bằng với nền kinh tế ổn định, đời sống người dân được cải thiện. Kiến trúc hoàng cung kết hợp hài hòa giữa truyền thống và hiện đại, tạo nên bản sắc riêng biệt.",
    "Huế trở thành trung tâm văn hóa, giáo dục của cả nước. Nhiều công trình kiến trúc tinh xảo được xây dựng. Tuy nhiên, quân sự yếu khiến triều đình gặp khó khăn khi đối mặt với thế lực phương Tây sau này."
  ];

  const handleChoice = (choiceIndex: number) => {
    const newChoices = [...choices, choiceIndex];
    setChoices(newChoices);
    
    if (currentStep < scenario.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const determineOutcome = () => {
    // Simplified outcome determination
    const sum = choices.reduce((acc, choice) => acc + choice, 0);
    const avg = sum / choices.length;
    
    if (avg < 1) return outcomes[0];
    if (avg < 2) return outcomes[1];
    return outcomes[2];
  };

  const resetGame = () => {
    setCurrentStep(0);
    setChoices([]);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <Button variant="outline" size="sm" onClick={onBack} className="w-24 mb-4">
          Quay lại
        </Button>
        <CardTitle className="text-2xl">Nhập vai vua Gia Long</CardTitle>
        {currentStep < scenario.length && (
          <CardDescription>
            Bước {currentStep + 1} / {scenario.length}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {currentStep < scenario.length ? (
          <div className="space-y-4">
            <div className="text-xl font-medium">
              {scenario[currentStep].text}
            </div>
            <div className="grid gap-2">
              {scenario[currentStep].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left"
                  onClick={() => handleChoice(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xl font-medium">Kết quả của triều đại</div>
            <div className="bg-muted p-4 rounded-lg">
              {determineOutcome()}
            </div>
            <Button onClick={resetGame} className="mt-4">
              Chơi lại
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// A simple treasure hunt game
const TreasureHuntGame = ({ onBack }: { onBack: () => void }) => {
  const [stage, setStage] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  
  const stages = [
    {
      clue: "Để bắt đầu tìm kiếm kho báu, hãy giải mã câu đố này: 'Nơi vua ngự khi triều kiến, tên gọi là gì?' (gợi ý: _ _ _ _ _ _ _ _ _ _)",
      answer: "thái hòa",
      hint: "Đây là tên của điện lớn nhất trong Đại Nội Huế"
    },
    {
      clue: "Tuyệt vời! Giờ hãy tiếp tục với câu đố tiếp theo: 'Ta đứng trước cửa cung đình, canh giữ nơi này. Ta là ai?' (gợi ý: _ _ _ _ _ _)",
      answer: "kỳ đài",
      hint: "Đây là công trình cao nhất trong Kinh thành Huế"
    },
    {
      clue: "Rất giỏi! Để tìm thấy kho báu, hãy trả lời câu hỏi cuối cùng: 'Chín vật thiêng này được đặt trước Thế Miếu, chúng là gì?' (gợi ý: _ _ _ _ _ _ _)",
      answer: "cửu đỉnh",
      hint: "Đây là chín vật bằng đồng tượng trưng cho quyền lực của vua"
    }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedInput = input.toLowerCase().trim();
    const normalizedAnswer = stages[stage].answer.toLowerCase();
    
    if (normalizedInput === normalizedAnswer) {
      if (stage < stages.length - 1) {
        setStage(stage + 1);
        setInput("");
        setError("");
      } else {
        // Completed all stages
        setStage(stages.length);
      }
    } else {
      setError("Đáp án chưa đúng, hãy thử lại!");
    }
  };
  
  const showHint = () => {
    setError(stages[stage].hint);
  };
  
  const resetGame = () => {
    setStage(0);
    setInput("");
    setError("");
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <Button variant="outline" size="sm" onClick={onBack} className="w-24 mb-4">
          Quay lại
        </Button>
        <CardTitle className="text-2xl">Mật thư của vua Tự Đức</CardTitle>
        {stage < stages.length && (
          <CardDescription>
            Giai đoạn {stage + 1} / {stages.length}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {stage < stages.length ? (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-lg">
              {stages[stage].clue}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập đáp án của bạn"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <Button type="submit">Kiểm tra</Button>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              <Button type="button" variant="outline" onClick={showHint}>
                Xem gợi ý
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="text-2xl font-bold">Chúc mừng!</div>
            <div className="bg-muted p-4 rounded-lg">
              Bạn đã giải mã thành công mật thư của vua Tự Đức và tìm ra bức sắc phong quý giá. Đây là một trong những tài liệu lịch sử quan trọng giúp hiểu thêm về triều Nguyễn.
            </div>
            <Button onClick={resetGame} className="mt-4">
              Chơi lại
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function GamePage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  if (activeGame === "quiz") {
    return <QuizGame onBack={() => setActiveGame(null)} />;
  }
  
  if (activeGame === "roleplay") {
    return <RolePlayGame onBack={() => setActiveGame(null)} />;
  }
  
  if (activeGame === "treasure") {
    return <TreasureHuntGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Game giáo dục về Huế</h1>
      
      <Tabs defaultValue="knowledge">
        <TabsList className="mb-6">
          <TabsTrigger value="knowledge">Kiến thức</TabsTrigger>
          <TabsTrigger value="role-play">Nhập vai</TabsTrigger>
          <TabsTrigger value="treasure">Khám phá</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="space-y-4">
          <GameCard
            icon={BookOpen}
            title="Kiến thức về cố đô Huế"
            description="Kiểm tra hiểu biết của bạn về lịch sử và văn hóa Huế qua các câu hỏi trắc nghiệm."
            onPlay={() => setActiveGame("quiz")}
          />
        </TabsContent>

        <TabsContent value="role-play" className="space-y-4">
          <GameCard
            icon={Crown}
            title="Nhập vai vua Gia Long"
            description="Đưa ra quyết định xây dựng kinh đô Huế với các lựa chọn về vị trí, phong thủy, kiến trúc."
            onPlay={() => setActiveGame("roleplay")}
          />
        </TabsContent>

        <TabsContent value="treasure" className="space-y-4">
          <GameCard
            icon={Map}
            title="Mật thư của vua Tự Đức"
            description="Giải mã mật thư để tìm kiếm một bức sắc phong bị thất lạc."
            onPlay={() => setActiveGame("treasure")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
