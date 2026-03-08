import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";


/* ================= GET USER BY CUSTOM ID ================= */
export const getUserByCustomId = async (customId) => {
  const formattedId = customId.trim();


  if (!formattedId) {
    throw new Error("Invalid Custom ID");
  }


  const userRef = doc(db, "users", formattedId);
  const snap = await getDoc(userRef);


  if (!snap.exists()) {
    throw new Error("User not found");
  }


  return {
    id: snap.id,
    ...snap.data(),
  };
};


/* ================= GET ALL USERS ================= */
export const getAllUsers = async () => {
  const usersCollection = collection(db, "users");
  const snap = await getDocs(usersCollection);


  return snap.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
};


/* ================= UPDATE USER ================= */
export const updateUser = async (userId, updatedData) => {
  if (!userId) {
    throw new Error("User ID is required");
  }


  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, updatedData);
};
