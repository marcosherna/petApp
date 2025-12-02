import React, { useRef } from "react";
import SectionLayout from "../layout/SectionLayout";
import { CircularIconButton } from "../../components";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Dna,
  Filter,
  Heart,
  MapPin,
  Palette,
  Rocket,
  Smartphone,
  Target,
} from "lucide-react";

export function InfoSection(
  props: Omit<React.ComponentProps<typeof SectionLayout>, "children">
) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const totalSections = 3;

  const goToSection = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const sectionWidth = container.clientWidth;
    const currentScroll = container.scrollLeft;

    const currentIndex = Math.round(currentScroll / sectionWidth);

    let nextIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

    nextIndex = Math.max(0, Math.min(nextIndex, totalSections - 1));

    container.scrollTo({
      left: nextIndex * sectionWidth,
      behavior: "smooth",
    });
  };

  return (
    <SectionLayout className="flex w-full h-full bg-amber-200" {...props}>
      <div className="flex flex-col justify-center items-center h-full bg-[#0F172A] min-w-[200px]">
        <div className="flex gap-3 min-w-fit">
          <CircularIconButton
            icon={<ChevronLeft className="text-[#F9FAFB]" />}
            ariaLabel="left"
            onClick={() => goToSection("left")}
            className="bg-[#1E293B] hover:bg-[#334155] text-[#F9FAFB] border border-[#334155]"
          />

          <CircularIconButton
            icon={<ChevronRight className="text-[#F9FAFB]" />}
            ariaLabel="right"
            onClick={() => goToSection("right")}
            className="bg-[#1E293B] hover:bg-[#334155] text-[#F9FAFB] border border-[#334155]"
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex h-full w-full overflow-x-auto scroll-smooth no-scrollbar"
      >
        <section className="flex flex-col justify-center h-full w-full flex-shrink-0 bg-[#0F172A] px-6 py-12">
          <div className="space-y-6">
            <h2 className="text-[#F9FAFB] text-3xl font-extrabold">
              ¿Qué es <span className="text-[#3B82F6]">PetMark</span>?
            </h2>

            <p className="text-[#CBD5E1] text-base leading-relaxed bg-[#1E293B] p-4 rounded-xl shadow">
              PetMark es una app móvil donde la comunidad comparte y descubre
              productos para mascotas con fotos reales, precios actualizados y
              la tienda donde los encontraron. Todo acompañado de ubicación en
              el mapa, comentarios y una experiencia moderna con modo oscuro.
            </p>

            <div className="text-left  p-5 space-y-3">
              <h3 className="text-[#3B82F6] font-bold text-lg">
                La marca transmite:
              </h3>

              <ul className="text-[#CBD5E1] space-y-1">
                <li>
                  •{" "}
                  <span className="font-medium text-[#F9FAFB]">Confianza</span>{" "}
                  — productos reales de usuarios reales
                </li>
                <li>
                  • <span className="font-medium text-[#F9FAFB]">Cercanía</span>{" "}
                  — todo está en tu comunidad
                </li>
                <li>
                  •{" "}
                  <span className="font-medium text-[#F9FAFB]">
                    Descubrimiento
                  </span>{" "}
                  — explora, filtra, encuentra
                </li>
                <li>
                  • <span className="font-medium text-[#F9FAFB]">Cuidado</span>{" "}
                  — las mascotas son el centro emocional
                </li>
              </ul>
            </div>

            <div className="flex flex-row items-center justify-end">
              <div className="inline-block px-6 py-2  text-white font-semibold shadow-md">
                Tu comunidad, tus mascotas, tus hallazgos.
              </div>

              <span className="text-3xl font-bold text-white">01</span>
            </div>
          </div>
        </section>
        <section className="flex items-center h-full w-full flex-shrink-0 bg-[#0F172A] px-8 py-6">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#F9FAFB]">
              Misión, Visión y Valores
            </h2>

            <div className="flex flex-row gap-3">
              {/* Misión */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold flex items-center gap-2 text-[#3B82F6]">
                  <Target className="w-6 h-6" />
                  Misión
                </h3>

                <div className="bg-[#1E293B] p-6 rounded-2xl shadow space-y-3 border border-[#334155]">
                  <p className="text-[#CBD5E1] leading-relaxed">
                    Conectar a los amantes de mascotas con los mejores productos
                    cercanos, mediante una plataforma visual, colaborativa y
                    confiable.
                  </p>
                </div>
              </div>

              {/* Visión */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold flex items-center gap-2 text-[#3B82F6]">
                  <Rocket className="w-6 h-6" />
                  Visión
                </h3>

                <div className="bg-[#1E293B] p-6 rounded-2xl shadow space-y-3 border border-[#334155]">
                  <p className="text-[#CBD5E1] leading-relaxed">
                    Ser la comunidad líder donde las personas encuentran,
                    califican y recomiendan productos para sus mascotas en
                    cualquier ciudad.
                  </p>
                </div>
              </div>
            </div>

            {/* Valores */}
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[#3B82F6]">
                <Dna className="w-6 h-6" />
                Valores
              </h3>

              <ul className="text-[#CBD5E1] list-disc list-outside ml-6 space-y-2">
                <li>
                  <span className="font-semibold text-[#F9FAFB]">
                    Transparencia:
                  </span>{" "}
                  Información real compartida por usuarios.
                </li>
                <li>
                  <span className="font-semibold text-[#F9FAFB]">
                    Amor por las mascotas:
                  </span>{" "}
                  Todas las decisiones giran alrededor de su bienestar.
                </li>
                <li>
                  <span className="font-semibold text-[#F9FAFB]">
                    Comunidad:
                  </span>{" "}
                  Personas ayudando a personas a encontrar lo mejor para sus
                  mascotas.
                </li>
                <li>
                  <span className="font-semibold text-[#F9FAFB]">
                    Innovación:
                  </span>{" "}
                  Experiencia moderna, filtros inteligentes y mapa interactivo.
                </li>
              </ul>
            </div>

            <div className="flex justify-end">
              <span className="text-3xl font-bold text-white">02</span>
            </div>
          </div>
        </section>

        <section className="flex items-center h-full w-full flex-shrink-0 bg-[#0F172A] px-8 py-6">
          <div className="space-y-8 w-full max-w-5xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#F9FAFB]">
              Tecnologías utilizadas
            </h2>

            {/* Grid de tecnologías */}
            <div className="grid grid-cols-3 gap-4">
              {/* App móvil */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow space-y-4 hover:bg-[#243041] transition">
                <Smartphone className="w-8 h-8 text-[#3B82F6]" />
                <h3 className="text-xl font-semibold text-[#F9FAFB]">
                  Aplicación móvil
                </h3>
                <p className="text-[#CBD5E1] text-sm leading-relaxed">
                  App diseñada con enfoque mobile-first y una experiencia limpia
                  y rápida.
                </p>
              </div>

              {/* Firebase */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow space-y-4 hover:bg-[#243041] transition">
                <Database className="w-8 h-8 text-[#3B82F6]" />
                <h3 className="text-xl font-semibold text-[#F9FAFB]">
                  Firebase
                </h3>
                <p className="text-[#CBD5E1] text-sm leading-relaxed">
                  Autenticación, base de datos en tiempo real, storage y backend
                  serverless.
                </p>
              </div>

              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow space-y-4 hover:bg-[#243041] transition">
                <Palette className="w-8 h-8 text-[#3B82F6]" />
                <h3 className="text-xl font-semibold text-[#F9FAFB]">CSS</h3>
                <p className="text-[#CBD5E1] text-sm leading-relaxed">
                  Estilos personalizados con CSS puro para lograr una interfaz
                  moderna y consistente.
                </p>
              </div>

              {/* Mapas */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow space-y-4 hover:bg-[#243041] transition">
                <MapPin className="w-8 h-8 text-[#3B82F6]" />
                <h3 className="text-xl font-semibold text-[#F9FAFB]">Mapas</h3>
                <p className="text-[#CBD5E1] text-sm leading-relaxed">
                  Geolocalización y marcadores de tiendas para productos subidos
                  por usuarios.
                </p>
              </div>

              {/* Filtros */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow space-y-4 hover:bg-[#243041] transition">
                <Filter className="w-8 h-8 text-[#3B82F6]" />
                <h3 className="text-xl font-semibold text-[#F9FAFB]">
                  Filtros inteligentes
                </h3>
                <p className="text-[#CBD5E1] text-sm leading-relaxed">
                  Filtrado por tienda, categoría, precio y relevancia en tiempo
                  real.
                </p>
              </div>

              {/* Favoritos */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow space-y-4 hover:bg-[#243041] transition">
                <Heart className="w-8 h-8 text-[#3B82F6]" />
                <h3 className="text-xl font-semibold text-[#F9FAFB]">
                  Favoritos
                </h3>
                <p className="text-[#CBD5E1] text-sm leading-relaxed">
                  Sistema social para guardar, comentar y consultar productos
                  destacados.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <span className="text-3xl font-bold text-white">03</span>
            </div>
          </div>
        </section>
      </div>
    </SectionLayout>
  );
}
