import { STATISTICS_SCHEMA } from "@/src/utils/schemas/statistics";
import React from "react";
import ComingSoonIcon from "../../utils/ComingSoonIcon";

export default function StatsFeed({
  statistics,
}: {
  statistics: { [statisticID: string]: STATISTICS_SCHEMA } | undefined;
}) {
  return <ComingSoonIcon small width={60} height={60} />;
}
