import React from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

type GroupItemType = {
  title: string;
  subtitle: string;
  className?: string;
  link?: string;
};

export default function GroupItem({
  title,
  subtitle,
  className,
  link,
}: GroupItemType) {
  const router = useRouter();
  const route = link ? link : `/groups/${title}`;
  return (
    <div
      onClick={() => router.push(route, { scroll: false })}
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
