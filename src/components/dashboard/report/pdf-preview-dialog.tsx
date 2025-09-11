"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { generatePDFContent } from "@/lib/utils/pdf-generator";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  records: any[];
  dynamicColumns: string[];  
  getFieldValue: (record: any, column: string) => boolean;
  onDownload: () => void;
}

export function PDFPreviewDialog({
  open,
  onOpenChange,
  records,
  dynamicColumns, 
  getFieldValue, 
  onDownload,
}: PDFPreviewDialogProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    if (open && records.length > 0) {
      // Generate PDF with dynamic columns
      const doc = generatePDFContent(records, dynamicColumns,getFieldValue, true);  // Pass dynamicColumns
      
      // Create blob with proper MIME type
      const pdfBlob = doc.output("blob");
      
      // Create object URL
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      // Cleanup function
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    }
  }, [open, records, dynamicColumns]);  // Add dynamicColumns to dependencies

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 gap-0">  {/* Increased width for landscape */}
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>PDF Preview</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 w-full overflow-hidden">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="PDF Preview"
              style={{ minHeight: "500px" }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading PDF...</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          <Button onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}