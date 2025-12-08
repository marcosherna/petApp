import React from "react";

export interface PageTransitionContextType {
  currentPage: string | null;
  isTransitioning: boolean;
  startTransition: (callback?: () => void) => void;
  navigateSection: (sectionId: string) => void;
}

export const PageTransitionContext =
  React.createContext<PageTransitionContextType>({
    currentPage: null,
    isTransitioning: false,
    startTransition: () => {},
    navigateSection: () => {},
  });
