// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5c6c16gWt3HwQqkjrvY7cT-AbvIISAqc",
  authDomain: "coworkerproject-cce6f.firebaseapp.com",
  projectId: "coworkerproject-cce6f",
  storageBucket: "coworkerproject-cce6f.appspot.com",
  messagingSenderId: "939678640035",
  appId: "1:939678640035:web:b4a86408fa808871c8dc16",
  measurementId: "G-Q1QBXBQ6C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const bucket = admin.storage().bucket();