import { Timestamp } from "firebase/firestore";

export interface Comment {
  id: string;
  productId: string;
  userId: string;
  userPhoto: string;
  userName: string;
  content: string;
  createdAt: string;
}

export const commentMapper = (raw: any): Comment => {
  let createdAt = "";
  if (raw.createdAt instanceof Timestamp) {
    createdAt = raw.createdAt.toDate().toISOString();
  }
  return { ...raw, createdAt } as Comment;
};
