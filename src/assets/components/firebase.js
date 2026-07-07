// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ_XwfOBGy44_eleEWS1G5FDWZo3X2x10",
  authDomain: "login-auth-2050c.firebaseapp.com",
  projectId: "login-auth-2050c",
  storageBucket: "login-auth-2050c.firebasestorage.app",
  messagingSenderId: "428233074707",
  appId: "1:428233074707:web:9c073c6a611f383b79f7e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();

export default app;