import React from "react";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-custom-background min-h-screen w-full lg:py-10 lg:px-28 md:px-8 md:py-4 p-2">
      {children}
    </div>
  );
}
