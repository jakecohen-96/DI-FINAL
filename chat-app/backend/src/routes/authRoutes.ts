import express from "express";
import admin from "firebase-admin";

const router = express.Router();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://jake-s-chat-app-default-rtdb.europe-west1.firebasedatabase.app"
  });
}

router.post("/verify-token", async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.status(200).json({ message: "Token is valid", user: decodedToken });
  } catch (error: any) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.status(200).json({ message: "User logged out" });
});

export default router;