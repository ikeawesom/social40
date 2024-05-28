import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { deletePost } from "../submitPostData";
import { toast } from "sonner";
import Image from "next/image";

export default function DeleteButton({
  id,
  haveMedia,
}: {
  id: string;
  haveMedia: boolean;
}) {
  const [loading, setLoading] = useState("");
  const router = useRouter();
  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this post? This is irreversible!"
      )
    ) {
      setLoading("Deleting...");
      try {
        const res = await deletePost(id ?? "", haveMedia);
        if (!res.status) throw new Error(res.error);
        router.refresh();
        // toast.success("Post deleted");
      } catch (err: any) {
        toast.error(err.message);
        setLoading("");
      }
    }
  };
  return (
    <>
      {loading === "" ? (
        <Image
          onClick={handleDelete}
          className="cursor-pointer self-end"
          src="/icons/icon_trash.svg"
          alt="Delete Post"
          height={25}
          width={25}
        />
      ) : (
        <p className="self-end text-sm text-custom-grey-text">{loading}</p>
      )}
    </>
  );
}
