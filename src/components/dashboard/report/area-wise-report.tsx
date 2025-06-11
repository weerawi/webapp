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
import { generateAreaWiseExcel } from "@/lib/utils/are-excel-generator";
import { generateAreaWisePDF } from "@/lib/utils/are-psd-generator"; 

interface AreaWiseData {
  area: string;
  returned: number;
  broughtForward: number;
  jobsReceived: number;
  totalJobs: number;
  teams: number;
  waiting: number;
  dcDone: number;
  dcDonePercentage: string;
  totalDcDone: number;
  totalDcPercentage: string;
  rcDone: number;  
  rcDonePercentage: string;  
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
  stoppedByNWSDB: number;
  unableToAttend: number;
}

export function AreaWiseReport() {
  const records = useSelector((state: RootState) => state.report.records);
  const [areaData, setAreaData] = useState<AreaWiseData[]>([]);

  useEffect(() => {
    calculateAreaWiseData();
  }, [records]);

  const calculateAreaWiseData = () => {
    const areaMap = new Map<string, AreaWiseData>();

    records.forEach((record) => {
      if (!areaMap.has(record.area)) {
        areaMap.set(record.area, {
          area: record.area,
          returned: 0,
          broughtForward: 0,
          jobsReceived: 0,
          totalJobs: 0,
          teams: 0,
          waiting: 0,
          dcDone: 0,
          dcDonePercentage: "0%",
          totalDcDone: 0,
          totalDcPercentage: "0%",
          rcDone: 0,   
          rcDonePercentage: "0%",  
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
          stoppedByNWSDB: 0,
          unableToAttend: 0,
        });
      }

      const data = areaMap.get(record.area)!;
      
      // Update counts based on record fields
      if (record.dc) data.dcDone++;
      if (record.rc) data.rcDone++; // ADD THIS if you have an 'rc' field in records
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
      if (record.stoppedByNWSDB) data.stoppedByNWSDB++;
      if (record.unableToAttend) data.unableToAttend++; // ADD THIS if you have this field
      
      data.totalJobs++;
    });

    // Calculate percentages and finalize data
    const finalData = Array.from(areaMap.values()).map(data => {
      data.dcDonePercentage = data.totalJobs > 0 
        ? `${((data.dcDone / data.totalJobs) * 100).toFixed(2)}%` 
        : "0%";
      data.totalDcDone = data.dcDone;
      data.totalDcPercentage = data.dcDonePercentage;
      
      // Calculate RC Done percentage
      data.rcDonePercentage = data.totalJobs > 0 
        ? `${((data.rcDone / data.totalJobs) * 100).toFixed(2)}%` 
        : "0%";
        
      // Calculate teams (unique team numbers per area)
      const uniqueTeams = new Set(
        records
          .filter(r => r.area === data.area)
          .map(r => r.teamNo)
      );
      data.teams = uniqueTeams.size;
      
      return data;
    });

    setAreaData(finalData);
  };

  const handleDownloadExcel = () => {
    generateAreaWiseExcel(areaData);
  };

  const handleDownloadPDF = () => {
    generateAreaWisePDF(areaData);
  };

  const calculateTotals = () => {
    return areaData.reduce((totals, area) => ({
      returned: totals.returned + area.returned,
      broughtForward: totals.broughtForward + area.broughtForward,
      jobsReceived: totals.jobsReceived + area.jobsReceived,
      totalJobs: totals.totalJobs + area.totalJobs,
      teams: totals.teams + area.teams,
      waiting: totals.waiting + area.waiting,
      dcDone: totals.dcDone + area.dcDone,
      rcDone: totals.rcDone + area.rcDone, 
      payment100: totals.payment100 + area.payment100,
      payment80: totals.payment80 + area.payment80,
      payment50: totals.payment50 + area.payment50,
      alreadyPaid: totals.alreadyPaid + area.alreadyPaid,
      gateClosed: totals.gateClosed + area.gateClosed,
      meterRemoved: totals.meterRemoved + area.meterRemoved,
      alreadyDisconnected: totals.alreadyDisconnected + area.alreadyDisconnected,
      wrongMeter: totals.wrongMeter + area.wrongMeter,
      billingError: totals.billingError + area.billingError,
      cantFind: totals.cantFind + area.cantFind,
      objections: totals.objections + area.objections,
      stoppedByNWSDB: totals.stoppedByNWSDB + area.stoppedByNWSDB,
      unableToAttend: totals.unableToAttend + area.unableToAttend,
    }), {
      returned: 0,
      broughtForward: 0,
      jobsReceived: 0,
      totalJobs: 0,
      teams: 0,
      waiting: 0,
      dcDone: 0,
      rcDone: 0,
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
      stoppedByNWSDB: 0,
      unableToAttend: 0,
    });
  };

  const totals = calculateTotals();

  return (
    <Card className="gap-1 py-2 overflow-x-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Area Wise Disconnection Report</CardTitle>
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
      <CardContent className="relative">
        <ScrollArea className="h-[450px] w-full whitespace-nowrap">
          <div className="rounded-md border">
            <Table className="w-full"> 
              <TableHeader className="sticky top-0 bg-background z-20 shadow-sm">
                <TableRow>
                  <TableHead rowSpan={2} className="text-center border">Area</TableHead>
                  <TableHead colSpan={4} className="text-center border">Balance</TableHead>
                  <TableHead rowSpan={2} className="text-center border">Total<br/>Jobs</TableHead>
                  <TableHead rowSpan={2} className="text-center border">Teams</TableHead>
                  <TableHead rowSpan={2} className="text-center border">Waiting</TableHead>
                  <TableHead colSpan={2} className="text-center border">12:00:00 PM DC</TableHead>
                  <TableHead colSpan={2} className="text-center border">Total DC Done</TableHead>
                  <TableHead colSpan={2} className="text-center border">RC Done</TableHead>
                  <TableHead colSpan={4} className="text-center border bg-green-50">Payment</TableHead>
                  <TableHead colSpan={9} className="text-center border">Reasons</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="text-center border">Returned</TableHead>
                  <TableHead className="text-center border">B/F</TableHead>
                  <TableHead className="text-center border">Jobs<br/>Received</TableHead>
                  <TableHead className="text-center border">Total</TableHead>
                  <TableHead className="text-center border">DC Done</TableHead>
                  <TableHead className="text-center border">%</TableHead>
                  <TableHead className="text-center border">Total</TableHead>
                  <TableHead className="text-center border">%</TableHead>
                  <TableHead className="text-center border">Total</TableHead>
                  <TableHead className="text-center border">%</TableHead>
                  <TableHead className="text-center border bg-green-50">100%</TableHead>
                  <TableHead className="text-center border bg-green-50">80%</TableHead>
                  <TableHead className="text-center border bg-green-50">50%</TableHead>
                  <TableHead className="text-center border bg-green-50">Already<br/>Paid</TableHead>
                  <TableHead className="text-center border">Gate<br/>Closed</TableHead>
                  <TableHead className="text-center border">Meter<br/>Removed</TableHead>
                  <TableHead className="text-center border">Already<br/>Disconnected</TableHead>
                  <TableHead className="text-center border">Wrong<br/>Meter</TableHead>
                  <TableHead className="text-center border">Billing<br/>Error</TableHead>
                  <TableHead className="text-center border">Can't<br/>Find</TableHead>
                  <TableHead className="text-center border">Objections</TableHead>
                  <TableHead className="text-center border">Stopped By<br/>NWSDB</TableHead>
                  <TableHead className="text-center border">Unable To<br/>Attend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areaData.map((area) => (
                  <TableRow key={area.area}>
                    <TableCell className="font-medium">{area.area}</TableCell>
                    <TableCell className="text-center">{area.returned}</TableCell>
                    <TableCell className="text-center">{area.broughtForward}</TableCell>
                    <TableCell className="text-center">{area.jobsReceived}</TableCell>
                    <TableCell className="text-center">{area.totalJobs}</TableCell>
                    <TableCell className="text-center font-semibold">{area.totalJobs}</TableCell>
                    <TableCell className="text-center">{area.teams}</TableCell>
                    <TableCell className="text-center">{area.waiting}</TableCell>
                    <TableCell className="text-center">{area.dcDone}</TableCell>
                    <TableCell className="text-center">{area.dcDonePercentage}</TableCell>
                    <TableCell className="text-center">{area.totalDcDone}</TableCell>
                    <TableCell className="text-center">{area.totalDcPercentage}</TableCell>
                    <TableCell className="text-center">{area.rcDone}</TableCell>
                    <TableCell className="text-center">{area.rcDonePercentage}</TableCell>
                    <TableCell className="text-center bg-green-50">{area.payment100}</TableCell>
                    <TableCell className="text-center bg-green-50">{area.payment80}</TableCell>
                    <TableCell className="text-center bg-green-50">{area.payment50}</TableCell>
                    <TableCell className="text-center bg-green-50">{area.alreadyPaid}</TableCell>
                    <TableCell className="text-center">{area.gateClosed}</TableCell>
                    <TableCell className="text-center">{area.meterRemoved}</TableCell>
                    <TableCell className="text-center">{area.alreadyDisconnected}</TableCell>
                    <TableCell className="text-center">{area.wrongMeter}</TableCell>
                    <TableCell className="text-center">{area.billingError}</TableCell>
                    <TableCell className="text-center">{area.cantFind}</TableCell>
                    <TableCell className="text-center">{area.objections}</TableCell>
                    <TableCell className="text-center">{area.stoppedByNWSDB}</TableCell>
                    <TableCell className="text-center">{area.unableToAttend}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-gray-100">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-center">{totals.returned}</TableCell>
                  <TableCell className="text-center">{totals.broughtForward}</TableCell>
                  <TableCell className="text-center">{totals.jobsReceived}</TableCell>
                  <TableCell className="text-center">{totals.totalJobs}</TableCell>
                  <TableCell className="text-center">{totals.totalJobs}</TableCell>
                  <TableCell className="text-center">{totals.teams}</TableCell>
                  <TableCell className="text-center">{totals.waiting}</TableCell>
                  <TableCell className="text-center">{totals.dcDone}</TableCell>
                  <TableCell className="text-center">
                    {totals.totalJobs > 0 
                      ? `${((totals.dcDone / totals.totalJobs) * 100).toFixed(2)}%` 
                      : "0%"}
                  </TableCell>
                  <TableCell className="text-center">{totals.dcDone}</TableCell>
                  <TableCell className="text-center">
                    {totals.totalJobs > 0 
                      ? `${((totals.dcDone / totals.totalJobs) * 100).toFixed(2)}%` 
                      : "0%"}
                  </TableCell>
                  <TableCell className="text-center">{totals.rcDone}</TableCell>
                  <TableCell className="text-center">
                    {totals.totalJobs > 0 
                      ? `${((totals.rcDone / totals.totalJobs) * 100).toFixed(2)}%` 
                      : "0%"}
                  </TableCell>
                  <TableCell className="text-center bg-green-50">{totals.payment100}</TableCell>
                  <TableCell className="text-center bg-green-50">{totals.payment80}</TableCell>
                  <TableCell className="text-center bg-green-50">{totals.payment50}</TableCell>
                  <TableCell className="text-center bg-green-50">{totals.alreadyPaid}</TableCell>
                  <TableCell className="text-center">{totals.gateClosed}</TableCell>
                  <TableCell className="text-center">{totals.meterRemoved}</TableCell>
                  <TableCell className="text-center">{totals.alreadyDisconnected}</TableCell>
                  <TableCell className="text-center">{totals.wrongMeter}</TableCell>
                  <TableCell className="text-center">{totals.billingError}</TableCell>
                  <TableCell className="text-center">{totals.cantFind}</TableCell>
                  <TableCell className="text-center">{totals.objections}</TableCell>
                  <TableCell className="text-center">{totals.stoppedByNWSDB}</TableCell>
                  <TableCell className="text-center">{totals.unableToAttend}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}