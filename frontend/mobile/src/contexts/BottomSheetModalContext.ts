import React, { createContext } from "react";

export type BottomSheetModalContextType = {
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
};

export const BottomSheetModalContext =
  createContext<BottomSheetModalContextType>({
    openModal: () => {},
    closeModal: () => {},
  });
