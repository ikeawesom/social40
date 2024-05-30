"use client";
import React from "react";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

export default function CreateActivityButton({
  className,
  groupID,
}: {
  className?: string;
  groupID: string;
}) {
  const router = useRouter();
  const params = new URLSearchParams({ create: "true" });
  const route = `/groups/${groupID}/activity?${params}`;

  return (
    <PrimaryButton
      className={twMerge("flex items-center justify-center w-fit", className)}
      onClick={() => router.push(route, { scroll: false })}
    >
      Create Activity
      <Image src="/icons/icon_right_bright.svg" alt="" width={20} height={20} />
    </PrimaryButton>
  );
}
