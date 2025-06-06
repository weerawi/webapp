import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function generateExcel(records: any[], dynamicColumns: string[] = []) {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Prepare headers
  const headers: any = {
    "Date": "Date",
    "Time": "Time",
    "Account No": "Account No",
    "Area": "Area",
    "Supervisor": "Supervisor",
    "Team No": "Team No",
    "Helper": "Helper"
  };
  
  // Add dynamic columns to headers
  dynamicColumns.forEach(column => {
    headers[column] = column;
  });
  
  // Prepare data
  const excelData = records.map(record => {
    const row: any = {
      "Date": record.date,
      "Time": record.time,
      "Account No": record.accountNo,
      "Area": record.area,
      "Supervisor": record.supervisor,
      "Team No": record.teamNo,
      "Helper": record.helper,
    };
    
    // Add dynamic column values
    dynamicColumns.forEach(column => {
      const fieldName = column.toLowerCase().replace(/\s+(.)/g, (match, chr) => chr.toUpperCase());
      row[column] = record[fieldName] ? "Yes" : "No";
    });
    
    return row;
  });
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Set column widths
  const columnWidths = [
    { wch: 12 }, // Date
    { wch: 10 }, // Time
    { wch: 15 }, // Account No
    { wch: 15 }, // Area
    { wch: 15 }, // Supervisor
    { wch: 10 }, // Team No
    { wch: 15 }, // Helper
    ...dynamicColumns.map(() => ({ wch: 12 })) // Dynamic columns
  ];
  ws["!cols"] = columnWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Disconnection Report");
  
  // Generate filename with current date
  const currentDate = new Date().toISOString().split("T")[0];
  const filename = `Disconnection_Report_${currentDate}.xlsx`;
  
  // Save file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, filename);
}