import React from "react";
import LoadingIcon from "../utils/LoadingIcon";

export default function LoadingScreenSmall({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <div className="grid place-items-center w-full h-[40vh]">
      <LoadingIcon height={height ? height : 80} width={width ? width : 80} />
    </div>
  );
}
