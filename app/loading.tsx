import React from "react";
import LoadingIcon from "@/src/components/utils/LoadingIcon";

export default function loading() {
  return (
    <div className="h-screen grid place-items-center">
      <LoadingIcon />
    </div>
  );
}
