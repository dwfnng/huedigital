import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  ExternalLink,
  Info,
  Calendar,
  Tag,
  Download
} from "lucide-react";
import type { Resource } from "@shared/schema";
import { motion } from "framer-motion";
import ShareButton from "@/components/ShareButton";
import ImageLoader from "./ImageLoader";

interface ResourceDetailsProps {
  resource: Resource | null;
  onClose: () => void;
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

export default function ResourceDetails({
  resource,
  onClose,
}: ResourceDetailsProps) {
  if (!resource) return null;

  return (
    <Sheet open={!!resource} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden">
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-2xl">{resource.title}</SheetTitle>
          {resource.titleEn && (
            <SheetDescription className="text-base">{resource.titleEn}</SheetDescription>
          )}
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
          <div className="space-y-6">
            {/* Main Content */}
            <motion.div
              className="prose prose-sm dark:prose-invert max-w-none"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {resource.description && (
                <div className="mb-6">
                  <div dangerouslySetInnerHTML={{ __html: resource.description }} />
                  {resource.descriptionEn && (
                    <p className="text-sm leading-relaxed text-muted-foreground mt-2">
                      {resource.descriptionEn}
                    </p>
                  )}
                </div>
              )}

              {/* Image Gallery */}
              {resource.imageUrls && resource.imageUrls.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  {resource.imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <ImageLoader
                        src={url}
                        alt={`${resource.title} - Hình ${index + 1}`}
                        className="absolute inset-0"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Metadata */}
            <motion.div 
              className="space-y-4 border-t pt-4"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Từ khóa</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author & Source */}
              {resource.author && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Tác giả</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{resource.author}</p>
                </div>
              )}

              {resource.source && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Nguồn</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{resource.source}</p>
                </div>
              )}

              {/* Cultural Context */}
              {resource.culturalPeriod && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Thời kỳ</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{resource.culturalPeriod}</p>
                </div>
              )}
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex gap-3 pt-4"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Button
                className="flex-1"
                onClick={() => window.open(resource.contentUrl || '#', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Xem chi tiết
              </Button>
              <ShareButton
                title={resource.title}
                description={resource.description || ''}
                url={resource.contentUrl || window.location.href}
              />
            </motion.div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}