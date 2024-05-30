"use client";

import { FALLOUTS_SCHEMA } from "@/src/utils/schemas/activities";
import React, { useEffect, useState } from "react";
import ProfileStatSection from "../ProfileStatSection";
import Modal from "../../utils/Modal";
import ModalHeader from "../../utils/ModalHeader";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import { twMerge } from "tailwind-merge";
import ModalLoading from "../../utils/ModalLoading";
import AllActivityCard from "../../groups/custom/activities/AllActivityCard";
import { getFalloutActivities } from "@/src/utils/members/getFalloutActivities";
import { getSimple } from "@/src/utils/helpers/parser";

export interface viewFalloutsType extends GROUP_ACTIVITY_SCHEMA {
  reason: string;
}

export default function ViewFalloutsModal({
  totalActivities,
  activitiesFellout,
}: {
  totalActivities: number;
  activitiesFellout: FALLOUTS_SCHEMA[];
}) {
  const noFallouts = activitiesFellout.length;
  const [activities, setActivities] = useState<viewFalloutsType[]>();
  const [show, setShow] = useState(false);

  const fetchData = async () => {
    try {
      const { data, error } = await getFalloutActivities({ activitiesFellout });
      if (error) throw new Error(error);
      setActivities(data);
    } catch (err: any) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    if (show && !activities) fetchData();
  }, [show]);

  const valid = activitiesFellout.length > 0;

  const showModal = () => {
    if (valid) setShow(true);
  };
  const single = activitiesFellout.length === 1;
  return (
    <>
      {show && (
        <Modal>
          <ModalHeader close={() => setShow(false)} heading="Fallouts" />
          {activities ? (
            <div
              className={twMerge(
                "w-full flex items-start justify-start gap-2 flex-col",
                !single && "max-h-[60vh] overflow-x-visible overflow-y-scroll"
              )}
            >
              {activities.map((data: viewFalloutsType, index: number) => {
                const { reason } = data;
                const parsed = getSimple(data);
                return (
                  <AllActivityCard
                    className="border-custom-light-text border-[1px] py-2 px-3 hover:brightness-95 duration-150"
                    key={index}
                    data={parsed}
                    falloutReason={reason}
                  />
                );
              })}
            </div>
          ) : (
            <ModalLoading />
          )}
        </Modal>
      )}
      <ProfileStatSection
        onClick={showModal}
        title="Fallouts"
        config={{
          first: (20 / 100) * totalActivities,
          second: (50 / 100) * totalActivities,
        }}
        value={noFallouts}
        className="flex-1"
      />
    </>
  );
}
