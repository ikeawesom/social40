import React from "react";
import Image from "next/image";

export default function ErrorActivities({ text }: { text?: string }) {
  return (
    <div className="grid place-items-center min-h-[30vh]">
      <div className="flex w-full items-center justify-center gap-4 flex-col">
        <Image
          alt="Activities"
          src="/icons/features/icon_activities_active.svg"
          width={100}
          height={100}
        />
        <h1 className="text-lg text-custom-dark-text text-center">
          {text
            ? text
            : "An unexpected error occurred when searching for your activities. If this error persists, please contact the administrator."}
        </h1>
      </div>
    </div>
  );
}
