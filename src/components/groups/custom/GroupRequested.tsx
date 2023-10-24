"use client";
import { useMemberID } from "@/src/hooks/useMemberID";
import React from "react";

export default function GroupRequested() {
  const { memberID } = useMemberID();
  return <div>GroupRequested</div>;
}
