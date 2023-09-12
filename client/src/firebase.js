import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyD5Fhsi_AHvYCAmDY8nExZQMCLF0_XB7wo",
  authDomain: "joy-of-tails.firebaseapp.com",
  projectId: "joy-of-tails",
  storageBucket: "joy-of-tails.appspot.com",
  messagingSenderId: "523639919370",
  appId: "1:523639919370:web:31f46ac19b723b80ade0f3",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
