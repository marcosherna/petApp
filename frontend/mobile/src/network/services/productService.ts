import { WhereFilterOp } from "firebase/firestore";
import { productCollection, subscribe, subscribeWithFilter } from "../firebase";
import { Product } from "../models/Product"; 

const collectionName = productCollection();

const productMapper = (product: any): Product => {
  const images = Array.isArray(product.images)
    ? product.images
    : [];

  return {
    ...product,
    imgs: images,
    imgCover:
      images.length > 0
        ? images[0]
        : "https://b2bmart.vn/images/placeholder.jpg",
    price: parseFloat(product.price ?? 0),
    score: parseFloat(product.score ?? 0),
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
