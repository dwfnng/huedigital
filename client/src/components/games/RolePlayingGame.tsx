import { ScrollArea } from "@/components/ui/scroll-area";

// In the answer display section of the component:
<div className="space-y-4 mt-4">
  {selectedAnswer && (
    <ScrollArea className="h-[200px] rounded-md border p-4">
      <div className="space-y-2">
        <p className="text-sm">{selectedAnswer.detail}</p>
        {selectedAnswer.additionalInfo && (
          <p className="text-sm text-muted-foreground mt-2">{selectedAnswer.additionalInfo}</p>
        )}
      </div>
    </ScrollArea>
  )}
</div>
