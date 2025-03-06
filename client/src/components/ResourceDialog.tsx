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

const MediaContent = ({ resource }: { resource: any }) => {
  if (!resource) return null;

  switch (resource.type) {
    case "video":
      return (
        <video
          src={resource.contentUrl}
          controls
          className="w-full rounded-lg"
          poster={resource.thumbnailUrl}
        >
          Your browser does not support video playback.
        </video>
      );
    case "audio":
      return (
        <div className="bg-muted p-4 rounded-lg">
          <audio
            src={resource.contentUrl}
            controls
            className="w-full"
          >
            Your browser does not support audio playback.
          </audio>
          {resource.thumbnailUrl && (
            <img
              src={resource.thumbnailUrl}
              alt={resource.title}
              className="mt-4 rounded-lg w-full"
            />
          )}
        </div>
      );
    case "document":
      if (resource.fileFormat === "pdf") {
        return (
          <iframe
            src={resource.contentUrl}
            className="w-full h-[60vh] border rounded-lg"
            title={resource.title}
          />
        );
      }
      return (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Click to download: <a href={resource.contentUrl} className="text-primary hover:underline" download>{resource.title}</a>
          </p>
        </div>
      );
    default:
      return (
        <img
          src={resource.contentUrl}
          alt={resource.title}
          className="w-full rounded-lg"
        />
      );
  }
};

export function ResourceDialog({ resource, open, onOpenChange }: ResourceDialogProps) {
  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh]">
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
          <div className="space-y-6">
            {/* Content */}
            <MediaContent resource={resource} />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold">Mô tả</h3>
              <p className="text-sm">{resource.description}</p>
              {resource.descriptionEn && (
                <p className="text-sm text-muted-foreground">{resource.descriptionEn}</p>
              )}
            </div>

            {/* Metadata */}
            {resource.metadata && Object.keys(resource.metadata).length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Thông tin bổ sung</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(resource.metadata).map(([key, value]) => (
                    <div key={key}>
                      <dt className="font-medium capitalize">{key.replace(/_/g, ' ')}</dt>
                      <dd className="text-muted-foreground">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Keywords */}
            {resource.keywords?.length > 0 && (
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

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {resource.author && (
                <div>
                  <dt className="font-medium">Tác giả</dt>
                  <dd className="text-muted-foreground">{resource.author}</dd>
                </div>
              )}
              {resource.source && (
                <div>
                  <dt className="font-medium">Nguồn</dt>
                  <dd className="text-muted-foreground">{resource.source}</dd>
                </div>
              )}
              {resource.period && (
                <div>
                  <dt className="font-medium">Thời kỳ</dt>
                  <dd className="text-muted-foreground">{resource.period}</dd>
                </div>
              )}
              {resource.dynasty && (
                <div>
                  <dt className="font-medium">Triều đại</dt>
                  <dd className="text-muted-foreground">{resource.dynasty}</dd>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}