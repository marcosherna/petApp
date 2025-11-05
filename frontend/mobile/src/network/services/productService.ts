import { WhereFilterOp } from "firebase/firestore";
import { productCollection, subscribe, subscribeWithFilter } from "../firebase";
import { Product } from "../models/Product";

const collectionName = productCollection();

export const subscribeToProducts = (
  setProducts: (products: Product[]) => void,
  onError: (products: any) => void
) => {
  const unsubscribe = subscribe(
    collectionName,
    (products) => {
      const mapper = products.map((product) => {
        const { id, name, description, price, score, category, images } =
          product;
        return {
          id,
          name,
          description,
          imgs: images,
          imgCover: images.length >= 0 ? images[0] : "",
          price: parseFloat(price),
          score: parseFloat(score),
          category,
        } as Product;
      });

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
      const mapper = products.map((product: any) => {
        return {
          ...product,
          imgs: product.images,
          imgCover: product.images.length >= 0 ? product.images[0] : "",
          price: parseFloat(product.price),
          score: parseFloat(product.score),
        } as Product;
      });

      setProducts(mapper);
    },
    onError,
    orderByField,
    orderDirection,
    limitResults
  );
  return unsubscribe;
};
