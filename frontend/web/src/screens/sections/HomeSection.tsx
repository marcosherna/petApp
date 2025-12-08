import SectionLayout from "../layout/SectionLayout";
import React from "react";

export function HomeSection(
  props: Omit<React.ComponentProps<typeof SectionLayout>, "children">
) {
  return (
    <SectionLayout className="flex justify-center items-center" {...props}>
      <span>this is home section</span>
    </SectionLayout>
  );
}
