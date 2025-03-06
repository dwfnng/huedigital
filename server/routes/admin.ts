
import express from "express";
import { storage } from "../storage";

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.isAuthenticated() && req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Unauthorized: Admin access required" });
};

// Get all contributions
router.get("/api/admin/contributions", isAdmin, async (_req, res) => {
  try {
    const contributions = await storage.getAllContributions();
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contributions" });
  }
});

// Approve or reject a contribution
router.put("/api/admin/contributions/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    
    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const updatedContribution = await storage.updateContributionStatus(Number(id), status, comment);
    res.json(updatedContribution);
  } catch (error) {
    res.status(500).json({ message: "Error updating contribution" });
  }
});

export default router;
