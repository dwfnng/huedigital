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
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, RefreshCw, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Xin chào! Tôi là trợ lý ảo về Cố đô Huế. Bạn muốn biết thêm thông tin gì về lịch sử, văn hóa, hoặc các di tích tại Huế?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: inputValue })
      });
      
      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: messages.length + 2,
        content: data.response,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        content: "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Trò chuyện AI</h1>
        <p className="text-muted-foreground mb-6">
          Trò chuyện với trợ lý ảo để tìm hiểu thêm về lịch sử và văn hóa Huế
        </p>
        
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Trợ lý ảo có kiến thức về lịch sử, văn hóa và các di tích tại Huế. Hãy hỏi về các địa điểm, sự kiện lịch sử hoặc gợi ý du lịch.
          </AlertDescription>
        </Alert>
        
        <Card className="h-[calc(100vh-16rem)]">
          <CardContent className="p-4 flex flex-col h-full">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${
                      message.role === "assistant" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div className={`flex items-start gap-3 max-w-[80%] ${
                      message.role === "assistant" ? "bg-muted" : "bg-primary/10"
                    } p-3 rounded-lg`}>
                      {message.role === "assistant" ? (
                        <Bot className="h-5 w-5 mt-1 text-primary" />
                      ) : (
                        <User className="h-5 w-5 mt-1 text-primary" />
                      )}
                      <div>
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs text-muted-foreground mt-1 text-right">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3 max-w-[80%] bg-muted p-3 rounded-lg">
                      <RefreshCw className="h-5 w-5 mt-1 text-primary animate-spin" />
                      <div>
                        <div className="text-sm">Đang xử lý câu trả lời...</div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="flex gap-2 mt-4">
              <Input 
                placeholder="Nhập tin nhắn của bạn..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
