"use client";

import { useState, useEffect } from "react";
import { useReports } from "@/lib/hooks/useReports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  FileText,
  BarChart3,
  Camera,
  FileSpreadsheet,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PDFPreviewDialog } from "./pdf-preview-dialog";
import { generatePDFContent } from "@/lib/utils/pdf-generator";
import { generateExcel } from "@/lib/utils/excel-generator";
import { fetchWaterboardOptions } from "@/lib/services/adminService";
import { buildOrderedColumns } from "@/lib/constant/report-structure"; 

export function ReportView() {
  const { filteredRecords = [] } = useReports();
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [dynamicColumns, setDynamicColumns] = useState<string[]>([]);

  useEffect(() => {
    fetchDynamicColumns();
  }, []);

  const fetchDynamicColumns = async () => {
    try {
      const options = await fetchWaterboardOptions();
      const names = options.map(o => o.name);
      const ordered = buildOrderedColumns(names, false);
      console.debug("Fetched option names:", names);
      console.debug("Ordered dynamic columns:", ordered);
      setDynamicColumns(ordered);
    } catch (error) {
      console.error("Failed to fetch columns:", error);
    }
  };

  const handleViewPhoto = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setPhotoDialogOpen(true);
  };

  const handlePreviewPDF = () => {
    setPdfPreviewOpen(true);
  };

  const handleDownloadPDF = () => {
    const doc = generatePDFContent(filteredRecords, dynamicColumns);
    const currentDate = new Date().toISOString().split("T")[0];
    doc.save(`Disconnection_Report_${currentDate}.pdf`);
  };

  const handleDownloadExcel = () => {
    generateExcel(filteredRecords, dynamicColumns);
  };

  const renderCheckmark = (value: boolean) =>
    value ? (
      <div className="flex justify-center">
        <div className="h-4 w-4 rounded-full bg-green-500" />
      </div>
    ) : null;

  // Helper function to get field value from record
  // const getFieldValue = (record: any, columnName: string): boolean => {
  //   // Convert column name to camelCase to match record fields
  //   const fieldName = columnName
  //     .toLowerCase()
  //     .replace(/\s+(.)/g, (match, chr) => chr.toUpperCase());
  //   return record[fieldName] || false;
  // };
  const COLUMN_KEY_MAP: Record<string, string[]> = {
    "DC": ["dc"],
    "RC": ["rc"],
    "Payment Amount": ["paymentAmount"],        // if numeric, you will display differently (not a green dot)
    "100%": ["payment100", "payment_100"],
    "99-75%": ["payment80", "payment99_75"],
    "74-50%": ["payment50", "payment74_50"],
    "CTP": ["ctp"],
    "P": ["houseClosedP", "gateClosed"],        // verify mapping
    "T": ["houseClosedT", "meterRemoved"],      // verify mapping
    "Complaint": ["unSolvedCusComp", "complaint"],
    "Protest": ["objections", "protest"],
    "Not.Att": ["cantFind", "notAtt", "notAttempted"],
    "Already DC": ["alreadyDisconnected", "alreadyDc"],
    "Remarks": ["remarksFlag", "remarksPresent"] // remove or adapt if not boolean
  };

  // If a column name not in map, derive a candidate key.
  const fallbackCandidates = (name: string): string[] => {
    const cleaned = name
      .toLowerCase()
      .replace(/[%().]/g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean);
    if (!cleaned.length) return [];
    const camel = cleaned
      .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
      .join("");
    return [camel];
  };

  const getFieldValue = (record: any, columnName: string): boolean => {
    const candidates = COLUMN_KEY_MAP[columnName] || fallbackCandidates(columnName);
    for (const key of candidates) {
      if (key in (record || {})) {
        return Boolean(record[key]);
      }
    }
    return false;
  };

  return (
    <>
      <Card className="gap-0 pt-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Disconnection Report ({filteredRecords.length} records)
            </CardTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handlePreviewPDF()}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownloadPDF()}>
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownloadExcel()}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Download Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[450px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-10">S/No</TableHead>
                  <TableHead className="w-24">Date</TableHead>
                  <TableHead className="w-20">Time</TableHead>
                  <TableHead className="w-28">Account No</TableHead>
                  <TableHead className="w-24">Area</TableHead>
                  <TableHead className="w-24">Supervisor</TableHead>
                  <TableHead className="w-20">Team</TableHead>
                  <TableHead className="w-20">Helper</TableHead>
                  {dynamicColumns.map((column) => (
                    <TableHead key={column} className="text-center w-24">
                      {column}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Photo</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.time}</TableCell>
                    <TableCell>{record.accountNo}</TableCell>
                    <TableCell>{record.area}</TableCell>
                    <TableCell>{record.supervisor}</TableCell>
                    <TableCell>{record.teamNo}</TableCell>
                    <TableCell>{record.helper}</TableCell>
                    {dynamicColumns.map((column) => (
                      <TableCell key={column}>
                        {renderCheckmark(getFieldValue(record, column))}
                      </TableCell>
                    ))}
                    <TableCell>
                      {record.photo && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPhoto(record.photo!)}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Photo Modal */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disconnection Photo</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-6">
            {selectedPhoto && (
              <div className="relative h-64 w-64">
                <Image
                  src={selectedPhoto}
                  alt="Disconnection photo"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <PDFPreviewDialog
        open={pdfPreviewOpen}
        onOpenChange={setPdfPreviewOpen}
        records={filteredRecords}
        onDownload={() => {
          handleDownloadPDF();
          setPdfPreviewOpen(false);
        }}
      />
    </>
  );
}
