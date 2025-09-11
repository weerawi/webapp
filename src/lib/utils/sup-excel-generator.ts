import * as XLSX from "xlsx";
import { format } from "date-fns";

export const generateSupervisorWiseExcel = (
  groupedData: Record<string, any[]>,
  calculateAreaTotals: (areaData: any[]) => any,
  dateRange: { from: Date; to: Date | undefined }
) => {
  const workbook = XLSX.utils.book_new();
  const data: any[][] = [];
  
  // Title and date range
  const dateRangeText = dateRange.to 
    ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
    : format(dateRange.from, "dd/MM/yyyy");
  
  data.push(["Hagra Holdings Lanka (Pvt) Ltd - Daily DC/RC Summary"]);
  data.push([dateRangeText]);
  data.push([]);
  
  // Headers
  data.push([
    "Team No", "S.Name", "Area", "Helpers",
    "Previous Day Balance", "Returned", "B/F", 
    "Jobs Received", "Total Jobs", "Days", "Waiting",
    "DC Done", "RC Done",
    "100%", "80%", "50%", "Already Paid",
    "Un Solved Cus Comp", "Gate Closed", "Meter Removed", 
    "Already Disconnected", "Wrong Meter", "Billing Error", 
    "Can't Find", "Objections", "Stopped By Board", "Unable To Attend"
  ]);
  
  let rowIndex = 4; // Starting after headers
  const totalRowIndices: number[] = [];
  let grandTotalRowIndex = 0;
  
  // Add data rows
  Object.entries(groupedData).forEach(([area, areaData]) => {
    // Individual supervisor rows
    areaData.forEach(item => {
      data.push([
        item.teamNo, item.supervisor, item.area, item.helpers.join(", "),
        item.previousDayBalance, item.returned, item.broughtForward,
        item.jobsReceived, item.totalJobs, item.days, item.waiting,
        item.ocDone, item.rcDone,
        item.payment100, item.payment80, item.payment50, item.alreadyPaid,
        item.unSolvedCusComp, item.gateClosed, item.meterRemoved,
        item.alreadyDisconnected, item.wrongMeter, item.billingError,
        item.cantFind, item.objections, item.stoppedByBoard, item.unableToAttend
      ]);
      rowIndex++;
    });
    
    // Area total row
    const areaTotals = calculateAreaTotals(areaData);
    data.push([
      "", "", `Total for ${area}`, "",
      areaTotals.previousDayBalance, areaTotals.returned, areaTotals.broughtForward,
      areaTotals.jobsReceived, areaTotals.totalJobs, "",
      areaTotals.waiting, areaTotals.ocDone, areaTotals.rcDone,
      areaTotals.payment100, areaTotals.payment80, areaTotals.payment50, areaTotals.alreadyPaid,
      areaTotals.unSolvedCusComp, areaTotals.gateClosed, areaTotals.meterRemoved,
      areaTotals.alreadyDisconnected, areaTotals.wrongMeter, areaTotals.billingError,
      areaTotals.cantFind, areaTotals.objections, areaTotals.stoppedByBoard, areaTotals.unableToAttend
    ]);
    totalRowIndices.push(rowIndex);
    rowIndex++;
  });
  
  // Grand Total
  const grandTotal = Object.values(groupedData).reduce((grand, areaData) => {
    const areaTotals = calculateAreaTotals(areaData);
    return {
      previousDayBalance: grand.previousDayBalance + areaTotals.previousDayBalance,
      returned: grand.returned + areaTotals.returned,
      broughtForward: grand.broughtForward + areaTotals.broughtForward,
      jobsReceived: grand.jobsReceived + areaTotals.jobsReceived,
      totalJobs: grand.totalJobs + areaTotals.totalJobs,
      waiting: grand.waiting + areaTotals.waiting,
      ocDone: grand.ocDone + areaTotals.ocDone,
      rcDone: grand.rcDone + areaTotals.rcDone,
      payment100: grand.payment100 + areaTotals.payment100,
      payment80: grand.payment80 + areaTotals.payment80,
      payment50: grand.payment50 + areaTotals.payment50,
      alreadyPaid: grand.alreadyPaid + areaTotals.alreadyPaid,
      unSolvedCusComp: grand.unSolvedCusComp + areaTotals.unSolvedCusComp,
      gateClosed: grand.gateClosed + areaTotals.gateClosed,
      meterRemoved: grand.meterRemoved + areaTotals.meterRemoved,
      alreadyDisconnected: grand.alreadyDisconnected + areaTotals.alreadyDisconnected,
      wrongMeter: grand.wrongMeter + areaTotals.wrongMeter,
      billingError: grand.billingError + areaTotals.billingError,
      cantFind: grand.cantFind + areaTotals.cantFind,
      objections: grand.objections + areaTotals.objections,
      stoppedByBoard: grand.stoppedByBoard + areaTotals.stoppedByBoard,
      unableToAttend: grand.unableToAttend + areaTotals.unableToAttend,
    };
  }, {
    previousDayBalance: 0, returned: 0, broughtForward: 0, jobsReceived: 0,
    totalJobs: 0, waiting: 0, ocDone: 0, rcDone: 0, payment100: 0,
    payment80: 0, payment50: 0, alreadyPaid: 0, unSolvedCusComp: 0,
    gateClosed: 0, meterRemoved: 0, alreadyDisconnected: 0, wrongMeter: 0,
    billingError: 0, cantFind: 0, objections: 0, stoppedByBoard: 0, unableToAttend: 0,
  });
  
  data.push([
    "", "", "GRAND TOTAL", "",
    grandTotal.previousDayBalance, grandTotal.returned, grandTotal.broughtForward,
    grandTotal.jobsReceived, grandTotal.totalJobs, "",
    grandTotal.waiting, grandTotal.ocDone, grandTotal.rcDone,
    grandTotal.payment100, grandTotal.payment80, grandTotal.payment50, grandTotal.alreadyPaid,
    grandTotal.unSolvedCusComp, grandTotal.gateClosed, grandTotal.meterRemoved,
    grandTotal.alreadyDisconnected, grandTotal.wrongMeter, grandTotal.billingError,
    grandTotal.cantFind, grandTotal.objections, grandTotal.stoppedByBoard, grandTotal.unableToAttend
  ]);
  grandTotalRowIndex = rowIndex;
  
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 8 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, // Team, Name, Area, Helpers
    { wch: 12 }, { wch: 10 }, { wch: 8 }, // Balance columns
    { wch: 12 }, { wch: 10 }, { wch: 8 }, { wch: 10 }, // Jobs, Days, Waiting
    { wch: 10 }, { wch: 10 }, // DC/RC Done
    { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 12 }, // Payment columns
    { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 18 }, // Reason columns 1-4
    { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, // Reason columns 5-8
    { wch: 18 }, { wch: 15 } // Last reason columns
  ];
  
  // Apply styles
  const range = XLSX.utils.decode_range(worksheet['!ref']!);
  
  // Style header row (row 4, index 3)
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 3, c: col });
    if (!worksheet[cellRef]) continue;
    
    worksheet[cellRef].s = {
      fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "4285F4" } },
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center" }
    };
  }
  
  // Style area total rows (light gray)
  totalRowIndices.forEach(rowIdx => {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: rowIdx, c: col });
      if (!worksheet[cellRef]) continue;
      
      worksheet[cellRef].s = {
        fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "F0F0F0" } },
        font: { bold: true },
        alignment: { horizontal: "center" }
      };
    }
  });
  
  // Style grand total row (darker gray)
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: grandTotalRowIndex, c: col });
    if (!worksheet[cellRef]) continue;
    
    worksheet[cellRef].s = {
      fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "DCDCDC" } },
      font: { bold: true },
      alignment: { horizontal: "center" }
    };
  }
  
  XLSX.utils.book_append_sheet(workbook, worksheet, "Supervisor Report");
  
  const fileName = `Supervisor_Wise_Report_${format(dateRange.from, "yyyy-MM-dd")}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};