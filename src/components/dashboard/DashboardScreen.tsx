"use client";
import React from "react";
import DefaultCard from "../DefaultCard";
import { useAuth } from "@/src/contexts/AuthContext";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";

type DashboardProps = {
  className?: string;
};
export default function DashboardScreen({ className }: DashboardProps) {
  const { user } = useAuth();
  // activity feed
  return <DefaultCard></DefaultCard>;
}
