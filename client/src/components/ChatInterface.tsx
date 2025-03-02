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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.response) {
        const assistantMessage: Message = { role: "assistant", content: data.response };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error("Empty response from server");
      }
    } catch (err) {
      console.error("Failed to get response:", err);
      setError("Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <div>
              <p className="mb-2">Chào mừng đến với trợ lý ảo!</p>
              <p>Hãy đặt câu hỏi hoặc tìm hiểu về các địa điểm, tài liệu lịch sử.</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg max-w-[80%]",
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted mr-auto"
              )}
            >
              {message.content}
            </div>
          ))
        )}
        {isLoading && (
          <div className="bg-muted p-3 rounded-lg max-w-[80%] mr-auto">
            <div className="flex space-x-2 items-center">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg max-w-[80%] mx-auto text-center">
            {error}
          </div>
        )}
      </div>
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Textarea
            placeholder="Nhập tin nhắn của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
            className="min-h-[60px] resize-none"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()} 
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
