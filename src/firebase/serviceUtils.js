import { db } from "./firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";








/**
 * Generate a unique Service ID in the format: SER-2026-XXX
 * XXX increments based on the last service in Firestore
 */
export const generateServiceId = async () => {
  try {
    const q = query(
      collection(db, "services"),
      orderBy("serviceId", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);








    if (snapshot.empty) return "SER-2026-001";








    const lastServiceId = snapshot.docs[0].data().serviceId;
    const lastNumber = parseInt(lastServiceId.split("-")[2], 10);
    const nextNumber = String(lastNumber + 1).padStart(3, "0");








    return `SER-2026-${nextNumber}`;
  } catch (error) {
    console.error("Error generating Service ID:", error);
    return "SER-2026-001";
  }
};
