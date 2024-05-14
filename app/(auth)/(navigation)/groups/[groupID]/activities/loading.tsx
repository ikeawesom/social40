import React from "react";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import CenterFeedSkeleton from "@/src/components/utils/CenterFeedSkeleton";

export default function loading() {
  return (
    <>
      <HeaderBar text="Activities" back />
      <CenterFeedSkeleton header />
    </>
  );
}
