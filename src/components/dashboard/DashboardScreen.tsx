"use client";
import React from "react";
import DefaultCard from "../DefaultCard";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/member";

type DashboardProps = {
  data: MEMBER_SCHEMA;
  className?: string;
};
export default function DashboardScreen({ data, className }: DashboardProps) {
  // activity feed
  return <DefaultCard></DefaultCard>;
}
