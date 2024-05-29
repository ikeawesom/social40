import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../helpers/handleResponses";
import { FALLOUTS_SCHEMA } from "../schemas/activities";

function checkValidReason(r: string) {
  const reason = r.toLowerCase();
  const validKeywords = ["course", "ippt", "duty", "duties", "cos"];
  return validKeywords.some((s: string) => reason.includes(s));
}

export async function getMemberFallouts(
  memberID: string,
  involvedActivities: string[]
) {
  try {
    const promArr = involvedActivities.map(async (id: string) => {
      const { data, error } = await dbHandler.getSpecific({
        path: `GROUP-ACTIVITIES/${id}/FALLOUTS`,
        orderCol: "memberID",
        ascending: false,
      });
      if (error) return handleResponses({ status: false, error });
      const fallouts = data as { [memID: string]: FALLOUTS_SCHEMA };
      return handleResponses({
        data: Object.keys(fallouts).includes(memberID)
          ? checkValidReason(fallouts[memberID].reason)
            ? false
            : id
          : null,
      });
    });

    const resArr = await Promise.all(promArr);

    const felloutActivities = [] as string[];
    resArr.forEach((item: any) => {
      if (item.error) throw new Error(item.error);
      if (item.data) felloutActivities.push(item.data);
    });

    return handleResponses({ data: felloutActivities });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
