import { useFeedbackContext } from "@/src/contexts/FeedbackContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const MAX_STARS = 5;
export default function StarsSection() {
  const [highlighted, setHighlighted] = useState(-1);
  const { setFeedbackDetails, feedbackDetails } = useFeedbackContext();

  useEffect(() => {
    if (feedbackDetails)
      setFeedbackDetails({ ...feedbackDetails, rating: highlighted });
  }, [highlighted]);

  return (
    <>
      <p className="text-start text-sm text-custom-grey-text">
        How would you rate Social40?
      </p>
      <div className="flex w-full items-center justify-evenly gap-3">
        {new Array(MAX_STARS).fill(0).map((val: number, index: number) => {
          return (
            <Image
              onClick={() => setHighlighted(index)}
              key={index}
              alt=""
              src={
                index <= highlighted
                  ? "/icons/icon_star_filled.svg"
                  : "/icons/icon_star_outline.svg"
              }
              className="hover:brightness-90 duration-150 cursor-pointer"
              width={30}
              height={30}
            />
          );
        })}
      </div>
    </>
  );
}
