"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SecondaryButton from "./SecondaryButton";
import { LoadingIconBright } from "./LoadingIcon";
import { twMerge } from "tailwind-merge";
import { handleSignOut } from "@/src/contexts/AuthContext";

export default function SignoutButton({
  height,
  width,
  textStyle,
  text,
}: {
  height?: number;
  width?: number;
  textStyle?: string;
  text?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signOutFunction = async () => {
    setLoading(true);
    await handleSignOut();
    router.push(`/auth?${new URLSearchParams({ new_user: "false" })}`, {
      scroll: false,
    });
  };

  return (
    <SecondaryButton
      className="grid place-items-center bg-custom-red border-0"
      onClick={signOutFunction}
      disabled={loading}
    >
      {loading ? (
        <LoadingIconBright
          width={width ? width : 20}
          height={height ? height : 20}
        />
      ) : (
        <div className="flex items-center justify-center gap-2">
          <p
            className={twMerge(
              "font-semibold text-custom-light-text",
              textStyle
            )}
          >
            {text ? text : "Sign out"}
          </p>
          <Image
            src="/icons/icon_signout.svg"
            width={width ? width : 20}
            height={height ? height : 20}
            alt="Sign Out"
            className="rounded-full cursor-pointer"
          />
        </div>
      )}
    </SecondaryButton>
  );
}
