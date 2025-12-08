import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { usePageTransition } from "../../hooks/usePageTransition";

interface PageTransitionLayoutProps {
  children: React.ReactNode;
  colors?: string[];
  layers?: number;
  reverse?: boolean;
}

export default function PageTransitionLayout({
  children,
  colors = ["#4f46e5", "#6366f1cc", "#818cf880"],
  layers = 3,
  reverse = false,
}: PageTransitionLayoutProps) {
  const { isTransitioning } = usePageTransition();

  const layerColors = reverse ? [...colors].reverse() : colors;

  const visibleColors = layerColors.slice(0, layers);

  return (
    <>
      <AnimatePresence>
        {isTransitioning && (
          <>
            {visibleColors.map((color, index) => {
              const delay = index * 0.02;
              const duration = 0.4 + index * 0.15;
              const zIndex = 50 - index * 10;

              return (
                <motion.div
                  key={`cover-${index}`}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{
                    duration,
                    ease: [0.76, 0, 0.24, 1],
                    delay,
                  }}
                  className="fixed inset-0 backdrop-blur-sm"
                  style={{
                    zIndex,
                    backgroundColor: color,
                  }}
                />
              );
            })}
          </>
        )}
      </AnimatePresence>

      {children}
    </>
  );
}
