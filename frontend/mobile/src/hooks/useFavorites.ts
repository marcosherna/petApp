import { useEffect, useState } from "react";
import { db } from "../network/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";

export default function useFavorites(userId?: string) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(collection(db, "favorites"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const list: any[] = [];

      // 🔥 Traer datos completos del producto
      for (const docSnap of snapshot.docs) {
        const fav = docSnap.data();
        const productRef = doc(db, "products", fav.productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const p = productSnap.data();

          list.push({
            id: productSnap.id,
            name: p.name,
            price: p.price,
            imgCover: p.imgCover ?? p.images?.[0],
          });
        }
      }

      setFavorites(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { favorites, loading };
}
