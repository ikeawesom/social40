"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshingScreen() {
  const router = useRouter();
  useEffect(() => {
    const url = sessionStorage.getItem("url");
    router.refresh();
    setTimeout(() => {
      if (url) {
        router.replace(url, { scroll: false });
      } else {
        router.replace("/home", { scroll: false });
      }
    }, 400);
  }, []);
  return <></>;
}
