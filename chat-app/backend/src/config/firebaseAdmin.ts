import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccountPath = process.env.FIREBASE_KEY_PATH || "/run/secrets/FIREBASE_KEY.json";

let serviceAccount;
try {

  const fileContent = readFileSync(serviceAccountPath, "utf-8");
  serviceAccount = JSON.parse(fileContent);
} catch (error) {
  throw new Error(`Failed to read or parse Firebase key file at ${serviceAccountPath}: ${error}`);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export default admin;