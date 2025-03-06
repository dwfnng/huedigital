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

    const contributions = await storage.getAllContributions();
    res.json(contributions);
  } catch (error) {
    console.error("Error getting contributions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Tạo đóng góp mới - gửi vào hàng đợi phê duyệt
router.post("/api/contributions", async (req, res) => {
  try {
    const data = insertContributionSchema.parse({
      ...req.body,
      status: "pending" // Set status as pending for admin review
    });

    const contribution = await storage.createContribution(data);
    res.status(201).json(contribution);
  } catch (error) {
    console.error("Error creating contribution:", error);
    res.status(400).json({ message: "Invalid contribution data" });
  }
});

// Chỉ admin mới có thể xóa đóng góp không phù hợp
router.delete("/api/contributions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.user || {};

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized - Admin only" });
    }

    await storage.deleteContribution(Number(id));
    res.json({ message: "Contribution deleted successfully" });
  } catch (error) {
    console.error("Error deleting contribution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;