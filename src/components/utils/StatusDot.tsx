import React from "react";

export default function StatusDot({ status }: { status: boolean }) {
  return (
    <span
      className={`h-2 w-2 rounded-full ${
        status ? "bg-custom-green" : "bg-custom-orange"
      }`}
    />
  );
}
