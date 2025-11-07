import React from "react";
import sal from "sal.js";

import NavBarApp from "../components/NavBarApp";
import PageTransitionLayout from "./layout/PageTransitionLayout";

import { usePageTransition } from "../hooks/usePageTransition";
import { AboutSection, HomeSection } from "./sections";

export default function MainContent() {
  const { startTransition } = usePageTransition();

  const handleNavigate = (sectionId: string) => { 
    startTransition(() => { 
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    });
  };

  React.useEffect(() => {
    sal({ root: null, threshold: 0.3, once: false });
  }, []);

  return (
    <PageTransitionLayout>
      <div className="app-container bg-white h-screen overflow-hidden">
        <NavBarApp onNavigate={handleNavigate} /> 
        <HomeSection id="home" /> 
        <AboutSection id="about" />  
      </div>
    </PageTransitionLayout>
  );
}
