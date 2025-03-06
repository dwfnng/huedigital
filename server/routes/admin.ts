
import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// Phê duyệt đóng góp
router.post("/api/admin/contributions/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.user || {};

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized - Admin only" });
    }

    const contribution = await storage.updateContributionStatus(Number(id), "approved");

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

    res.json({ message: "Contribution approved successfully" });
  } catch (error) {
    console.error("Error approving contribution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Từ chối đóng góp
router.post("/api/admin/contributions/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.user || {};

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized - Admin only" });
    }

    await storage.updateContributionStatus(Number(id), "rejected");
    res.json({ message: "Contribution rejected successfully" });
  } catch (error) {
    console.error("Error rejecting contribution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
