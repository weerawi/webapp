"use client";

import React, { useEffect, useState } from "react";
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
// In supervisor-wise-report.tsx, replace the existing imports and add these:
import { format, addDays } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateSupervisorWiseExcel } from "@/lib/utils/sup-excel-generator";

// Update the SupervisorWiseData interface:
interface SupervisorWiseData {
  teamNo: string;
  supervisor: string;
  area: string;
  returned: number;
  broughtForward: number;
  jobsReceived: number;
  totalJobs: number;
  days: number;
  waiting: number;
  ocDone: number;
  rcDone: number;
  // Percentages for display
  returnedPercentage: string;
  bfPercentage: string;
  payment100: number;
  payment80: number;
  payment50: number;
  alreadyPaid: number;
  // paymentPercentage: string;
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
  const areas = useSelector((state: RootState) => state.report.areas);
  const [supervisorData, setSupervisorData] = useState<SupervisorWiseData[]>([]);
  
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: new Date(),
  });
  
  const [selectedArea, setSelectedArea] = useState<string>("all");

  useEffect(() => {
    calculateSupervisorWiseData();
  }, [records, dateRange, selectedArea]);

  const calculateSupervisorWiseData = () => {
    const teamMap = new Map<string, SupervisorWiseData>();
    
    // Filter records based on date range
    const filteredRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      const isInDateRange = 
        recordDate >= dateRange.from && 
        (!dateRange.to || recordDate <= dateRange.to);
      const matchesArea = selectedArea === "all" || record.area === selectedArea;
      return isInDateRange && matchesArea;
    });

    // Get previous date records for "unable to attend" calculation
    const previousDate = addDays(dateRange.from, -1);
    const previousDateRecords = records.filter(
      (record) => record.date === format(previousDate, "yyyy-MM-dd")
    );

    // Calculate unable to attend by team from previous date
    const unableToAttendByTeam = new Map<string, number>();
    previousDateRecords.forEach((record) => {
      const key = `${record.teamNo}-${record.supervisor}-${record.area}`;
      // Count records that weren't completed (your logic here)
      const count = unableToAttendByTeam.get(key) || 0;
      unableToAttendByTeam.set(key, count + 1);
    });

    filteredRecords.forEach((record) => {
      const key = `${record.teamNo}-${record.supervisor}-${record.area}`;
      
      if (!teamMap.has(key)) {
        const unableToAttend = unableToAttendByTeam.get(key) || 0;
        const returned = 0; // This is given - adjust as needed
        const broughtForward = unableToAttend - returned;
        
        teamMap.set(key, {
          teamNo: record.teamNo,
          supervisor: record.supervisor,
          area: record.area,
          returned: returned,
          broughtForward: broughtForward,
          jobsReceived: 0,
          totalJobs: 0,
          days: 0,
          waiting: 0,
          ocDone: 0,
          rcDone: 0,
          returnedPercentage: "0%",
          bfPercentage: "0%",
          payment100: 0,
          payment80: 0,
          payment50: 0,
          alreadyPaid: 0,
          // paymentPercentage: "0%",
          unSolvedCusComp: 0,
          gateClosed: 0,
          meterRemoved: 0,
          alreadyDisconnected: 0,
          wrongMeter: 0,
          billingError: 0,
          cantFind: 0,
          objections: 0,
          stoppedByNWSDB: 0,
          unableToAttend: unableToAttend,
          helpers: [],
        });
      }

      const data = teamMap.get(key)!;
      
      // Count jobs received
      data.jobsReceived++;
      
      // Update counts based on record fields
      if (record.dc) data.ocDone++;
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
      
      // Add unique helpers
      if (record.helper && !data.helpers.includes(record.helper)) {
        data.helpers.push(record.helper);
      }
    });

    // Calculate totals and percentages
    const finalData = Array.from(teamMap.values()).map((data) => {
      // Total jobs = B/F + Jobs Received
      data.totalJobs = data.broughtForward + data.jobsReceived;
      
      // Calculate return/BF percentages (they should total 100%)
      const returnBFTotal = data.returned + data.broughtForward;
      if (returnBFTotal > 0) {
        data.returnedPercentage = `${((data.returned / returnBFTotal) * 100).toFixed(2)}%`;
        data.bfPercentage = `${((data.broughtForward / returnBFTotal) * 100).toFixed(2)}%`;
      }
      
      // Calculate payment percentage
      // const totalPayments = data.payment100 + data.payment80 + data.payment50 + data.alreadyPaid;
      // if (data.totalJobs > 0) {
      //   data.paymentPercentage = `${((totalPayments / data.totalJobs) * 100).toFixed(0)}%`;
      // }
      
      // Calculate days (unique dates for this team)
      const teamDates = new Set(
        filteredRecords
          .filter((r) => r.teamNo === data.teamNo && r.supervisor === data.supervisor && r.area === data.area)
          .map((r) => r.date)
      );
      data.days = teamDates.size;
      
      return data;
    });

    // Sort by area and then by team number
    const sortedData = finalData.sort((a, b) => {
      if (a.area !== b.area) {
        return a.area.localeCompare(b.area);
      }
      return parseInt(a.teamNo) - parseInt(b.teamNo);
    });

    setSupervisorData(sortedData);
  };



  // Helper function to calculate area totals
