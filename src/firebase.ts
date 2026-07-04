import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// Твоя конфигурация из Firebase Console
import { signOut } from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспорт базы данных Firestore
export const db = getFirestore(app);

// Настройка Google-авторизации
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Функция входа через Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user.uid;
  } catch (error) {}
};

export const logout = async () => {
  await signOut(auth);
};
