import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Video, Music, History, FileType } from "lucide-react";

interface ResourceDialogProps {
  resource: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getResourceIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Video className="h-4 w-4" />;
    case "audio":
      return <Music className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export function ResourceDialog({ resource, open, onOpenChange }: ResourceDialogProps) {
  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getResourceIcon(resource.type)}
            <DialogTitle>{resource.title}</DialogTitle>
          </div>
          {resource.titleEn && (
            <DialogDescription>
              {resource.titleEn}
            </DialogDescription>
          )}
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileType className="h-4 w-4" />
                {resource.type.toUpperCase()}
              </div>
              {resource.period && (
                <div className="flex items-center gap-1">
                  <History className="h-4 w-4" />
                  {resource.period}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold">Mô tả</h3>
              <p className="text-sm">{resource.description}</p>
              {resource.descriptionEn && (
                <p className="text-sm text-muted-foreground">{resource.descriptionEn}</p>
              )}
            </div>

            {/* Content */}
            <div className="mt-4">
              {resource.type === "document" && (
                <iframe 
                  src={resource.contentUrl} 
                  className="w-full h-[60vh] border rounded-lg"
                />
              )}
              {resource.type === "video" && (
                <video 
                  src={resource.contentUrl} 
                  controls
                  className="w-full rounded-lg"
                />
              )}
              {resource.type === "audio" && (
                <audio 
                  src={resource.contentUrl} 
                  controls
                  className="w-full"
                />
              )}
            </div>

            {/* Additional Information */}
            {resource.metadata && Object.keys(resource.metadata).length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Thông tin bổ sung</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(resource.metadata).map(([key, value]) => (
                    <div key={key}>
                      <dt className="font-medium">{key}</dt>
                      <dd className="text-muted-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Keywords */}
            {resource.keywords && resource.keywords.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Từ khóa</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.keywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
