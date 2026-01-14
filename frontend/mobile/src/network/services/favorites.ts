import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Verificar si YA es favorito
export async function isProductFavorite(userId: string, productId: string) {
  const q = query(
    collection(db, "favorites"),
    where("userId", "==", userId),
    where("productId", "==", productId)
  );
  const snap = await getDocs(q);
  return snap.size > 0;
}

// Agregar producto a favoritos
export async function addFavorite(userId: string, product: any) {
  return await addDoc(collection(db, "favorites"), {
    userId,
    productId: product.id,
    name: product.name,
    price: product.price,
    imgCover: product.imgCover ?? product.imgs?.[0] ?? "",
  });
}

// Eliminar favorito
export async function removeFavorite(userId: string, productId: string) {
  const q = query(
    collection(db, "favorites"),
    where("userId", "==", userId),
    where("productId", "==", productId)
  );
  const snap = await getDocs(q);

  snap.forEach((d) => {
    deleteDoc(doc(db, "favorites", d.id));
  });
}
