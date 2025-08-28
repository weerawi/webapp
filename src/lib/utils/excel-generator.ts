import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function generateExcel(
  records: any[], 
  dynamicColumns: string[] = [],
  getFieldValue: (record: any, column: string) => boolean
) {
  const wb = XLSX.utils.book_new();
  
  // Prepare data with proper headers
  const excelData = records.map((record, index) => {
    const row: any = {
      "S/No": index + 1,
      "Date": record.date,
      "Time": record.time,
      "Account No": record.accountNo,
      "Meter No": record.meterNo || '-',      // Added
      "Area": record.area,
      "Supervisor": record.supervisor,
      "Team No": record.teamNo,
      "Helper": record.helper,
      "Reading": record.reading || '-',        // Added
    };
    
    // Add dynamic column values using proper field mapping
    dynamicColumns.forEach(column => {
      row[column] = getFieldValue(record, column) ? "Yes" : "No";
    });
    
    return row;
  });
  
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Set column widths
  const columnWidths = [
    { wch: 6 },  // S/No
    { wch: 12 }, // Date
    { wch: 10 }, // Time
    { wch: 15 }, // Account No
    { wch: 15 }, // Meter No      - Added
    { wch: 15 }, // Area
    { wch: 15 }, // Supervisor
    { wch: 10 }, // Team No
    { wch: 15 }, // Helper
    { wch: 12 }, // Reading        - Added
    ...dynamicColumns.map(() => ({ wch: 10 })) // Dynamic columns
  ];
  ws["!cols"] = columnWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, "Disconnection Report");
  
  const currentDate = new Date().toISOString().split("T")[0];
  const filename = `Disconnection_Report_${currentDate}.xlsx`;
  
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, filename);
}