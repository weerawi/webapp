import * as XLSX from "xlsx";

export const generateAreaWiseExcel = (
  data: any[],
  dateRange?: { from: Date; to?: Date },
  selectedArea?: string
) => {
  // Create headers row with areas
  const headers = ["Parameter", ...data.map(d => d.area), "Total"];
  
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
      stoppedByNWSDB: acc.stoppedByNWSDB + area.stoppedByNWSDB,
      unableToAttend: acc.unableToAttend + area.unableToAttend,
    }),
    {
      returned: 0, broughtForward: 0, jobsReceived: 0, totalJobs: 0,
      teams: 0, waiting: 0, dcDone: 0, totalDcDone: 0, rcDone: 0,
      payment100: 0, payment80: 0, payment50: 0, alreadyPaid: 0,
      unSolvedCusComp: 0, gateClosed: 0, meterRemoved: 0,
      alreadyDisconnected: 0, wrongMeter: 0, billingError: 0,
      cantFind: 0, objections: 0, stoppedByNWSDB: 0, unableToAttend: 0,
    }
  );

  // Create data rows (transposed structure)
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
    { label: "Stopped By NWSDB", key: "stoppedByNWSDB" },
    { label: "Unable To Attend", key: "unableToAttend" },
  ];

  const rows = parameters.map(param => {
    const row: any = { Parameter: param.label };
    data.forEach(area => {
      row[area.area] = area[param.key as keyof typeof area];
    });
    row["Total"] = totals[param.key as keyof typeof totals];
    return row;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);
  
  // Add title and filters info at the top
  const title = [["Area Wise Disconnection Report"]];
  const dateInfo = dateRange ? 
    [[`Date Range: ${dateRange.from.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString() || dateRange.from.toLocaleDateString()}`]] : 
    [[""]];
  const areaInfo = [[`Area: ${selectedArea === "all" ? "All Areas" : selectedArea || "All Areas"}`]];
  
  // Insert title rows at the beginning
  XLSX.utils.sheet_add_aoa(worksheet, title, { origin: "A1" });
  XLSX.utils.sheet_add_aoa(worksheet, dateInfo, { origin: "A2" });
  XLSX.utils.sheet_add_aoa(worksheet, areaInfo, { origin: "A3" });
  
  // Shift data down by 4 rows
  const finalWorksheet = XLSX.utils.aoa_to_sheet([
    title[0],
    dateInfo[0],
    areaInfo[0],
    [""], // Empty row
    headers,
    ...rows.map(row => Object.values(row))
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, finalWorksheet, "Area Wise Report");
  
  const currentDate = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `Area_Wise_Report_${currentDate}.xlsx`);
};