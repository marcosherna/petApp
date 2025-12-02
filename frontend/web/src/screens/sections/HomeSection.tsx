import React from "react";
import SectionLayout from "../layout/SectionLayout";
import { Button } from "../../components";
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
      className="
        flex flex-col gap-8 justify-end items-center
        text-center px-8 pb-32
        bg-gradient-to-b from-amber-50 to-white
        dark:from-[#0F172A] dark:to-[#1E293B]
        transition-colors
      "
      {...props}
    >
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
    </SectionLayout>
  );
}
