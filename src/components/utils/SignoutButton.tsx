"use client";
import React, { useState } from "react";
import { authHandler } from "@/src/firebase/auth";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "@/src/firebase/config";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import SecondaryButton from "./SecondaryButton";
import { LoadingIconBright } from "./LoadingIcon";

export default function SignoutButton({
  height,
  width,
}: {
  height?: number;
  width?: number;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSignout = async () => {
    setLoading(true);
    const auth = getAuth(FIREBASE_APP);
    const res = await authHandler.signOutUser(auth);
    if (!res.status) {
      toast.error(res.data);
      setLoading(false);
    } else {
      router.push(`/auth?${new URLSearchParams({ new_user: "false" })}`);
    }
  };
  return (
    <SecondaryButton
      className="grid place-items-center bg-custom-red border-0"
      onClick={handleSignout}
    >
      {loading ? (
        <LoadingIconBright width={20} height={20} />
      ) : (
        <div className="flex items-center justify-center gap-2">
          <p className="text-lg font-semibold text-custom-light-text">
            Sign out
          </p>
          <Image
            src="/icons/icon_signout.svg"
            width={width ? width : 25}
            height={height ? height : 25}
            alt="Sign Out"
            className="rounded-full cursor-pointer"
          />
        </div>
      )}
    </SecondaryButton>
  );
}
