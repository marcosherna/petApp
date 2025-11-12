import { ReactNode, useCallback, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { Product } from "../network/models";


export const ProductProvider = ({
  children,
  initialProduct = null,
}: {
  children: ReactNode;
  initialProduct?: Product | null;
}) => {
  const [product, setProduct] = useState<Product | null>(initialProduct);

  const updateProduct = useCallback((changes: Partial<Product>) => {
    setProduct((prev) => (prev ? { ...prev, ...changes } : prev));
  }, []);

  const clearProduct = useCallback(() => setProduct(null), []);

  return (
    <ProductContext.Provider
      value={{
        product,
        setProduct,
        updateProduct,
        clearProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};