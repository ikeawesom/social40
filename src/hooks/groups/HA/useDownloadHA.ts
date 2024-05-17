import { HATableRowType } from "@/src/components/groups/custom/HA/DownloadHAButton";
import { fetchHAData } from "@/src/components/groups/custom/HA/fetchHAData";
import { ExportExcel } from "@/src/utils/helpers/ExportExcel";
import { StringToDate, DateToString } from "@/src/utils/helpers/getCurrentDate";
import { getDateDiff } from "@/src/utils/groups/HA/handleHA";
import {
  HA_REPORT_SCHEMA,
  GroupDatesActivitiesType,
} from "@/src/utils/schemas/ha";
import { useState } from "react";
import { toast } from "sonner";

export function useDownloadHA(
  groupID: string,
  reportID: string,
  from: string,
  to: string
) {
  const [loading, setLoading] = useState(false);
  const download = async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchHAData(groupID, reportID);
      if (error) throw new Error(error);
      const haData = data as HA_REPORT_SCHEMA;
      const spreadsheetData = data.data as GroupDatesActivitiesType;

      const tableRows = [] as HATableRowType[];

      const {
        time: { from, to },
      } = haData;
      let curDate = StringToDate(`${from} 00:00`).data as Date;
      const endDate = StringToDate(`${to} 00:00`).data as Date;

      let dayDiff = getDateDiff(endDate, curDate);
      let template = {} as HATableRowType;

      while (dayDiff >= 0) {
        const dateStr = DateToString(curDate).split(" ")[0];
        template[dateStr] = "";
        curDate.setDate(curDate.getDate() + 1);
        dayDiff = getDateDiff(endDate, curDate);
      }

      Object.keys(spreadsheetData).forEach((memberID: string) => {
        const memberHADates = spreadsheetData[memberID];
        const datesParticipated = Object.keys(memberHADates);
        let to_add = {} as HATableRowType;

        Object.keys(template).forEach((dateStr: string) => {
          // handle dates
          if (datesParticipated.includes(dateStr)) {
            // mnember participated in activities on this day
            const activities = memberHADates[dateStr];
            Object.keys(activities).forEach((id: string) => {
              const { activityTitle, createdBy, activityDateStr } =
                activities[id];
              const actTime = activityDateStr.split(" ")[1];

              if (Object.keys(to_add).includes(dateStr)) {
                // another activity on this date
                to_add[
                  dateStr
                ] += `${actTime} ${activityTitle} by ${createdBy}, `;
              } else {
                // only activity on this date
                to_add[
                  dateStr
                ] = `${actTime} ${activityTitle} by ${createdBy}, `;
              }
            });
          } else {
            // member does not have activities on this date
            to_add[dateStr] = "";
          }
          const text = to_add[dateStr].trim();
          const newText = text.substring(0, text.length - 1);
          to_add[dateStr] = newText;
        });

        tableRows.push({ memberID, ...to_add });
      });

      //   console.log(tableRows);

      const filename = `HA-report-${groupID}-${from}-to-${to}-${reportID}`;
      ExportExcel({ excelData: tableRows, filename });
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  return { loading, download };
}
