import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePDFContent(
  records: any[], 
  dynamicColumns: string[] = [], 
  getFieldValue: (record: any, column: string) => boolean,
  isPreview = false
) {
  // Create PDF in landscape orientation
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = doc.internal.pageSize.width; // 297mm for A4 landscape
  const pageHeight = doc.internal.pageSize.height; // 210mm for A4 landscape
  
  // Company letterhead (adjusted for landscape)
  const companyName = "Hegra Holdings Lanka(Pvt) Ltd";
  const companyAddress = "53/1A, Shalwa Road, Nugegoda";
  const companyPhone = "Tel: +94 77 235 6563 | Email: hegraholdings@gmail.com.lk";
  
  // Add company logo placeholder
  doc.setFillColor(41, 185, 128);
  doc.rect(15, 10, 25, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("HEGRA", 27.5, 22, { align: "center" });
  
  // Company details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(companyName, pageWidth / 2, 18, { align: "center" });
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(companyAddress, pageWidth / 2, 24, { align: "center" });
  doc.text(companyPhone, pageWidth / 2, 30, { align: "center" });
  
  // Line separator
  doc.setDrawColor(41, 128, 185);
  doc.line(15, 35, pageWidth - 15, 35);
  
  // Report title
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Disconnection Report", pageWidth / 2, 42, { align: "center" });
  
  // Report metadata
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on: ${currentDate}`, 15, 48);
  doc.text(`Total Records: ${records.length}`, 15, 53);
  
  // Prepare table headers - fixed columns plus dynamic
  const tableHeaders = [
    "S/No",
    "Date", 
    "Time",
    "Account No", 
    "Area", 
    "Supervisor",
    "Team",
    "Helper",
    ...dynamicColumns
  ];
  
  // Prepare table data with proper field mapping
  const tableData = records.map((record, index) => {
    const row = [
      (index + 1).toString(),
      record.date,
      record.time,
      record.accountNo,
      record.area,
      record.supervisor,
      record.teamNo,
      record.helper,
    ];
    
    // Add dynamic column values using the same mapping logic
    dynamicColumns.forEach(column => {
      row.push(getFieldValue(record, column) ? "✓" : "");
    });
    
    return row;
  });
  
  // Calculate column widths for landscape A4
  const fixedColumnsWidth = 120; // Width for first 8 columns
  const availableWidth = 267; // 297mm - 30mm margins
  const dynamicColumnWidth = dynamicColumns.length > 0 
    ? Math.min((availableWidth - fixedColumnsWidth) / dynamicColumns.length, 15)
    : 15;
  
  // Add table with adjusted settings for landscape
  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: 58,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      cellWidth: 'auto',
    },
    columnStyles: {
      0: { cellWidth: 10 }, // S/No
      1: { cellWidth: 18 }, // Date
      2: { cellWidth: 12 }, // Time
      3: { cellWidth: 20 }, // Account No
      4: { cellWidth: 18 }, // Area
      5: { cellWidth: 18 }, // Supervisor
      6: { cellWidth: 12 }, // Team
      7: { cellWidth: 12 }, // Helper
      // Dynamic columns get calculated width
      ...Object.fromEntries(
        dynamicColumns.map((_, i) => [i + 8, { cellWidth: dynamicColumnWidth }])
      )
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (data) => {
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    },
  });
  
  return doc;
}