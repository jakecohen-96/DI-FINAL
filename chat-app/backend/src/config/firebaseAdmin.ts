import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON as string);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL, 
});

export default admin;