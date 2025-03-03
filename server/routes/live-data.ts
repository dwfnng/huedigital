
import express from "express";
import { storage } from "../storage";

const router = express.Router();

// Lấy dữ liệu thời gian thực mới nhất
router.get("/api/live-data", async (_req, res) => {
  try {
    // Thay thế bằng dữ liệu từ database thực tế khi có
    const liveData = {
      weather: {
        temperature: 32,
        condition: "Nắng nhẹ",
        humidity: 75,
        updatedAt: new Date().toISOString()
      },
      crowds: {
        imperialCity: "Trung bình",
        thienmMonastery: "Đông",
        perfumeRiver: "Ít",
        updatedAt: new Date().toISOString()
      },
      traffic: {
        leTrongTan: "Thông thoáng",
        hungVuong: "Đông",
        dinhTienHoang: "Hơi đông",
        updatedAt: new Date().toISOString()
      },
      emergencies: []
    };
    
    res.json(liveData);
  } catch (error) {
    console.error("Error fetching live data:", error);
    res.status(500).json({ message: "Error fetching live data" });
  }
});

// API để cập nhật dữ liệu thời gian thực (cần authentication trong môi trường thực tế)
router.post("/api/live-data", async (req, res) => {
  try {
    const { type, data } = req.body;
    
    // Trong thực tế, bạn sẽ lưu dữ liệu này vào database
    // await storage.updateLiveData(type, data);
    
    res.status(200).json({ message: `${type} data updated successfully` });
  } catch (error) {
    console.error("Error updating live data:", error);
    res.status(500).json({ message: "Error updating live data" });
  }
});

export default router;
