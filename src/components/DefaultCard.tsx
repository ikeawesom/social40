import React from "react";
import { twMerge } from "tailwind-merge";

type CardType = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};
export default function DefaultCard({
  children,
  className,
  onClick,
}: CardType) {
  return (
    <div
      onClick={onClick}
      className={twMerge("bg-white shadow-sm p-4 rounded-lg", className)}
    >
      {children}
    </div>
  );
}
