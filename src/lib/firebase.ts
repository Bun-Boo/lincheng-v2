import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuA9pu1SeN9rnBc3_lZnAiX3Hsc3d9sts",
  authDomain: "trang-1b214.firebaseapp.com",
  projectId: "trang-1b214",
  storageBucket: "trang-1b214.firebasestorage.app",
  messagingSenderId: "569880433536",
  appId: "1:569880433536:web:9d0adc2fc67f7cababa765"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
