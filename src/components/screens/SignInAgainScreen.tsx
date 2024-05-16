"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SignoutButton from "../utils/SignoutButton";
import { useRouter } from "next/navigation";
import LoadingScreenSmall from "./LoadingScreenSmall";
import { useTimer } from "@/src/hooks/useTimer";
import { useAuth } from "@/src/contexts/AuthContext";

export default function SignInAgainScreen() {
  const [loading, setLoading] = useState(true);
  const { seconds } = useTimer(10);
  const { memberID } = useAuth();

  const router = useRouter();
  useEffect(() => {
    const duration = 1400;

    const id = localStorage.getItem("localMemberID");
    router.refresh();
    if (id) {
      setTimeout(() => {
        router.push("/home", { scroll: false });
      }, duration);
    } else {
      setTimeout(() => {
        router.push("/auth", { scroll: false });
      }, duration);
    }
  }, [memberID]);

  useEffect(() => {
    if (seconds < 2) router.push("/auth", { scroll: false });
  }, [seconds]);

  if (loading)
    return <LoadingScreenSmall text={`Re-authenticating: ${seconds}s`} />;

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
