// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB8u64xgtkg6CGRYkTsUlXs2DSKOHf9KE",
  authDomain: "school-management-aa45c.firebaseapp.com",
  projectId: "school-management-aa45c",
  storageBucket: "school-management-aa45c.firebasestorage.app",
  messagingSenderId: "1084255621326",
  appId: "1:1084255621326:web:041679253bde5b7d80c09f",
  measurementId: "G-HNHYV8ZKRE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
