import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";


export const getProducts = async () => {
  const productsRef = collection(db, "products");
  const snapshot = await getDocs(productsRef);


  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};
