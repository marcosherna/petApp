import { ReactNode, useCallback, useRef, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { Product } from "../network/models";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export const ProductProvider = ({
  children,
  initialProduct = null,
}: {
  children: ReactNode;
  initialProduct?: Product | null;
}) => {
  const commetRef = useRef<BottomSheetModal>(null);
  const [product, setProduct] = useState<Product | null>(initialProduct);

  const updateProduct = useCallback((changes: Partial<Product>) => {
    setProduct((prev) => (prev ? { ...prev, ...changes } : prev));
  }, []);

  const clearProduct = useCallback(() => setProduct(null), []);

  const openComment = () => {
    commetRef?.current?.present();
  };

  const closeComment = () => {
    commetRef?.current?.dismiss();
  };

  return (
    <ProductContext.Provider
      value={{
        product,
        setProduct,
        updateProduct,
        clearProduct,
        commentSheetRef: commetRef,
        openComment,
        closeComment,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
