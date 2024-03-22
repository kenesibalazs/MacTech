// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFNz0YU6gNexlb4QKxC0IQpropr2TcCf4",
  authDomain: "hackatonapp-c950e.firebaseapp.com",
  projectId: "hackatonapp-c950e",
  storageBucket: "hackatonapp-c950e.appspot.com",
  messagingSenderId: "966954277462",
  appId: "1:966954277462:web:75162fdd8eaa105f0ff9f7",
  measurementId: "G-M1YS0F58Z0"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
