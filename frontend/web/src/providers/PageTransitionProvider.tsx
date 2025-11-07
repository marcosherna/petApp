import React from "react";

import { PageTransitionContext } from "../context/PageTransitionContext";

export const PageTransitionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<string | null>(null);

  const startTransition = (callback?: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback?.();
      setTimeout(() => setIsTransitioning(false), 400);
    }, 300);
  };

  const navigateSection = (sectionId: string) => {
    startTransition(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
      setCurrentPage(sectionId);
    });
  };

  return (
    <PageTransitionContext.Provider
      value={{ currentPage, isTransitioning, startTransition, navigateSection }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
};
