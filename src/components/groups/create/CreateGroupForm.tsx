import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import SecondaryButton from "../../utils/SecondaryButton";
import PrimaryButton from "../../utils/PrimaryButton";
import generateID from "@/src/utils/getRandomID";
import Modal from "../../utils/Modal";
import HRow from "../../utils/HRow";
import Image from "next/image";
import { toast } from "sonner";
import { LoadingIconBright } from "../../utils/LoadingIcon";
import getCurrentDate from "@/src/utils/getCurrentDate";
import { useMemberID } from "@/src/hooks/useMemberID";
import { useRouter } from "next/navigation";
import { createGroup } from "@/src/utils/groups/createGroup";

type FormType = {
  className?: string;
  closeModal: () => void;
};

export default function CreateGroupForm({ className, closeModal }: FormType) {
  const { memberID } = useMemberID();
  const router = useRouter();
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

  const handleGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { admin, desc, name } = groupDetails;
      if (admin.split(" ").length > 1)
        throw new Error("Admin ID cannot have spaces.");

      const res = await createGroup({
        groupID: admin,
        createdBy: memberID,
        groupDesc: desc,
        groupName: name,
        createdOn: getCurrentDate(),
      });

      if (!res.status) throw new Error(res.error);
      closeModal();
      toast.success(`Successfully created group ${admin}. Redirecting...`);
      setTimeout(() => {
        router.push(`/groups/${admin}`, { scroll: false });
      }, 1500);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <Modal>
      <div className="mb-4">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-custom-dark-text font-semibold">Create Group</h1>
          <button
            onClick={closeModal}
            className="hover:opacity-75 duration-200"
          >
            <Image
              src="/icons/icon_close.svg"
              alt="Close"
              width={15}
              height={15}
            />
          </button>
        </div>
        <HRow />
      </div>
      <form
        className={twMerge("flex-col gap-y-4 flex", className)}
        onSubmit={handleGroup}
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
          className="text-sm py-2 px-0 grid place-items-center"
        >
          {loading ? <LoadingIconBright height={20} /> : "Create group"}
        </PrimaryButton>
      </form>
    </Modal>
  );
}
