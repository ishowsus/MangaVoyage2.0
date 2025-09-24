import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjxuYEgZf1fXYtZVsFVlbZYbINbCKtqnI",
  authDomain: "mangavoyage-a9db8.firebaseapp.com",
  projectId: "mangavoyage-a9db8",
  storageBucket: "mangavoyage-a9db8.appspot.com", // ✅ FIXED
  messagingSenderId: "249693100425",
  appId: "1:249693100425:web:4ab55b0a0689ab213b2958",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
