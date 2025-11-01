import {
  getAuth,
  createUserWithEmailAndPassword, 
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { database } from "../firebase";
import { app } from "../../../firebaseConfig";

const auth = getAuth(app);

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;
  await updateProfile(user, { displayName: name });
  await setDoc(doc(database, "users", user.uid), {
    name,
    email,
    createdAt: serverTimestamp(),
  });

  return user;
};

