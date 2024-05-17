import { useState } from "react";
import { AllDatesActivitiesType } from "../schemas/ha";
import { toast } from "sonner";
import { DateToString, StringToDate } from "../helpers/getCurrentDate";
import { HATableRowType } from "@/src/components/groups/custom/HA/DownloadHAButton";
import { getDateDiff } from "../groups/HA/handleHA";
import { ExportExcel } from "../helpers/ExportExcel";

export function useDownloadIndivHA(
  memberID: string,
  dailyActivities: AllDatesActivitiesType
) {
  const [loading, setLoading] = useState(false);

  const startDate = StringToDate(`${Object.keys(dailyActivities)[0]} 00:00`)
    .data as Date;
  let curDate = StringToDate(`${Object.keys(dailyActivities)[0]} 00:00`)
    .data as Date;

  const endDate = StringToDate(
    `${
      Object.keys(dailyActivities)[Object.keys(dailyActivities).length - 1]
    } 00:00`
  ).data as Date;

  let dayDiff = getDateDiff(endDate, curDate);
  const tableRows = [] as HATableRowType[];
  let template = {} as HATableRowType;

  while (dayDiff >= 0) {
    const dateStr = DateToString(curDate).split(" ")[0];
    template[dateStr] = "";
    curDate.setDate(curDate.getDate() + 1);
    dayDiff = getDateDiff(endDate, curDate);
  }

  const download = async () => {
    setLoading(true);
    try {
      let to_add = {} as HATableRowType;
      Object.keys(template).forEach((dateStr: string) => {
        if (Object.keys(dailyActivities).includes(dateStr)) {
          const activitiesOnDate = dailyActivities[dateStr];

          Object.keys(activitiesOnDate).forEach((id: string) => {
            const { activityTitle, createdBy, activityDateStr } =
              dailyActivities[dateStr][id];
            const actTime = activityDateStr.split(" ")[1];

            if (Object.keys(to_add).includes(dateStr)) {
              // another activity on this date
              to_add[
                dateStr
              ] += `${actTime} ${activityTitle} by ${createdBy}, `;
            } else {
              // only activity on this date
              to_add[dateStr] = `${actTime} ${activityTitle} by ${createdBy}, `;
            }
          });
        } else {
          to_add[dateStr] = "";
        }
        const text = to_add[dateStr].trim();
        const newText = text.substring(0, text.length - 1);
        to_add[dateStr] = newText;
      });
      tableRows.push({ memberID, ...to_add });

      const filename = `Daily-HA-report-${memberID}-${
        Object.keys(dailyActivities)[0]
      }-to-${
        Object.keys(dailyActivities)[Object.keys(dailyActivities).length - 1]
      }`;
      ExportExcel({ excelData: tableRows, filename });
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return { download, loading };
}
