import React, { createContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Product } from "../network/models";

export type ProductContextType = {
  product: Product | null;
  setProduct: (product: Product | null) => void;
  updateProduct: (changes: Partial<Product>) => void;
  clearProduct: () => void;
};

export const ProductContext = createContext<ProductContextType>({
  product: null,
  setProduct: () => {},
  updateProduct: () => {},
  clearProduct: () => {},
});
