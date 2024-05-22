"use client";

import React from "react";
import DefaultFeaturedCard from "./feed/DefaultFeaturedCard";
import IPPTFeaturedCard from "./feed/IPPTFeaturedCard";
import DeleteStatisticButton from "./DeleteStatisticButton";

export default function FeaturedSection({
  bestStat,
  type,
  memberID,
}: {
  type: string;
  bestStat: any;
  memberID: string;
}) {
  return (
    <>
      {type === "IPPT" ? (
        <IPPTFeaturedCard bestStat={bestStat} />
      ) : (
        <DefaultFeaturedCard data={bestStat} type={type} />
      )}
      <DeleteStatisticButton memberID={memberID} type={type} />
    </>
  );
}
