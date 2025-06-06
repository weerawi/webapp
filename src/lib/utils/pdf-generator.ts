import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePDFContent(records: any[], dynamicColumns?: string[], isPreview = false) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Ensure dynamicColumns is always an array
  const columns = dynamicColumns || [];
  
  // Company letterhead
  const companyName = "Hegra Holdings Lanka(Pvt) Ltd";
  const companyAddress = "53/1A, Shalwa Road, Nugegoda";
  const companyPhone = "Tel: +94 77 235 6563 | Email: hegraholdings@gmail.com.lk";
  
  // Add company logo placeholder
  doc.setFillColor(41, 185, 128);
  doc.rect(15, 10, 30, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("HEGRA", 30, 27, { align: "center" });
  
  // Company details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(companyName, pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(companyAddress, pageWidth / 2, 28, { align: "center" });
  doc.text(companyPhone, pageWidth / 2, 35, { align: "center" });
  
  // Add a line separator
  doc.setDrawColor(41, 128, 185);
  doc.line(15, 45, pageWidth - 15, 45);
  
  // Report title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Disconnection Report", pageWidth / 2, 55, { align: "center" });
  
  // Report metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on: ${currentDate}`, 15, 65);
  doc.text(`Total Records: ${records.length}`, 15, 72);
  
  // Prepare table headers
  const tableHeaders = ["Date", "Account No", "Area", "Team"];
  
  // Add dynamic columns to headers if they exist
  if (columns.length > 0) {
    tableHeaders.push(...columns);
  }
  
  // Prepare table data
  const tableData = records.map(record => {
    const row = [
      record.date,
      record.accountNo,
      record.area,
      record.teamNo,
    ];
    
    // Add dynamic column values if columns exist
    if (columns.length > 0) {
      columns.forEach(column => {
        const fieldName = column.toLowerCase().replace(/\s+(.)/g, (match, chr) => chr.toUpperCase());
        row.push(record[fieldName] ? "✓" : "");
      });
    }
    
    return row;
  });
  
  // Add table
  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: 80,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    didDrawPage: (data) => {
      // Add footer on each page
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${data.pageNumber} of ${doc.getNumberOfPages()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    },
  });
  
  return doc;
}