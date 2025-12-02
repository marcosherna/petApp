import React from "react";
import type { JSX, SVGProps } from "react";
import type { Icon as LucideIcon } from "lucide-react";

export type Size = "sm" | "md" | "lg";
export type Variant = "solid" | "outline" | "ghost" | "danger";

export type LucideIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

interface CircularIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: Size;
  variant?: Variant;
  ariaLabel: string;
  loading?: boolean;
}

const sizeMap: Record<Size, string> = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
};

const variantMap: Record<Variant, string> = {
  solid:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-300",
  outline:
    "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-primary-300",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-primary-300",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-300",
};

export function CircularIconButton({
  icon: Icon,
  size = "md",
  variant = "solid",
  ariaLabel,
  className = "",
  loading = false,
  disabled = false,
  ...rest
}: CircularIconButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full transition-shadow focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      type={rest.type ?? "button"}
      aria-label={ariaLabel}
      className={`${base} ${sizeMap[size]} ${variantMap[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {Icon}
    </button>
  );
}

/*
USO (ejemplos):

import { Trash2, Plus, Search } from "lucide-react";
import CircularIconButton from "./CircularIconButton";

<CircularIconButton icon={Plus} ariaLabel="Agregar" size="md" variant="solid" onClick={() => {}} />
<CircularIconButton icon={Trash2} ariaLabel="Eliminar" size="sm" variant="danger" />
<CircularIconButton icon={Search} ariaLabel="Buscar" size="lg" variant="outline" />

Ajustes recomendados en tailwind.config.js:
- definir colores custom: primary-600, primary-700, primary-300
- habilitar "@tailwindcss/forms" si usas inputs
*/
