import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Map, Scroll, Search, Book, Compass, Star, Navigation } from "lucide-react";
import { useLocation } from "wouter";

interface Clue {
  id: string;
  title: string;
  description: string;
  hint: string;
  answer: string;
  historicalInfo: string;
  location?: {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    type: "heritage" | "monument" | "museum" | "education";
  };
  unlocked: boolean;
}

const initialClues: Clue[] = [
  {
    id: "imperial-seal",
    title: "Ấn tín hoàng gia",
    description: "Ta là nơi lưu giữ những sắc lệnh thiêng liêng, nơi các vua triều Nguyễn cất giữ ấn tín quốc gia. Tìm ta trong Tử Cấm Thành.",
    hint: "Đây là nơi thờ các vị vua triều Nguyễn",
    answer: "dien the mieu",
    historicalInfo: "Điện Thế Miếu là nơi thờ các vị vua triều Nguyễn và lưu giữ các ấn tín, sắc lệnh quan trọng của triều đình. Đây là công trình nằm trong khu vực Tử Cấm Thành - nơi chỉ có vua và những người được phép mới được vào.",
    location: {
      id: "forbidden-city",
      name: "Tử Cấm Thành",
      nameEn: "Forbidden Purple City",
      description: "Khu vực riêng tư của hoàng gia, nơi sinh sống và làm việc của vua và gia đình.",
      type: "heritage"
    },
    unlocked: false
  },
  {
    id: "royal-audience",
    title: "Nơi vua gặp các quan",
    description: "Vượt qua Ngọ Môn, rẽ về hướng đông, tìm nơi vua ngự để gặp các quan. Nơi đây từng là trung tâm quyền lực của triều Nguyễn.",
    hint: "Đây là nơi vua làm việc và ban chiếu chỉ",
    answer: "dien can chanh",
    historicalInfo: "Điện Cần Chánh là nơi vua triều Nguyễn thường xuyên làm việc, tiếp kiến các quan và ban chiếu chỉ. Đây là tòa nhà quan trọng nhất trong Hoàng thành về mặt chính trị.",
    location: {
      id: "dai-noi",
      name: "Đại Nội Huế",
      nameEn: "Imperial City",
      description: "Trung tâm chính trị của triều Nguyễn, nơi diễn ra các hoạt động quản lý đất nước.",
      type: "heritage"
    },
    unlocked: false
  },
  {
    id: "huong-river-bridge",
    title: "Cầu trên sông Hương",
    description: "Ta là cây cầu nối liền hai bờ sông Hương, được xây dựng dưới triều vua Thiệu Trị. Ban đêm ánh đèn ta phản chiếu trên mặt nước tạo nên khung cảnh tuyệt đẹp.",
    hint: "Cây cầu biểu tượng của thành phố Huế",
    answer: "cau truong tien",
    historicalInfo: "Cầu Trường Tiền (hay còn gọi là cầu Tràng Tiền) là biểu tượng của thành phố Huế, được xây dựng năm 1899 dưới triều vua Thành Thái. Cầu có 6 nhịp với chiều dài 402,60m và rộng 6m.",
    location: {
      id: "huong-river",
      name: "Sông Hương",
      nameEn: "Perfume River",
      description: "Dòng sông chảy qua trung tâm thành phố Huế, là biểu tượng của vẻ đẹp trữ tình của cố đô.",
      type: "heritage"
    },
    unlocked: false
  },
  {
    id: "tu-duc-tomb",
    title: "Nơi vua làm thơ",
    description: "Nơi đây vua Tự Đức từng dành nhiều thời gian để sáng tác thơ văn. Cảnh quan nơi đây hài hòa giữa kiến trúc và thiên nhiên.",
    hint: "Lăng tẩm đẹp nhất của các vua triều Nguyễn",
    answer: "lang tu duc",
    historicalInfo: "Lăng Tự Đức được xây dựng từ năm 1864-1867, là nơi vua Tự Đức thường xuyên lui tới để nghỉ ngơi, đọc sách và làm thơ trước khi mất. Đây là một quần thể kiến trúc đẹp với hồ nước, đình tạ và cảnh quan thiên nhiên hài hòa.",
    location: {
      id: "thuy-xuan",
      name: "Thủy Xuân",
      nameEn: "Thuy Xuan",
      description: "Vùng ngoại ô Huế, nơi có nhiều lăng tẩm của các vua triều Nguyễn.",
      type: "heritage"
    },
    unlocked: false
  },
  {
    id: "spiritual-pagoda",
    title: "Tháp bên sông Hương",
    description: "Ta là tháp cổ bên dòng sông Hương, nơi lưu giữ xe hơi của vị Bồ Tát hiện đại. Người dân Huế coi ta là biểu tượng tâm linh của xứ Huế.",
    hint: "Ngôi chùa cổ nhất Huế, có tháp Phước Duyên 7 tầng",
    answer: "chua thien mu",
    historicalInfo: "Chùa Thiên Mụ (Chùa Linh Mụ) được xây dựng năm 1601 dưới thời chúa Nguyễn Hoàng. Tháp Phước Duyên 7 tầng của chùa là biểu tượng của Huế. Tại đây còn lưu giữ chiếc xe Austin của Hòa thượng Thích Quảng Đức - người đã tự thiêu phản đối chính sách đàn áp Phật giáo năm 1963.",
    location: {
      id: "kim-long",
      name: "Kim Long",
      nameEn: "Kim Long",
      description: "Khu vực phía tây thành phố Huế, nơi có chùa Thiên Mụ nổi tiếng.",
      type: "heritage"
    },
    unlocked: false
  },
  {
    id: "education-center",
    title: "Trung tâm giáo dục",
    description: "Nơi đây là trung tâm giáo dục cao nhất của triều Nguyễn, đào tạo nên nhiều nhân tài cho đất nước. Tìm ta ở phía nam kinh thành.",
    hint: "Trường đại học đầu tiên của Việt Nam thời phong kiến",
    answer: "quoc tu giam",
    historicalInfo: "Quốc Tử Giám Huế là trường đại học đầu tiên của Việt Nam, được xây dựng năm 1908 dưới triều vua Duy Tân. Đây là nơi đào tạo quan lại và nhân tài cho triều Nguyễn.",
    location: {
      id: "dong-ba",
      name: "Đông Ba",
      nameEn: "Dong Ba",
      description: "Khu vực phía đông Huế, gần chợ Đông Ba nổi tiếng.",
      type: "education"
    },
    unlocked: false
  },
  {
    id: "traditional-arts",
    title: "Nghệ thuật cung đình",
    description: "Ta là nơi vua và hoàng gia thưởng thức nghệ thuật truyền thống, nơi lưu giữ di sản văn hóa phi vật thể được UNESCO công nhận",
    hint: "Nơi biểu diễn nhã nhạc cung đình Huế",
    answer: "duyet thi duong",
    historicalInfo: "Duyệt Thị Đường là nơi vua và hoàng gia thưởng thức các buổi biểu diễn nghệ thuật, đặc biệt là nhã nhạc cung đình Huế - được UNESCO công nhận là di sản văn hóa phi vật thể vào năm 2003. Nơi đây không chỉ là không gian giải trí mà còn là nơi bảo tồn và phát triển nghệ thuật truyền thống.",
    location: {
      id: "dai-noi",
      name: "Đại Nội Huế",
      nameEn: "Imperial City",
      description: "Nơi diễn ra các hoạt động văn hóa nghệ thuật của hoàng cung, đặc biệt là biểu diễn nhã nhạc cung đình.",
      type: "heritage"
    },
    unlocked: false
  }
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function TreasureHuntGame() {
  const [clues, setClues] = useState<Clue[]>(initialClues);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showHint, setShowHint] = useState<string | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [, setLocation] = useLocation();

  const handleAnswer = () => {
    const currentClue = clues.find(clue => !clue.unlocked);
    if (!currentClue) return;

    if (currentAnswer.toLowerCase().replace(/\s/g, "") === currentClue.answer) {
      const updatedClues = clues.map(clue =>
        clue.id === currentClue.id ? { ...clue, unlocked: true } : clue
      );
      setClues(updatedClues);
      setCurrentAnswer("");
      setError(null);
      setShowHint(null);
      setSelectedClue(currentClue);

      if (updatedClues.every(clue => clue.unlocked)) {
        setGameComplete(true);
      }
    } else {
      setError("Câu trả lời chưa chính xác. Hãy thử lại!");
    }
  };

  const resetGame = () => {
    setClues(initialClues);
    setCurrentAnswer("");
    setShowHint(null);
    setGameComplete(false);
    setError(null);
    setSelectedClue(null);
  };

  const getCurrentClue = () => clues.find(clue => !clue.unlocked);

  const handleShowLocation = (clue: Clue) => {
    if (clue.location) {
      setLocation(`/map?location=${clue.location.id}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
            <Map className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Truy tìm bảo vật hoàng cung</h2>
          <p className="text-muted-foreground">
            Giải mã các câu đố để khám phá bí mật lịch sử của cung đình Huế
          </p>
        </div>

        {!gameComplete ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-6">
                {clues.map((clue) => (
                  <div
                    key={clue.id}
                    className={`p-4 rounded-lg transition-colors ${
                      clue.unlocked ? 'bg-muted/30' : 'bg-muted/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        {clue.unlocked ? (
                          <Scroll className="h-6 w-6 text-primary" />
                        ) : (
                          <Book className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{clue.title}</h3>
                        {clue.unlocked && (
                          <>
                            <p className="text-sm whitespace-pre-line mt-2">
                              {clue.description}
                            </p>
                            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                {clue.historicalInfo}
                              </p>
                            </div>
                            {clue.location && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={() => handleShowLocation(clue)}
                              >
                                <Navigation className="h-4 w-4 mr-2" />
                                Xem vị trí trên bản đồ số
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {getCurrentClue() && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập câu trả lời..."
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAnswer();
                          }
                        }}
                      />
                      <Button onClick={handleAnswer}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <Button
                        variant="ghost"
                        onClick={() => setShowHint(getCurrentClue()?.id || null)}
                      >
                        <Compass className="h-4 w-4 mr-2" />
                        Gợi ý
                      </Button>
                    </div>
                    {showHint === getCurrentClue()?.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 bg-muted/30 rounded-lg"
                      >
                        <p className="text-sm">{getCurrentClue()?.hint}</p>
                      </motion.div>
                    )}
                  </div>
                )}
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
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Chúc mừng! Bạn đã hoàn thành cuộc truy tìm bảo vật
              </h3>
              <p className="text-muted-foreground">
                Bạn đã khám phá được những bí mật thú vị về các di tích lịch sử trong Hoàng thành Huế.
                Hãy tiếp tục tìm hiểu thêm về lịch sử và văn hóa độc đáo của Cố đô!
              </p>
            </div>

            <Button onClick={resetGame}>
              Chơi lại
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}