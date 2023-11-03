import React from "react";
import DefaultCard from "../DefaultCard";
import ComingSoonIcon from "./ComingSoonIcon";
import HRow from "./HRow";

export default function ComingSoonCard({ text }: { text: string }) {
  return (
    <DefaultCard className="w-full">
      <h1 className="text-custom-dark-text font-semibold">{text}</h1>
      <HRow />
      <div className="p-3">
        <ComingSoonIcon className="gap-2" small width={100} height={100} />
      </div>
    </DefaultCard>
  );
}
