import admin from "firebase-admin";
import serviceAccount from "./FIREBASE_KEY.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

export default admin;