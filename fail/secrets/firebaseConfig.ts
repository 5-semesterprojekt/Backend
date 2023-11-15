// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCngbHAI-NnDnuyYIJOaSLwMbn6btdGO6E",
  authDomain: "semprojekt-e2353.firebaseapp.com",
  projectId: "semprojekt-e2353",
  storageBucket: "semprojekt-e2353.appspot.com",
  messagingSenderId: "733762089096",
  appId: "1:733762089096:web:0da39f55166a422ee56f3d",
  measurementId: "G-CPFQTHR74D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
