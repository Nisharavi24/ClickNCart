import { auth, db } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";




import {
  collection,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
  query,
  where
} from "firebase/firestore";








/* ---------- REGISTER USER ---------- */
export const registerUser = async (formData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );




    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const userCount = snapshot.size + 1;
    const customId = "U026" + String(userCount).padStart(4, "0");




    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName || "",
      email: formData.email,
      mobile: formData.mobile,
      authUid: userCredential.user.uid,
      role: "customer",
      createdAt: serverTimestamp(),
    };




    await setDoc(doc(db, "users", customId), payload);




    // prevent auto login after register
    await signOut(auth);




    return {
      customId,
      role: "customer",
      ...userCredential.user,
    };




  } catch (error) {
    throw new Error(error?.message || String(error));
  }
};








/* ---------- LOGIN USER ---------- */
export const loginUser = async (email, password) => {
  try {




    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;




    const usersRef = collection(db, "users");
    const q = query(usersRef, where("authUid", "==", uid));
    const snapshot = await getDocs(q);




    if (snapshot.empty) {
      throw new Error("User not found. Please register.");
    }




    const userDoc = snapshot.docs[0];
    const role = userDoc.data().role;




    // prevent admin login in user panel
    if (role === "admin") {
      throw new Error("Admin cannot login from user panel");
    }




    return {
      ...userCredential.user,
      customId: userDoc.id,
      role: role,
    };




  } catch (error) {




    if (error.code === "auth/user-not-found") {
      throw new Error("User not found. Please register.");
    }
    else if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password.");
    }
    else if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address.");
    }
    else {
      throw new Error(error.message || "Login failed.");
    }




  }
};








/* ---------- LOGIN ADMIN ---------- */
export const loginAdmin = async (email, password) => {
  try {




    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;




    const usersRef = collection(db, "users");
    const q = query(usersRef, where("authUid", "==", uid));
    const snapshot = await getDocs(q);




    if (snapshot.empty) {
      throw new Error("Admin not found in database");
    }




    const userDoc = snapshot.docs[0];
    const role = userDoc.data().role;




    // prevent normal user login in admin panel
    if (role !== "admin") {
      throw new Error("You are not an admin!");
    }




    return {
      ...userCredential.user,
      customId: userDoc.id,
      role: role,
    };




  } catch (error) {
    throw new Error(error.message);
  }
};








/* ---------- GOOGLE LOGIN ---------- */
export const googleLogin = async () => {
  try {




    const provider = new GoogleAuthProvider();




    // prevent token conflict
    await signOut(auth);




    const result = await signInWithPopup(auth, provider);
    const user = result.user;




    const usersRef = collection(db, "users");
    const q = query(usersRef, where("authUid", "==", user.uid));
    const snapshot = await getDocs(q);




    let customId;




    if (snapshot.empty) {




      const allUsers = await getDocs(usersRef);
      const userCount = allUsers.size + 1;
      customId = "U026" + String(userCount).padStart(4, "0");




      await setDoc(doc(db, "users", customId), {
        firstName: user.displayName || "",
        lastName: "",
        email: user.email,
        mobile: "",
        authUid: user.uid,
        role: "customer",
        createdAt: serverTimestamp(),
      });




    } else {
      customId = snapshot.docs[0].id;
    }




    return {
      ...user,
      customId,
      role: "customer",
    };




  } catch (error) {




    if (error.code === "auth/invalid-credential") {
      throw new Error("Google login failed. Please try again.");
    }




    throw new Error(error.message);
  }
};








/* ---------- FORGOT PASSWORD ---------- */
export const forgotPassword = async (email) => {
  try {




    await sendPasswordResetEmail(auth, email);
    return true;




  } catch (error) {
    throw new Error(error.message);
  }
};








/* ---------- LOGOUT ---------- */
export const logoutUser = async () => {
  try {




    await signOut(auth);
    return true;




  } catch (error) {
    throw new Error(error.message);
  }
};


