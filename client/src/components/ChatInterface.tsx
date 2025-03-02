import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatMessage from "./ChatMessage";
import type { Message } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length,
      role: "user",
      content: input.trim(),
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest(
        "POST",
        "/api/chat",
        { message: input.trim() }
      );
      const data = await response.json();

      setMessages(prev => [...prev, {
        id: prev.length,
        role: "assistant",
        content: data.response,
        createdAt: new Date(),
      }]);
    } catch (error) {
      console.error("Failed to get response:", error);
      setError("Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg overflow-hidden bg-background">
      <ScrollArea className="flex-1 p-6">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Chào bạn! Tôi là trợ lý AI chuyên về lịch sử và văn hóa Cố đô Huế.</p>
            <p className="mt-2">Bạn có thể hỏi tôi về các di tích, lịch sử, phong tục, văn hóa...</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="text-sm text-muted-foreground animate-pulse p-3">
            Đang trả lời...
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg max-w-[80%] mx-auto text-center">
            {error}
          </div>
        )}
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            placeholder="Nhập tin nhắn của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isLoading}
            className="min-h-[60px] resize-none"
          />
          <Button 
            type="submit"
            disabled={isLoading || !input.trim()} 
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}