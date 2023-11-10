import { VERSION_MAP } from "@/src/utils/constants";
import React from "react";

export default function PatchNotesPage() {
  return (
    <div className="grid place-items-center w-full">
      <div className="flex flex-col items-start justify-start gap-10 w-full max-w-[600px]">
        <h1 className="text-5xl text-custom-dark-text font-bold">
          Version Updates
        </h1>
        {Object.keys(VERSION_MAP).map((version: string) => {
          const updates = VERSION_MAP[version].updates;
          const emptyUpdates = updates.length === 0;
          return (
            <div
              key={version}
              className="flex flex-col w-full items-start justify-center"
            >
              <h1 className="text-custom-dark-text text-2xl font-semibold">
                v{version}
              </h1>
              <p className="text-custom-dark-text">
                {VERSION_MAP[version].desc}
              </p>
              {!emptyUpdates && (
                <ul className="mt-3 list-disc">
                  <h4 className="text-custom-dark-text text-lg">What's New?</h4>
                  {updates.map((update: string, index: number) => (
                    <li key={index} className="text-custom-dark-text ml-4">
                      {update}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
