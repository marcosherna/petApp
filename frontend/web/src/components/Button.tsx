import { ChevronRight } from "lucide-react";
import React from "react";

interface ButtonProps {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ label, icon, onClick, disabled }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        flex items-center overflow-hidden rounded-xl
        border-2 border-amber-500
        bg-white dark:bg-[#0F172A]
        shadow-sm
        transition-all duration-200
        hover:bg-amber-500/10 hover:border-amber-600 hover:shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {label && (
        <span className="
            px-4 py-2 font-semibold 
            text-amber-700 dark:text-amber-300
            tracking-wide
        ">
          {label}
        </span>
      )}

      <span
        className="
          flex items-center justify-center 
          px-4 py-2
          bg-amber-500 text-white
          dark:bg-amber-600
          transition-colors duration-200
          hover:bg-amber-600 dark:hover:bg-amber-700
        "
      >
        {icon ?? <ChevronRight className="text-white" />}
      </span>
    </button>
  );
}
