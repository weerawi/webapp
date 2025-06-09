"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SupervisorWiseData {
  supervisor: string;
  area: string;
  totalJobs: number;
  dcDone: number;
  rcDone: number;
  dcPercentage: string;
  payment100: number;
  payment80: number;
  payment50: number;
  alreadyPaid: number;
  gateClosed: number;
  meterRemoved: number;
  alreadyDisconnected: number;
  wrongMeter: number;
  billingError: number;
  cantFind: number;
  objections: number;
  helpers: string[];
}

export function SupervisorWiseReport() {
  const records = useSelector((state: RootState) => state.report.records);
  const [supervisorData, setSupervisorData] = useState<SupervisorWiseData[]>([]);

  useEffect(() => {
    calculateSupervisorWiseData();
  }, [records]);

  const calculateSupervisorWiseData = () => {
    const supervisorMap = new Map<string, SupervisorWiseData>();

    records.forEach((record) => {
      const key = `${record.supervisor}-${record.area}`;
      
      if (!supervisorMap.has(key)) {
        supervisorMap.set(key, {
          supervisor: record.supervisor,
          area: record.area,
          totalJobs: 0,
          dcDone: 0,
          rcDone: 0,
          dcPercentage: "0%",
          payment100: 0,
          payment80: 0,
          payment50: 0,
          alreadyPaid: 0,
          gateClosed: 0,
          meterRemoved: 0,
          alreadyDisconnected: 0,
          wrongMeter: 0,
          billingError: 0,
          cantFind: 0,
          objections: 0,
          helpers: [],
        });
      }

      const data = supervisorMap.get(key)!;
      
      // Update counts
      if (record.dc) data.dcDone++;
      if (record.rc) data.rcDone++;
      if (record.payment100) data.payment100++;
      if (record.payment80) data.payment80++;
      if (record.payment50) data.payment50++;
      if (record.alreadyPaid) data.alreadyPaid++;
      if (record.gateClosed) data.gateClosed++;
      if (record.meterRemoved) data.meterRemoved++;
      if (record.alreadyDisconnected) data.alreadyDisconnected++;
      if (record.wrongMeter) data.wrongMeter++;
      if (record.billingError) data.billingError++;
      if (record.cantFind) data.cantFind++;
      if (record.objections) data.objections++;
      
      // Add unique helpers
      if (record.helper && !data.helpers.includes(record.helper)) {
        data.helpers.push(record.helper);
      }
      
      data.totalJobs++;
    });

    // Calculate percentages and sort by supervisor
    const finalData = Array.from(supervisorMap.values())
      .map(data => {
        data.dcPercentage = data.totalJobs > 0 
          ? `${((data.dcDone / data.totalJobs) * 100).toFixed(1)}%` 
          : "0%";
        return data;
      })
      .sort((a, b) => a.supervisor.localeCompare(b.supervisor));

    setSupervisorData(finalData);
  };

  const handleDownloadExcel = () => {
    // Implement Excel generation for supervisor report
    console.log("Download Excel for Supervisor Report");
  };

  const handleDownloadPDF = () => {
    // Implement PDF generation for supervisor report
    console.log("Download PDF for Supervisor Report");
  };

  return (
    <Card className="gap-1 py-2 overflow-x-hidden">
      <CardHeader>
        <div className=" flex items-center justify-between">
          <CardTitle>Supervisor Wise Disconnection Report</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownloadPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Download Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent  className="relative">
      <div className="rounded-md border">

        <ScrollArea className="h-[450px] w-full whitespace-nowrap" >
          <Table className="w-full">
            <TableHeader className="sticky top-0 bg-background z-20 shadow-sm">
              <TableRow>
                <TableHead rowSpan={2} className="text-center border">Supervisor</TableHead>
                <TableHead rowSpan={2} className="text-center border">Area</TableHead>
                <TableHead rowSpan={2} className="text-center border">Total Jobs</TableHead>
                <TableHead colSpan={3} className="text-center border">Disconnection Status</TableHead>
                <TableHead colSpan={4} className="text-center border bg-green-50">Payment Status</TableHead>
                <TableHead colSpan={7} className="text-center border">Reasons for Not Disconnected</TableHead>
                <TableHead rowSpan={2} className="text-center border">Helpers</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center border">DC Done</TableHead>
                <TableHead className="text-center border">RC Done</TableHead>
                <TableHead className="text-center border">DC %</TableHead>
                <TableHead className="text-center border bg-green-50">100%</TableHead>
                <TableHead className="text-center border bg-green-50">80%</TableHead>
                <TableHead className="text-center border bg-green-50">50%</TableHead>
                <TableHead className="text-center border bg-green-50">Already Paid</TableHead>
                <TableHead className="text-center border">Gate Closed</TableHead>
                <TableHead className="text-center border">Meter Removed</TableHead>
                <TableHead className="text-center border">Already Disconnected</TableHead>
                <TableHead className="text-center border">Wrong Meter</TableHead>
                <TableHead className="text-center border">Billing Error</TableHead>
                <TableHead className="text-center border">Can't Find</TableHead>
                <TableHead className="text-center border">Objections</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supervisorData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{data.supervisor}</TableCell>
                  <TableCell>{data.area}</TableCell>
                  <TableCell className="text-center font-semibold">{data.totalJobs}</TableCell>
                  <TableCell className="text-center">{data.dcDone}</TableCell>
                  <TableCell className="text-center">{data.rcDone}</TableCell>
                  <TableCell className="text-center font-medium">{data.dcPercentage}</TableCell>
                  <TableCell className="text-center bg-green-50">{data.payment100}</TableCell>
                  <TableCell className="text-center bg-green-50">{data.payment80}</TableCell>
                  <TableCell className="text-center bg-green-50">{data.payment50}</TableCell>
                  <TableCell className="text-center bg-green-50">{data.alreadyPaid}</TableCell>
                  <TableCell className="text-center">{data.gateClosed}</TableCell>
                  <TableCell className="text-center">{data.meterRemoved}</TableCell>
                  <TableCell className="text-center">{data.alreadyDisconnected}</TableCell>
                  <TableCell className="text-center">{data.wrongMeter}</TableCell>
                  <TableCell className="text-center">{data.billingError}</TableCell>
                  <TableCell className="text-center">{data.cantFind}</TableCell>
                  <TableCell className="text-center">{data.objections}</TableCell>
                  <TableCell className="text-sm">{data.helpers.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

      </div>
      </CardContent>
    </Card>
  );
}