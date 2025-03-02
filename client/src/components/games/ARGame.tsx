import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Camera, Compass, Lock, Eye, Info } from "lucide-react";

interface ARLocation {
  id: string;
  name: string;
  description: string;
  model3dUrl: string;
  historicalInfo: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const arLocations: ARLocation[] = [
  {
    id: "dien_thai_hoa",
    name: "Điện Thái Hòa",
    description: "Nơi làm việc chính của vua, tổ chức các nghi lễ quan trọng",
    model3dUrl: "/models/dien-thai-hoa.glb",
    historicalInfo: "Điện Thái Hòa là công trình quan trọng nhất trong Hoàng thành Huế, được xây dựng năm 1805. Đây là nơi vua thiết triều, ban chiếu chỉ và tiếp đón sứ thần.",
    coordinates: {
      lat: 16.4691,
      lng: 107.5788
    }
  },
  {
    id: "ngo_mon",
    name: "Ngọ Môn",
    description: "Cổng chính phía nam của Hoàng thành Huế",
    model3dUrl: "/models/ngo-mon.glb",
    historicalInfo: "Ngọ Môn được xây dựng năm 1833 dưới triều Minh Mạng, là cổng chính của Hoàng thành. Công trình có 5 cửa, trong đó cửa giữa chỉ dành cho vua đi lại.",
    coordinates: {
      lat: 16.4697,
      lng: 107.5779
    }
  }
];

export default function ARGame() {
  const [selectedLocation, setSelectedLocation] = useState<ARLocation | null>(null);
  const [showPermissionRequest, setShowPermissionRequest] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!cameraActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  const handleStartAR = () => {
    setShowPermissionRequest(false);
    setCameraActive(true);
  };

  const handleLocationSelect = (location: ARLocation) => {
    setSelectedLocation(location);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Khám phá di tích qua AR</h2>
          <p className="text-muted-foreground">
            Trải nghiệm thực tế tăng cường với các di tích lịch sử Huế
          </p>
        </div>

        {showPermissionRequest ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-6">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Cho phép truy cập camera</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Để sử dụng tính năng AR, ứng dụng cần được cấp quyền truy cập camera của thiết bị
              </p>
              <Button onClick={handleStartAR} className="gap-2">
                <Camera className="h-4 w-4" />
                Bắt đầu trải nghiệm AR
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              {selectedLocation && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-semibold mb-1">{selectedLocation.name}</h3>
                  <p className="text-white/80 text-sm">{selectedLocation.description}</p>
                </div>
              )}
            </div>

            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-4">
                {arLocations.map((location) => (
                  <Button
                    key={location.id}
                    variant="outline"
                    className={`w-full justify-start gap-4 h-auto p-4 text-left ${
                      selectedLocation?.id === location.id ? 'border-primary' : ''
                    }`}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <Eye className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{location.name}</p>
                      <p className="text-sm text-muted-foreground">{location.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Show historical info
                      }}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </Button>
                ))}
              </div>
            </ScrollArea>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Di chuyển camera để quét các di tích xung quanh
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
