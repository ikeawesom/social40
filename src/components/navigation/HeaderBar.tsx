"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { MAX_LENGTH } from "@/src/utils/constants";
import { toast } from "sonner";

export default function HeaderBar({
  text,
  back,
}: {
  text: string;
  back?: boolean;
}) {
  useEffect(() => {
    sessionStorage.setItem("pathname", window.location.pathname);
  }, []);

  const router = useRouter();

  const handleReload = () => {
    try {
      router.replace("/reloading");
    } catch (err: any) {
      toast.error("An error has occurred.");
      router.refresh();
      // router.back();
    }
  };

  return (
    <div
      className={twMerge(
        "w-full bg-white shadow-sm fixed top-0 left-0 p-2 flex items-center justify-start gap-x-4 z-40",
        !back ? "px-4" : ""
      )}
    >
      {back && (
        <Image
          onClick={() => {
            router.back();
            router.refresh();
          }}
          src="/icons/navigation/icon_back.svg"
          className="cursor-pointer"
          alt="Back"
          width={30}
          height={30}
        />
      )}
      <Image
        onClick={handleReload}
        src="/icons/navigation/icon_reload.svg"
        className="cursor-pointer justify-self-end"
        alt="Reload"
        width={20}
        height={20}
      />
      <h1 className="font-semibold text-custom-dark-text w-full text-start">
        {text.length > MAX_LENGTH - 4
          ? text.substring(0, MAX_LENGTH - 4 - 3) + "..."
          : text}
      </h1>
    </div>
  );
}
