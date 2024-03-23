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
  apiKey: "AIzaSyBgypNvN4cve98A478pnRXjX7Rc3pbefuI",
  authDomain: "fir-88ee8.firebaseapp.com",
  projectId: "fir-88ee8",
  storageBucket: "fir-88ee8.appspot.com",
  messagingSenderId: "146431154946",
  appId: "1:146431154946:web:81be76eafb32f5cdda801b",
  measurementId: "G-54N4PE4E14"
};


// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
