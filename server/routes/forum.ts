import { Router } from "express";
import { storage } from "../storage";
import { insertDiscussionSchema, insertCommentSchema } from "@shared/schema";

const router = Router();

// Get all discussions
router.get("/api/discussions", async (req, res) => {
  try {
    const discussions = await storage.getAllDiscussions();
    res.json(discussions);
  } catch (error) {
    console.error("Error getting discussions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get discussion by id
router.get("/api/discussions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const discussion = await storage.getDiscussionById(Number(id));
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    await storage.incrementDiscussionViews(Number(id));
    res.json(discussion);
  } catch (error) {
    console.error("Error getting discussion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create new discussion
router.post("/api/discussions", async (req, res) => {
  try {
    const data = insertDiscussionSchema.parse(req.body);
    const discussion = await storage.createDiscussion(data);
    res.status(201).json(discussion);
  } catch (error) {
    console.error("Error creating discussion:", error);
    res.status(400).json({ message: "Invalid discussion data" });
  }
});

// Get comments for a discussion
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

// Create new comment
router.post("/api/comments", async (req, res) => {
  try {
    const data = insertCommentSchema.parse(req.body);
    const comment = await storage.createComment(data);

    // Get updated comments list
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

// Delete discussion (admin only)
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

export default router;