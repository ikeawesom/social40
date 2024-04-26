import React from "react";
import LoadingIcon from "../utils/LoadingIcon";

export default function LoadingScreenSmall({
  width,
  height,
  text,
}: {
  width?: number;
  height?: number;
  text?: string;
}) {
  return (
    <div className="grid place-items-center w-full h-[40vh]">
      <div className="flex items-center justify-center gap-4 flex-col p-6">
        <LoadingIcon height={height ? height : 80} width={width ? width : 80} />
        {text && (
          <h1 className="text-center text-sm text-custom-dark-text">{text}</h1>
        )}
      </div>
    </div>
  );
}
