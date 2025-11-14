import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { auth as authenticate, database } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// const auth = getAuth(app);

export const unsubscribeSession = (callback: (user: User | null) => void) =>
  onAuthStateChanged(authenticate, (currentUser) => {
    callback(currentUser);
  });

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    authenticate,
    email,
    password
  );

  const user = userCredential.user;
  await updateProfile(user, { displayName: name });
  return user;
};

export const sigIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    authenticate,
    email,
    password
  );

  const user = userCredential.user;
  return user;
};

export const signOut = async () => {
  await authenticate.signOut();
};

export async function getUserRating(
  userId: string,
  productId: string
): Promise<number> {
  const ratingDoc = await getDoc(
    doc(database, "products", productId, "ratings", userId)
  );
  if (ratingDoc.exists()) {
    return parseInt(ratingDoc.data().rating);
  }
  return 0;
}
