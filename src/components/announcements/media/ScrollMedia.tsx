import React, { useState } from "react";
import { DisplayMediaType } from "./AddMedia";
import Image from "next/image";
import { contentfulImageLoader } from "../../profile/edit/ProfilePicSection";
import { CloseButtonRed } from "../../utils/CloseButtonRed";
import InnerContainer from "../../utils/InnerContainer";

export default function ScrollMedia({
  mediaFiles,
  toDelete,
}: {
  mediaFiles: DisplayMediaType[];
  toDelete?: (id: string) => void;
}) {
  const [spotlight, setSpotlight] = useState<DisplayMediaType>();

  return (
    <>
      {spotlight && (
        <div className="h-full w-full bg-black/25 fixed z-20 grid place-items-center top-0 left-0 px-4 fade-in">
          <div className="relative w-full bg-black rounded-md shadow-sm h-[30vh]">
            <Image
              alt={spotlight.file.name}
              src={spotlight.src}
              loader={contentfulImageLoader}
              fill
              sizes="100%"
              className="object-contain"
            />
            <CloseButtonRed
              size={10}
              className="p-2"
              close={() => setSpotlight(undefined)}
            />
          </div>
        </div>
      )}
      <InnerContainer className="flex-row px-3 py-2 min-w-full flex items-center justify-start gap-3 overflow-x-scroll">
        {mediaFiles.map((image: DisplayMediaType, index: number) => {
          const { file, id, src } = image;
          return (
            <div
              key={index}
              className="p-2 rounded-md shadow-sm border-[1px] border-custom-light-text relative overflow-hidden w-[6rem] h-[6rem] min-w-[6rem] min-h-[6rem] flex items-center justify-center"
            >
              <Image
                onClick={() => setSpotlight({ file, id, src })}
                loader={contentfulImageLoader}
                fill
                sizes="100%"
                className="object-cover"
                alt={image.id}
                src={image.src ?? ""}
              />
              {toDelete && <CloseButtonRed close={() => toDelete(image.id)} />}
            </div>
          );
        })}
      </InnerContainer>
    </>
  );
}
