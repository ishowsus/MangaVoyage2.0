// firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAjxuYEgZf1fXYtZVsFVlbZYbINbCKtqnI",
  authDomain: "mangavoyage-a9db8.firebaseapp.com",
  projectId: "mangavoyage-a9db8",
  storageBucket: "mangavoyage-a9db8.appspot.com", // ✅ FIXED
  messagingSenderId: "249693100425",
  appId: "1:249693100425:web:4ab55b0a0689ab213b2958",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

