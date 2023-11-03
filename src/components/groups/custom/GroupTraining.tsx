import React from "react";
import DefaultCard from "../../DefaultCard";
import ComingSoonIcon from "../../utils/ComingSoonIcon";
import HRow from "../../utils/HRow";

export default function GroupTraining() {
  return (
    <DefaultCard className="w-full">
      <h1 className="text-custom-dark-text font-semibold">Group Training</h1>
      <HRow />
      <div className="p-3">
        <ComingSoonIcon className="gap-2" small width={100} height={100} />
      </div>
    </DefaultCard>
  );
}
