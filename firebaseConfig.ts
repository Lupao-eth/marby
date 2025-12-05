// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADIXgqDvMrHGDCs4xpYSXbTyLIar-woAA",
  authDomain: "marby-905dc.firebaseapp.com",
  projectId: "marby-905dc",
  storageBucket: "marby-905dc.firebasestorage.app",
  messagingSenderId: "1012862298198",
  appId: "1:1012862298198:web:716705c9464c8330e3b3f7",
  measurementId: "G-NT6CR49YDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
