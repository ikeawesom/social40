import React from "react";
import { DisplayDateActivityType } from "./ActivityCalendarClientView";
import Modal from "../../utils/Modal";
import ModalHeader from "../../utils/ModalHeader";
import AllActivityCard from "../../groups/custom/activities/AllActivityCard";
import { twMerge } from "tailwind-merge";

export default function DateActivityModal({
  data,
  close,
}: {
  data: DisplayDateActivityType;
  close: () => void;
}) {
  const single = Object.keys(data.activities).length === 1;
  return (
    <Modal>
      <ModalHeader
        close={close}
        heading={`View ${!single ? "Activities" : "Activity"}`}
      />
      <div
        className={twMerge(
          "w-full flex items-start justify-start gap-2 flex-col",
          !single && "max-h-[60vh] overflow-x-visible overflow-y-scroll"
        )}
      >
        {Object.keys(data.activities).map((id: string) => {
          const actData = data.activities[id];
          return (
            <AllActivityCard
              className="border-custom-light-text border-[1px]"
              key={id}
              data={actData}
            />
          );
        })}
      </div>
    </Modal>
  );
}
