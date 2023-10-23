"use client";
import { useRouter } from "next/navigation";
import React from "react";
import PrimaryButton from "./PrimaryButton";

export default function ReturnHomeButton() {
  const router = useRouter();
  return (
    <PrimaryButton onClick={() => router.replace("/", { scroll: false })}>
      Return Home
    </PrimaryButton>
  );
}
