import React, { createContext, type RefObject } from "react";
import { Product } from "../network/models";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export type ProductContextType = {
  product: Product | null;
  setProduct: (product: Product | null) => void;
  updateProduct: (changes: Partial<Product>) => void;
  clearProduct: () => void;
  commentSheetRef: RefObject<BottomSheetModal | null> | null;
  openComment: () => void;
  closeComment: () => void;
};

export const ProductContext = createContext<ProductContextType>({
  product: null,
  setProduct: () => {},
  updateProduct: () => {},
  clearProduct: () => {},
  commentSheetRef: null,
  openComment: () => {},
  closeComment: () => {},
});
