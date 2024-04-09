import React from "react";
import { twMerge } from "tailwind-merge";

export default function AnnouncementTag({
  className,
  children,
  onClick,
  isDelete,
}: {
  className?: string;
  children?: React.ReactNode;
  isDelete?: boolean;
  onClick?: () => void;
}) {
  return (
    <p
      className={twMerge(
        "cursor-default text-sm px-2 py-1 rounded-md bg-custom-grey-text/90 text-custom-light-text",
        className
      )}
    >
      {children ? children : "text"}
      {isDelete && (
        <span
          onClick={onClick}
          className="hover:brightness-90 cursor-pointer font-bold bg-white text-custom-grey-text/90 px-1 rounded-md ml-1"
        >
          {"x"}
        </span>
      )}
    </p>
  );
}
