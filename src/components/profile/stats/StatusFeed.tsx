import React from "react";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { StatusListType } from "../StatsSection";
import StatusList from "./status/StatusList";

export default async function StatusFeed({
  viewProfile,
  memberID,
}: {
  viewProfile?: boolean;
  memberID: string;
}) {
  const host = process.env.HOST;
  // fetch statuses from member
  const PostObjA = GetPostObj({
    memberID,
  });
  const resB = await fetch(`${host}/api/profile/status`, PostObjA);
  const dataB = await resB.json();

  if (!dataB.status) throw new Error(dataB.error);

  const status = dataB.data as StatusListType;

  return <StatusList status={status} viewProfile={viewProfile ?? false} />;
}
