// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYhilCDqP_MH78SzFJgCRhN0uVXvOADXU",
  authDomain: "tradermind-a8dcc.firebaseapp.com",
  projectId: "tradermind-a8dcc",
  storageBucket: "tradermind-a8dcc.appspot.com",
  messagingSenderId: "296383052960",
  appId: "1:296383052960:web:543aa53273036ed8b6ddc5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Optional: set additional parameters for the Google provider
googleProvider.setCustomParameters({ prompt: "select_account" });

// Export authentication methods
export { auth, googleProvider, signOut, signInWithPopup, signInWithEmailAndPassword };

// Use signInWithPopup directly, passing auth and provider as arguments
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Use signInWithEmail for email/password authentication
export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
