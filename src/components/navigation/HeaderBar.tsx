"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function HeaderBar({
  text,
  back,
}: {
  text: string;
  back?: boolean;
}) {
  const router = useRouter();
  return (
    <div
      className={twMerge(
        "w-full bg-white shadow-sm fixed top-0 left-0 py-2 px-2 flex items-center justify-start gap-x-2 z-40",
        !back ? "px-4" : ""
      )}
    >
      {back && (
        <Image
          onClick={() => router.back()}
          src="/icons/navigation/icon_back.svg"
          alt="Back"
          width={30}
          height={30}
        />
      )}
      <h1 className="text-xl font-bold text-custom-dark-text">{text}</h1>
    </div>
  );
}
