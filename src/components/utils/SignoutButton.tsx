"use client";
import React from "react";
import PrimaryButton from "./PrimaryButton";
import { authHandler } from "@/src/firebase/auth";
import { toast } from "sonner";

export default function SignoutButton() {
  const handleSignout = async () => {
    const res = await authHandler.signOutUser();
    if (!res.status) toast.error(res.data);
  };
  return <PrimaryButton onClick={handleSignout}>Sign out</PrimaryButton>;
}
