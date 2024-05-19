"use client";

import {
  ACTIVITY_FEED_VIEWS,
  ActivityFeedViewType,
} from "@/src/utils/constants";
import getAllSearchParams from "@/src/utils/helpers/getAllSearchParams";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function GroupsActivitiesViews() {
  const { values } = getAllSearchParams();
  const [curView, setCurView] = useState(values["view"] ?? "scroll");
  const [show, setShow] = useState(false);

  return (
    <div className="w-full flex flex-col items-end justify-center">
      <div
        onClick={() => setShow(!show)}
        className={twMerge(
          "flex items-center justify-end duration-150 gap-2 px-2 py-1 rounded-md hover:bg-custom-grey-text/10 cursor-pointer",
          show && "bg-custom-grey-text/10"
        )}
      >
        <p className={twMerge("text-xs text-custom-grey-text")}>View By</p>
        <Image
          alt=""
          src="/icons/navigation/icon_sliders.svg"
          width={20}
          height={20}
        />
      </div>
      {show && (
        <div className="flex items-center justify-end gap-4 mt-2">
          {ACTIVITY_FEED_VIEWS.map((view: ActivityFeedViewType) => {
            const { id, name, isDefault } = view;
            return (
              <Link
                onClick={() => {
                  setCurView(id);
                  setShow(!show);
                }}
                className={twMerge(
                  "text-xs hover:opacity-60 duration-150 fade-in-bottom",
                  curView === id && "text-custom-primary font-bold"
                )}
                key={id}
                href={`/home?${new URLSearchParams({ ...values, view: id })}`}
              >
                {name} {isDefault ? "(Default)" : ""}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
