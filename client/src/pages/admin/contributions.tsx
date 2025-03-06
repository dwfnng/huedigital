
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Contribution {
  id: number;
  title: string;
  description: string;
  type: string;
  userId: number;
  author: string;
  status: string;
  points: number;
  createdAt: string;
  url: string;
  thumbnailUrl?: string;
}

export default function AdminContributionsPage() {
  const { data: contributions = [], isLoading, error } = useQuery<Contribution[]>({
    queryKey: ['/api/contributions/all'],
    queryFn: async () => {
      const response = await fetch('/api/contributions');
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu đóng góp');
      }
      return response.json();
    }
  });

  function getStatusBadge(status: string) {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Đã duyệt</Badge>;
      case 'pending':
        return <Badge variant="warning">Chờ duyệt</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-96">Đang tải...</div>;
  if (error) return <div className="text-red-500">Lỗi: {(error as Error).message}</div>;

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý đóng góp</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {contributions.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  Chưa có đóng góp nào được gửi.
                </div>
              ) : (
                contributions.map((contribution) => (
                  <Card key={contribution.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {contribution.thumbnailUrl && (
                        <div className="w-full md:w-64 h-48 relative">
                          <img
                            src={contribution.thumbnailUrl || contribution.url}
                            alt={contribution.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{contribution.title}</h3>
                          {getStatusBadge(contribution.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{contribution.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback>{contribution.author?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <span>{contribution.author || `User ${contribution.userId}`}</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{new Date(contribution.createdAt).toLocaleDateString('vi-VN')}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="capitalize">{contribution.type}</span>
                          {contribution.points > 0 && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-emerald-600">{contribution.points} điểm</span>
                            </>
                          )}
                        </div>
                        {contribution.url && (
                          <div className="mt-3">
                            <a 
                              href={contribution.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Xem tư liệu
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
