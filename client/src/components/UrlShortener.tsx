
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Copy } from "lucide-react";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/short-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Không thể rút gọn URL");
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể rút gọn URL. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast({
        title: "Đã sao chép",
        description: "Đường dẫn rút gọn đã được sao chép vào clipboard",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể sao chép đường dẫn",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Rút gọn đường dẫn</CardTitle>
        <CardDescription>Nhập URL cần rút gọn vào ô bên dưới</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="https://example.com/your-long-url-here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Rút gọn URL"}
          </Button>
        </form>

        {shortUrl && (
          <div className="mt-4 p-3 bg-muted rounded-md relative group">
            <p className="text-sm font-medium break-all pr-6">{shortUrl}</p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-50 group-hover:opacity-100"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Lưu ý: Các URL được rút gọn sẽ không được lưu trữ vĩnh viễn
      </CardFooter>
    </Card>
  );
}
