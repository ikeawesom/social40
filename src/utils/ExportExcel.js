import * as FS from "file-saver";
import XLSX from "sheetjs-style";

export async function ExportExcel({ excelData, filename }) {
  const filetype =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const finalData = new Blob([excelBuffer], { type: filetype });
  FS.saveAs(finalData, filename, fileExtension);
}
