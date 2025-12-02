import { useContext } from "react";

import { PageTransitionContext } from "../context/PageTransitionContext";

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  return context;
};
