"use client";
import React, { useState } from "react";
import SecondaryButton from "../utils/SecondaryButton";
import Image from "next/image";
import { toast } from "sonner";
import InnerContainer from "../utils/InnerContainer";
import { contentfulImageLoader } from "../profile/edit/ProfilePicSection";
import { CloseButtonRed } from "../utils/CloseButtonRed";

export type DisplayMediaType = { file: File; src: string; id: string };

export default function AddMedia({
  handleMediaChange,
  mediaFiles,
  removeFile,
}: {
  handleMediaChange: (config: DisplayMediaType) => void;
  mediaFiles: DisplayMediaType[];
  removeFile: (id: string) => void;
}) {
  const [spotlight, setSpotlight] = useState<DisplayMediaType>();

  const handleUpload = (files: FileList | null) => {
    if (files && files[0]) {
      if (files[0].size < 5000000) {
        const curFile = files[0];
        const src = URL.createObjectURL(curFile);
        const srcArr = src.split("/");
        const id = srcArr[srcArr.length - 1];
        handleMediaChange({ file: curFile, id, src });
      } else {
        toast.error("File size too large.");
      }
    }
  };

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
              size={15}
              className="p-2"
              close={() => setSpotlight(undefined)}
            />
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-start">
        <SecondaryButton className="text-sm w-fit p-0">
          <label
            htmlFor="upload-img"
            className="flex items-center justify-center gap-1 px-3 py-1 cursor-pointer"
          >
            <p>Attach Media</p>
            <Image alt="" src="/icons/icon_clip.svg" width={18} height={18} />
          </label>
        </SecondaryButton>
        <div className="absolute">
          <input
            hidden
            id="upload-img"
            type="file"
            accept="image/*"
            onChange={(files) => handleUpload(files.target.files)}
            placeholder="Change Profile Picture"
            className="custom"
          />
        </div>
      </div>
      {mediaFiles.length !== 0 && (
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
                <CloseButtonRed close={() => removeFile(image.id)} />
              </div>
            );
          })}
        </InnerContainer>
      )}
    </>
  );
}
