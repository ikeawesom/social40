export function getActiveStatus(endDate: string) {
  const today = new Date();
  const endDateStr = endDate.split(" ")[0];
  const endDateArr = endDateStr.split("/");
  const endDateNew = new Date(
    Number.parseInt(endDateArr[2]),
    Number.parseInt(endDateArr[1]) - 1,
    Number.parseInt(endDateArr[0]) + 1,
    7,
    59
  );

  return today <= endDateNew;
}
