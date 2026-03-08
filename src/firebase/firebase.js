import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyAzYTSdON1c-0-vVaX_sAVYXqO7orZ3BGo",
  authDomain: "clickncart-23835.firebaseapp.com",
  projectId: "clickncart-23835",
  storageBucket: "clickncart-23835.appspot.com",
  messagingSenderId: "898698044394",
  appId: "1:898698044394:web:0040741663f3bd1f820893",
};




const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
