import React from "react";
import DefaultCard from "../../DefaultCard";
import Notice from "../../utils/Notice";

export default function ActiveStatusSection({ active }: { active: boolean }) {
  return (
    <DefaultCard className="flex flex-col w-full items-start justify-center gap-1">
      <div className="flex items-center justify-start gap-1">
        <p>Status: </p>
        {active ? (
          <h4 className="font-bold text-custom-orange">ACTIVE</h4>
        ) : (
          <h4 className="font-semibold text-custom-green">INACTIVE</h4>
        )}
      </div>
      {active ? (
        <Notice
          status="warning"
          text="This status is currently active! Please be cautious in the activites this member participates in."
        />
      ) : (
        <Notice
          status="info"
          text="Member is safe to participate in the conduct as this status has ended."
        />
      )}
    </DefaultCard>
  );
}
