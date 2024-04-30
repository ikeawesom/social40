"use client";
import React from "react";
import ReturnHomeButton from "../utils/ReturnHomeButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SecondaryButton from "../utils/SecondaryButton";
import { handleReload } from "../navigation/HeaderBar";

export default function OfflineScreen() {
  const router = useRouter();

  return (
    <div className="grid place-items-center h-[50vh]">
      <div className="flex flex-col gap-5 items-center justify-center max-w-[500px]">
        <div className="flex flex-col gap-1 items-center justify-center">
          <Image
            src="/icons/icon_no-wifi.svg"
            height={100}
            width={100}
            alt="No Internet Connection"
          />
          <p className="text-center text-custom-grey-text">
            Seems like your connection is unstable. Please check your internet
            connection or try again later.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-fit gap-2">
          <SecondaryButton onClick={() => handleReload(router)}>
            Refresh
          </SecondaryButton>
          <ReturnHomeButton />
        </div>
      </div>
    </div>
  );
}
