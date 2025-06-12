import * as XLSX from "xlsx";

export const generateSupervisorWiseExcel = (
  groupedData: Record<string, any[]>,
  calculateAreaTotals: (areaData: any[]) => any
) => {
  // Create flat array with proper structure including area totals
  const flatData: any[] = [];
  
  // Add header row structure
  Object.entries(groupedData).forEach(([area, areaData]) => {
    // Add individual supervisor rows for this area
    areaData.forEach(data => {
      flatData.push({
        'Team': data.teamNo,
        'S.Name': data.supervisor,
        'Area': data.area,
        'Returned': data.returned,
        'Returned %': data.returnedPercentage,
        'B/F': data.broughtForward,
        'B/F %': data.bfPercentage,
        'Jobs Received': data.jobsReceived,
        'Total Jobs': data.totalJobs,
        'Days': data.days,
        'Waiting': data.waiting,
        'OC Done': data.ocDone,
        'RC Done': data.rcDone,
        '100%': data.payment100,
        '80%': data.payment80,
        '50%': data.payment50,
        'Already Paid': data.alreadyPaid,
        'Payment %': data.paymentPercentage,
        'Un Solved Cus Comp': data.unSolvedCusComp,
        'Gate Closed': data.gateClosed,
        'Meter Removed': data.meterRemoved,
        'Already Disconnected': data.alreadyDisconnected,
        'Wrong Meter': data.wrongMeter,
        'Billing Error': data.billingError,
        "Can't Find": data.cantFind,
        'Objections': data.objections,
        'Stopped By NWSDB': data.stoppedByNWSDB,
        'Unable To Attend': data.unableToAttend,
        'Helpers': data.helpers.join(", ")
      });
    });
    
    // Add area total row
    const areaTotals = calculateAreaTotals(areaData);
    flatData.push({
      'Team': '',
      'S.Name': '',
      'Area': `Total for ${area}`,
      'Returned': areaTotals.returned,
      'Returned %': '',
      'B/F': areaTotals.broughtForward,
      'B/F %': '',
      'Jobs Received': areaTotals.jobsReceived,
      'Total Jobs': areaTotals.totalJobs,
      'Days': '',
      'Waiting': areaTotals.waiting,
      'OC Done': areaTotals.ocDone,
      'RC Done': areaTotals.rcDone,
      '100%': areaTotals.payment100,
      '80%': areaTotals.payment80,
      '50%': areaTotals.payment50,
      'Already Paid': areaTotals.alreadyPaid,
      'Payment %': areaTotals.totalJobs > 0 
        ? `${(((areaTotals.payment100 + areaTotals.payment80 + areaTotals.payment50 + areaTotals.alreadyPaid) / areaTotals.totalJobs) * 100).toFixed(0)}%` 
        : "0%",
      'Un Solved Cus Comp': areaTotals.unSolvedCusComp,
      'Gate Closed': areaTotals.gateClosed,
      'Meter Removed': areaTotals.meterRemoved,
      'Already Disconnected': areaTotals.alreadyDisconnected,
      'Wrong Meter': areaTotals.wrongMeter,
      'Billing Error': areaTotals.billingError,
      "Can't Find": areaTotals.cantFind,
      'Objections': areaTotals.objections,
      'Stopped By NWSDB': areaTotals.stoppedByNWSDB,
      'Unable To Attend': areaTotals.unableToAttend,
      'Helpers': ''
    });
    
    // Add empty row between areas for better readability
    flatData.push({});
  });
  
  // Remove the last empty row
  if (flatData.length > 0 && Object.keys(flatData[flatData.length - 1]).length === 0) {
    flatData.pop();
  }
  
  const worksheet = XLSX.utils.json_to_sheet(flatData);
  
  // Apply some basic styling to column widths
  const columnWidths = [
    { wch: 8 },   // Team
    { wch: 15 },  // S.Name
    { wch: 15 },  // Area
    { wch: 10 },  // Returned
    { wch: 10 },  // Returned %
    { wch: 10 },  // B/F
    { wch: 10 },  // B/F %
    { wch: 12 },  // Jobs Received
    { wch: 10 },  // Total Jobs
    { wch: 8 },   // Days
    { wch: 10 },  // Waiting
    { wch: 10 },  // OC Done
    { wch: 10 },  // RC Done
    { wch: 8 },   // 100%
    { wch: 8 },   // 80%
    { wch: 8 },   // 50%
    { wch: 12 },  // Already Paid
    { wch: 10 },  // Payment %
    { wch: 15 },  // Un Solved Cus Comp
    { wch: 12 },  // Gate Closed
    { wch: 15 },  // Meter Removed
    { wch: 18 },  // Already Disconnected
    { wch: 12 },  // Wrong Meter
    { wch: 12 },  // Billing Error
    { wch: 12 },  // Can't Find
    { wch: 12 },  // Objections
    { wch: 18 },  // Stopped By NWSDB
    { wch: 15 },  // Unable To Attend
    { wch: 20 },  // Helpers
  ];
  worksheet['!cols'] = columnWidths;
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Supervisor Wise Report");
  
  const currentDate = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `Supervisor_Wise_Report_${currentDate}.xlsx`);
};