"use client";

import Modal from "@/src/components/utils/Modal";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import React from "react";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import InnerContainer from "@/src/components/utils/InnerContainer";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { twMerge } from "tailwind-merge";
import { useAddCosMembers } from "@/src/hooks/groups/custom/COS/useAddCosMembers";
import ModalLoading from "@/src/components/utils/ModalLoading";
import ModalHeader from "@/src/components/utils/ModalHeader";

export default function AddMembersSection({
  groupData,
  curMembers,
}: {
  groupData: GROUP_SCHEMA;
  curMembers: string[];
}) {
  const {
    handleAdd,
    handleToggle,
    loadAdd,
    loading,
    members,
    reset,
    setShowModal,
    showModal,
    toAdd,
  } = useAddCosMembers(groupData, curMembers);

  return (
    <>
      {showModal && (
        <Modal className="min-[400px]:p-4">
          <ModalHeader close={reset} heading="Add Members" />
          {loading || loadAdd ? (
            <ModalLoading
              text={!loadAdd ? "Loading members..." : "Adding members..."}
            />
          ) : (
            <>
              <InnerContainer className="w-full max-h-[30vh] border-[1px] border-custom-light-text/50">
                {Object.keys(members).map((id: string) => {
                  const added = toAdd.includes(id);
                  return (
                    <div
                      className="flex items-center justify-between gap-2 w-full px-3 py-2 bg-white hover:bg-custom-light-text"
                      key={id}
                    >
                      <div>
                        <h4 className="text-sm font-bold text-custom-dark-text">
                          {members[id].displayName}
                        </h4>
                        <p className="text-xs text-custom-grey-text">
                          {members[id].memberID}
                        </p>
                      </div>
                      <SecondaryButton
                        className={twMerge(
                          "w-fit px-2 py-1",
                          added
                            ? "bg-custom-light-red text-custom-red border-custom-red/30"
                            : "bg-custom-light-green text-custom-green border-custom-green/30"
                        )}
                        onClick={() => handleToggle(id)}
                      >
                        {added ? "Remove" : "Add"}
                      </SecondaryButton>
                    </div>
                  );
                })}
              </InnerContainer>
              {toAdd.length !== 0 && (
                <>
                  <p className="text-sm text-custom-grey-text my-2">
                    Currently adding ({toAdd.length}):{" "}
                  </p>
                  <InnerContainer className="w-full flex flex-row p-2 max-h-[15vh] items-center justify-start gap-1 flex-wrap">
                    {toAdd.map((id: string) => (
                      <p
                        className="text-sm px-2 py-1 bg-custom-light-text rounded-md cursor-default hover:brightness-95"
                        key={id}
                      >
                        {id}
                      </p>
                    ))}
                  </InnerContainer>
                  <PrimaryButton
                    onClick={handleAdd}
                    disabled={loadAdd}
                    className="mt-2"
                  >
                    Add Selected
                  </PrimaryButton>
                </>
              )}
            </>
          )}
        </Modal>
      )}
      <PrimaryButton onClick={() => setShowModal(true)} className="w-fit px-3">
        Add Members
      </PrimaryButton>
    </>
  );
}
