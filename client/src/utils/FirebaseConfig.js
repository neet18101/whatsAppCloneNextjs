// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyDnDabFtw5XTap7rDvp8-dfiHp857It3mg",
  authDomain: "chat-app-23ff9.firebaseapp.com",
  databaseURL: "https://chat-app-23ff9-default-rtdb.firebaseio.com",
  projectId: "chat-app-23ff9",
  storageBucket: "chat-app-23ff9.appspot.com",
  messagingSenderId: "495721059712",
  appId: "1:495721059712:web:ad8500ec0a0825bf291d65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app)