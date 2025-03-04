import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { insertContributionSchema, type InsertContribution } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function ContributePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<InsertContribution>({
    resolver: zodResolver(insertContributionSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "image",
      url: "",
    }
  });

  const onSubmit = async (data: InsertContribution) => {
    try {
      setIsSubmitting(true);

      if (!selectedFile) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn file để tải lên",
          variant: "destructive"
        });
        return;
      }

      // TODO: Implement file upload to get URL
      const fileUrl = "/temp/url";

      const contribution = {
        ...data,
        url: fileUrl,
      };

      await fetch("/api/contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contribution),
      });

      // Invalidate queries to refetch data
      await queryClient.invalidateQueries({ queryKey: ["/api/contributions"] });

      toast({
        title: "Thành công",
        description: "Cảm ơn bạn đã đóng góp tư liệu. Chúng tôi sẽ xem xét và phê duyệt sớm nhất.",
      });

      form.reset();
      setSelectedFile(null);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi đóng góp. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Đóng góp tư liệu</CardTitle>
            <CardDescription>
              Chia sẻ tư liệu lịch sử và văn hóa của bạn về Cố đô Huế
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề tư liệu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Mô tả chi tiết về tư liệu..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại tư liệu</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại tư liệu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="image">Hình ảnh</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="document">Tài liệu</SelectItem>
                          <SelectItem value="audio">Âm thanh</SelectItem>
                          <SelectItem value="3d_model">Mô hình 3D</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="file">Tải lên tư liệu</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang gửi...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Gửi đóng góp
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}