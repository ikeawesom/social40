"use client";
import React from "react";
import SecondaryButton from "../../utils/SecondaryButton";
import Image from "next/image";
import { toast } from "sonner";
import ScrollMedia from "./ScrollMedia";

export type DisplayMediaType = { file: File | null; src: string; id: string };

export default function AddMedia({
  handleMediaChange,
  mediaFiles,
  removeFile,
}: {
  handleMediaChange: (config: DisplayMediaType) => void;
  mediaFiles: DisplayMediaType[];
  removeFile: (id: string) => void;
}) {
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
        <ScrollMedia mediaFiles={mediaFiles} toDelete={removeFile} />
      )}
    </>
  );
}
