import React from "react";

type GroupHeaderType = {
  owner: string;
  title: string;
  desc: string;
};

export default function GroupHeader({ owner, title, desc }: GroupHeaderType) {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <p className="text-xs text-custom-grey-text text-center">
        {owner}'s Group
      </p>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl text-custom-dark-text font-bold text-center">
          {title}
        </h1>
        <h4 className="text-sm text-custom-dark-text text-center">{desc}</h4>
      </div>
    </div>
  );
}
