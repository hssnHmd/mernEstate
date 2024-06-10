// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-estate-cb79e.firebaseapp.com',
  projectId: 'mern-estate-cb79e',
  storageBucket: 'mern-estate-cb79e.appspot.com',
  messagingSenderId: '281658585914',
  appId: '1:281658585914:web:5c64f1f3a03e172e77d603',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
