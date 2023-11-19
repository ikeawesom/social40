import HRow from "@/src/components/utils/HRow";
import { VERSION_MAP } from "@/src/utils/constants";
import React from "react";

export default function PatchNotesPage() {
  return (
    <div className="grid place-items-center w-full">
      <div className="flex flex-col items-start justify-start gap-10 w-full max-w-[600px] p-4">
        <h1 className="text-5xl text-custom-dark-text font-bold">
          Version Updates
        </h1>
        {Object.keys(VERSION_MAP).map((versionNumber: string) => {
          const { version, desc, title, updates } = VERSION_MAP[versionNumber];
          const emptyUpdates = updates.length === 0;
          return (
            <div
              key={versionNumber}
              className="flex flex-col w-full items-start justify-center"
            >
              <h1 className="text-custom-dark-text text-2xl font-semibold">
                v{version}: {title}
              </h1>
              <HRow />
              <p className="text-custom-dark-text">{desc}</p>
              {!emptyUpdates && (
                <ul className="mt-3 list-disc">
                  <h4 className="text-custom-dark-text text-lg font-semibold">
                    What's New?
                  </h4>
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
