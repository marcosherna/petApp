import { productCollection, subscribe } from "../firebase";
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
        const { id, name, description, imgCover, price, score } = product;
        return {
          id,
          name,
          description,
          imgCover,
          price: parseFloat(price),
          score: parseFloat(score),
        } as Product;
      });

      setProducts(mapper);
    },
    onError
  );
  return unsubscribe;
};
