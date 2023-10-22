import { STATUS_SCHEMA } from "@/src/utils/schemas/statuses";
import React from "react";

export default function StatusFeed({
  status,
}: {
  status: { [statusID: string]: STATUS_SCHEMA };
}) {
  return <div>StatusFeed</div>;
}
