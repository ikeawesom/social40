import React from "react";
import { twMerge } from "tailwind-merge";

type CardType = {
  children?: React.ReactNode;
  className?: string;
};
export default function DefaultCard({ children, className }: CardType) {
  return (
    <div className={twMerge("bg-white shadow-sm p-4 rounded-lg", className)}>
      {children}
    </div>
  );
}
