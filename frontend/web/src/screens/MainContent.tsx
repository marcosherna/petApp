import React from "react";
import sal from "sal.js";

import NavBarApp from "../components/NavBarApp";
import PageTransitionLayout from "./layout/PageTransitionLayout";

import { usePageTransition } from "../hooks/usePageTransition";
import { AboutSection, HomeSection, InfoSection } from "./sections"; 

export default function MainContent() {
  const { navigateSection } = usePageTransition();

  React.useEffect(() => {
    sal({ root: null, threshold: 0.3, once: false });
  }, []);

  return (
    <PageTransitionLayout>
      <div className="app-container h-screen overflow-hidden relative "> 
        <NavBarApp onNavigate={navigateSection} />
        <HomeSection id="home" />
        <InfoSection id="info" />
        <AboutSection id="about" />
      </div>
    </PageTransitionLayout>
  );
}