const calculateAreaTotals = (areaData: SupervisorWiseData[]) => {
  return areaData.reduce((totals, data) => ({
    returned: totals.returned + data.returned,
    broughtForward: totals.broughtForward + data.broughtForward,
    jobsReceived: totals.jobsReceived + data.jobsReceived,
    totalJobs: totals.totalJobs + data.totalJobs,
    waiting: totals.waiting + data.waiting,
    ocDone: totals.ocDone + data.ocDone,
    rcDone: totals.rcDone + data.rcDone,
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
    totalJobs: 0,
    waiting: 0,
    ocDone: 0,
    rcDone: 0,
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

// Group data by area
const groupedData = supervisorData.reduce((acc, item) => {
  if (!acc[item.area]) {
    acc[item.area] = [];
  }
  acc[item.area].push(item);
  return acc;
}, {} as Record<string, SupervisorWiseData[]>);

const handleDownloadExcel = () => {
  generateSupervisorWiseExcel(groupedData, calculateAreaTotals);
};

const handleDownloadPDF = () => {
  // generateSupervisorWisePDF(groupedData);
  return true;
};

return (
  <Card className="gap-1 py-2 overflow-x-hidden">
    <CardHeader>
  <div className="flex items-center justify-between">
    <CardTitle>Hagra Holdings Lanka (Pvt) Ltd - Daily DC/RC Summary</CardTitle>
    <div className="flex items-center gap-4">
      <DatePickerWithRange
        value={dateRange}
        onChange={(range) => {
          if (range?.from) {
            setDateRange({
              from: range.from,
              to: range.to
            });
          }
        }}
      />
      <Select value={selectedArea} onValueChange={setSelectedArea}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Area" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Areas</SelectItem>
          {areas.map((area) => (
            <SelectItem key={area} value={area}>
              {area}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Add this Export dropdown menu */}
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
  </div>
  <div className="text-sm text-muted-foreground mt-1">
    {format(dateRange.from, "yyyy-MMM")}
  </div>
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
            <TableHead colSpan={3} className="text-center border">Balance</TableHead>
            <TableHead rowSpan={2} className="text-center border">Total<br/>Jobs</TableHead>
            <TableHead rowSpan={2} className="text-center border">Days</TableHead>
            <TableHead rowSpan={2} className="text-center border">Waiting</TableHead>
            <TableHead rowSpan={2} className="text-center border">OC Done</TableHead>
            <TableHead rowSpan={2} className="text-center border">RC Done</TableHead>
            <TableHead colSpan={4} className="text-center border bg-green-50">Paid</TableHead>
            <TableHead colSpan={10} className="text-center border">Reasons</TableHead>
            <TableHead rowSpan={2} className="text-center border">Helpers</TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="text-center border">Returned</TableHead>
            <TableHead className="text-center border">B/F</TableHead>
            <TableHead className="text-center border">Jobs<br/>Received</TableHead>
            <TableHead className="text-center border bg-green-50">100%</TableHead>
            <TableHead className="text-center border bg-green-50">80%</TableHead>
            <TableHead className="text-center border bg-green-50">50%</TableHead>
            <TableHead className="text-center border bg-green-50">Already<br/>Paid</TableHead>
            {/* <TableHead className="text-center border bg-green-50">%</TableHead> */}
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
          {Object.entries(groupedData).map(([area, areaData]) => {
            const areaTotals = calculateAreaTotals(areaData);
            return (
              <React.Fragment key={area}>
                {areaData.map((data, index) => (
                  <TableRow key={`${area}-${index}`}>
                    <TableCell className="text-center font-medium">{data.teamNo}</TableCell>
                    <TableCell>{data.supervisor}</TableCell>
                    <TableCell>{data.area}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col">
                        <span>{data.returned}</span>
                        <span className="text-xs text-red-500">{data.returnedPercentage}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col">
                        <span>{data.broughtForward}</span>
                        <span className="text-xs text-red-500">{data.bfPercentage}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{data.jobsReceived}</TableCell>
                    <TableCell className="text-center font-semibold">{data.totalJobs}</TableCell>
                    <TableCell className="text-center">{data.days}</TableCell>
                    <TableCell className="text-center bg-orange-50">{data.waiting}</TableCell>
                    <TableCell className="text-center">{data.ocDone}</TableCell>
                    <TableCell className="text-center">{data.rcDone}</TableCell>
                    <TableCell className="text-center bg-green-50">{data.payment100}</TableCell>
                    <TableCell className="text-center bg-green-50">{data.payment80}</TableCell>
                    <TableCell className="text-center bg-green-50">{data.payment50}</TableCell>
                    <TableCell className="text-center bg-green-50">{data.alreadyPaid}</TableCell>
                    {/* <TableCell className="text-center bg-green-50 font-medium">{data.paymentPercentage}</TableCell> */}
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
                {/* Area Total Row */}
                <TableRow className="font-bold bg-gray-100">
                  <TableCell colSpan={3} className="text-right">Total for {area}</TableCell>
                  <TableCell className="text-center">{areaTotals.returned}</TableCell>
                  <TableCell className="text-center">{areaTotals.broughtForward}</TableCell>
                  <TableCell className="text-center">{areaTotals.jobsReceived}</TableCell>
                  <TableCell className="text-center">{areaTotals.totalJobs}</TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell className="text-center bg-orange-50">{areaTotals.waiting}</TableCell>
                  <TableCell className="text-center">{areaTotals.ocDone}</TableCell>
                  <TableCell className="text-center">{areaTotals.rcDone}</TableCell>
                  <TableCell className="text-center bg-green-50">{areaTotals.payment100}</TableCell>
                  <TableCell className="text-center bg-green-50">{areaTotals.payment80}</TableCell>
                  <TableCell className="text-center bg-green-50">{areaTotals.payment50}</TableCell>
                  <TableCell className="text-center bg-green-50">{areaTotals.alreadyPaid}</TableCell>
                  {/* <TableCell className="text-center bg-green-50">
                    {areaTotals.totalJobs > 0 
                      ? `${(((areaTotals.payment100 + areaTotals.payment80 + areaTotals.payment50 + areaTotals.alreadyPaid) / areaTotals.totalJobs) * 100).toFixed(0)}%` 
                      : "0%"}
                  </TableCell> */}
                  <TableCell className="text-center">{areaTotals.unSolvedCusComp}</TableCell>
                  <TableCell className="text-center">{areaTotals.gateClosed}</TableCell>
                  <TableCell className="text-center">{areaTotals.meterRemoved}</TableCell>
                  <TableCell className="text-center">{areaTotals.alreadyDisconnected}</TableCell>
                  <TableCell className="text-center">{areaTotals.wrongMeter}</TableCell>
                  <TableCell className="text-center">{areaTotals.billingError}</TableCell>
                  <TableCell className="text-center">{areaTotals.cantFind}</TableCell>
                  <TableCell className="text-center">{areaTotals.objections}</TableCell>
                  <TableCell className="text-center">{areaTotals.stoppedByNWSDB}</TableCell>
                  <TableCell className="text-center">{areaTotals.unableToAttend}</TableCell>
                  <TableCell className="text-center"></TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</CardContent>
    </Card>
  );
}