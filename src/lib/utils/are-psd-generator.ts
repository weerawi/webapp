import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const generateAreaWisePDF = (
  data: any[],
  dateRange?: { from: Date; to?: Date },
  selectedArea?: string
) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  
  // Title
  doc.setFontSize(16);
  doc.text("Area Wise Disconnection Report", 14, 15);
  
  // Date range and area info
  doc.setFontSize(10);
  const dateRangeText = dateRange 
    ? `${format(dateRange.from, "MM/dd/yyyy")} - ${dateRange.to ? format(dateRange.to, "MM/dd/yyyy") : format(dateRange.from, "MM/dd/yyyy")}`
    : "";
  doc.text(`Date Range: ${dateRangeText}`, 14, 22);
  doc.text(`Area: ${selectedArea === "all" ? "All Areas" : selectedArea || "All Areas"}`, 14, 28);
  
  // Calculate totals
  const totals = data.reduce(
    (acc, area) => ({
      returned: acc.returned + area.returned,
      broughtForward: acc.broughtForward + area.broughtForward,
      jobsReceived: acc.jobsReceived + area.jobsReceived,
      totalJobs: acc.totalJobs + area.totalJobs,
      teams: acc.teams + area.teams,
      waiting: acc.waiting + area.waiting,
      dcDone: acc.dcDone + area.dcDone,
      totalDcDone: acc.totalDcDone + area.totalDcDone,
      rcDone: acc.rcDone + area.rcDone,
      payment100: acc.payment100 + area.payment100,
      payment80: acc.payment80 + area.payment80,
      payment50: acc.payment50 + area.payment50,
      alreadyPaid: acc.alreadyPaid + area.alreadyPaid,
      unSolvedCusComp: acc.unSolvedCusComp + area.unSolvedCusComp,
      gateClosed: acc.gateClosed + area.gateClosed,
      meterRemoved: acc.meterRemoved + area.meterRemoved,
      alreadyDisconnected: acc.alreadyDisconnected + area.alreadyDisconnected,
      wrongMeter: acc.wrongMeter + area.wrongMeter,
      billingError: acc.billingError + area.billingError,
      cantFind: acc.cantFind + area.cantFind,
      objections: acc.objections + area.objections,
      stoppedByBoard: acc.stoppedByBoard + area.stoppedByBoard,
      unableToAttend: acc.unableToAttend + area.unableToAttend,
    }),
    {
      returned: 0, broughtForward: 0, jobsReceived: 0, totalJobs: 0,
      teams: 0, waiting: 0, dcDone: 0, totalDcDone: 0, rcDone: 0,
      payment100: 0, payment80: 0, payment50: 0, alreadyPaid: 0,
      unSolvedCusComp: 0, gateClosed: 0, meterRemoved: 0,
      alreadyDisconnected: 0, wrongMeter: 0, billingError: 0,
      cantFind: 0, objections: 0, stoppedByBoard: 0, unableToAttend: 0,
    }
  );
  
  // Headers (areas as columns)
  const headers = ["Parameter", ...data.map(d => d.area), "Total"];
  
  // Parameters
  const parameters = [
    { label: "Returned", key: "returned" },
    { label: "Brought Forward", key: "broughtForward" },
    { label: "Jobs Received", key: "jobsReceived" },
    { label: "Total Jobs", key: "totalJobs" },
    { label: "Teams", key: "teams" },
    { label: "Waiting", key: "waiting" },
    // { label: "12:00:00 PM DC", key: "dcDone" },
    { label: "Total DC Done", key: "totalDcDone" },
    { label: "Total RC Done", key: "rcDone" },
    { label: "100%", key: "payment100" },
    { label: "80%", key: "payment80" },
    { label: "50%", key: "payment50" },
    { label: "Already Paid", key: "alreadyPaid" },
    { label: "Un Solved Cus Comp.", key: "unSolvedCusComp" },
    { label: "Gate Closed", key: "gateClosed" },
    { label: "Meter Removed", key: "meterRemoved" },
    { label: "Already Disconnected", key: "alreadyDisconnected" },
    { label: "Wrong Meter", key: "wrongMeter" },
    { label: "Billing Error", key: "billingError" },
    { label: "Can't Find", key: "cantFind" },
    { label: "Objections", key: "objections" },
    { label: "Stopped By Board", key: "stoppedByBoard" },
    { label: "Unable To Attend", key: "unableToAttend" },
  ];
  
  // Create rows (transposed structure)
  const rows = parameters.map(param => {
    const row = [param.label];
    data.forEach(area => {
      row.push(String(area[param.key as keyof typeof area] || 0));
    });
    row.push(String(totals[param.key as keyof typeof totals] || 0));
    return row;
  });
  
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 35,
    theme: 'grid',
    styles: { 
      fontSize: 7,
      cellPadding: 1,
      lineWidth: 0.1
    },
    headStyles: { 
      fillColor: [66, 139, 202],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'left' }, // Parameter column
      ...Object.fromEntries(
        [...Array(data.length + 1)].map((_, i) => [
          i + 1, 
          { halign: 'center' }
        ])
      )
    }
  });
  
  const currentDate = new Date().toISOString().split("T")[0];
  doc.save(`Area_Wise_Report_${currentDate}.pdf`);
};