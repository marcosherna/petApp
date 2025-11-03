import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import { app } from "../../firebaseConfig";
import { FirebaseError } from "firebase/app";

export const database = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const productCollection = () => `products-general`;

export const subscribe = (
  collectionName: string,
  setCallback: (data: any[]) => void,
  onError: (err: FirebaseError) => void
) => {
  const response = collection(database, collectionName);

  const unsubscribe = onSnapshot(
    response,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCallback(data);
    },
    (error) => {
      onError?.(error);
    }
  );

  return unsubscribe;
};
