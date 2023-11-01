"use client";
import React from "react";
import { authHandler } from "@/src/firebase/auth";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "@/src/firebase/config";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function SignoutButton({
  height,
  width,
  absolute,
}: {
  height?: number;
  width?: number;
  absolute?: boolean;
}) {
  const handleSignout = async () => {
    const auth = getAuth(FIREBASE_APP);
    const res = await authHandler.signOutUser(auth);
    if (!res.status) toast.error(res.data);
  };
  return (
    <Image
      src="/icons/icon_signout.svg"
      width={height ? height : 35}
      height={height ? height : 35}
      alt="Sign Out"
      onClick={handleSignout}
      className={twMerge(
        "rounded-full cursor-pointer",
        absolute ? "absolute top-2 right-2" : ""
      )}
    />
  );
}
