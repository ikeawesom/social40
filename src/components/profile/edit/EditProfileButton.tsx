"use client";
import React from "react";
import { useRouter } from "next/navigation";
import SecondaryButton from "../../utils/SecondaryButton";

export default function EditProfileButton() {
  const router = useRouter();
  return (
    <SecondaryButton
      className="flex-1"
      onClick={() => router.push("/settings", { scroll: false })}
    >
      Settings
    </SecondaryButton>
  );
}
