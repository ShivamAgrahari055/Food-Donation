// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQuwSMvcnUYn5CjvmflqEK_8yjr_O5PIw",
  authDomain: "food-donation-6b257.firebaseapp.com",
  projectId: "food-donation-6b257",
  storageBucket: "food-donation-6b257.firebasestorage.app",
  messagingSenderId: "25841238516",
  appId: "1:25841238516:web:89180f2cc78346438fb9a1",
 // measurementId: "G-F51TKHSDXQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);