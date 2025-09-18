"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  Download,
  FileText,
  Camera,
  FileSpreadsheet,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PDFPreviewDialog } from "./pdf-preview-dialog";
import { generatePDFContent } from "@/lib/utils/pdf-generator";
import { generateExcel } from "@/lib/utils/excel-generator";
import { fetchWaterboardOptions } from "@/lib/services/adminService";
import { buildOrderedColumns } from "@/lib/constant/report-structure";
import { useDispatch, useSelector } from "react-redux";
import { setDynamicColumnsAll } from "@/lib/store/slices/reportSlice";
import { hideLoader, showLoader } from "@/lib/store/slices/loaderSlice";
import { checkRecordType } from "@/lib/utils/record-type-checker";

export function ReportView() {
  const { filteredRecords = [] } = useReports();
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [dynamicColumns, setDynamicColumns] = useState<string[]>([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedJobImage, setSelectedJobImage] = useState<{
    imageUrl: string;
    type: string;
    accountNo: string;
    date: string;
  }>({ imageUrl: "", type: "", accountNo: "", date: "" });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.auth.user);


  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      
      // If same date, sort by time
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      return (timeB[0] * 60 + timeB[1]) - (timeA[0] * 60 + timeA[1]);
    });
  }, [filteredRecords]);

  // Memoized calculations for pagination
  const paginationInfo = useMemo(() => {
    const totalRecords = sortedRecords.length;
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRecords);
    // const currentRecords = filteredRecords.slice(startIndex, endIndex);
    const currentRecords = sortedRecords.slice(startIndex, endIndex);
    
    return {
      totalRecords,
      totalPages,
      startIndex,
      endIndex,
      currentRecords,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  // }, [filteredRecords, currentPage, rowsPerPage]);
  }, [sortedRecords, currentPage, rowsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRecords.length]);

  useEffect(() => {
    fetchDynamicColumns();
  }, []);

  const fetchDynamicColumns = async () => {
    dispatch(showLoader("Loading report columns..."));
    try {
      const options = await fetchWaterboardOptions();
      const names = options.map(o => o.name);
      const ordered = buildOrderedColumns(names, false);
      setDynamicColumns(ordered);
      dispatch(setDynamicColumnsAll(ordered));
    } catch (error) {
      console.error("Failed to fetch columns:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
      // Scroll to top of table
      document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  // Memoized getFieldValue to prevent recalculation
  // const getFieldValue = useMemo(() => {
  //   return (record: any, columnName: string): boolean => {
  //     if (record.type) {
  //       const types = typeMapping[columnName] || [columnName.toLowerCase()];
  //       return types.some(t => record.type.toLowerCase().includes(t.toLowerCase()));
  //     }
      
  //     const candidates = typeMapping[columnName] || fallbackCandidates(columnName);
  //     for (const key of candidates) {
  //       if (key in (record || {})) {
  //         return Boolean(record[key]);
  //       }
  //     }
  //     return false;
  //   };
  // }, [typeMapping]);
  const getFieldValue = useMemo(() => {
    return (record: any, columnName: string): boolean => {
      // Map display columns to field names
      const fieldMapping: Record<string, string> = {
        "DC": "dc",
        "RC": "rc", 
        "100%": "payment100",
        "Payment Amount": "paymentAmount",
        "99-75%": "payment80",
        "74-50%": "payment50",
        "CTP": "ctp",
        "P": "gateClosed",
        "T": "gateClosed",
        "Complaint": "unSolvedCusComp",
        "Protest": "objections",
        "Not.Att": "cantFind",
        "Already DC": "alreadyDisconnected",
      };
      
      const fieldName = fieldMapping[columnName] || columnName.toLowerCase().replace(/\s+/g, "");
      return checkRecordType(record, fieldName);
    };
  }, []);

  // const fallbackCandidates = (name: string): string[] => {
  //   const cleaned = name
  //     .toLowerCase()
  //     .replace(/[%().]/g, " ")
  //     .replace(/[^a-z0-9]+/g, " ")
  //     .trim()
  //     .split(" ")
  //     .filter(Boolean);
  //   if (!cleaned.length) return [];
  //   const camel = cleaned
  //     .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
  //     .join("");
  //   return [camel];
  // };

  

  const renderCheckmark = (value: boolean, record?: any, columnName?: string) => {
    if (!value) return null;
    
    return (
      <div className="flex justify-center">
        <button
          type="button"
          className="h-4 w-4 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedJobImage({
              imageUrl: record.imageUrl,
              type: record.type || columnName || "",
              accountNo: record.accountNo || "",
              date: `${record.date || ""} ${record.time || ""}`
            });
            setImageModalOpen(true);
          }}
        />
      </div>
    );
  };

  const handleViewPhoto = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setPhotoDialogOpen(true);
  };

  const handlePreviewPDF = () => {
    setPdfPreviewOpen(true);
  };

  const handleDownloadPDF = () => {
    // Use ALL records for export, not just current page
    const doc = generatePDFContent(filteredRecords, dynamicColumns, getFieldValue);
    const currentDate = new Date().toISOString().split("T")[0];
    doc.save(`Disconnection_Report_${currentDate}.pdf`);
  };

  const handleDownloadExcel = () => {
    // Use ALL records for export, not just current page
    generateExcel(filteredRecords, dynamicColumns, getFieldValue);
  };

  // Generate page numbers to display
  const getPageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);
    
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(paginationInfo.totalPages, currentPage + halfVisible);
    
    if (currentPage <= halfVisible) {
      end = Math.min(maxVisible, paginationInfo.totalPages);
    }
    
    if (currentPage > paginationInfo.totalPages - halfVisible) {
      start = Math.max(1, paginationInfo.totalPages - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, paginationInfo.totalPages]);

  return (
    <>
      <Card className="gap-0 pt-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Disconnection Report ({paginationInfo.totalRecords} total records)
            </CardTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export All
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

          {/* Table with fixed height */} 
          <ScrollArea className="h-[420px] border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-10">S/No</TableHead>
                  <TableHead className="w-24">Date</TableHead>
                  <TableHead className="w-20">Time</TableHead>
                  <TableHead className="w-28">Account No</TableHead>
                  <TableHead className="w-20">Meter No</TableHead>
                  <TableHead className="w-24">Area</TableHead>
                  <TableHead className="w-24">Supervisor</TableHead>
                  <TableHead className="w-20">Team</TableHead>
                  <TableHead className="w-20">Helper</TableHead>
                  <TableHead className="w-16">Reading</TableHead>
                  {dynamicColumns.map((column) => (
                    <TableHead key={column} className="text-center w-24">
                      {column}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Photo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginationInfo.currentRecords.map((record, index) => (
                  <TableRow key={record.id}>
                    <TableCell>{paginationInfo.startIndex + index + 1}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.time}</TableCell>
                    <TableCell>{record.accountNo}</TableCell>
                    <TableCell>{record.meterNo || '-'}</TableCell>
                    <TableCell>{record.area}</TableCell>
                    <TableCell>{record.supervisor}</TableCell>
                    <TableCell>{record.teamNo}</TableCell>
                    <TableCell>{record.helper}</TableCell>
                    <TableCell>{record.reading || '-'}</TableCell>
                    
                    {dynamicColumns.map((column) => (
                      <TableCell key={column}>
                        {renderCheckmark(getFieldValue(record, column), record, column)}
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
                
                {/* Remove or minimize empty rows - Option 1: Remove completely */}
                {/* No empty rows needed with ScrollArea */}
                
                {/* Option 2: If you want to keep some spacing for short lists */}
                {paginationInfo.currentRecords.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={11 + dynamicColumns.length} 
                      className="h-32 text-center text-muted-foreground"
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Pagination Controls - Bottom */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {paginationInfo.startIndex + 1} to {paginationInfo.endIndex} of{" "}
                {paginationInfo.totalRecords} entries
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Rows per page:</span>
                <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={!paginationInfo.hasPrevPage}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!paginationInfo.hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Page number buttons */}
              {getPageNumbers.map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!paginationInfo.hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(paginationInfo.totalPages)}
                disabled={!paginationInfo.hasNextPage}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
            </div>
            
          </div>
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

      {/* Image Modal */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Job Photo</DialogTitle>
            <div className="text-sm text-muted-foreground mt-2">
              <p>Account: {selectedJobImage.accountNo}</p>
              <p>Type: {selectedJobImage.type}</p>
              <p>Date: {selectedJobImage.date}</p>
            </div>
          </DialogHeader>
          <div className="flex justify-center p-6">
            {selectedJobImage.imageUrl && selectedJobImage.imageUrl !== "" ? (
              <div className="relative h-80 w-full">
                <Image
                  src={selectedJobImage.imageUrl}
                  alt="Job photo"
                  fill
                  className="object-contain rounded-md"
                  onError={(e) => {
                    console.error("Image failed to load:", selectedJobImage.imageUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Camera className="h-12 w-12 mb-2 opacity-50" />
                <p>No image available for this job</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <PDFPreviewDialog
        open={pdfPreviewOpen}
        onOpenChange={setPdfPreviewOpen}
        records={filteredRecords}
        dynamicColumns={dynamicColumns}
        getFieldValue={getFieldValue}
        onDownload={() => {
          handleDownloadPDF();
          setPdfPreviewOpen(false);
        }}
      />
    </>
  );
}
