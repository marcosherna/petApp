import React from "react";

export default function SectionLayout({
  className = "",
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="SectionLayout"
      className={`h-screen ${className}`}
      {...props}
    />
  );
}
