// src/services/rentalServices.js
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";




// Add Rental
export const addRental = async (data) => {
  await addDoc(collection(db, "rentals"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};




// Get Rentals
export const getRentals = async () => {
  const snapshot = await getDocs(collection(db, "rentals"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};




// Update Rental ✅🔥 THIS WAS MISSING
export const updateRental = async (id, data) => {
  await updateDoc(doc(db, "rentals", id), {
    ...data,
  });
};




// Delete Rental
export const deleteRental = async (id) => {
  await deleteDoc(doc(db, "rentals", id));
};
