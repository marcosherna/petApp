import { Menu } from "lucide-react";
import Logo from "./Logo";
import { usePageTransition } from "../hooks/usePageTransition";

export default function NavBarApp({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const { currentPage } = usePageTransition();

  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-10 
        flex justify-between items-center 
        w-full py-4 px-8 
        backdrop-blur-lg bg-[#0F172A]/70 
        border-b border-[#1E293B]
      "
    >
      <Logo />

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-10 font-medium text-[#CBD5E1]">
        <li
          className={`
            cursor-pointer transition 
            hover:text-[#3B82F6]
            ${!currentPage || currentPage === "home" ? "text-[#3B82F6]" : ""}
          `}
          onClick={() => onNavigate("home")}
        >
          Inicio
        </li>

        <li
          className={`
            cursor-pointer transition 
            hover:text-[#3B82F6]
            ${!currentPage || currentPage === "info" ? "text-[#3B82F6]" : ""}
          `}
          onClick={() => onNavigate("info")}
        >
          Informacion
        </li>

        <li
          className={`
            cursor-pointer transition 
            hover:text-[#3B82F6]
            ${currentPage === "about" ? "text-[#3B82F6]" : ""}
          `}
          onClick={() => onNavigate("about")}
        >
          Sobre el Proyecto
        </li>
      </ul>

      {/* Mobile Menu Icon */}
      <div className="md:hidden cursor-pointer">
        <Menu size={26} className="text-[#F1F5F9]" />
      </div>
    </nav>
  );
}
