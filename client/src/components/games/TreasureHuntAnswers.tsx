
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Scroll, MapPin, Lightbulb, BookOpen } from "lucide-react";

interface ClueAnswer {
  clue: string;
  answer: string;
  historicalInfo: string;
  location?: string;
}

export default function TreasureHuntAnswers() {
  const answers: ClueAnswer[] = [
    {
      clue: "Ta là nơi lưu giữ những sắc lệnh thiêng liêng, nơi các vua triều Nguyễn cất giữ ấn tín quốc gia. Tìm ta trong Tử Cấm Thành.",
      answer: "ĐIỆN THẾ MIẾU",
      historicalInfo: "Điện Thế Miếu là nơi thờ các vị vua triều Nguyễn và lưu giữ các ấn tín, sắc lệnh quan trọng của triều đình. Đây là công trình nằm trong khu vực Tử Cấm Thành - nơi chỉ có vua và những người được phép mới được vào.",
      location: "Tử Cấm Thành (Đại Nội Huế)"
    },
    {
      clue: "Vượt qua Ngọ Môn, rẽ về hướng đông, tìm nơi vua ngự để gặp các quan. Nơi đây từng là trung tâm quyền lực của triều Nguyễn.",
      answer: "ĐIỆN CẦN CHÁNH",
      historicalInfo: "Điện Cần Chánh là nơi vua triều Nguyễn thường xuyên làm việc, tiếp kiến các quan và ban chiếu chỉ. Đây là tòa nhà quan trọng nhất trong Hoàng thành về mặt chính trị.",
      location: "Đại Nội Huế"
    },
    {
      clue: "Ta là cây cầu nối liền hai bờ sông Hương, được xây dựng dưới triều vua Thiệu Trị. Ban đêm ánh đèn ta phản chiếu trên mặt nước tạo nên khung cảnh tuyệt đẹp.",
      answer: "CẦU TRƯỜNG TIỀN",
      historicalInfo: "Cầu Trường Tiền (hay còn gọi là cầu Tràng Tiền) là biểu tượng của thành phố Huế, được xây dựng năm 1899 dưới triều vua Thành Thái. Cầu có 6 nhịp với chiều dài 402,60m và rộng 6m.",
      location: "Sông Hương, Huế"
    },
    {
      clue: "Nơi đây vua Tự Đức từng dành nhiều thời gian để sáng tác thơ văn. Cảnh quan nơi đây hài hòa giữa kiến trúc và thiên nhiên.",
      answer: "LĂNG TỰ ĐỨC",
      historicalInfo: "Lăng Tự Đức được xây dựng từ năm 1864-1867, là nơi vua Tự Đức thường xuyên lui tới để nghỉ ngơi, đọc sách và làm thơ trước khi mất. Đây là một quần thể kiến trúc đẹp với hồ nước, đình tạ và cảnh quan thiên nhiên hài hòa.",
      location: "Thủy Xuân, Huế"
    },
    {
      clue: "Ta là tháp cổ bên dòng sông Hương, nơi lưu giữ xe hơi của vị Bồ Tát hiện đại. Người dân Huế coi ta là biểu tượng tâm linh của xứ Huế.",
      answer: "CHÙA THIÊN MỤ",
      historicalInfo: "Chùa Thiên Mụ (Chùa Linh Mụ) được xây dựng năm 1601 dưới thời chúa Nguyễn Hoàng. Tháp Phước Duyên 7 tầng của chùa là biểu tượng của Huế. Tại đây còn lưu giữ chiếc xe Austin của Hòa thượng Thích Quảng Đức - người đã tự thiêu phản đối chính sách đàn áp Phật giáo năm 1963.",
      location: "Đồi Hà Khê, phường Kim Long, Huế"
    },
    {
      clue: "Nơi đây là trung tâm giáo dục cao nhất của triều Nguyễn, đào tạo nên nhiều nhân tài cho đất nước. Tìm ta ở phía nam kinh thành.",
      answer: "QUỐC TỬ GIÁM",
      historicalInfo: "Quốc Tử Giám Huế là trường đại học đầu tiên của Việt Nam, được xây dựng năm 1908 dưới triều vua Duy Tân. Đây là nơi đào tạo quan lại và nhân tài cho triều Nguyễn.",
      location: "Phường Đông Ba, Huế"
    },
    {
      clue: "Ta là nơi vua và hoàng gia thưởng thức nghệ thuật truyền thống, nơi lưu giữ di sản văn hóa phi vật thể được UNESCO công nhận.",
      answer: "DUYỆT THỊ ĐƯỜNG",
      historicalInfo: "Duyệt Thị Đường là nơi vua và hoàng gia thưởng thức các buổi biểu diễn nghệ thuật, đặc biệt là nhã nhạc cung đình Huế - được UNESCO công nhận là di sản văn hóa phi vật thể vào năm 2003. Nơi đây không chỉ là không gian giải trí mà còn là nơi bảo tồn và phát triển nghệ thuật truyền thống.",
      location: "Đại Nội Huế"
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Scroll className="h-6 w-6 text-primary" />
          Đáp án Trò Chơi Truy Tìm Bảo Vật Hoàng Cung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground text-center">
          Dưới đây là đáp án cho các câu đố trong trò chơi truy tìm bảo vật hoàng cung.
          Mỗi câu đố sẽ dẫn bạn đến những địa điểm di tích lịch sử quan trọng của Cố đô Huế.
        </p>

        {answers.map((item, index) => (
          <div key={index} className="space-y-3 bg-secondary/20 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">Câu đố {index + 1}:</h3>
                <p className="text-sm text-muted-foreground italic">{item.clue}</p>
              </div>
            </div>

            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Đáp án: <span className="text-primary font-bold">{item.answer}</span></h3>
              </div>
              
              <p className="text-sm">{item.historicalInfo}</p>
              
              {item.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{item.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="mt-6 text-sm text-muted-foreground border-t pt-4">
          <p className="font-medium mb-2">Lưu ý:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Các đáp án có thể được nhập bằng chữ thường hoặc chữ hoa.</li>
            <li>Không cần nhập dấu trong khi trả lời câu đố trong trò chơi.</li>
            <li>Mỗi câu đố sẽ mở khóa thêm thông tin lịch sử về địa điểm tương ứng.</li>
            <li>Hãy khám phá thực tế các địa điểm này để hiểu rõ hơn về giá trị lịch sử và văn hóa của Cố đô Huế.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
