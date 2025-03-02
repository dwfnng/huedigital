import { Router } from "express";
import { storage } from "../storage";
import { insertDiscussionSchema } from "@shared/schema";

const router = Router();

// Lấy danh sách bài viết
router.get("/api/discussions", async (req, res) => {
  try {
    const discussions = await storage.getAllDiscussions();
    res.json(discussions);
  } catch (error) {
    console.error("Error getting discussions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Tạo bài viết mới
router.post("/api/discussions", async (req, res) => {
  try {
    const data = insertDiscussionSchema.parse(req.body);
    const discussion = await storage.createDiscussion(data);
    // Tạo point transaction cho người dùng
    await storage.createPointTransaction(
      discussion.userId,
      "10", // 10 points cho mỗi bài viết
      "discussion",
      discussion.id
    );
    // Cập nhật điểm của người dùng
    const user = await storage.getUserById(discussion.userId);
    if (user) {
      const newPoints = (Number(user.points) + 10).toString();
      await storage.updateUserPoints(user.id, newPoints);
    }
    res.status(201).json(discussion);
  } catch (error) {
    console.error("Error creating discussion:", error);
    res.status(400).json({ message: "Invalid discussion data" });
  }
});

// Lấy bài viết theo category
router.get("/api/discussions/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const discussions = await storage.getDiscussionsByCategory(category);
    res.json(discussions);
  } catch (error) {
    console.error("Error getting discussions by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
