// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCngbHAI-NnDnuyYIJOaSLwMbn6btdGO6E",
  authDomain: "semprojekt-e2353.firebaseapp.com",
  projectId: "semprojekt-e2353",
  storageBucket: "semprojekt-e2353.appspot.com",
  messagingSenderId: "733762089096",
  appId: "1:733762089096:web:aa5fe8ab8100a453e56f3d",
  measurementId: "G-B0Q16D11TP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);