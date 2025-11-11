import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  WhereFilterOp,
} from "firebase/firestore";

import { app } from "../../firebaseConfig";
import { FirebaseError } from "firebase/app";
import { getStorage } from "firebase/storage";

export const database = getFirestore(app);
export const db = getFirestore(app);

import { getAuth } from "firebase/auth";

export const auth = getAuth(app);

export const productCollection = () => `products`;

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

export const subscribeWithFilter = (
  collectionName: string,
  filters: Array<[string, WhereFilterOp, any]> = [],
  setCallback: (data: any[]) => void,
  onError: (err: FirebaseError) => void,
  orderByField?: string,
  orderDirection: "asc" | "desc" = "asc",
  limitResults?: number
) => {
  const ref = collection(database, collectionName);

  let q: any = query(ref);

  if (filters.length > 0) {
    const whereClauses = filters.map(([field, op, value]) =>
      where(field, op, value)
    );
    q = query(ref, ...whereClauses);
  }

  if (orderByField) {
    q = query(q, orderBy(orderByField, orderDirection));
  }

  if (limitResults) {
    q = query(q, limit(limitResults));
  }

  const unsubscribe = onSnapshot(
    q,
    (snapshot: any) => {
      const data = snapshot.docs.map((doc: any) => ({
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

export const storage = getStorage(app);
