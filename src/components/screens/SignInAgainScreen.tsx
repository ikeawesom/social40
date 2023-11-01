import React from "react";
import Image from "next/image";
import SignoutButton from "../utils/SignoutButton";
export default function SignInAgainScreen() {
  return (
    <div className="grid place-items-center h-[50vh]">
      <div className="flex flex-col gap-3 items-center justify-center">
        <Image
          src="/icons/icon_lock.svg"
          height={150}
          width={150}
          alt="Error"
        />
        <p className="text-center text-custom-grey-text text-xl">
          Due to security measures, you need to sign in again.
        </p>
        <SignoutButton width={80} height={80} />
      </div>
    </div>
  );
}
