"use client";
import React from "react";
import DefaultCard from "../DefaultCard";
import { useAuth } from "@/src/contexts/AuthContext";
import { useMemberID } from "@/src/hooks/useMemberID";

type DashboardProps = {
  className?: string;
};
export default function DashboardScreen({ className }: DashboardProps) {
  const { memberID } = useMemberID();
  // activity feed
  return <DefaultCard></DefaultCard>;
}
