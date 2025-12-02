import React, { useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

import SectionLayout from "../layout/SectionLayout";
import { CircularIconButton } from "../../components";

const developers = [
  {
    id: 1,
    name: "Product",
    icon: "🧬",
    rol: "Watch Video",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    tasks: ["disenia", "backend", "otro"],
  },
  {
    id: 2,
    name: "Performance",
    icon: "📡",
    rol: "Better than Quantum Computing.",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    tasks: ["disenia", "backend", "otro"],
  },
  {
    id: 3,
    name: "Media",
    icon: "▶️",
    rol: "Show More",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    tasks: ["disenia", "backend", "otro"],
  },
  {
    id: 4,
    name: "Process",
    icon: "🧪",
    rol: "New Scientific Discoveries",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    tasks: ["disenia", "backend", "otro"],
  },
];

const Card = ({
  index,
  name,
  rol,
  icon,
  description,
  tasks,
}: {
  index: number;
  name: string;
  rol: string;
  icon: string;
  description: string;
  tasks: string[];
}) => {
  return (
    <div
      className="
      relative
        group flex items-center h-full min-w-[30%]
        bg-amber-950 hover:bg-amber-800 p-14 transition-colors
      "
    >
      {/* Sin hover */}
      <div className="flex flex-col gap-4 group-hover:hidden text-white">
        <span className="text-3xl">{icon}</span>
        <span className="font-bold text-2xl">{name}</span>
        <span className="opacity-80">{rol}</span>
      </div>

      {/* Con hover */}
      <div className="hidden group-hover:flex flex-col gap-4 text-white">
        <span className="text-3xl">{icon}</span>
        <span className="font-bold text-2xl">{name}</span>

        <span className="text-justify">{description}</span>

        <ul className="list-disc pl-6">
          {tasks.map((task, i) => (
            <li key={i}>{task}</li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-0 right-0 m-9">
        <span className="text-3xl font-bold text-white">
          {index < 10 ? `0${index + 1}` : `${index + 1}`}
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
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <SectionLayout className="flex w-full h-full bg-amber-200" {...props}>
      <div className="flex flex-col justify-center items-center h-full bg-red-400 min-w-[200px]">
        <div className="flex gap-3 min-w-fit">
          <CircularIconButton
            icon={<ChevronLeft />}
            ariaLabel="left"
            onClick={scrollLeft}
          />

          <CircularIconButton
            icon={<ChevronRight />}
            ariaLabel="right"
            onClick={scrollRight}
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex h-full w-full overflow-x-auto bg-amber-600 scroll-smooth no-scrollbar"
      >
        {developers.map((dev, index) => (
          <Card
            key={index}
            index={index}
            name={dev.name}
            rol={dev.rol}
            icon={dev.icon}
            description={dev.description}
            tasks={dev.tasks}
          />
        ))}
      </div>
    </SectionLayout>
  );
}
