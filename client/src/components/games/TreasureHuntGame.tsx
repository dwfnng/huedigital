import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Map, Scroll, Search, Book, Compass, Star, Camera, Navigation } from "lucide-react";

interface Clue {
  id: string;
  title: string;
  description: string;
  hint: string;
  answer: string;
  historicalInfo: string;
  imageUrl?: string;
  location?: {
    lat: number;
    lng: number;
  };
  unlocked: boolean;
}

const initialClues: Clue[] = [
  {
    id: "1",
    title: "Mật thư của vua Tự Đức",
    description: "Giải mã câu đố sau để tìm vị trí tiếp theo:\n'Ta là nơi cất giữ tri thức\nNơi các học sĩ trau dồi văn chương\nTàng thư quý giá triều đường\nTìm ta ở chốn văn đường phía đông'",
    hint: "Đây là nơi lưu trữ sách vở và tài liệu quan trọng của triều đình",
    answer: "tang thu lau",
    historicalInfo: "Tàng Thư Lâu là thư viện của triều Nguyễn, nơi lưu trữ các sách vở, tài liệu quan trọng của triều đình. Công trình này được xây dựng vào năm 1825 dưới thời vua Minh Mạng.",
    imageUrl: "/attached_assets/tang-thu-lau.jpg",
    location: {
      lat: 16.4691,
      lng: 107.5788
    },
    unlocked: true
  },
  {
    id: "2",
    title: "Bí mật của Tàng Thư Lâu",
    description: "Phía sau giá sách cổ, bạn tìm thấy một mảnh giấy với nội dung:\n'Nơi vua ngự triều đường\nMỗi sáng nghe tấu chương\nCửu trùng cao vời vợi\nNgai vàng điểm kim cương'",
    hint: "Đây là nơi vua làm việc chính thức với các quan lại",
    answer: "can chanh dien",
    historicalInfo: "Điện Cần Chánh là nơi vua làm việc hằng ngày, tiếp kiến các quan và ban hành các chỉ dụ quan trọng. Điện được xây dựng theo kiến trúc truyền thống với nhiều chi tiết nghệ thuật độc đáo.",
    imageUrl: "/attached_assets/can-chanh-dien.jpg",
    location: {
      lat: 16.4697,
      lng: 107.5779
    },
    unlocked: false
  },
  {
    id: "3",
    title: "Lời nhắn từ quá khứ",
    description: "Trên bức tường điện Cần Chánh, một dòng chữ cổ hiện ra:\n'Bắc có rồng bay phượng múa\nNam có núi ngự sông quanh\nTìm nơi thiêng đất trời\nNơi vua dâng lễ vật'",
    hint: "Đây là nơi tổ chức các nghi lễ tế trời đất quan trọng của triều đình",
    answer: "dan nam giao",
    historicalInfo: "Đàn Nam Giao là công trình kiến trúc tôn giáo quan trọng, nơi vua chủ trì tế lễ Giao - một nghi lễ quan trọng nhất của triều đình nhà Nguyễn, thể hiện quan niệm 'phụng thiên thừa vận' của các triều đại phong kiến.",
    imageUrl: "/attached_assets/dan-nam-giao.jpg",
    location: {
      lat: 16.4509,
      lng: 107.5715
    },
    unlocked: false
  },
  {
    id: "4",
    title: "Dấu tích hoàng cung",
    description: "Tại Đàn Nam Giao, một bức phù điêu cổ mang thông điệp:\n'Nơi đây cung nữ ca vang\nTiếng đàn véo von vọng sang điện rồng\nTìm nơi âm nhạc mênh mông\nCung đình di sản một vòng time gian'",
    hint: "Đây là nơi biểu diễn nhã nhạc cung đình Huế, di sản văn hóa phi vật thể được UNESCO công nhận",
    answer: "duyet thi duong",
    historicalInfo: "Duyệt Thị Đường là nơi vua và hoàng gia thưởng thức các buổi biểu diễn nghệ thuật, đặc biệt là nhã nhạc cung đình Huế - được UNESCO công nhận là di sản văn hóa phi vật thể vào năm 2003.",
    imageUrl: "/attached_assets/duyet-thi-duong.jpg",
    location: {
      lat: 16.4701,
      lng: 107.5776
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
      window.open(
        `https://www.google.com/maps?q=${clue.location.lat},${clue.location.lng}`,
        '_blank'
      );
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
                            {clue.imageUrl && (
                              <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={clue.imageUrl}
                                  alt={clue.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
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
                                Xem vị trí trên bản đồ
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