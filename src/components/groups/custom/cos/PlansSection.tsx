import HRow from "@/src/components/utils/HRow";
import { dbHandler } from "@/src/firebase/db";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { COS_MONTHLY_SCHEMA } from "@/src/utils/schemas/cos";
import React from "react";

export default async function PlansSection({ groupID }: { groupID: string }) {
  try {
    const { data, error } = await dbHandler.getSpecific({
      path: `GROUPS/${groupID}/COS`,
      orderCol: "date",
      ascending: true,
    });

    if (error) throw new Error(error);

    const cosData = data as COS_MONTHLY_SCHEMA;

    return (
      <div className="w-full">
        <h1 className="text-lg font-bold text-custom-dark-text">Planned COS</h1>
        <HRow className="mb-2" />
        {Object.keys(cosData).length === 0 ? (
          <div className="min-h-[10vh] bg-white grid place-items-center p-2 rounded-md">
            <p className="text-sm text-custom-grey-text">
              Oops, no plans here.
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
