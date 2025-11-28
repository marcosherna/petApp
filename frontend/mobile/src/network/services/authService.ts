import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  EmailAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";

import { auth as authenticate, database } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserInfo } from "../models/User";

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

export async function savePhoneNumber(userId: string, phone: string) {
  await setDoc(doc(database, "users", userId), { phone }, { merge: true });
}

export async function updateUserProfile(
  currentUser: User,
  displayName: string,
  phoneNumber?: string
) {
  await updateProfile(currentUser, {
    displayName,
    photoURL: currentUser.photoURL,
  });

  const userRef = doc(database, "users", currentUser.uid);

  await setDoc(
    userRef,
    {
      displayName,
      phoneNumber: phoneNumber || null,
      updatedAt: new Date(),
    },
    { merge: true }
  );
}

export async function getUserData(uid: string): Promise<null | UserInfo> {
  const userRef = doc(database, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    uid,
    ...snapshot.data(),
  } as UserInfo;
}

export async function changeUserPassword(
  currentUser: User,
  currentPassword: string,
  newPassword: string
) { 
  const credential = EmailAuthProvider.credential(
    currentUser.email!,
    currentPassword
  );
  await reauthenticateWithCredential(currentUser, credential);
  await updatePassword(currentUser, newPassword);
}


export const deleteUserAccount = async (user: any) => {
  await deleteUser(user);
};

export async function reauthenticateUser(currentUser: User, password: string) {
  const credential = EmailAuthProvider.credential(
    currentUser.email!,
    password
  );
  await reauthenticateWithCredential(currentUser, credential);
}