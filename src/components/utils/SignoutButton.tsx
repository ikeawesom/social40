"use client";
import React from "react";
import PrimaryButton from "./PrimaryButton";
import { authHandler } from "@/src/firebase/auth";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "@/src/firebase/config";

export default function SignoutButton() {
  const handleSignout = async () => {
    const auth = getAuth(FIREBASE_APP);
    const res = await authHandler.signOutUser(auth);
    if (!res.status) toast.error(res.data);
  };
  return <PrimaryButton onClick={handleSignout}>Sign out</PrimaryButton>;
}
