"use client";
import React from "react";
import DefaultCard from "../DefaultCard";
import { useAuth } from "@/src/contexts/AuthContext";
import { useMemberID } from "@/src/hooks/useMemberID";
import ComingSoonScreen from "../screens/ComingSoonScreen";

type DashboardProps = {
  className?: string;
};
export default function DashboardScreen({ className }: DashboardProps) {
  const { memberID } = useMemberID();
  // activity feed
  return <ComingSoonScreen />;
}
