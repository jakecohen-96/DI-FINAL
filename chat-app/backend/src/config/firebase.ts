// firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export { firebaseApp, analytics };