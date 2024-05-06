import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import HRow from "@/src/components/utils/HRow";
import React from "react";
import StatusSkeleton from "./StatusSkeleton";
import StrengthSkeleton from "./StrengthSkeleton";

export default function StrengthSectionSkeleton() {
  return (
    <>
      <h1 className="font-bold text-custom-dark-text">Strength</h1>
      <StrengthSkeleton />
      <HRow />
      <StatusSkeleton />
      <HRow />
      <DefaultSkeleton className="h-[10px]" />
    </>
  );
}
