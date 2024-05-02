"use client";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { useRouter } from "next/navigation";
import React from "react";

export default function AddStatusButton() {
  const router = useRouter();
  return (
    <PrimaryButton
      onClick={() => router.push("/status", { scroll: false })}
      className="mb-2 mt-1"
    >
      Add a Status
    </PrimaryButton>
  );
}
