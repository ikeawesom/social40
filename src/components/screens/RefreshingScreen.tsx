"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshingScreen() {
  const router = useRouter();
  useEffect(() => {
    const url = sessionStorage.getItem("url");
    if (url) {
      setTimeout(() => {
        router.replace(url);
      }, 1000);
    } else {
      router.back();
    }
  }, []);
  return (
    <div className="grid place-items-center w-full h-[40vh]">
      <h1 className="font-bold text-custom-dark-text text-center">
        Refreshing...
      </h1>
    </div>
  );
}
