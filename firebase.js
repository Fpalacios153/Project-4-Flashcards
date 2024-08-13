// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.FIREBASE_SECRET_KEY,
    authDomain: process.env.NEXT_PUBLIC_API_KEY_authDomain,
    projectId: process.env.NEXT_PUBLIC_API_KEY_projectId,
    storageBucket: process.env.NEXT_PUBLIC_API_KEY_storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_API_KEY_messagingSenderId,
    appId: process.env.NEXT_PUBLIC_API_KEY_appId,
    measurementId: process.env.NEXT_PUBLIC_API_KEY_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
export default db;
