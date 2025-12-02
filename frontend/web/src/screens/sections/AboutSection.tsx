import React, { useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Dna,
  Cog,
  Camera,
  FlaskConical,
} from "lucide-react";

import SectionLayout from "../layout/SectionLayout";
import { CircularIconButton } from "../../components";

const developers = [
  {
    id: 1,
    name: "Producto",
    Icon: Dna,
    rol: "Diseño y Concepto",
    description:
      "Encargado de la visión general del producto, definir funcionalidad y mantener coherencia en la experiencia del usuario.",
    tasks: ["Diseño UX/UI", "Propuesta de valor", "Flow de usuario"],
  },
  {
    id: 2,
    name: "Backend",
    Icon: Cog,
    rol: "Firebase & Servicios",
    description:
      "Responsable de la autenticación, base de datos, almacenamiento de imágenes y reglas de seguridad.",
    tasks: ["Firebase Auth", "Firestore", "Storage & Rules"],
  },
  {
    id: 3,
    name: "Media",
    Icon: Camera,
    rol: "Fotos y Contenido",
    description:
      "Creación de fotografías e imágenes para presentar productos y la experiencia de la app.",
    tasks: ["Fotografía", "Edición", "Optimización"],
  },
  {
    id: 4,
    name: "Frontend",
    Icon: FlaskConical,
    rol: "Aplicación Móvil",
    description:
      "Implementación de la UI, navegación, estados, modo oscuro y filtros visuales dinámicos.",
    tasks: ["React Native", "UI Components", "Dark Mode"],
  },
];

const Card = ({
  index,
  name,
  rol,
  Icon,
  description,
  tasks,
}: {
  index: number;
  name: string;
  rol: string;
  Icon: React.ComponentType<{ className?: string }>;
  description: string;
  tasks: string[];
}) => {
  return (
    <div
      className="
        relative group flex items-center h-full min-w-[30%]
        bg-[#0F172A] border border-[#334155]
        hover:bg-[#243041] transition-colors
        p-14  
      "
    >
      <div className="flex flex-col gap-4 group-hover:hidden text-[#F9FAFB]">
        <Icon className="w-10 h-10 text-[#3B82F6]" />
        <span className="font-bold text-2xl">{name}</span>
        <span className="opacity-80 text-[#CBD5E1]">{rol}</span>
      </div>

      <div className="hidden group-hover:flex flex-col gap-4 text-[#F9FAFB]">
        <Icon className="w-10 h-10 text-[#3B82F6]" />
        <span className="font-bold text-2xl">{name}</span>

        <span className="text-justify text-[#CBD5E1]">{description}</span>

        <ul className="list-disc pl-6 text-[#CBD5E1] space-y-1">
          {tasks.map((task, i) => (
            <li key={i}>{task}</li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-0 right-0 m-9">
        <span className="text-3xl font-bold text-[#3B82F6]">
          {index < 9 ? `0${index + 1}` : `${index + 1}`}
        </span>
      </div>
    </div>
  );
};

export function AboutSection(
  props: Omit<React.ComponentProps<typeof SectionLayout>, "children">
) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <SectionLayout className="flex w-full h-full bg-[#0F172A]" {...props}>
      {/* Controles */}
      <div className="flex flex-col justify-center items-center h-full min-w-[200px] bg-[#0F172A]">
        <div className="flex gap-3 min-w-fit">
          <CircularIconButton
            icon={<ChevronLeft className="text-[#F9FAFB]" />}
            ariaLabel="left"
            onClick={scrollLeft}
          />

          <CircularIconButton
            icon={<ChevronRight className="text-[#F9FAFB]" />}
            ariaLabel="right"
            onClick={scrollRight}
          />
        </div>
      </div>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex h-full w-full overflow-x-auto scroll-smooth no-scrollbar bg-[#0F172A]"
      >
        {developers.map((dev, index) => (
          <Card
            key={dev.id}
            index={index}
            name={dev.name}
            rol={dev.rol}
            Icon={dev.Icon}
            description={dev.description}
            tasks={dev.tasks}
          />
        ))}
      </div>
    </SectionLayout>
  );
}
