import React from "react";
import SectionLayout from "../layout/SectionLayout";
import { Button, Particles } from "../../components";
import { usePageTransition } from "../../hooks/usePageTransition";

export function HomeSection(
  props: Omit<React.ComponentProps<typeof SectionLayout>, "children">
) {
  const { navigateSection } = usePageTransition();

  const handleSectionTecnologyNavigate = () => {
    navigateSection("info");
  };

  return (
    <SectionLayout
      className="relative h-full flex flex-col bg-gradient-to-b from-amber-50 to-white dark:from-[#0F172A]  dark:to-[#1E293B] transition-colors"
      {...props}
    >
      {/* Fondo de partículas */}
      <Particles
        particleCount={180}
        particleColors={["#FBBF24", "#FACC15", "#FEF9C3"]}
        particleSpread={7}
        speed={0.12}
        alphaParticles={true}
        particleBaseSize={120}
        sizeRandomness={7}
        pixelRatio={1.6}
        moveParticlesOnHover={true}
        particleHoverFactor={0.8} 
      />

      {/* Contenido principal */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col justify-center items-center gap-8 pb-12 text-center">
        <span
          className="
        text-xs tracking-[0.25em] 
        text-gray-500 dark:text-gray-400 
        uppercase font-medium
      "
        >
          Facultad de Ingeniería y Ciencias Naturales • Proyecto Académico 2025
        </span>

        <span
          className="
        text-5xl font-extrabold tracking-wide 
        text-amber-700 dark:text-amber-300
      "
        >
          PetMark
        </span>

        <span
          className="
        text-gray-700 dark:text-gray-300 
        max-w-xl text-lg leading-relaxed
      "
        >
          La comunidad donde compartes productos reales para mascotas, precios,
          fotos y tiendas cercanas.
        </span>

        <Button label="Propósito" onClick={handleSectionTecnologyNavigate} />
      </div>
    </SectionLayout>
  );
}
