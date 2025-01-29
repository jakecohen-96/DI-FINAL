import express from "express";
import { auth } from "../config/firebase";

const router = express.Router();

router.post("/verify-token", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await auth.verifyIdToken(token);
    res.status(200).json({ message: "Token is valid", user: decodedToken });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ message: "Invalid token", error: error.message });
    } else {
      res.status(401).json({ message: "Invalid token", error: "Unknown error" });
    }
  }
});

router.post("/logout", (req, res) => {
  res.status(200).json({ message: "User logged out" });
});

export default router;