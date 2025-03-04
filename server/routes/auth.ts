import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { users, insertUserSchema } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const router = Router();

// Configure passport local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Registration endpoint
router.post("/register", async (req, res) => {
  try {
    const parseResult = insertUserSchema.extend({
      password: z.string().min(6)
    }).safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid registration data" });
    }

    const { username, email, password } = parseResult.data;

    // Check if username already exists
    const [existingUser] = await db.select().from(users).where(eq(users.username, username));
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [user] = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      role: "user",
      points: "0"
    }).returning();

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      points: user.points
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

// Login endpoint
router.post("/login", passport.authenticate("local"), (req, res) => {
  const user = req.user as any;
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    points: user.points
  });
});

// Logout endpoint
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

// Get current user
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
});

export default router;
