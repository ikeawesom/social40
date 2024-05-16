"use client";
import Modal from "@/src/components/utils/Modal";
import ModalHeader from "@/src/components/utils/ModalHeader";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import { MONTHS } from "@/src/utils/constants";
import {
  COS_MONTHLY_SCHEMA,
  COS_TYPES,
  CosDailyType,
} from "@/src/utils/schemas/cos";
import React, { useEffect, useState } from "react";
import FormInputContainer from "@/src/components/utils/FormInputContainer";
import { getAvailableMonths } from "./getAvailableMonths";
import InnerContainer from "@/src/components/utils/InnerContainer";
import { DateToString } from "@/src/utils/helpers/getCurrentDate";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Badge from "@/src/components/utils/Badge";
import { CreateCOSPlan } from "@/src/utils/groups/COS/handleCOS";
import Toggle from "@/src/components/utils/Toggle";

export const getType = (day: number) => {
  return day === 0 || day === 6 ? "weekend" : day === 5 ? "friday" : "standard";
};

export default function CreatePlanSection({
  groupID,
  members,
  cosData,
  memberPoints,
}: {
  members: string[];
  groupID: string;
  cosData: COS_MONTHLY_SCHEMA;
  memberPoints: { [memberID: string]: number };
}) {
  const { availableMonths, full } = getAvailableMonths(cosData);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0]);
  const [plan, setPlan] = useState<{ [date: string]: CosDailyType }>({});
  const [ori, setOri] = useState<{ [date: string]: CosDailyType }>({});
  const [loading, setLoading] = useState(false);

  const comparePlans = () => {
    const first = JSON.stringify(plan);
    const sec = JSON.stringify(ori);
    return first === sec;
  };

  const boom = () => {
    setShowModal(false);
    setSelectedMonth(availableMonths[0]);
    calculateDays();
    setLoading(false);
  };

  const reset = () => {
    if (!comparePlans()) {
      if (
        confirm(
          "Woah, you sure you want to close this window? You have unsaved changes!"
        )
      )
        boom();
    } else {
      boom();
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedMonth(parseInt(e.target.value));

  const calculateDays = () => {
    const year = new Date().getFullYear();
    const date = new Date(year, selectedMonth, 1);
    date.setHours(date.getHours() + 8);

    let curMonth = selectedMonth;
    let dates = {} as { [date: string]: CosDailyType };

    while (curMonth === selectedMonth) {
      const curDay = DateToString(date).split(" ")[0];
      const dayOfWeek = date.getDay();
      const type = getType(dayOfWeek);

      const template = {
        memberID: members[0],
        day: date.getDate(),
        month: curMonth,
        type,
        disabled: false,
      } as CosDailyType;
      dates[curDay] = template;
      date.setDate(date.getDate() + 1);
      curMonth = date.getMonth();
    }

    setPlan(dates);
    setOri(dates);
  };
  useEffect(() => {
    calculateDays();
  }, [selectedMonth]);

  const togglePublicHols = (date: string) => {
    setPlan({
      ...plan,
      [date]: {
        ...plan[date],
        type:
          plan[date].type !== "public"
            ? "public"
            : getType(
                new Date(
                  new Date().getFullYear(),
                  plan[date].month,
                  plan[date].day
                ).getDay()
              ),
      },
    });
  };

  const handleToggleDisable = (date: string) => {
    setPlan({
      ...plan,
      [date]: {
        ...plan[date],
        disabled: Object.keys(plan[date]).includes("disabled")
          ? !plan[date].disabled ?? true
          : true,
      },
    });
  };

  const handleAssignMember = (
    e: React.ChangeEvent<HTMLSelectElement>,
    date: string
  ) => {
    setPlan({ ...plan, [date]: { ...plan[date], memberID: e.target.value } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await CreateCOSPlan(groupID, selectedMonth, plan);
      if (error) throw new Error(error);
      router.refresh();
      toast.success(
        `Nice, your plan for ${MONTHS[selectedMonth]} was saved successfully.`
      );
      router.push(`/groups/${groupID}/COS/${selectedMonth}`);
    } catch (err: any) {
      toast.error(err.message);
    }
    boom();
    setLoading(false);
  };

  return (
    <>
      {showModal && (
        <Modal>
          <ModalHeader close={reset} heading="Create Plan" />
          {full ? (
            <div className="w-full grid place-items-center p-4 h-[10vh]">
              <p className="text-sm text-custom-grey-text text-center">
                Oops, all months have been planned for. Try deleting plans from
                previous months to create new ones!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-start justify-start gap-2"
            >
              <FormInputContainer labelText="Plan for" inputName="months">
                <select name="months" onChange={handleMonthChange}>
                  {availableMonths.map((month: number) => (
                    <option key={month} value={month}>
                      {MONTHS[month]}
                    </option>
                  ))}
                </select>
              </FormInputContainer>
              <InnerContainer className="items-start max-h-[50vh]">
                {Object.keys(plan).map((date: string) => {
                  const { day, month, type, disabled } = plan[date];
                  const newScore =
                    Number(memberPoints[plan[date].memberID]) +
                    Number(COS_TYPES[type]);
                  return (
                    <div
                      key={date}
                      className="w-full p-3 border-b-[1px] border-custom-light-text"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div>
                          {type === "weekend" && (
                            <Badge className="mb-2">WEEKEND</Badge>
                          )}
                          {type === "public" && (
                            <Badge
                              className="mb-2"
                              backgroundColor="bg-purple-50"
                              borderColor="border-purple-300"
                              textColor="text-purple-300"
                            >
                              HOLIDAY
                            </Badge>
                          )}
                          <div className="flex items-center justify-start gap-2">
                            <h1 className="font-bold text-sm text-custom-dark-text">
                              {day} {MONTHS[month]}
                            </h1>
                            <Toggle
                              disable={() => handleToggleDisable(date)}
                              disabled={disabled ?? false}
                              enable={() => handleToggleDisable(date)}
                            />
                          </div>
                        </div>
                        {!disabled && (
                          <div className="self-start">
                            <p className="text-xs items-end text-custom-grey-text custom-red mb-1">
                              To earn: {COS_TYPES[type]}
                            </p>
                          </div>
                        )}
                      </div>
                      <FormInputContainer
                        inputName="assignMember"
                        labelText="Assign:"
                      >
                        <select
                          disabled={disabled}
                          name="assignMember"
                          className="w-fit"
                          onChange={(e) => handleAssignMember(e, date)}
                        >
                          {members.map((id: string) => (
                            <option key={id} value={id}>
                              {id} ({memberPoints[id]})
                            </option>
                          ))}
                        </select>
                      </FormInputContainer>
                      {!disabled && (
                        <>
                          <h1 className="mt-2 text-sm font-bold text-custom-green">
                            Points: {memberPoints[plan[date].memberID]} {" >> "}{" "}
                            {newScore}
                          </h1>
                          <p
                            onClick={() => togglePublicHols(date)}
                            className="w-fit text-xs mt-2 text-custom-grey-text underline cursor-pointer hover:text-custom-primary"
                          >
                            Toggle as Public Holiday
                          </p>
                        </>
                      )}
                    </div>
                  );
                })}
              </InnerContainer>
              <PrimaryButton disabled={loading} type="submit">
                Save Plan
              </PrimaryButton>
            </form>
          )}
        </Modal>
      )}
      <PrimaryButton
        onClick={() => {
          if (members.length > 0) {
            setShowModal(true);
          } else {
            alert(
              "Slow down! You have no COS members added. Please add some members first, then start planning."
            );
          }
        }}
        className="w-fit px-3"
      >
        Create Plan
      </PrimaryButton>
    </>
  );
}
