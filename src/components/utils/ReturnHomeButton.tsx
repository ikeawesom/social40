"use client";
import { useRouter } from "next/navigation";
import React from "react";
import PrimaryButton from "./PrimaryButton";
import Link from "next/link";

export default function ReturnHomeButton() {
  return (
    <Link href="/home">
      <PrimaryButton>Return Home</PrimaryButton>
    </Link>
  );
}
