import { ReactNode, useCallback, useRef, useState, useEffect } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { Product } from "../network/models";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../network/firebase";

export const ProductProvider = ({
  children,
  initialProduct = null,
}: {
  children: ReactNode;
  initialProduct?: Product | null;
}) => {
  const commetRef = useRef<BottomSheetModal>(null);
  const [product, setProduct] = useState<Product | null>(initialProduct);

  useEffect(() => {
    if (!product?.id) return;
    const unsub = onSnapshot(doc(db, "products", product.id), (snap) => {
      if (snap.exists()) {
        setProduct((prev) =>
          prev ? ({ ...prev, ...snap.data() } as Product) : null
        );
      }
    });
    return () => unsub();
  }, [product?.id]);

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
