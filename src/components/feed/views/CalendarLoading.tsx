import React from "react";
import LoadingIcon from "../../utils/LoadingIcon";

export default function CalendarLoading() {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white/70 grid place-items-center">
      <LoadingIcon height={50} width={50} />
    </div>
  );
}
