import { STATISTICS_SCHEMA } from "@/src/utils/schemas/statistics";
import React from "react";

export default function StatsFeed({
  statistics,
}: {
  statistics: { [statisticID: string]: STATISTICS_SCHEMA };
}) {
  return <div>StatsFeed</div>;
}
