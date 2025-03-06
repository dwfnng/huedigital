
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, ThumbsDown, ThumbsUp } from "lucide-react";
import { Layout } from "@/components/Layout";

type Contribution = {
  id: number;
  title: string;
  content: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  userId: number | null;
  createdAt: string;
  userName?: string;
  adminComment?: string;
};

export default function AdminContributions() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [adminComment, setAdminComment] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      navigate("/");
      return;
    }

    async function fetchContributions() {
      try {
        const response = await fetch("/api/admin/contributions");
        if (!response.ok) throw new Error("Failed to fetch contributions");
        const data = await response.json();
        setContributions(data);
      } catch (err) {
        setError("Error loading contributions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (!isLoading && user) {
      fetchContributions();
    }
  }, [user, isLoading, navigate]);

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/contributions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved", comment: adminComment }),
      });
      
      if (!response.ok) throw new Error("Failed to approve contribution");
      
      // Update local state
      setContributions(prevContributions => 
        prevContributions.map(contrib => 
          contrib.id === id 
            ? { ...contrib, status: "approved", adminComment } 
            : contrib
        )
      );
      
      setSelectedContribution(null);
      setAdminComment("");
    } catch (err) {
      setError("Error approving contribution");
      console.error(err);
    }
  };

  const handleReject = async (id: number) => {
    if (!adminComment) {
      setError("Vui lòng cung cấp lý do từ chối");
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/contributions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", comment: adminComment }),
      });
      
      if (!response.ok) throw new Error("Failed to reject contribution");
      
      // Update local state
      setContributions(prevContributions => 
        prevContributions.map(contrib => 
          contrib.id === id 
            ? { ...contrib, status: "rejected", adminComment } 
            : contrib
        )
      );
      
      setSelectedContribution(null);
      setAdminComment("");
    } catch (err) {
      setError("Error rejecting contribution");
      console.error(err);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Chờ duyệt</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Đã duyệt</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800"><ThumbsDown className="w-3 h-3 mr-1" /> Từ chối</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return <Layout>Đang tải...</Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Quản lý đóng góp</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Chờ duyệt
              <Badge variant="secondary" className="ml-2">
                {contributions.filter(c => c.status === "pending").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Đã duyệt
              <Badge variant="secondary" className="ml-2">
                {contributions.filter(c => c.status === "approved").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Từ chối
              <Badge variant="secondary" className="ml-2">
                {contributions.filter(c => c.status === "rejected").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
          </TabsList>

          {["pending", "approved", "rejected", "all"].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              {loading ? (
                <p>Đang tải dữ liệu...</p>
              ) : (
                <div className="grid gap-4">
                  {contributions
                    .filter(contrib => tabValue === "all" || contrib.status === tabValue)
                    .map(contribution => (
                      <Card key={contribution.id} className="hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{contribution.title}</CardTitle>
                            <StatusBadge status={contribution.status} />
                          </div>
                          <CardDescription className="flex items-center text-sm">
                            <span>Người gửi: {contribution.userName || "Ẩn danh"}</span>
                            <span className="mx-2">•</span>
                            <span>Ngày: {new Date(contribution.createdAt).toLocaleDateString("vi-VN")}</span>
                            <span className="mx-2">•</span>
                            <span>Loại: {contribution.type}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm max-w-none mb-4">
                            <div className="text-sm line-clamp-3">{contribution.content}</div>
                          </div>
                          
                          {contribution.status === "pending" ? (
                            <div className="flex space-x-2 mt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-600 hover:text-green-800 hover:bg-green-50"
                                onClick={() => setSelectedContribution(contribution)}
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Duyệt
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                onClick={() => setSelectedContribution(contribution)}
                              >
                                <ThumbsDown className="w-4 h-4 mr-1" />
                                Từ chối
                              </Button>
                            </div>
                          ) : (
                            contribution.adminComment && (
                              <div className="mt-2 text-sm">
                                <p className="font-medium">Phản hồi của quản trị viên:</p>
                                <p className="text-muted-foreground">{contribution.adminComment}</p>
                              </div>
                            )
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  
                  {contributions.filter(c => tabValue === "all" || c.status === tabValue).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Không có đóng góp nào {tabValue !== "all" ? `có trạng thái "${tabValue}"` : ""}.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {selectedContribution && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{selectedContribution.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Gửi bởi: {selectedContribution.userName || "Ẩn danh"} • 
                {new Date(selectedContribution.createdAt).toLocaleDateString("vi-VN")}
              </p>
              
              <Separator className="my-4" />
              
              <div className="prose prose-sm max-w-none mb-6">
                <p>{selectedContribution.content}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium mb-1">
                    Phản hồi (bắt buộc cho từ chối)
                  </label>
                  <Textarea
                    id="comment"
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Nhập phản hồi của bạn..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" onClick={() => {
                    setSelectedContribution(null);
                    setAdminComment("");
                    setError(null);
                  }}>
                    Hủy
                  </Button>
                  <Button 
                    variant="default" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedContribution.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Duyệt
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleReject(selectedContribution.id)}
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Từ chối
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
