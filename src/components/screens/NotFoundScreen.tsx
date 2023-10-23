import React from "react";
import ReturnHomeButton from "../utils/ReturnHomeButton";

export default function NotFoundScreen() {
  return (
    <div className="grid place-items-center h-[50vh]">
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="flex-flex-col gap-1 items-center justify-center">
          <h1 className="text-6xl text-custom-primary font-bold text-center">
            404
          </h1>
          <p className="text-center text-custom-grey-text">
            Hmm.. can't find the page you are looking for. Please check your URL
            again.
          </p>
        </div>
        <ReturnHomeButton />
      </div>
    </div>
  );
}
