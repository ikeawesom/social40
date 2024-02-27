"use client";
import React, { FormEvent, useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import DefaultCard from "../DefaultCard";
import submitPost from "./submitPostData";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type PostType = {
  title: string;
  desc: string;
  createdBy: string;
};

export default function CreateAnnouncementForm({
  memberID,
}: {
  memberID: string;
}) {
  const router = useRouter();
  const [postData, setPostData] = useState<PostType>({
    title: "",
    desc: "",
    createdBy: memberID,
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setPostData({
      title: "",
      desc: "",
      createdBy: memberID,
    });
  };
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitPost(postData);
      if (!res.status) throw new Error(res.error);
      resetForm();
      router.refresh();
      toast.success("Announcement has been posted");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <DefaultCard className="w-full">
      <h1 className="font-bold text-custom-dark-text">Create Announcement</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-start gap-2 mt-2"
      >
        <input
          name="title"
          type="text"
          onChange={handleChange}
          placeholder="Add a title..."
          value={postData.title}
          required
        />
        <textarea
          name="desc"
          onChange={handleChange}
          rows={5}
          placeholder="Type something here..."
          required
          value={postData.desc}
        />
        <PrimaryButton disabled={loading} type="submit">
          {loading ? "Posting..." : "Post it"}
        </PrimaryButton>
      </form>
    </DefaultCard>
  );
}
