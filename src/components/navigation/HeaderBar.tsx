"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { MAX_LENGTH } from "@/src/utils/settings";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import LoadingIcon from "../utils/LoadingIcon";
import SecondaryButton from "../utils/SecondaryButton";

export const handleReload = (router: AppRouterInstance) => {
  router.refresh();
  router.push("/reloading", { scroll: false });
};

export default function HeaderBar({
  text,
  back,
}: {
  text: string;
  back?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const toggleLoad = () => {
    setLoading(true);
    handleReload(router);
  };
  useEffect(() => {
    sessionStorage.setItem("url", window.location.href);
  }, []);

  const router = useRouter();

  return (
    <div
      className={twMerge(
        "w-full bg-white shadow-sm fixed top-0 left-0 p-2 flex items-center justify-start gap-x-2 z-40",
        !back ? "px-4" : ""
      )}
    >
      {back && (
        <SecondaryButton className="w-fit p-0">
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
        </SecondaryButton>
      )}

      <SecondaryButton disabled={loading} className="w-fit p-1">
        {loading ? (
          <LoadingIcon width={20} height={20} />
        ) : (
          <Image
            onClick={toggleLoad}
            src="/icons/navigation/icon_reload.svg"
            className="cursor-pointer justify-self-end"
            alt="Reload"
            width={20}
            height={20}
          />
        )}
      </SecondaryButton>
      <h1 className="font-semibold text-custom-dark-text w-full text-start">
        {text.length > MAX_LENGTH - 4
          ? text.substring(0, MAX_LENGTH - 4 - 3) + "..."
          : text}
      </h1>
    </div>
  );
}
