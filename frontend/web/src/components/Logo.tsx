import { PawPrint } from "lucide-react";

export default function Logo() {
  return (
    <span className="flex flex-row items-center gap-3 select-none">
      <PawPrint
        size={26}
        className="
        text-blue-500
          p-0.5 rounded-md
        "
      />

      <h3
        className="
          font-bold text-lg 
          tracking-wide 
          text-[#F1F5F9]
        "
      >
        PetMark
      </h3>
    </span>
  );
}
