
import { useIsMobile } from "@/hooks/use-mobile";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

  const { isMobile } = useIsMobile();

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Crown, Scroll, Star, ChevronRight, Book, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Case {
  id: string;
  title: string;
  description: string;
  context: string;
  evidence: {
    text: string;
    type: "testimony" | "document" | "physical";
  }[];
  choices: {
    id: string;
    text: string;
    reasoning: string;
    consequence: string;
    score: number;
    historicalInfo?: string;
  }[];
  historicalBackground: {
    title: string;
    content: string;
    relevance: string;
  };
}

const cases: Case[] = [
  {
    id: "land_dispute",
    title: "Tranh chấp đất đai",
    description: "Một vụ tranh chấp đất đai giữa hai gia tộc quý tộc đe dọa sự ổn định của triều đình.",
    context: "Năm 1825, hai gia tộc có công với triều đình đang tranh chấp một vùng đất canh tác màu mỡ. Cả hai đều có những bằng chứng về quyền sở hữu.",
    evidence: [
      {
        text: "Gia tộc A có sắc phong từ thời Gia Long ban thưởng công trạng",
        type: "document"
      },
      {
        text: "Gia tộc B đã canh tác trên đất này từ ba đời trước",
        type: "testimony"
      },
      {
        text: "Có dấu tích của cả hai gia tộc trên vùng đất",
        type: "physical"
      }
    ],
    choices: [
      {
        id: "split",
        text: "Chia đôi đất đai cho hai gia tộc",
        reasoning: "Đảm bảo sự công bằng và duy trì hòa khí",
        consequence: "Cả hai gia tộc đều không hoàn toàn hài lòng, nhưng chấp nhận phán quyết. Triều đình thể hiện sự công minh.",
        score: 8,
        historicalInfo: "Thời Minh Mạng, việc phân xử tranh chấp đất đai thường dựa trên nguyên tắc 'điều hòa lợi hại'."
      },
      {
        id: "investigate",
        text: "Điều tra kỹ lưỡng nguồn gốc đất đai",
        reasoning: "Tìm ra sự thật lịch sử để đưa ra phán quyết công bằng",
        consequence: "Quá trình điều tra kéo dài có thể gây bất ổn, nhưng kết quả sẽ có tính thuyết phục cao.",
        score: 10,
        historicalInfo: "Triều Nguyễn có bộ máy hành chính chặt chẽ với hệ thống lưu trữ hồ sơ đất đai chi tiết."
      },
      {
        id: "favor_a",
        text: "Phán quyết theo hướng có lợi cho gia tộc A",
        reasoning: "Tôn trọng sắc phong của tiên đế",
        consequence: "Gia tộc B bất mãn, có thể gây mất ổn định xã hội",
        score: 5,
        historicalInfo: "Các sắc phong thời Gia Long thường được coi là bằng chứng pháp lý quan trọng."
      }
    ],
    historicalBackground: {
      title: "Luật đất đai thời Minh Mạng",
      content: "Triều Minh Mạng đã có những cải cách quan trọng trong quản lý đất đai, với việc ban hành nhiều điều luật chi tiết.",
      relevance: "Vụ án này phản ánh sự phức tạp trong quản lý đất đai và vai trò của quan lại trong việc duy trì ổn định xã hội."
    }
  },
  {
    id: "corruption",
    title: "Tham nhũng trong triều",
    description: "Phát hiện dấu hiệu tham nhũng trong việc thu thuế tại một tỉnh lớn.",
    context: "Có báo cáo về việc quan lại địa phương thu thuế cao hơn quy định và biển thủ công quỹ.",
    evidence: [
      {
        text: "Sổ sách thu chi không khớp với thực tế",
        type: "document"
      },
      {
        text: "Nhiều người dân khiếu nại về mức thuế bất thường",
        type: "testimony"
      },
      {
        text: "Phát hiện của cải bất minh của quan lại",
        type: "physical"
      }
    ],
    choices: [
      {
        id: "strict",
        text: "Xử nghiêm để răn đe",
        reasoning: "Thể hiện sự nghiêm minh của pháp luật",
        consequence: "Tạo tiền lệ tốt cho việc chống tham nhũng, nhưng có thể ảnh hưởng đến sự ổn định của bộ máy hành chính.",
        score: 9,
        historicalInfo: "Vua Minh Mạng nổi tiếng với các biện pháp chống tham nhũng quyết liệt."
      },
      {
        id: "reform",
        text: "Cải cách hệ thống thu thuế",
        reasoning: "Giải quyết vấn đề từ gốc rễ",
        consequence: "Mất thời gian để triển khai, nhưng mang lại hiệu quả lâu dài",
        score: 10,
        historicalInfo: "Triều Nguyễn đã thực hiện nhiều cải cách quan trọng trong hệ thống thuế khóa."
      },
      {
        id: "transfer",
        text: "Điều chuyển công tác và phạt nhẹ",
        reasoning: "Duy trì ổn định và tránh xáo trộn lớn",
        consequence: "Không đủ sức răn đe, có thể khuyến khích hành vi tương tự",
        score: 4,
        historicalInfo: "Việc điều chuyển công tác thường được áp dụng cho các vi phạm nhỏ."
      }
    ],
    historicalBackground: {
      title: "Cải cách hành chính thời Minh Mạng",
      content: "Vua Minh Mạng đã thực hiện nhiều cải cách để hiện đại hóa bộ máy hành chính và chống tham nhũng.",
      relevance: "Việc xử lý tham nhũng phản ánh quyết tâm cải cách và hiện đại hóa đất nước của triều Nguyễn."
    }
  },
  {
    id: "foreign_trade",
    title: "Chính sách thương mại",
    description: "Thương nhân phương Tây đề nghị mở rộng quan hệ buôn bán.",
    context: "Đoàn thương nhân từ các nước phương Tây mang nhiều hàng hóa mới lạ và đề nghị thiết lập quan hệ thương mại thường xuyên.",
    evidence: [
      {
        text: "Báo cáo về lợi ích kinh tế từ việc buôn bán",
        type: "document"
      },
      {
        text: "Quan sát về kỹ thuật và vũ khí tiên tiến",
        type: "physical"
      },
      {
        text: "Lời cảnh báo từ các quan văn thần",
        type: "testimony"
      }
    ],
    choices: [
      {
        id: "open",
        text: "Chấp nhận mở cửa có kiểm soát",
        reasoning: "Tận dụng cơ hội phát triển kinh tế và học hỏi kỹ thuật mới",
        consequence: "Thúc đẩy phát triển kinh tế nhưng có thể ảnh hưởng đến truyền thống",
        score: 8,
        historicalInfo: "Một số cảng thị của Việt Nam đã từng là điểm giao thương quốc tế sôi động."
      },
      {
        id: "restrict",
        text: "Hạn chế giao thương, chỉ cho phép ở một số cảng",
        reasoning: "Duy trì kiểm soát và bảo vệ văn hóa truyền thống",
        consequence: "Giảm thiểu rủi ro nhưng có thể bỏ lỡ cơ hội phát triển",
        score: 6,
        historicalInfo: "Chính sách bế quan tỏa cảng từng được áp dụng trong lịch sử Việt Nam."
      },
      {
        id: "reject",
        text: "Từ chối đề nghị thương mại",
        reasoning: "Bảo vệ chủ quyền và văn hóa truyền thống",
        consequence: "Tránh được ảnh hưởng nước ngoài nhưng có thể dẫn đến cô lập",
        score: 4,
        historicalInfo: "Chính sách đóng cửa đã gây ra nhiều hạn chế trong phát triển đất nước."
      }
    ],
    historicalBackground: {
      title: "Quan hệ thương mại thời Nguyễn",
      content: "Triều Nguyễn có chính sách thương mại thận trọng với phương Tây, vừa muốn phát triển kinh tế vừa lo ngại ảnh hưởng văn hóa và chính trị.",
      relevance: "Quyết định về chính sách thương mại có ảnh hưởng sâu rộng đến sự phát triển của đất nước."
    }
  }
];

