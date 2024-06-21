import RefreshingScreen from "@/src/components/screens/RefreshingScreen";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Loading...",
};

export default function page() {
  return <RefreshingScreen />;
}
