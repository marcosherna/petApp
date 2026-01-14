import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { database, subscribeWithFilter } from "../firebase";
import { commentMapper, Comment } from "../models/Comment";

const commentCollectionName = "comments";

export const subscribeToComentsByProductId = (
  productId: string,
  setComents: (comment: Comment[]) => void,
  onError: (err: any) => void
) => {
  const q = query(
    collection(database, commentCollectionName),
    where("productId", "==", productId)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const comments = snapshot.docs.map((doc) => {
        const data = doc.data();

        return commentMapper({
          id: doc.id,
          ...data,
          createdAt: data.createdAt ?? null,
        });
      });

      setComents(comments);
    },
    onError
  );

  return unsubscribe;
};

export const addComment = async (
  comment: Omit<Comment, "id" | "createdAt">
) => {
  try {
    const commentRef = doc(collection(database, commentCollectionName));
    const id = commentRef.id;

    const newComment = {
      ...comment,
      createdAt: serverTimestamp(),
    };

    await setDoc(commentRef, { ...newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

export const getCommentsByProductId = async (
  productId: string,
  max: number = 2
) => {
  try {
    const ref = collection(database, commentCollectionName);

    const q = query(ref, where("productId", "==", productId), limit(max));

    const snapshot = await getDocs(q);

    const comments = snapshot.docs.map((doc) => {
      const data = doc.data();
      return commentMapper({
        id: doc.id,
        ...data,
        createdAt: data.createdAt ?? null,
      });
    });

    return comments;
  } catch (error) {
    return [];
  }
};
