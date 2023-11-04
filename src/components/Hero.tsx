import React from "react";

export default function Hero() {
  return (
    <div className="flex flex-col gap-y-1 items-center justify-center">
      <h1 className="sm:text-6xl text-5xl">
        Social
        <span className="text-custom-primary font-bold text-center">40</span>
      </h1>
      <p className="text-custom-grey-text text-center">
        Manage, track and monitor progress while striving for victory.
      </p>
    </div>
  );
}
