// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkNfhU8vNRGZvqktT5SbbG1gfBxMTkD7Q",
  authDomain: "dimex-c5f0e.firebaseapp.com",
  projectId: "dimex-c5f0e",
  storageBucket: "dimex-c5f0e.firebasestorage.app",
  messagingSenderId: "839359524843",
  appId: "1:839359524843:web:0a460e7fb2c8f1d2b5f3ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);