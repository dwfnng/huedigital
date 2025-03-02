import { Router } from "express";
import { storage } from "../storage";
import { insertContributionSchema } from "@shared/schema";

const router = Router();

// Lấy danh sách đóng góp
router.get("/api/contributions", async (req, res) => {
  try {
    const userId = req.query.userId as string;
    const locationId = req.query.locationId as string;
    
    if (userId) {
      const contributions = await storage.getContributionsByUserId(Number(userId));
      return res.json(contributions);
    }
    
    if (locationId) {
      const contributions = await storage.getContributionsByLocationId(Number(locationId));
      return res.json(contributions);
    }

    const pendingContributions = await storage.getPendingContributions();
    res.json(pendingContributions);
  } catch (error) {
    console.error("Error getting contributions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Tạo đóng góp mới
router.post("/api/contributions", async (req, res) => {
  try {
    const data = insertContributionSchema.parse(req.body);
    const contribution = await storage.createContribution(data);
    
    // Tạo point transaction và cập nhật điểm người dùng
    // Điểm thưởng tùy theo loại đóng góp
    let points = "0";
    switch (contribution.type) {
      case "image":
        points = "15";
        break;
      case "video":
        points = "20";
        break;
      case "document":
        points = "25";
        break;
    }

    await storage.createPointTransaction(
      contribution.userId,
      points,
      "contribution",
      contribution.id
    );

    const user = await storage.getUserById(contribution.userId);
    if (user) {
      const newPoints = (Number(user.points) + Number(points)).toString();
      await storage.updateUserPoints(user.id, newPoints);
    }

    res.status(201).json(contribution);
  } catch (error) {
    console.error("Error creating contribution:", error);
    res.status(400).json({ message: "Invalid contribution data" });
  }
});

// Cập nhật trạng thái đóng góp (duyệt/từ chối)
router.patch("/api/contributions/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const contribution = await storage.updateContributionStatus(Number(id), status);
    res.json(contribution);
  } catch (error) {
    console.error("Error updating contribution status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
