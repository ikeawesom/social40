import React from "react";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-custom-background min-h-screen w-full lg:px-28 md:px-8 p-4">
      {children}
    </div>
  );
}
