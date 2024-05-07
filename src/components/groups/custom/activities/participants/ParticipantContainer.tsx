import { handleReload } from "@/src/components/navigation/HeaderBar";
import FormInputContainer from "@/src/components/utils/FormInputContainer";
import InnerContainer from "@/src/components/utils/InnerContainer";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import {
  DateToTimestamp,
  TimestampToDateString,
} from "@/src/utils/getCurrentDate";
import handleResponses from "@/src/utils/handleResponses";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export default function ParticipantContainer({
  setCurMember,
  itemList,
  memberID,
  activityID,
  admin,
}: {
  activityID: string;
  setCurMember: React.Dispatch<React.SetStateAction<string>>;
  itemList: any;
  memberID: string;
  admin: boolean;
}) {
  const router = useRouter();
  const { host } = useHostname();
  const [loading, setLoading] = useState(false);
  const [selected, setSelect] = useState({
    state: false,
    selectedIDs: [] as string[],
  });

  const [reason, setReason] = useState("");

  const handleSelectedFallouts = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const arrPromise = selected.selectedIDs.map(async (id: string) => {
        const ActivityObj = GetPostObj({
          activityID,
          memberID: id,
          fallReason: reason,
          verifiedBy: memberID,
        });
        const res = await fetch(
          `${host}/api/activity/group-fallout`,
          ActivityObj
        );
        const body = await res.json();
        if (!body.status)
          return handleResponses({ status: false, error: body.error });

        const ActivityObjA = GetPostObj({
          activityID,
          memberID: id,
        });
        const resA = await fetch(
          `${host}/api/activity/group-leave`,
          ActivityObjA
        );
        const bodyA = await resA.json();
        if (!bodyA.status)
          return handleResponses({ status: false, error: bodyA.error });
        return handleResponses();
      });
      const promiseArr = await Promise.all(arrPromise);

      promiseArr.forEach((item: any) => {
        if (!item.status) throw new Error(item.error);
      });
      toast.success("Kicked members.");
      handleReload(router);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleClick = (mem: string) => {
    if (!selected.state) {
      // normal state
      if (mem !== memberID) {
        setCurMember(mem);
      } else {
        router.push(`/members/${memberID}`, { scroll: false });
      }
    } else {
      // select state
      let temp = selected.selectedIDs;
      if (!temp.includes(mem)) {
        temp.push(mem);
      } else {
        temp.splice(selected.selectedIDs.indexOf(mem), 1);
      }
      setSelect({ ...selected, selectedIDs: temp });
    }
  };
  const empty = Object.keys(itemList).length === 0;
  return (
    <>
      {admin && (
        <div className="mb-2 flex items-center justify-between w-full gap-2 flex-wrap">
          <div className="flex items-center justify-start gap-3 w-full">
            <SecondaryButton
              className={twMerge(
                "border-custom-primary text-custom-primary min-[330px]:w-fit",
                selected.state && "bg-custom-primary text-custom-light-text"
              )}
              onClick={() => {
                setSelect({
                  ...selected,
                  state: !selected.state,
                  selectedIDs: [],
                });
              }}
            >
              {selected.state ? "Cancel" : "Kick Multiple"}
            </SecondaryButton>
            {selected.state && (
              <p className="text-sm text-custom-grey-text text-start">
                Selecting ( {selected.selectedIDs.length} )
              </p>
            )}
          </div>
          {selected.state && (
            <>
              <form
                onSubmit={handleSelectedFallouts}
                className="w-full flex items-end justify-between gap-2 max-[500px]:flex-wrap"
              >
                <FormInputContainer
                  className="min-[500px]:flex-[2]"
                  inputName="reason"
                  labelText="Reason for kicking"
                >
                  <input
                    type="text"
                    value={reason}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setReason(e.target.value);
                    }}
                    placeholder="e.g. Guard Duty, RSI, etc."
                    required
                  />
                </FormInputContainer>
                <SecondaryButton
                  type="submit"
                  disabled={selected.selectedIDs.length === 0}
                  className="min-[500px]:w-fit flex items-center justify-center border-custom-red text-custom-red px-3 flex-1"
                >
                  {loading ? (
                    <LoadingIcon height={20} width={20} />
                  ) : (
                    "Kick Selected"
                  )}
                </SecondaryButton>
              </form>
            </>
          )}
        </div>
      )}
      <InnerContainer
        className={twMerge(
          "w-full max-h-[60vh]",
          empty && "h-[10vh] flex items-center justify-center"
        )}
      >
        {empty ? (
          <p className="text-sm text-center text-custom-grey-text">
            No participants added.
          </p>
        ) : (
          <>
            {Object.keys(itemList).map((mem: string) => {
              const tempTimestamp = itemList[mem].dateJoined;

              const tempDate = new Date(tempTimestamp.seconds * 1000);
              tempDate.setHours(tempDate.getHours() - 8);
              const date = DateToTimestamp(tempDate);

              const dateStr = TimestampToDateString(date);
              return (
                <div
                  key={mem}
                  onClick={() => {
                    handleClick(mem);
                  }}
                  className={twMerge(
                    "cursor-pointer w-full flex flex-col items-start justify-center py-2 px-3 duration-150 hover:bg-custom-light-text",
                    selected.state && selected.selectedIDs.includes(mem)
                      ? "bg-custom-light-orange hover:brightness-90"
                      : "hover:bg-custom-light-text"
                  )}
                >
                  <h1 className="text-custom-dark-text font-semibold text-sm">
                    {itemList[mem].displayName}
                  </h1>
                  <h4 className="text-custom-grey-text text-xs">{mem}</h4>
                  <h4 className="text-custom-grey-text text-xs">
                    Participated on: {dateStr}
                  </h4>
                </div>
              );
            })}
          </>
        )}
      </InnerContainer>
    </>
  );
}
