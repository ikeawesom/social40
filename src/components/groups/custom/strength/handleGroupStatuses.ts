import { dbHandler } from "@/src/firebase/db";
import handleResponses from "@/src/utils/helpers/handleResponses";
import { GroupStatusType } from "@/src/utils/schemas/groups";

export async function handleGroupStatuses(memberList: string[]) {
  // fetch member's statuses
  try {
    const statusArr = memberList.map(async (memberID: string) => {
      const { data, error } = await dbHandler.getSpecific({
        path: `MEMBERS/${memberID}/STATUSES`,
        orderCol: "endDate",
        ascending: false,
      });

      if (error) return handleResponses({ status: false, error });

      const statusData = {
        [memberID]: data,
      };

      return handleResponses({ data: statusData });
    });

    const statusPromiseArray = await Promise.all(statusArr);

    const groupStatusList = {} as GroupStatusType;

    statusPromiseArray.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
      const data = item.data;
      const memberID = Object.keys(data)[0];
      const memberStatusObj = data[memberID];
      groupStatusList[memberID] = memberStatusObj;
    });

    return handleResponses({ data: groupStatusList });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
