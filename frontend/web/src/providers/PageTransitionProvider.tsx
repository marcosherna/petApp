import React from "react";

import { PageTransitionContext } from "../context/PageTransitionContext";

export const PageTransitionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const startTransition = (callback?: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback?.();
      setTimeout(() => setIsTransitioning(false), 400);
    }, 300);
  };

  return (
    <PageTransitionContext.Provider
      value={{ isTransitioning, startTransition }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
};
