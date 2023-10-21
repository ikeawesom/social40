import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import SecondaryButton from "../utils/SecondaryButton";
import PrimaryButton from "../utils/PrimaryButton";
import generateID from "@/src/utils/getRandomID";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Modal from "../utils/Modal";
import { useCookies } from "next-client-cookies";

type FormType = {
  className?: string;
};

export default function CreateGroupForm({ className }: FormType) {
  const cookieStore = useCookies();

  const [groupDetails, setGroupDetails] = useState({
    name: "",
    desc: "",
    admin: "",
  });

  const [loading, setLoading] = useState(false);

  const handleID = () => {
    const ID = generateID();
    setGroupDetails({ ...groupDetails, admin: ID });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupDetails({ ...groupDetails, [e.target.name]: e.target.value });
  };

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGroupDetails({ ...groupDetails, desc: e.target.value });
  };

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <Modal>
      <form
        className={twMerge("flex-col gap-y-4 flex", className)}
        onSubmit={createGroup}
      >
        <span className="flex flex-col gap-2 items-center justify-center mb-4">
          <input
            type="text"
            placeholder="Admin ID"
            required
            name="admin"
            className="text-sm"
            onChange={handleChange}
            value={groupDetails.admin}
          />
          <p className="text-xs text-gray-400">
            You will need to give your group members this Admin ID for their
            registration. This{" "}
            <span className="text-red-500 font-medium">cannot</span> be changed
            afterwards.
          </p>
          <SecondaryButton
            className="text-sm py-2 px-0 text-orange-500 border-orange-500"
            onClick={handleID}
            disabled={loading}
          >
            Generate Admin ID for me
          </SecondaryButton>
        </span>
        <input
          type="text"
          placeholder="Group name"
          required
          name="name"
          className="text-sm"
          onChange={handleChange}
          value={groupDetails.name}
        />
        <textarea
          required
          placeholder="A short description of the group"
          name="desc"
          className="text-sm"
          onChange={handleTextArea}
          value={groupDetails.desc}
        />
        <PrimaryButton
          disabled={loading}
          type="submit"
          className="text-sm py-2 px-0"
        >
          Create group
        </PrimaryButton>
      </form>
    </Modal>
  );
}
