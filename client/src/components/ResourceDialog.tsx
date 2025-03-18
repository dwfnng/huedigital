import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, CalendarDays, User, History } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ResourceDialogProps {
  resource: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResourceDialog({ resource, open, onOpenChange }: ResourceDialogProps) {
  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] bg-[#f0f0f0] text-[#333333]">
        <DialogHeader className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <DialogTitle>{resource.title}</DialogTitle>
          </div>
          {resource.titleEn && (
            <DialogDescription className="mt-1">
              {resource.titleEn}
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea className="h-full pr-4">
          <div className="space-y-6 p-2">
            {/* Metadata header */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground bg-white rounded-lg p-4 shadow-sm">
              {resource.author && (
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {resource.author}
                </div>
              )}
              {resource.yearCreated && (
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {resource.yearCreated}
                </div>
              )}
              {resource.period && (
                <div className="flex items-center gap-1.5">
                  <History className="h-4 w-4" />
                  {resource.period}
                </div>
              )}
            </div>

            <Separator />

            {/* Main content */}
            <div className="space-y-4 bg-white rounded-lg p-6 shadow-sm">
              {/* Vietnamese description */}
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
                <p className="text-base leading-relaxed text-[#333333]">
                  {resource.description}
                </p>
              </div>

              {/* English description */}
              {resource.descriptionEn && (
                <div className="prose prose-sm max-w-none text-[#555555]">
                  <p className="text-base leading-relaxed">
                    {resource.descriptionEn}
                  </p>
                </div>
              )}
            </div>

            {/* Keywords */}
            {resource.keywords?.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="text-sm font-medium mb-2">Từ khóa</h4>
                <div className="flex flex-wrap gap-1.5">
                  {resource.keywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Additional metadata */}
            {resource.metadata && Object.keys(resource.metadata).length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="text-sm font-medium mb-3">Thông tin chi tiết</h4>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {Object.entries(resource.metadata).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <dt className="font-medium capitalize">{key.replace(/_/g, ' ')}</dt>
                      <dd className="text-[#555555]">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Source info */}
            {(resource.source || resource.dynasty) && (
              <div className="text-sm bg-white rounded-lg p-4 shadow-sm">
                <Separator className="mb-4" />
                {resource.source && (
                  <p>
                    <span className="font-medium">Nguồn: </span>
                    <span className="text-[#555555]">{resource.source}</span>
                  </p>
                )}
                {resource.dynasty && (
                  <p className="mt-1">
                    <span className="font-medium">Triều đại: </span>
                    <span className="text-[#555555]">{resource.dynasty}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}