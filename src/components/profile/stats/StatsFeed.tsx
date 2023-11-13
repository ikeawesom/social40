import { STATISTICS_SCHEMA } from "@/src/utils/schemas/statistics";
import React from "react";
import ComingSoonIcon from "../../utils/ComingSoonIcon";

export default function StatsFeed({
  viewProfile,
  memberID,
}: {
  viewProfile?: boolean;
  memberID: string;
}) {
  return <ComingSoonIcon small width={60} height={60} />;
}
