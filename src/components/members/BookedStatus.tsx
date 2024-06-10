"use client";

import { useBiboCtx } from "@/src/contexts/BiboContext";
import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";

export default function BookedStatus({ status }: { status: boolean }) {
  const { clientBibo, setClientBibo } = useBiboCtx();

  const bg = clientBibo ? "bg-custom-green" : "bg-custom-orange";

  useEffect(() => {
    if (clientBibo === null) setClientBibo(status);
  }, []);

  if (clientBibo !== null)
    return (
      <div
        className={twMerge(
          "h-[10px] w-[10px] rounded-full",
          bg
          // color,
          // border
        )}
      />
    );
}
