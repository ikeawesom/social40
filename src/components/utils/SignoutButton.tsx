"use client";
import React from "react";
import { authHandler } from "@/src/firebase/auth";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "@/src/firebase/config";
import Image from "next/image";

export default function SignoutButton() {
  const handleSignout = async () => {
    const auth = getAuth(FIREBASE_APP);
    const res = await authHandler.signOutUser(auth);
    if (!res.status) toast.error(res.data);
  };
  return (
    <Image
      src="/icons/icon_signout.svg"
      width={35}
      height={35}
      alt="Sign Out"
      onClick={handleSignout}
      className="rounded-full cursor-pointer absolute top-2 right-2"
    />
  );
}
