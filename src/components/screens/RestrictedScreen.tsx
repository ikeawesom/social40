import React from "react";
import ReturnHomeButton from "../utils/ReturnHomeButton";
import Image from "next/image";

export default function RestrictedScreen() {
  return (
    <div className="grid place-items-center h-[50vh]">
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="flex-flex-col gap-1 items-center justify-center">
          <div className="grid place-items-center">
            <Image
              src="/icons/icon_error.svg"
              width={200}
              height={200}
              alt="ERROR"
              className="text-center"
            />
          </div>

          <h1 className="text-center text-4xl font-bold text-custom-dark-text">
            Forbidden
          </h1>
          <p className="text-center text-custom-grey-text">
            Looks like you do not have access to this page! Please contact your
            commander for further assistance.
          </p>
        </div>
        <ReturnHomeButton />
      </div>
    </div>
  );
}
