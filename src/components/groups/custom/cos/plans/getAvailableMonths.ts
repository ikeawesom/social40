import { COS_MONTHLY_SCHEMA } from "@/src/utils/schemas/cos";

export function getAvailableMonths(cosData: COS_MONTHLY_SCHEMA) {
  const months = new Array(12)
    .fill(0)
    .map((i: number, index: number) => index)
    .filter((month: number) => {
      const doneDates = Object.keys(cosData).map((date: string) =>
        parseInt(date)
      );
      return !doneDates.includes(month);
    });

  return {
    availableMonths: months,
    full: months.length === 0,
  };
}
