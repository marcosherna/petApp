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
        flex items-center overflow-hidden
        border-2 border-red-500 rounded-lg
        transition-all duration-200
        hover:bg-red-500/10
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    > 
      {label && (
        <span className="px-4 py-2 font-medium text-red-600">{label}</span>
      )}
 
      <span
        className="
          flex items-center justify-center 
          px-4 py-2
          bg-red-500/40 text-white
          transition-colors duration-200
          group-hover:bg-red-600
        "
      >
        {icon ?? <ChevronRight className="text-white" />}
      </span>
    </button>
  );
}
