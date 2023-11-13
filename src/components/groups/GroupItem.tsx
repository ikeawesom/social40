import React from "react";
import Link from "next/link";

type GroupItemType = {
  title: string;
  subtitle: string;
};

export default function GroupItem({ title, subtitle }: GroupItemType) {
  const route = `/groups/${title}`;
  return (
    <Link
      href={route}
      className="flex flex-col items-start justify-center w-full bg-white rounded-lg py-2 px-3 shadow-sm hover:brightness-95 duration-300 cursor-pointer"
      key={title}
    >
      <h1 className="font-medium text-base">{title}</h1>
      <p className="text-xs text-custom-grey-text">{subtitle}</p>
    </Link>
  );
}
