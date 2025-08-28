import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";

export const generateSupervisorWisePDF = (
  groupedData: Record<string, any[]>,
  calculateAreaTotals: (areaData: any[]) => any,
  dateRange: { from: Date; to: Date | undefined }
) => {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  
  // Title and date
  const dateRangeText = dateRange.to 
    ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
    : format(dateRange.from, "dd/MM/yyyy");
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Hagra Holdings Lanka (Pvt) Ltd', doc.internal.pageSize.width / 2, 15, { align: 'center' });
  doc.text('Daily DC/RC Summary', doc.internal.pageSize.width / 2, 23, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(dateRangeText, doc.internal.pageSize.width / 2, 31, { align: 'center' });
  
  // Prepare table data
  const tableData: any[][] = [];
  
  Object.entries(groupedData).forEach(([area, areaData]) => {
    areaData.forEach(item => {
      tableData.push([
        item.teamNo, item.supervisor, item.area,
        item.previousDayBalance, item.returned, item.broughtForward,
        item.jobsReceived, item.totalJobs, item.days,
        item.ocDone, item.rcDone,
        item.payment100, item.payment80, item.payment50, item.alreadyPaid,
        item.unSolvedCusComp, item.gateClosed, item.meterRemoved,
        item.unableToAttend
      ]);
    });
    
    // Area total
    const areaTotals = calculateAreaTotals(areaData);
    tableData.push([
      '', '', `Total for ${area}`,
      areaTotals.previousDayBalance, areaTotals.returned, areaTotals.broughtForward,
      areaTotals.jobsReceived, areaTotals.totalJobs, '',
      areaTotals.ocDone, areaTotals.rcDone,
      areaTotals.payment100, areaTotals.payment80, areaTotals.payment50, areaTotals.alreadyPaid,
      areaTotals.unSolvedCusComp, areaTotals.gateClosed, areaTotals.meterRemoved,
      areaTotals.unableToAttend
    ]);
  });

  // Calculate Grand Total
  const grandTotal = Object.values(groupedData).reduce((grand, areaData) => {
    const areaTotals = calculateAreaTotals(areaData);
    return {
      previousDayBalance: grand.previousDayBalance + areaTotals.previousDayBalance,
      returned: grand.returned + areaTotals.returned,
      broughtForward: grand.broughtForward + areaTotals.broughtForward,
      jobsReceived: grand.jobsReceived + areaTotals.jobsReceived,
      totalJobs: grand.totalJobs + areaTotals.totalJobs,
      ocDone: grand.ocDone + areaTotals.ocDone,
      rcDone: grand.rcDone + areaTotals.rcDone,
      payment100: grand.payment100 + areaTotals.payment100,
      payment80: grand.payment80 + areaTotals.payment80,
      payment50: grand.payment50 + areaTotals.payment50,
      alreadyPaid: grand.alreadyPaid + areaTotals.alreadyPaid,
      unSolvedCusComp: grand.unSolvedCusComp + areaTotals.unSolvedCusComp,
      gateClosed: grand.gateClosed + areaTotals.gateClosed,
      meterRemoved: grand.meterRemoved + areaTotals.meterRemoved,
      unableToAttend: grand.unableToAttend + areaTotals.unableToAttend,
    };
  }, {
    previousDayBalance: 0, returned: 0, broughtForward: 0, jobsReceived: 0,
    totalJobs: 0, ocDone: 0, rcDone: 0, payment100: 0,
    payment80: 0, payment50: 0, alreadyPaid: 0, unSolvedCusComp: 0,
    gateClosed: 0, meterRemoved: 0, unableToAttend: 0,
  });

  // Add Grand Total row
  tableData.push([
    '', '', 'GRAND TOTAL',
    grandTotal.previousDayBalance, grandTotal.returned, grandTotal.broughtForward,
    grandTotal.jobsReceived, grandTotal.totalJobs, '',
    grandTotal.ocDone, grandTotal.rcDone,
    grandTotal.payment100, grandTotal.payment80, grandTotal.payment50, grandTotal.alreadyPaid,
    grandTotal.unSolvedCusComp, grandTotal.gateClosed, grandTotal.meterRemoved,
    grandTotal.unableToAttend
  ]);
  
  autoTable(doc, {
    head: [[
      'Team', 'Name', 'Area', 'Prev Balance', 'Returned', 'B/F',
      'Jobs Rec', 'Total Jobs', 'Days', 'DC Done', 'RC Done',
      '100%', '80%', '50%', 'Paid', 'Unsolved', 'Gate Closed', 'Meter Removed', 'Unable'
    ]],
    body: tableData,
    startY: 40,
    styles: { 
      fontSize: 7,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    },
    headStyles: { 
      fillColor: [66, 139, 202],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    didParseCell: function(data: any) {
      // Color total rows
      if (data.row.raw[2]?.toString().includes('Total') || data.row.raw[2] === 'GRAND TOTAL') {
        data.cell.styles.fillColor = [240, 240, 240];
        data.cell.styles.fontStyle = 'bold';
      }
      if (data.row.raw[2] === 'GRAND TOTAL') {
        data.cell.styles.fillColor = [220, 220, 220];
      }
    }
  });
  
  const fileName = `Supervisor_Wise_Report_${format(dateRange.from, "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
};