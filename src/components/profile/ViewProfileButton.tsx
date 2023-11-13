"use client";
import React from "react";
import { useRouter } from "next/navigation";
import SecondaryButton from "../utils/SecondaryButton";

export default function ViewProfileButton({ memberID }: { memberID: string }) {
  const router = useRouter();
  return (
    <SecondaryButton
      className="flex-1 border-custom-orange text-custom-orange"
      onClick={() => router.push(`/members/${memberID}`, { scroll: false })}
    >
      View Public Profile
    </SecondaryButton>
  );
}
