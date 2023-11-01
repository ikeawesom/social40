"use client";
import React from "react";
import DefaultCard from "../DefaultCard";
import HRow from "../utils/HRow";
import PrimaryButton from "../utils/PrimaryButton";
import { useRouter } from "next/navigation";

export default function QuickStatusLinks() {
  const router = useRouter();
  return (
    <DefaultCard className="w-full flex flex-col gap-1 items-start justify-center">
      <h1 className="text-start font-semibold text-base">Quick Links</h1>
      <HRow />
      <PrimaryButton
        className="bg-violet-500"
        onClick={() => router.push("https://bit.ly/IR-generator")}
      >
        Incident Report Generator
      </PrimaryButton>
      <PrimaryButton
        onClick={() => router.push("https://bit.ly/40SAR-MC")}
        className="bg-green-600"
      >
        Medical Leave Declaration
      </PrimaryButton>
    </DefaultCard>
  );
}
