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
  return <></>;
}
