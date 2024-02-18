"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshingScreen() {
  const router = useRouter();
  useEffect(() => {
    const url = sessionStorage.getItem("url");
    if (url) {
      
        router.replace(url);
      
    } else {
      router.back();
    }
  }, []);
  return
   ( <></>)
}