export default function MinisterGame() {
  const [currentCase, setCurrentCase] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showEvidence, setShowEvidence] = useState<string | null>(null);

  const handleChoice = (choiceId: string) => {
    setSelectedChoice(choiceId);
    const choice = cases[currentCase].choices.find(c => c.id === choiceId);
    if (choice) {
      setScore(score + choice.score);
    }
  };

  const handleNext = () => {
    if (currentCase < cases.length - 1) {
      setCurrentCase(currentCase + 1);
      setSelectedChoice(null);
      setShowEvidence(null);
    } else {
      setShowResult(true);
    }
  };

  const getEvaluation = () => {
    const maxScore = cases.reduce((sum, c) => sum + Math.max(...c.choices.map(ch => ch.score)), 0);
    const percentage = (score / maxScore) * 100;

    if (percentage >= 80) {
      return {
        title: "Quan tài giỏi!",
        description: "Bạn đã thể hiện sự sáng suốt và công minh trong việc xử lý các vụ án."
      };
    } else if (percentage >= 60) {
      return {
        title: "Quan tài có triển vọng",
        description: "Bạn có những quyết định đúng đắn, nhưng vẫn cần cải thiện trong một số tình huống."
      };
    } else {
      return {
        title: "Cần học hỏi thêm",
        description: "Hãy nghiên cứu kỹ hơn về luật pháp và cách xử lý tình huống thời Minh Mạng."
      };
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background/95 backdrop-blur-md">
      <CardContent className="p-4 md:p-6">
        <div className="text-center mb-4">
          <div className="inline-block p-2 bg-primary/10 rounded-full mb-2">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold">Quan thần thời Minh Mạng</h2>
          <p className="text-sm text-muted-foreground">
            Giải quyết các vụ án và tình huống trong triều đình, áp dụng luật pháp thời Nguyễn
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentCase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="p-4 bg-accent/20 rounded-lg">
                <h3 className="font-medium mb-2">{cases[currentCase].title}</h3>
                <p className="text-sm">{cases[currentCase].description}</p>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Bối cảnh vụ án:</h4>
                <p className="text-sm">{cases[currentCase].context}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Bằng chứng:</h4>
                {cases[currentCase].evidence.map((evidence, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left"
                    onClick={() => setShowEvidence(evidence.text)}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Bằng chứng {index + 1}</span>
                    </div>
                  </Button>
                ))}
              </div>

              {showEvidence && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-muted/30 rounded-lg"
                >
                  <p className="text-sm">{showEvidence}</p>
                </motion.div>
              )}

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Phương án xử lý:</h4>
                {cases[currentCase].choices.map((choice) => (
                  <Button
                    key={choice.id}
                    variant={selectedChoice === choice.id ? "default" : "outline"}
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleChoice(choice.id)}
                    disabled={selectedChoice !== null}
                  >
                    <div className="text-left">
                      <p className="font-medium mb-1">{choice.text}</p>
                      <p className="text-sm text-muted-foreground">{choice.reasoning}</p>
                    </div>
                  </Button>
                ))}
              </div>

              {selectedChoice && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Hệ quả:</h4>
                    <p className="text-sm">
                      {cases[currentCase].choices.find(c => c.id === selectedChoice)?.consequence}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Kiến thức lịch sử:</h4>
                    <p className="text-sm">
                      {cases[currentCase].choices.find(c => c.id === selectedChoice)?.historicalInfo}
                    </p>
                  </div>

                  <Button onClick={handleNext} className="w-full">
                    {currentCase === cases.length - 1 ? "Kết thúc" : "Vụ án tiếp theo"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6"
            >
              <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{getEvaluation().title}</h3>
              <p className="text-base text-muted-foreground mb-4">
                {getEvaluation().description}
              </p>
              <Button
                onClick={() => {
                  setCurrentCase(0);
                  setSelectedChoice(null);
                  setScore(0);
                  setShowResult(false);
                }}
              >
                Thử lại
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}