import React from "react";
import { useRouter } from "next/navigation";

type GroupItemType = {
  title: string;
  subtitle: string;
};

export default function GroupItem({ title, subtitle }: GroupItemType) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/groups/${title}`, { scroll: false })}
      className="flex flex-col items-start justify-center w-full bg-white rounded-lg py-2 px-3 shadow-sm hover:brightness-95 duration-300"
      key={title}
    >
      <h1 className="font-semibold text-base">{title}</h1>
      <p className="text-xs text-custom-grey-text">{subtitle}</p>
    </div>
  );
}
