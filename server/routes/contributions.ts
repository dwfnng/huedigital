import { Router } from "express";
import { storage } from "../storage";
import { insertContributionSchema, insertCommentSchema } from "@shared/schema";

const router = Router();

// Lấy danh sách đóng góp được phê duyệt
router.get("/api/contributions", async (_req, res) => {
  try {
    const contributions = await storage.getApprovedContributions();
    res.json(contributions);
  } catch (error) {
    console.error("Error fetching contributions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Tạo đóng góp mới - cần xác thực
router.post("/api/contributions", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const parseResult = insertContributionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid contribution data" });
    }

    const contribution = await storage.createContribution({
      ...parseResult.data,
      status: "pending",
      userId: req.user?.id
    });

    res.status(201).json(contribution);
  } catch (error) {
    console.error("Error creating contribution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Lấy đóng góp theo người dùng - cần xác thực
router.get("/api/my-contributions", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const contributions = await storage.getUserContributions(req.user!.id);
    res.json(contributions);
  } catch (error) {
    console.error("Error fetching user contributions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Xóa đóng góp (chỉ admin)
router.delete("/api/contributions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user as any; //Assuming req.user has a role property

    if (!user?.role || user.role !== 'admin') {
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