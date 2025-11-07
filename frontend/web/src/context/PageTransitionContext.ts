import React from "react";

export interface PageTransitionContextType {
  isTransitioning: boolean;
  startTransition: (callback?: () => void) => void;
}

export const PageTransitionContext =
  React.createContext<PageTransitionContextType>({
    isTransitioning: false,
    startTransition: () => {},
  });
