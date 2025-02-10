import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getAnalytics } from "firebase/analytics";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {

  apiKey: "AIzaSyDj6dCxv5i2GrnWCTINFJjpQI3IJudyg80",

  authDomain: "jake-s-chat-app.firebaseapp.com",

  databaseURL: "https://jake-s-chat-app-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "jake-s-chat-app",

  storageBucket: "jake-s-chat-app.firebasestorage.app",

  messagingSenderId: "116931307401",

  appId: "1:116931307401:web:fc32721c3f806e88afe358",

  measurementId: "G-C3QFKKRFW8"

};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics();
export const auth = getAuth(app);
export const db = getFirestore(app);  