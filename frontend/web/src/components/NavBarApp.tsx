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
    <nav className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center w-full py-4 px-8 backdrop-blur-sm ">
      <Logo />

      <ul className="flex space-x-8 font-medium text-gray-700">
        <li
          className={`cursor-pointer hover:text-indigo-600 transition ${
            !currentPage || currentPage === "home" ? "text-indigo-700" : ""
          }`}
          onClick={() => onNavigate("home")}
        >
          Inicio
        </li>

        <li
          className={`cursor-pointer hover:text-indigo-600 transition ${
            currentPage && currentPage === "about" ? "text-indigo-700" : ""
          }`} 
          onClick={() => onNavigate("about")}
        >
          About
        </li>
      </ul>

      <div className="md:hidden">
        <Menu size={24} />
      </div>
    </nav>
  );
}
