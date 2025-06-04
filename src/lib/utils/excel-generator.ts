import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function generateExcel(records: any[]) {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Prepare data
  const excelData = records.map(record => ({
    "Date": record.date,
    "Time": record.time,
    "Account No": record.accountNo,
    "Area": record.area,
    "Supervisor": record.supervisor,
    "Team No": record.teamNo,
    "Helper": record.helper,
    "DC": record.dc ? "Yes" : "No",
    "RC": record.rc ? "Yes" : "No",
    "100% Payment": record.payment100 ? "Yes" : "No",
    "80% Payment": record.payment80 ? "Yes" : "No",
    "50% Payment": record.payment50 ? "Yes" : "No",
    "Already Paid": record.alreadyPaid ? "Yes" : "No",
    "Gate Closed": record.gateClosed ? "Yes" : "No",
    "Meter Removed": record.meterRemoved ? "Yes" : "No",
    "Already Disconnected": record.alreadyDisconnected ? "Yes" : "No",
    "Wrong Meter": record.wrongMeter ? "Yes" : "No",
    "Billing Error": record.billingError ? "Yes" : "No",
    "Can't Find": record.cantFind ? "Yes" : "No",
    "Objections": record.objections ? "Yes" : "No",
    "Stopped By NWSDB": record.stoppedByNWSDB ? "Yes" : "No",
  }));
  
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
    { wch: 8 },  // DC
    { wch: 8 },  // RC
    { wch: 12 }, // 100% Payment
    { wch: 12 }, // 80% Payment
    { wch: 12 }, // 50% Payment
    { wch: 12 }, // Already Paid
    { wch: 12 }, // Gate Closed
    { wch: 14 }, // Meter Removed
    { wch: 18 }, // Already Disconnected
    { wch: 12 }, // Wrong Meter
    { wch: 12 }, // Billing Error
    { wch: 10 }, // Can't Find
    { wch: 10 }, // Objections
    { wch: 16 }, // Stopped By NWSDB
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