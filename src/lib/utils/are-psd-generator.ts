import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateAreaWisePDF = (data: any[]) => {
  const doc = new jsPDF({ orientation: "landscape" });
  
  doc.setFontSize(16);
  doc.text("Area Wise Disconnection Report", 14, 15);
  
  const headers = [
    "Area", "Returned", "B/F", "Jobs Received", "Total Jobs", 
    "Teams", "Waiting", "DC Done", "DC %", "100%", "80%", 
    "50%", "Already Paid", "Gate Closed", "Meter Removed"
  ];
  
  const rows = data.map(item => [
    item.area,
    item.returned,
    item.broughtForward,
    item.jobsReceived,
    item.totalJobs,
    item.teams,
    item.waiting,
    item.dcDone,
    item.dcDonePercentage,
    item.payment100,
    item.payment80,
    item.payment50,
    item.alreadyPaid,
    item.gateClosed,
    item.meterRemoved
  ]);
  
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 25,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] }
  });
  
  const currentDate = new Date().toISOString().split("T")[0];
  doc.save(`Area_Wise_Report_${currentDate}.pdf`);
};