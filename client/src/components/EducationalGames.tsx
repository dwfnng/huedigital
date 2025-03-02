import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Brain, Timer, ClipboardList, Crown, Building2, Camera, Medal } from "lucide-react";

// Timeline Game Component
function TimelineGame() {
  const [events, setEvents] = useState<{year: number, event: string, description: string, isCorrect?: boolean}[]>([
    { 
      year: 1802, 
      event: "Vua Gia Long lên ngôi, thành lập triều Nguyễn",
      description: "Đánh dấu sự thống nhất đất nước và mở đầu cho triều đại phong kiến cuối cùng của Việt Nam"
    },
    { 
      year: 1805, 
      event: "Khởi công xây dựng Kinh thành Huế",
      description: "Công trình kiến trúc vĩ đại được xây dựng theo nguyên tắc phong thủy và nghệ thuật cổ"
    },
    { 
      year: 1821, 
      event: "Vua Minh Mạng lên ngôi",
      description: "Thời kỳ phát triển thịnh vượng của triều Nguyễn với nhiều cải cách quan trọng"
    },
    { 
      year: 1847, 
      event: "Vua Thiệu Trị băng hà, vua Tự Đức lên ngôi",
      description: "Giai đoạn đối mặt với nhiều thách thức từ phương Tây"
    },
    { 
      year: 1883, 
      event: "Kinh thành Huế thất thủ trước quân Pháp",
      description: "Sự kiện đánh dấu sự suy yếu của triều Nguyễn trước sức mạnh phương Tây"
    },
    { 
      year: 1945, 
      event: "Vua Bảo Đại thoái vị, kết thúc triều Nguyễn",
      description: "Chấm dứt chế độ quân chủ tại Việt Nam sau hơn 140 năm tồn tại"
    },
  ]);

  const [shuffledEvents, setShuffledEvents] = useState<typeof events>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    const shuffled = [...events].sort(() => Math.random() - 0.5);
    setShuffledEvents(shuffled);
  }, []);

  const handleDragEvents = (selectedYear: number) => {
    const updatedEvents = [...shuffledEvents];
    const currentEvent = updatedEvents[currentStep];
    const isCorrect = currentEvent.year === selectedYear;

    updatedEvents[currentStep] = {
      ...currentEvent,
      isCorrect
    };

    setShuffledEvents(updatedEvents);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentStep < events.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setGameComplete(true);
    }
  };

  const resetGame = () => {
    const shuffled = [...events].sort(() => Math.random() - 0.5);
    setShuffledEvents(shuffled.map(event => ({ ...event, isCorrect: undefined })));
    setCurrentStep(0);
    setScore(0);
    setGameComplete(false);
  };

  const availableYears = events.map(e => e.year).sort((a, b) => a - b);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <span>Dòng thời gian lịch sử</span>
        </CardTitle>
        <CardDescription>
          Sắp xếp các sự kiện lịch sử quan trọng của triều Nguyễn theo đúng trình tự thời gian. 
          Mỗi sự kiện đều mang ý nghĩa đặc biệt trong lịch sử Cố đô Huế.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!gameComplete ? (
          <>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Sự kiện {currentStep + 1}/{events.length}</h3>
              <div className="p-4 bg-secondary/20 rounded-lg mb-4">
                <p className="text-center font-medium">{shuffledEvents[currentStep]?.event}</p>
                <p className="text-center text-sm">{shuffledEvents[currentStep]?.description}</p>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Chọn năm diễn ra sự kiện:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {availableYears.map((year) => (
                    <Button
                      key={year}
                      variant="outline"
                      onClick={() => handleDragEvents(year)}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <Progress value={(currentStep / events.length) * 100} className="h-2" />
          </>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <Medal className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trò chơi hoàn thành!</h3>
            <p className="text-muted-foreground mb-4">Bạn đã đạt {score}/{events.length} điểm</p>
            <Button onClick={resetGame}>Chơi lại</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Quiz Game Component
function QuizGame() {
  const allQuestions = [
    {
      question: "Ai là vị vua đầu tiên của triều Nguyễn?",
      options: ["Gia Long", "Minh Mạng", "Tự Đức", "Khải Định"],
      answer: 0,
      explanation: "Vua Gia Long (1762-1820) tên thật là Nguyễn Phúc Ánh, là người thống nhất đất nước và sáng lập triều Nguyễn vào năm 1802."
    },
    {
      question: "Kinh thành Huế được xây dựng vào năm nào?",
      options: ["1802", "1805", "1820", "1833"],
      answer: 1,
      explanation: "Kinh thành Huế được khởi công xây dựng vào năm 1805 và hoàn thành cơ bản vào năm 1832, là công trình kiến trúc đồ sộ nhất triều Nguyễn."
    },
    {
      question: "Điện nào là nơi vua triều Nguyễn thiết triều?",
      options: ["Điện Thái Hòa", "Điện Cần Chánh", "Điện Long An", "Điện Phụng Tiên"],
      answer: 0,
      explanation: "Điện Thái Hòa là nơi vua triều Nguyễn thiết triều và tiếp kiến sứ thần. Điện được xây dựng theo phong cách cung đình độc đáo."
    },
    {
      question: "Nhã nhạc cung đình Huế được UNESCO công nhận là di sản văn hóa phi vật thể vào năm nào?",
      options: ["2000", "2003", "2005", "2010"],
      answer: 1,
      explanation: "Nhã nhạc cung đình Huế được UNESCO công nhận là Kiệt tác truyền khẩu và phi vật thể của nhân loại vào năm 2003."
    }
  ];

  const [questions, setQuestions] = useState<typeof allQuestions>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
  }, []);

  useEffect(() => {
    let timer: number;

    if (isTimerActive && timeLeft > 0 && !quizComplete) {
      timer = window.setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !quizComplete) {
      handleNext();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, isTimerActive, quizComplete]);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setIsTimerActive(false);

    if (index === questions[currentQuestion]?.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setTimeLeft(15);
      setIsTimerActive(true);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setQuizComplete(false);
    setTimeLeft(15);
    setIsTimerActive(true);
  };

  if (questions.length === 0) {
    return <div>Đang tải câu hỏi...</div>;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          <span>Câu đố lịch sử</span>
        </CardTitle>
        <CardDescription>
          Thử thách kiến thức của bạn về lịch sử, văn hóa và kiến trúc của Cố đô Huế 
          qua những câu hỏi thú vị. Mỗi câu trả lời đều có giải thích chi tiết để 
          giúp bạn hiểu sâu hơn về di sản văn hóa độc đáo này.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!quizComplete ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Câu hỏi {currentQuestion + 1}/{questions.length}</span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                {timeLeft}s
              </span>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-4">{questions[currentQuestion]?.question}</h3>

              <RadioGroup value={selectedOption?.toString()} className="space-y-3">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 rounded-lg border p-3 cursor-pointer ${
                      selectedOption !== null ?
                        index === questions[currentQuestion]?.answer
                          ? 'border-green-500 bg-green-50'
                          : selectedOption === index
                            ? 'border-red-500 bg-red-50'
                            : ''
                        : ''
                    }`}
                    onClick={() => {
                      if (selectedOption === null) {
                        handleOptionSelect(index);
                      }
                    }}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={selectedOption !== null} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button
              className="w-full"
              onClick={handleNext}
              disabled={selectedOption === null && isTimerActive}
            >
              {currentQuestion === questions.length - 1 ? 'Kết thúc' : 'Câu tiếp theo'}
            </Button>

            <Progress value={(currentQuestion / questions.length) * 100} className="h-2 mt-4" />
          </>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <Medal className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trò chơi hoàn thành!</h3>
            <p className="text-muted-foreground mb-4">Bạn đã đạt {score}/{questions.length} điểm</p>
            <Button onClick={resetQuiz}>Chơi lại</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Word Puzzle Game Component
function WordPuzzleGame() {
  const allWords = [
    { 
      word: "HOANGTHANHHUẾ", 
      clue: "Di sản văn hóa thế giới tại trung tâm thành phố Huế",
      info: "Hoàng thành Huế là quần thể di tích rộng lớn, được UNESCO công nhận là Di sản Văn hóa Thế giới năm 1993."
    },
    { 
      word: "NGUYỄN", 
      clue: "Triều đại phong kiến cuối cùng của Việt Nam",
      info: "Triều Nguyễn tồn tại từ 1802 đến 1945, là triều đại phong kiến cuối cùng trong lịch sử Việt Nam."
    },
    { 
      word: "SÔNGHƯƠNG", 
      clue: "Dòng sông chảy qua thành phố Huế",
      info: "Sông Hương là niềm tự hào của người dân Huế, gắn liền với lịch sử và văn hóa của vùng đất Cố đô."
    },
    { 
      word: "NHÃNHẠC", 
      clue: "Loại hình âm nhạc cung đình Huế được UNESCO công nhận",
      info: "Nhã nhạc cung đình Huế là loại hình âm nhạc độc đáo, thể hiện sự tinh tế trong văn hóa cung đình triều Nguyễn."
    }
  ];

  const [puzzleWords, setPuzzleWords] = useState<typeof allWords>([]);
  const [currentWord, setCurrentWord] = useState(0);
  const [userGuess, setUserGuess] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const maxAttempts = 6;

  useEffect(() => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    setPuzzleWords(shuffled.slice(0, 3));
  }, []);

  const handleGuess = () => {
    if (!userGuess) return;

    const letter = userGuess.toUpperCase();

    if (!guessedLetters.includes(letter)) {
      const newGuessedLetters = [...guessedLetters, letter];
      setGuessedLetters(newGuessedLetters);

      if (!puzzleWords[currentWord]?.word.includes(letter)) {
        setAttempts(attempts + 1);
      }

      const isWordComplete = puzzleWords[currentWord]?.word.split('').every(
        char => newGuessedLetters.includes(char)
      );

      if (isWordComplete) {
        if (currentWord < puzzleWords.length - 1) {
          setCurrentWord(currentWord + 1);
          setGuessedLetters([]);
          setAttempts(0);
          setScore(score + 1);
        } else {
          setScore(score + 1);
          setGameComplete(true);
        }
      }

      if (attempts + 1 >= maxAttempts) {
        if (currentWord < puzzleWords.length - 1) {
          setCurrentWord(currentWord + 1);
          setGuessedLetters([]);
          setAttempts(0);
        } else {
          setGameComplete(true);
        }
      }
    }

    setUserGuess("");
  };

  const resetGame = () => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    setPuzzleWords(shuffled.slice(0, 3));
    setCurrentWord(0);
    setGuessedLetters([]);
    setScore(0);
    setAttempts(0);
    setGameComplete(false);
  };

  const renderWord = () => {
    if (!puzzleWords[currentWord]) return null;

    return puzzleWords[currentWord].word.split('').map((letter, index) => (
      <div key={index} className="w-8 h-10 border-b-2 border-primary flex items-center justify-center mx-1">
        <span className="text-xl font-bold">
          {guessedLetters.includes(letter) ? letter : ""}
        </span>
      </div>
    ));
  };

  if (puzzleWords.length === 0) {
    return <div>Đang tải trò chơi...</div>;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          <span>Điền từ bí ẩn</span>
        </CardTitle>
        <CardDescription>
          Khám phá kho tàng từ vựng độc đáo về di sản Huế. Mỗi từ đều ẩn chứa 
          một câu chuyện thú vị về lịch sử, văn hóa và kiến trúc của Cố đô.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!gameComplete ? (
          <>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Từ {currentWord + 1}/{puzzleWords.length}</span>
                <span className="text-sm">Còn lại: {maxAttempts - attempts} lượt</span>
              </div>

              <div className="p-3 bg-secondary/20 rounded-lg mb-4">
                <p className="text-center">{puzzleWords[currentWord]?.clue}</p>
                <p className="text-center text-sm">{puzzleWords[currentWord]?.info}</p>
              </div>

              <div className="flex flex-wrap justify-center my-6">
                {renderWord()}
              </div>

              <div className="mb-4">
                <p className="text-sm mb-2">Đã đoán ({guessedLetters.length}):</p>
                <div className="flex flex-wrap gap-1">
                  {guessedLetters.map((letter, idx) => (
                    <span key={idx} className="px-2 py-1 bg-secondary text-xs rounded">
                      {letter}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Input
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  maxLength={1}
                  placeholder="Nhập 1 chữ cái"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleGuess();
                    }
                  }}
                />
                <Button onClick={handleGuess}>Đoán</Button>
              </div>
            </div>

            <Progress value={((maxAttempts - attempts) / maxAttempts) * 100} className="h-2 mt-4" />
          </>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <Medal className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trò chơi hoàn thành!</h3>
            <p className="text-muted-foreground mb-4">Bạn đã đoán đúng {score}/{puzzleWords.length} từ</p>
            <Button onClick={resetGame}>Chơi lại</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function EducationalGames() {
  return (
    <div className="container mx-auto p-2 md:p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 slide-in">Trò chơi giáo dục</h1>
      <p className="text-sm md:text-base text-muted-foreground mb-6 slide-in" style={{ animationDelay: '0.1s' }}>
        Khám phá và học hỏi về lịch sử, văn hóa Huế qua các trò chơi tương tác thú vị
      </p>

      <Tabs defaultValue="quiz" className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <TabsTrigger value="quiz" className="text-sm">
            <Brain className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Câu đố</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-sm">
            <Timer className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Dòng thời gian</span>
          </TabsTrigger>
          <TabsTrigger value="word" className="text-sm">
            <ClipboardList className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Điền từ</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 md:mt-6">
          <TabsContent value="quiz">
            <QuizGame />
          </TabsContent>
          <TabsContent value="timeline">
            <TimelineGame />
          </TabsContent>
          <TabsContent value="word">
            <WordPuzzleGame />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}