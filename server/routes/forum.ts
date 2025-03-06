import { Router } from "express";
import { storage } from "../storage";
import { insertDiscussionSchema, insertCommentSchema } from "@shared/schema";

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

// Lấy bài viết theo id
router.get("/api/discussions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const discussion = await storage.getDiscussionById(Number(id));
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    res.json(discussion);
  } catch (error) {
    console.error("Error getting discussion:", error);
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

// Lấy bình luận cho một bài viết
router.get("/api/comments/:discussionId", async (req, res) => {
  try {
    const { discussionId } = req.params;
    const comments = await storage.getCommentsByDiscussionId(Number(discussionId));
    res.json(comments);
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Tạo bình luận mới
router.post("/api/comments", async (req, res) => {
  try {
    const data = insertCommentSchema.parse(req.body);
    const comment = await storage.createComment(data);

    // Cập nhật điểm cho người dùng khi bình luận
    await storage.createPointTransaction(
      comment.userId,
      "5", // 5 points cho mỗi bình luận
      "comment",
      comment.id
    );

    // Cập nhật điểm của người dùng
    const user = await storage.getUserById(comment.userId);
    if (user) {
      const newPoints = (Number(user.points) + 5).toString();
      await storage.updateUserPoints(user.id, newPoints);
    }

    // Lấy danh sách comments mới nhất của bài viết
    const updatedComments = await storage.getCommentsByDiscussionId(comment.discussionId);

    res.status(201).json({
      newComment: comment,
      allComments: updatedComments
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(400).json({ message: "Invalid comment data" });
  }
});

// Xóa bài viết (chỉ admin)
router.delete("/api/discussions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteDiscussion(Number(id));
    res.status(200).json({ message: "Discussion deleted successfully" });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Xóa bình luận (chỉ admin)
router.delete("/api/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteComment(Number(id));
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;