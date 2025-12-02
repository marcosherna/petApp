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
        flex flex-col gap-6 justify-end items-center 
        text-center px-6 pb-24
      "
      {...props}
    >
      <span className="text-sm tracking-[0.3em] text-gray-600 uppercase">
        Facultad de Ingeniería y Ciencias Naturales, Universidad de Sonsonate •
        proyecto académico 2025
      </span>

      <span className="text-4xl font-extrabold tracking-wide">Pet App</span>

      <Button label="Proposito" onClick={handleSectionTecnologyNavigate} />
    </SectionLayout>
  );
}
