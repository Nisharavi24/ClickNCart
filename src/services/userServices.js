import { db } from "../firebase/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";




export const updateUserProfile = async (docId, data) => {
  const userRef = doc(db, "users", docId);




  await updateDoc(userRef, {
    firstName: data.firstName,
    lastName: data.lastName,
    mobile: data.mobile,
    updatedAt: serverTimestamp(),
  });
};
