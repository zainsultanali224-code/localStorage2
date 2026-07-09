// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAecI-YrOgoZmb4h4L-xSBym5149gBLh88",
  authDomain: "login-demo-40884.firebaseapp.com",
  projectId: "login-demo-40884",
  storageBucket: "login-demo-40884.firebasestorage.app",
  messagingSenderId: "386383428949",
  appId: "1:386383428949:web:ee92fa9eec5d94f1dd43dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore(app)
export default app;