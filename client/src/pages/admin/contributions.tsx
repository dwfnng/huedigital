
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle2, 
  XCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Contribution {
  id: number;
  title: string;
  description: string;
  type: string;
  userId: number;
  locationId: number;
  status: string;
  createdAt: string;
  thumbnailUrl?: string;
  url?: string;
}

export default function AdminContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contributions');
      const data = await response.json();
      setContributions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contributions:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách đóng góp',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/contributions/${id}/approve`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast({
          title: 'Thành công',
          description: 'Đã phê duyệt đóng góp'
        });
        fetchContributions();
      } else {
        throw new Error('Failed to approve');
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể phê duyệt đóng góp',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/contributions/${id}/reject`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast({
          title: 'Thành công',
          description: 'Đã từ chối đóng góp'
        });
        fetchContributions();
      } else {
        throw new Error('Failed to reject');
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể từ chối đóng góp',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/contributions/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast({
          title: 'Thành công',
          description: 'Đã xóa đóng góp'
        });
        fetchContributions();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa đóng góp',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Đã phê duyệt</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Đã từ chối</Badge>;
      default:
        return <Badge className="bg-yellow-500">Chờ xét duyệt</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý đóng góp</h1>
        <Button onClick={fetchContributions} disabled={loading}>
          {loading ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đóng góp</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            {contributions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                {loading ? 'Đang tải dữ liệu...' : 'Chưa có đóng góp nào'}
              </div>
            ) : (
              <div className="space-y-4">
                {contributions.map((contribution) => (
                  <Card key={contribution.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        {contribution.thumbnailUrl && (
                          <div className="w-48 h-36 relative">
                            <img
                              src={contribution.thumbnailUrl}
                              alt={contribution.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{contribution.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {contribution.description}
                              </p>
                              <div className="flex gap-2 mb-2">
                                <Badge variant="outline">{contribution.type}</Badge>
                                {getStatusBadge(contribution.status)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID người đóng góp: {contribution.userId} • 
                                Ngày gửi: {new Date(contribution.createdAt).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              {contribution.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={() => handleApprove(contribution.id)}
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Phê duyệt
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleReject(contribution.id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Từ chối
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-500 border-red-200 hover:text-red-600"
                                onClick={() => handleDelete(contribution.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
