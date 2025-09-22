// This file is machine-generated - edit at your own risk.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxA9s-Juxgcgh61cAxUr3O7DZ9BvmZr1U",
  authDomain: "bluecarbon-5bc27.firebaseapp.com",
  projectId: "bluecarbon-5bc27",
  storageBucket: "bluecarbon-5bc27.firebasestorage.app",
  messagingSenderId: "792642793657",
  appId: "1:792642793657:web:c44b3cd746c79d02182b68",
  measurementId: "G-CC12TGHHYJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
