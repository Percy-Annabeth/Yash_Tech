


import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { auth, db } from "../firebase/config";   // ✅ import db
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"; // ✅ add setDoc

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 🔍 fetch role + name from Firestore
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          let role = "user";
          let name = firebaseUser.displayName || "";

          if (userSnap.exists()) {
            const data = userSnap.data();
            role = data.role || "user";
            name = data.name || name;
          }

          // ✅ Merge firebase user with Firestore data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: name,
            role,
          });
        } catch (err) {
          console.error("Error fetching user role:", err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: "user",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Modified signup to also save name + role in Firestore
  const signup = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // create Firestore user doc
    const userRef = doc(db, "users", cred.user.uid);
    await setDoc(userRef, {
      name,
      email,
      role: "user",
      createdAt: serverTimestamp(),
    });

    return cred;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

 export const useAuth = () => useContext(AuthContext);

