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

// Tạo đóng góp mới - tự động phê duyệt
router.post("/api/contributions", async (req, res) => {
  try {
    const data = insertContributionSchema.parse({
      ...req.body,
      status: "approved" // Auto-approve all contributions
    });

    const contribution = await storage.createContribution(data);

    // Tự động tính điểm thưởng dựa trên loại đóng góp
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

    // Cập nhật điểm người dùng
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
import express from "express";
import { storage } from "../storage";
import { insertContributionSchema } from "@shared/schema";

const router = express.Router();

// Get all approved contributions
router.get("/api/contributions", async (_req, res) => {
  try {
    const contributions = await storage.getApprovedContributions();
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contributions" });
  }
});

// Submit a new contribution
router.post("/api/contributions", async (req, res) => {
  try {
    const parseResult = insertContributionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid contribution data" });
    }
    
    const contribution = await storage.createContribution({
      ...parseResult.data,
      status: "pending",
      userId: req.user?.id || null,
    });
    
    res.status(201).json(contribution);
  } catch (error) {
    res.status(500).json({ message: "Error creating contribution" });
  }
});

// Get contributions for the current user
router.get("/api/my-contributions", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    const contributions = await storage.getUserContributions(req.user!.id);
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user contributions" });
  }
});

export default router;
