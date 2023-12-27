import Link from "next/link";
import React from "react";

export default function GuidebookDownload() {
  return (
    <span className="flex gap-1 items-center justify-center">
      <p className="text-custom-grey-text text-center text-sm">
        Download the{" "}
        <span>
          <Link
            href="https://bit.ly/social40-guidebook"
            className="text-custom-primary font-semibold text-sm hover:underline duration-200"
          >
            Social40 Guidebook
          </Link>
        </span>
      </p>
    </span>
  );
}
