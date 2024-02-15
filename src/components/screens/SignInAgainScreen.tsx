"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SignoutButton from "../utils/SignoutButton";
import { useRouter } from "next/navigation";
import LoadingScreenSmall from "./LoadingScreenSmall";

export default function SignInAgainScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      const id = localStorage.getItem("localMemberID");
      if (id) {
        router.refresh();
        router.push("/home");
        localStorage.removeItem("localMemberID");
      }

      setTimeout(() => {
        setLoading(false);
      }, 1400);
    }, 2000);
  }, []);

  if (loading) return <LoadingScreenSmall />;
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
        <SignoutButton
          textStyle="text-lg"
          width={25}
          height={25}
          text="Continue"
        />
      </div>
    </div>
  );
}
