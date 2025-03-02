
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SendHorizontal, Bot, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Xin chào! Tôi là trợ lý ảo về di sản văn hóa Huế. Bạn có thể hỏi tôi về các di tích lịch sử, văn hóa, lịch sử triều Nguyễn, hoặc các địa điểm du lịch ở Huế." 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Failed to get response:", error);
      
      // Fallback response in case of error
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          role: "assistant", 
          content: "Xin lỗi, hiện tại tôi không thể xử lý yêu cầu của bạn. Vui lòng thử lại sau hoặc tham khảo các tài liệu trong kho học liệu số của chúng tôi." 
        },
      ]);
      
      toast({
        title: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ trợ lý ảo. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="px-6">
        <CardTitle className="text-xl">Trò chuyện AI</CardTitle>
        <CardDescription>
          Hỏi đáp về di sản văn hóa Huế
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <Avatar className="mt-1">
                  {message.role === "assistant" ? (
                    <>
                      <AvatarImage src="/ai-avatar.png" />
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/user-avatar.png" />
                      <AvatarFallback className="bg-muted">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-3 max-w-[80%] ${
                    message.role === "assistant"
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground ml-auto"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="mt-1">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-3 max-w-[80%] bg-muted text-foreground">
                  <div className="flex gap-1">
                    <div className="animate-bounce">●</div>
                    <div className="animate-bounce animation-delay-200">●</div>
                    <div className="animate-bounce animation-delay-400">●</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="px-6 pb-6">
        <div className="flex gap-2 w-full">
          <Input
            placeholder="Nhập câu hỏi của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            <SendHorizontal className="h-4 w-4" />
            <span className="ml-2 sr-only">Gửi</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
