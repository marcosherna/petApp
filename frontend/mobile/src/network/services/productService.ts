import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  WhereFilterOp,
  serverTimestamp,
} from "firebase/firestore";
import {
  database,
  productCollection,
  subscribe,
  subscribeWithFilter,
} from "../firebase";
import { Product } from "../models/Product";

const collectionName = productCollection();

const productMapper = (product: any): Product => {
  const images = Array.isArray(product.images) ? product.images : [];

  return {
    id: product.id,
    ...product,
    imgs: images,
    imgCover:
      images.length > 0
        ? images[0]
        : "https://b2bmart.vn/images/placeholder.jpg",
    price: parseFloat(product.price ?? 0),
    score: product.score
      ? {
          avg: parseFloat(product.score.avg ?? 0),
          count: parseInt(product.score.count ?? 0),
        }
      : null,
    author: product.author
      ? {
          name: product.author.name ?? "Autor desconocido",
          photoURL: product.author.photoURL ?? null,
          uid: product.author.uid ?? null,
        }
      : {
          name: "Autor desconocido",
          photoURL: null,
          uid: null,
        },
  };
};

export const subscribeToProducts = (
  setProducts: (products: Product[]) => void,
  onError: (products: any) => void
) => {
  const unsubscribe = subscribe(
    collectionName,
    (products) => {
      const mapper = products.map(productMapper);
      setProducts(mapper);
    },
    onError
  );
  return unsubscribe;
};

export const subscribeToProductsWithFilter = (
  filters: Array<[string, WhereFilterOp, any]> = [],
  setProducts: (products: Product[]) => void,
  onError: (products: any) => void,
  orderByField?: string,
  orderDirection: "asc" | "desc" = "asc",
  limitResults?: number
) => {
  const unsubscribe = subscribeWithFilter(
    collectionName,
    filters,
    (products: any) => {
      const mapper = products.map(productMapper);
      setProducts(mapper);
    },
    onError,
    orderByField,
    orderDirection,
    limitResults
  );
  return unsubscribe;
};

async function recalculateAverageRating(productId: string) {
  const ratingsSnap = await getDocs(
    collection(database, "products", productId, "ratings")
  );
  const ratings = ratingsSnap.docs.map((doc) => doc.data().rating);

  const totalRatings = ratings.length;
  const avgRating =
    totalRatings > 0 ? ratings.reduce((a, b) => a + b, 0) / totalRatings : 0;

  await updateDoc(doc(database, "products", productId), {
    score: {
      avg: avgRating,
      count: totalRatings,
    },
  });
}

export async function rateProduct(
  userId: string,
  productId: string,
  ratingValue: number
) {
  const ratingRef = doc(database, "products", productId, "ratings", userId);

  await setDoc(ratingRef, {
    rating: ratingValue,
    createdAt: serverTimestamp(),
  });

  await recalculateAverageRating(productId);
}
