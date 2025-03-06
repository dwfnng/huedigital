
import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// API để lấy tất cả các đóng góp (bao gồm cả chi tiết)
router.get("/api/admin/contributions", async (_req, res) => {
  try {
    const contributions = await storage.getAllContributions();
    
    // Lấy thêm thông tin người dùng cho mỗi đóng góp
    const enhancedContributions = await Promise.all(
      contributions.map(async (contribution) => {
        try {
          const user = await storage.getUserById(contribution.userId);
          return {
            ...contribution,
            author: user ? user.username : `User ${contribution.userId}`
          };
        } catch (error) {
          return {
            ...contribution,
            author: `User ${contribution.userId}`
          };
        }
      })
    );
    
    res.json(enhancedContributions);
  } catch (error) {
    console.error("Error getting contributions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
