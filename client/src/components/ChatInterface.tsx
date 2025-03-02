import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import ChatMessage from "./ChatMessage";
import type { Message } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t p-4 bg-card">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi về lịch sử, văn hóa Cố đô Huế..."
            className="flex-1 min-h-[60px] max-h-[120px]"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}