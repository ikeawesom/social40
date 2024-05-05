"use client";
import React from "react";
import ReturnHomeButton from "../utils/ReturnHomeButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SecondaryButton from "../utils/SecondaryButton";
import { handleReload } from "../navigation/HeaderBar";

export default function ServerErrorScreen({ eMsg }: { eMsg?: string }) {
  const router = useRouter();

  return (
    <div className="grid place-items-center h-[50vh]">
      <div className="flex flex-col gap-5 items-center justify-center max-w-[500px]">
        <div className="flex flex-col gap-1 items-center justify-center">
          <Image
            src="/icons/icon_error.svg"
            height={100}
            width={100}
            alt="Error"
          />
          <p className="text-center text-custom-grey-text">
            Seems like we ran into a server error. Please contact the
            administrator or restart the app.
          </p>
          <p className="text-center text-custom-grey-text">
            {eMsg && `ERROR: ${eMsg}`}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-full gap-2">
          <SecondaryButton
            className="w-full max-w-[200px]"
            onClick={() => handleReload(router)}
          >
            Refresh
          </SecondaryButton>
          <ReturnHomeButton />
        </div>
      </div>
    </div>
  );
}
