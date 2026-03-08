import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { laptops } from "./seedProducts";








export const seedFirestore = async () => {
  try {
    for (const laptop of laptops) {








      // SALE ENTRY
      await addDoc(collection(db, "products"), {
        name: laptop.name,
        brand: laptop.brand,
        specs: laptop.specs,
        rating: laptop.rating,
        image: laptop.image,
        category: "laptop",
        type: "sale",
        price: laptop.salePrice
      });








      // RENT ENTRY
      await addDoc(collection(db, "products"), {
        name: laptop.name,
        brand: laptop.brand,
        specs: laptop.specs,
        rating: laptop.rating,
        image: laptop.image,
        category: "laptop",
        type: "rent",
        pricePerMonth: laptop.rentPrice
      });
    }








    console.log("🔥 LAPTOPS ADDED FOR SALE + RENT SUCCESSFULLY");
  } catch (error) {
    console.error("❌ SEED ERROR:", error);
  }
};
