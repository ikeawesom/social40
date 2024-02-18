"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshingScreen() {
  const router = useRouter();
  useEffect(() => {
    const pathname = sessionStorage.getItem("pathname");
    if (pathname) {
      setTimeout(() => {
        router.replace(pathname);
      }, 600);
    } else {
      router.back();
    }
  }, []);
  return <></>;
}
