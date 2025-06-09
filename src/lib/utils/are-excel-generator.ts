import * as XLSX from "xlsx";

export const generateAreaWiseExcel = (data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Area Wise Report");
  
  const currentDate = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `Area_Wise_Report_${currentDate}.xlsx`);
};