import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { Message } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { sampleQuestions } from "@/data/sampleQuestions";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content: "Xin chào! Tôi là trợ lý AI chuyên về lịch sử và văn hóa Cố đô Huế. Bạn có thể hỏi tôi về các di tích, phong tục, và câu chuyện lịch sử.",
      createdAt: new Date()
    }
  ]);
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
      createdAt: new Date()
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

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: prev.length,
        role: "assistant",
        content: data.response,
        createdAt: new Date()
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setError("Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuestionClick = (question: string) => {
    setInput(question);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const shouldShowSuggestions = (index: number) => {
    return messages[index].role === "assistant" && index === messages.length - 1;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg overflow-hidden bg-background/80 backdrop-blur-sm shadow-lg">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div key={message.id}>
              <div 
                className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"} slide-in`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div 
                  className={`flex items-start gap-3 max-w-[80%] p-4 rounded-lg transition-all hover:shadow-md
                    ${message.role === "assistant" 
                      ? "bg-muted" 
                      : "bg-primary/10"}`}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-5 w-5 mt-1 text-primary" />
                  ) : (
                    <User className="h-5 w-5 mt-1 text-primary" />
                  )}
                  <div className="space-y-2">
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs text-muted-foreground text-right">
                      {formatTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {shouldShowSuggestions(idx) && (
                <div className="mt-4 space-y-3 fade-in">
                  <p className="text-sm text-muted-foreground">Các câu hỏi gợi ý:</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleQuestions.map((question, qIdx) => (
                      <Badge
                        key={qIdx}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => handleSampleQuestionClick(question.text)}
                      >
                        {question.text}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start slide-in">
              <div className="flex items-start gap-3 max-w-[80%] bg-muted p-4 rounded-lg">
                <div className="animate-pulse flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="text-sm">Đang suy nghĩ...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4 fade-in">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t p-4 bg-card/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi về lịch sử, văn hóa Cố đô Huế..."
            className="flex-1 min-h-[60px] max-h-[120px] resize-none focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            className="hover:shadow-md transition-all"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}