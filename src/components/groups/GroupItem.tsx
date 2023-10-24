import React from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

type GroupItemType = {
  title: string;
  subtitle: string;
  className?: string;
};

export default function GroupItem({
  title,
  subtitle,
  className,
}: GroupItemType) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/groups/${title}`, { scroll: false })}
      className={twMerge(
        "flex flex-col items-start justify-center w-full bg-white rounded-lg py-2 px-3 shadow-sm hover:brightness-95 duration-300",
        className
      )}
      key={title}
    >
      <h1 className="font-medium text-base">{title}</h1>
      <p className="text-xs text-custom-grey-text">{subtitle}</p>
    </div>
  );
}
