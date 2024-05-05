import React from "react";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

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
    <div
      className={twMerge(
        "flex items-center justify-start gap-1 px-2 py-1 bg-custom-grey-text text-white rounded-md cursor-default hover:brightness-95 text-sm",
        className
      )}
    >
      {children ? children : "text"}
      {isDelete && (
        <div
          onClick={onClick}
          className="bg-white/60 p-1 rounded-full hover:bg-white"
        >
          <Image src="/icons/icon_close.svg" alt="Close" width={8} height={8} />
        </div>
      )}
    </div>
  );
}
