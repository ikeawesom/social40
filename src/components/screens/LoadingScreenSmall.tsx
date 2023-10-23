import React from "react";
import LoadingIcon from "../utils/LoadingIcon";

export default function LoadingScreenSmall() {
  return (
    <div className="grid place-items-center w-full h-[40vh]">
      <LoadingIcon height={80} width={80} />
    </div>
  );
}
