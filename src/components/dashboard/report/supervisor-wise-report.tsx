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
  teamNo: string;
  supervisor: string;
  area: string;
  returned: number;
  broughtForward: number;
  jobsReceived: number;
  bf: number;
  totalJobs: number;
  days: number;
  waiting: number;
  twelveOClock: number;
  ocDone: number;
  rcDone: number;
  dcDone: number;
  dcPercentage: string;
  payment100: number;
  payment80: number;
  payment50: number;
  alreadyPaid: number;
  unSolvedCusComp: number;
  gateClosed: number;
  meterRemoved: number;
  alreadyDisconnected: number;
  wrongMeter: number;
  billingError: number;
  cantFind: number;
  objections: number;
  stoppedByNWSDB: number;
  unableToAttend: number;
  helpers: string[];
}

export function SupervisorWiseReport() {
  const records = useSelector((state: RootState) => state.report.records);
  const [supervisorData, setSupervisorData] = useState<SupervisorWiseData[]>([]);

  useEffect(() => {
    calculateSupervisorWiseData();
  }, [records]);

  const calculateSupervisorWiseData = () => {
    const teamMap = new Map<string, SupervisorWiseData>();

    records.forEach((record) => {
      const key = `${record.teamNo}-${record.supervisor}-${record.area}`;
      
      if (!teamMap.has(key)) {
        teamMap.set(key, {
          teamNo: record.teamNo,
          supervisor: record.supervisor,
          area: record.area,
          returned: 0,
          broughtForward: 0,
          jobsReceived: 0,
          bf: 0,
          totalJobs: 0,
          days: 0,
          waiting: 0,
          twelveOClock: 0,
          ocDone: 0,
          rcDone: 0,
          dcDone: 0,
          dcPercentage: "0%",
          payment100: 0,
          payment80: 0,
          payment50: 0,
          alreadyPaid: 0,
          unSolvedCusComp: 0,
          gateClosed: 0,
          meterRemoved: 0,
          alreadyDisconnected: 0,
          wrongMeter: 0,
          billingError: 0,
          cantFind: 0,
          objections: 0,
          stoppedByNWSDB: 0,
          unableToAttend: 0,
          helpers: [],
        });
      }

      const data = teamMap.get(key)!;
      
      // Update counts based on record fields
      if (record.dc) data.dcDone++;
      if (record.rc) data.rcDone++;
      if (record.payment100) data.payment100++;
      if (record.payment80) data.payment80++;
      if (record.payment50) data.payment50++;
      if (record.alreadyPaid) data.alreadyPaid++;
      if (record.unSolvedCusComp) data.unSolvedCusComp++;
      if (record.gateClosed) data.gateClosed++;
      if (record.meterRemoved) data.meterRemoved++;
      if (record.alreadyDisconnected) data.alreadyDisconnected++;
      if (record.wrongMeter) data.wrongMeter++;
      if (record.billingError) data.billingError++;
      if (record.cantFind) data.cantFind++;
      if (record.objections) data.objections++;
      if (record.stoppedByNWSDB) data.stoppedByNWSDB++;
      if (record.unableToAttend) data.unableToAttend++;
      
      // Add unique helpers
      if (record.helper && !data.helpers.includes(record.helper)) {
        data.helpers.push(record.helper);
      }
      
      data.totalJobs++;
    });

    // Calculate percentages and sort by team number
    const finalData = Array.from(teamMap.values())
      .map(data => {
        data.dcPercentage = data.totalJobs > 0 
          ? `${((data.dcDone / data.totalJobs) * 100).toFixed(1)}%` 
          : "0%";
        return data;
      })
      .sort((a, b) => parseInt(a.teamNo) - parseInt(b.teamNo));

    setSupervisorData(finalData);
  };

  const handleDownloadExcel = () => {
    console.log("Download Excel for Supervisor Report");
  };

  const handleDownloadPDF = () => {
    console.log("Download PDF for Supervisor Report");
  };

  const calculateTotals = () => {
    return supervisorData.reduce((totals, data) => ({
      returned: totals.returned + data.returned,
      broughtForward: totals.broughtForward + data.broughtForward,
      jobsReceived: totals.jobsReceived + data.jobsReceived,
      bf: totals.bf + data.bf,
      totalJobs: totals.totalJobs + data.totalJobs,
      waiting: totals.waiting + data.waiting,
      twelveOClock: totals.twelveOClock + data.twelveOClock,
      ocDone: totals.ocDone + data.ocDone,
      rcDone: totals.rcDone + data.rcDone,
      dcDone: totals.dcDone + data.dcDone,
      payment100: totals.payment100 + data.payment100,
      payment80: totals.payment80 + data.payment80,
      payment50: totals.payment50 + data.payment50,
      alreadyPaid: totals.alreadyPaid + data.alreadyPaid,
      unSolvedCusComp: totals.unSolvedCusComp + data.unSolvedCusComp,
      gateClosed: totals.gateClosed + data.gateClosed,
      meterRemoved: totals.meterRemoved + data.meterRemoved,
      alreadyDisconnected: totals.alreadyDisconnected + data.alreadyDisconnected,
      wrongMeter: totals.wrongMeter + data.wrongMeter,
      billingError: totals.billingError + data.billingError,
      cantFind: totals.cantFind + data.cantFind,
      objections: totals.objections + data.objections,
      stoppedByNWSDB: totals.stoppedByNWSDB + data.stoppedByNWSDB,
      unableToAttend: totals.unableToAttend + data.unableToAttend,
    }), {
      returned: 0,
      broughtForward: 0,
      jobsReceived: 0,
      bf: 0,
      totalJobs: 0,
      waiting: 0,
      twelveOClock: 0,
      ocDone: 0,
      rcDone: 0,
      dcDone: 0,
      payment100: 0,
      payment80: 0,
      payment50: 0,
      alreadyPaid: 0,
      unSolvedCusComp: 0,
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
          <CardTitle>Hagra Holdings Lanka (Pvt) Ltd - Daily DC/RC Summary</CardTitle>
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
        <div className="text-sm text-muted-foreground mt-1">2025-APR</div>
      </CardHeader>
      <CardContent className="relative">
        <ScrollArea className="h-[450px] w-full whitespace-nowrap">
          <div className="rounded-md border">
            <Table className="w-full">
              <TableHeader className="sticky top-0 bg-background z-20 shadow-sm">
                <TableRow>
                  <TableHead rowSpan={2} className="text-center border">Team</TableHead>
                  <TableHead rowSpan={2} className="text-center border">S.Name</TableHead>
                  <TableHead rowSpan={2} className="text-center border">Area</TableHead>
                  <TableHead colSpan={4} className="text-center border">Balance</TableHead>
                  <TableHead rowSpan={2} className="text-center border">Total<br/>Jobs</TableHead>
                  <TableHead rowSpan={2} className="text-center border">Days</TableHead>
                  <TableHead rowSpan={2} className="text-center border">Waiting</TableHead>
                  <TableHead rowSpan={2} className="text-center border">12:00</TableHead>
                  <TableHead rowSpan={2} className="text-center border">OC Done</TableHead>
                  <TableHead rowSpan={2} className="text-center border">RC Done</TableHead>
                  <TableHead colSpan={5} className="text-center border bg-green-50">Paid</TableHead>
                  <TableHead colSpan={10} className="text-center border">Reasons</TableHead>
                  <TableHead rowSpan={2} className="text-center border">Helpers</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="text-center border">Returned</TableHead>
                  <TableHead className="text-center border">B/F</TableHead>
                  <TableHead className="text-center border">Jobs<br/>Received</TableHead>
                  <TableHead className="text-center border">BF</TableHead>
                  <TableHead className="text-center border bg-green-50">100%</TableHead>
                  <TableHead className="text-center border bg-green-50">80%</TableHead>
                  <TableHead className="text-center border bg-green-50">50%</TableHead>
                  <TableHead className="text-center border bg-green-50">Already<br/>Paid</TableHead>
                  <TableHead className="text-center border bg-green-50">%</TableHead>
                  <TableHead className="text-center border">Un Solved<br/>Cus Comp</TableHead>
                  <TableHead className="text-center border">Gate<br/>Closed</TableHead>
                  <TableHead className="text-center border">Meter<br/>Removed</TableHead>
                  <TableHead className="text-center border">Already<br/>Disconnected</TableHead>
                  <TableHead className="text-center border">Wrong<br/>Meter</TableHead>
                  <TableHead className="text-center border">Billing<br/>Error</TableHead>
                  <TableHead className="text-center border">Can't Find</TableHead>
                  <TableHead className="text-center border">Objections</TableHead>
                  <TableHead className="text-center border">Stopped By<br/>NWSDB</TableHead>
                  <TableHead className="text-center border">Unable To<br/>Attend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supervisorData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center font-medium">{data.teamNo}</TableCell>
                    <TableCell>{data.supervisor}</TableCell>
                    <TableCell>{data.area}</TableCell>
                    <TableCell className="text-center">{data.returned}</TableCell>
                    <TableCell className="text-center">{data.broughtForward}</TableCell>
                    <TableCell className="text-center">{data.jobsReceived}</TableCell>
                    <TableCell className="text-center">{data.bf}</TableCell>
                    <TableCell className="text-center font-semibold">{data.totalJobs}</TableCell>
                    <TableCell className="text-center">{data.days}</TableCell>
                    <TableCell className="text-center bg-orange-50">{data.waiting}</TableCell>
                    <TableCell className="text-center">{data.twelveOClock}</TableCell>
                    <TableCell className="text-center">{data.ocDone}</TableCell>
                    <TableCell className="text-center">{data.rcDone}</TableCell>
                    <TableCell className="text-center bg-green-50">{data.payment100}</TableCell>
                    <TableCell className="text-center bg-green-50">{data.payment80}</TableCell>
                    <TableCell className="text-center bg-green-50">{data.payment50}</TableCell>
                    <TableCell className="text-center bg-green-50">{data.alreadyPaid}</TableCell>
                    <TableCell className="text-center bg-green-50 font-medium">{data.dcPercentage}</TableCell>
                    <TableCell className="text-center">{data.unSolvedCusComp}</TableCell>
                    <TableCell className="text-center">{data.gateClosed}</TableCell>
                    <TableCell className="text-center">{data.meterRemoved}</TableCell>
                    <TableCell className="text-center">{data.alreadyDisconnected}</TableCell>
                    <TableCell className="text-center">{data.wrongMeter}</TableCell>
                    <TableCell className="text-center">{data.billingError}</TableCell>
                    <TableCell className="text-center">{data.cantFind}</TableCell>
                    <TableCell className="text-center">{data.objections}</TableCell>
                    <TableCell className="text-center">{data.stoppedByNWSDB}</TableCell>
                    <TableCell className="text-center">{data.unableToAttend}</TableCell>
                    <TableCell className="text-sm">{data.helpers.join(", ")}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-gray-100">
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-center">{totals.returned}</TableCell>
                  <TableCell className="text-center">{totals.broughtForward}</TableCell>
                  <TableCell className="text-center">{totals.jobsReceived}</TableCell>
                  <TableCell className="text-center">{totals.bf}</TableCell>
                  <TableCell className="text-center">{totals.totalJobs}</TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center bg-orange-50">{totals.waiting}</TableCell>
                  <TableCell className="text-center">{totals.twelveOClock}</TableCell>
                  <TableCell className="text-center">{totals.ocDone}</TableCell>
                  <TableCell className="text-center">{totals.rcDone}</TableCell>
                  <TableCell className="text-center bg-green-50">{totals.payment100}</TableCell>
                  <TableCell className="text-center bg-green-50">{totals.payment80}</TableCell>
                  <TableCell className="text-center bg-green-50">{totals.payment50}</TableCell>
                  <TableCell className="text-center bg-green-50">{totals.alreadyPaid}</TableCell>
                  <TableCell className="text-center bg-green-50">
                    {totals.totalJobs > 0 
                      ? `${(((totals.payment100 + totals.payment80 + totals.payment50 + totals.alreadyPaid) / totals.totalJobs) * 100).toFixed(1)}%` 
                      : "0%"}
                  </TableCell>
                  <TableCell className="text-center">{totals.unSolvedCusComp}</TableCell>
                  <TableCell className="text-center">{totals.gateClosed}</TableCell>
                  <TableCell className="text-center">{totals.meterRemoved}</TableCell>
                  <TableCell className="text-center">{totals.alreadyDisconnected}</TableCell>
                  <TableCell className="text-center">{totals.wrongMeter}</TableCell>
                  <TableCell className="text-center">{totals.billingError}</TableCell>
                  <TableCell className="text-center">{totals.cantFind}</TableCell>
                  <TableCell className="text-center">{totals.objections}</TableCell>
                  <TableCell className="text-center">{totals.stoppedByNWSDB}</TableCell>
                  <TableCell className="text-center">{totals.unableToAttend}</TableCell>
                  <TableCell className="text-center"></TableCell>
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