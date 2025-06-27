// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth ,createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup,GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDx1FeMe6UUNFbj05Q0a4UMEMXxxxI0o3c",
  authDomain: "booking-app-25cbe.firebaseapp.com",
  projectId: "booking-app-25cbe",
  storageBucket: "booking-app-25cbe.firebasestorage.app",
  messagingSenderId: "627935428861",
  appId: "1:627935428861:web:21f40be26391b881e53e94",
  measurementId: "G-CK5KSXM85V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const storage = getStorage(app)

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider();


export {app,db,  GoogleAuthProvider,auth,googleProvider, storage}

