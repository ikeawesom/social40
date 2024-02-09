"use client";
import React, { useEffect, useState } from "react";
import Image, { ImageLoader, ImageLoaderProps } from "next/image";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { toast } from "sonner";
import { storageHandler } from "@/src/firebase/storage";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { useHostname } from "@/src/hooks/useHostname";

export const contentfulImageLoader: ImageLoader = ({
  src,
  width,
}: ImageLoaderProps) => {
  return `${src}?w=${width}`;
};

export default function ProfilePicSection({
  memberData,
}: {
  memberData: MEMBER_SCHEMA;
}) {
  const { host } = useHostname();
  const [imageFile, setImageFile] = useState<File>();
  const [filePath, setFilepath] = useState(
    memberData.pfp ? memberData.pfp : "/icons/icon_avatar.svg"
  );

  const handleUpload = (files: any) => {
    if (files && files[0]) {
      if (files[0].size < 5000000) {
        setImageFile(files[0]);
      } else {
        toast.error("File size too large.");
      }
    }
  };

  useEffect(() => {
    const handleCloudUpload = async () => {
      try {
        const res = await storageHandler.upload({
          file: imageFile,
          path: `/PROFILE/${memberData.memberID}`,
        });
        setFilepath(res.data);
        const postObj = GetPostObj({
          memberID: memberData.memberID,
          pfp: res.data,
        });
        const resA = await fetch(`${host}/api/profile/pfp`, postObj);
        const bodyA = await resA.json();
        if (!bodyA.status) throw new Error(bodyA.error);
        toast.success("Profile picture updated successfully");
      } catch (err: any) {
        toast.error(err.message);
      }
      setImageFile(undefined);
    };
    if (
      imageFile !== undefined &&
      confirm("Do you want to change your profile picture?")
    )
      handleCloudUpload();
  }, [imageFile]);
  return (
    <>
      <label htmlFor="upload-img">
        <div className="overflow-hidden rounded-full shadow-lg w-24 h-24 relative flex items-center justify-center">
          <Image
            loader={contentfulImageLoader}
            fill
            src={filePath}
            alt="Profile"
            className="object-cover drop-shadow-md cursor-pointer hover:opacity-70 duration-150 z-10 overflow-hidden"
          />
        </div>
      </label>
      <form className="absolute">
        <input
          hidden
          id="upload-img"
          type="file"
          accept="image/*"
          onChange={(files) => handleUpload(files.target.files)}
          placeholder="Change Profile Picture"
          className="custom"
        />
      </form>
    </>
  );
}
