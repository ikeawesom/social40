import React from "react";
import LoadingIcon from "../utils/LoadingIcon";

export default function LoadingScreen() {
  return (
    <div className="h-screen grid place-items-center">
      <LoadingIcon />
    </div>
  );
}
