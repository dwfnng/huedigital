import ChatInterface from "@/components/ChatInterface";

export default function Chat() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Trò chuyện với AI</h1>
        <p className="text-muted-foreground mb-6">
          Hỏi đáp về lịch sử, văn hóa và di sản Cố đô Huế. AI sẽ giúp bạn tìm hiểu sâu hơn về các di tích, phong tục và câu chuyện lịch sử.
        </p>

        <ChatInterface />
      </div>
    </div>
  );
}