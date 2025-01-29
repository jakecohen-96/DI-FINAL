import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Parse Firebase Admin credentials from .env
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK as string);

if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: cert(serviceAccount),
});

export const auth = getAuth();