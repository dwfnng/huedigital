import { cn } from "@/lib/utils";
import type { Message } from "@shared/schema";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "rounded-lg px-4 py-2 max-w-[80%]",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
