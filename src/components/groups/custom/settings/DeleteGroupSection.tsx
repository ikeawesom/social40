import React, { useState } from "react";
import Modal from "@/src/components/utils/Modal";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { GROUP_MEMBERS_SCHEMA, GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import Image from "next/image";
import HRow from "@/src/components/utils/HRow";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import { toast } from "sonner";
import { dbHandler } from "@/src/firebase/db";
import { useRouter } from "next/navigation";
import { WAITLIST_SCHEMA } from "@/src/utils/schemas/waitlist";
import { deleteGroup } from "@/src/utils/groups/deleteGroup";

export default function DeleteGroupSection({
  groupData,
}: {
  groupData: GROUP_SCHEMA;
}) {
  const [showModal, setShowModal] = useState(false);
  const [inputName, setInputName] = useState("");
  const [loading, setLoading] = useState(false);

  const { createdBy, groupDesc, groupID, groupName } = groupData;
  const router = useRouter();
  const fullName = `${createdBy}/${groupID}`;
  const equals = inputName === fullName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await deleteGroup(groupID);
      if (!res.status) throw new Error(res.error);
      toast.success("Successfully deleted group. Returning to home...");

      setTimeout(() => {
        router.push("/groups", { scroll: false });
      }, 1500);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <SecondaryButton
        onClick={() => setShowModal(true)}
        className="border-custom-red text-custom-red font-semibold hover:bg-custom-red hover:text-custom-light-text duration-200"
      >
        Delete Group
      </SecondaryButton>
      {showModal && (
        <Modal className="max-w-[500px]">
          <div className="mb-4">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-custom-dark-text font-semibold">
                Delete {groupData.groupID}
              </h1>
              <button
                onClick={() => setShowModal(false)}
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
          <div className="grid place-items-center p-4">
            <div className="flex flex-col items-center justify-center gap-3">
              <Image
                src="/icons/icon_trash.svg"
                alt="Trash"
                width={80}
                height={80}
              />
              <h4 className="font-semibold text-center text-base">
                {fullName}
              </h4>
            </div>
          </div>
          <form
            className="flex flex-col items-start justify-center w-full gap-1"
            onSubmit={handleSubmit}
          >
            <p className="text-sm">
              To confirm, enter{" "}
              <span className="text-custom-red font-semibold">{fullName}</span>{" "}
              in the box below
            </p>
            <input
              required
              value={inputName}
              name="inputName"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputName(e.target.value)
              }
              className="border-custom-red"
              placeholder={fullName}
            />
            <p className="text-sm text-custom-grey-text text-start">
              By confirming, you agree that you will lose all data, including
              statistics, statuses, 40SAR points, etc. of the members in your
              group.
            </p>
            <PrimaryButton
              disabled={!equals}
              type="submit"
              className="mt-2 bg-custom-red grid place-items-center"
            >
              {loading ? (
                <LoadingIcon width={20} height={20} />
              ) : (
                "Delete Group"
              )}
            </PrimaryButton>
          </form>
        </Modal>
      )}
    </>
  );
}
