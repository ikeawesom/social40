import Link from "next/link";
import React from "react";

type GroupItemType = {
  title: string;
  subtitle: string;
};

export default function GroupItem({ title, subtitle }: GroupItemType) {
  return (
    <Link
      href={`/groups/${title}`}
      className="flex flex-col items-start justify-center w-full bg-white rounded-lg py-2 px-4 shadow-md hover:brightness-95 duration-300"
      key={title}
    >
      <h1 className="font-bold text-lg">{title}</h1>
      <p className="text-xs text-custom-grey-text">{subtitle}</p>
    </Link>
  );
}
