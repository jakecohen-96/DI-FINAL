import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK as string);

const app = initializeApp({
  credential: cert(serviceAccount),
});

export const auth = getAuth(app);
export const db = getFirestore(app);  