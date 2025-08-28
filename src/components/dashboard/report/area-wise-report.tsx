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
import { format } from "date-fns";  
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDays } from "date-fns";


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
}

export function AreaWiseReport() {
  const records = useSelector((state: RootState) => state.report.records);
  const currentDate = useSelector(
    (state: RootState) => state.report.currentDate
  );
  const areas = useSelector((state: RootState) => state.report.areas); 
  const [areaData, setAreaData] = useState<AreaWiseData[]>([]);
  
  // Remove the old date state and use only dateRange
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: new Date(),  
    to: new Date(),     
  });
  
  const [selectedArea, setSelectedArea] = useState<string>("all");

  useEffect(() => {
    calculateAreaWiseData();
  }, [records, dateRange, selectedArea]);

  const calculateAreaWiseData = () => {
    const areaMap = new Map<string, AreaWiseData>();
  
    // Filter records based on date range
    const filteredRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      const isInDateRange = 
        recordDate >= dateRange.from && 
        (!dateRange.to || recordDate <= dateRange.to);
      return isInDateRange;
    });
  
    // Get previous date data for "unable to attend" calculation
    const previousDate = addDays(dateRange.from, -1);
    const previousDateRecords = records.filter(
      (record) => record.date === format(previousDate, "yyyy-MM-dd")
    );
  
    // Calculate unable to attend from previous date
    const unableToAttendByArea = new Map<string, number>();
    previousDateRecords.forEach((record) => {
      // Logic to determine unable to attend - you'll need to define this
      const count = unableToAttendByArea.get(record.area) || 0;
      unableToAttendByArea.set(record.area, count + 1);
    });
  
    filteredRecords.forEach((record) => {
      if (!areaMap.has(record.area)) {
        const unableToAttend = unableToAttendByArea.get(record.area) || 0;
        const returned = 0; // You said this is given - adjust as needed
        
        areaMap.set(record.area, {
          area: record.area,
          returned: returned,
          broughtForward: unableToAttend - returned,
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
        });
      }
  
      const data = areaMap.get(record.area)!;
      
      // Count jobs received
      data.jobsReceived++;
      
      // Update counts based on record fields
      if (record.dc) {
        data.totalDcDone++;
        const recordTime = record.time.split(":");
        const recordHour = parseInt(recordTime[0]);
        if (recordHour < 12) {
          data.dcDone++;
        }
      }
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
    });
  
    // Calculate totals and percentages
    const finalData = Array.from(areaMap.values()).map((data) => {
      // Total jobs = B/F + Jobs Received
      data.totalJobs = data.broughtForward + data.jobsReceived;
      
      // Calculate percentages
      if (data.totalJobs > 0) {
        data.dcDonePercentage = `${((data.dcDone / data.totalJobs) * 100).toFixed(2)}%`;
        data.totalDcPercentage = `${((data.totalDcDone / data.totalJobs) * 100).toFixed(2)}%`;
        data.rcDonePercentage = `${((data.rcDone / data.totalJobs) * 100).toFixed(2)}%`;
      }
  
      // Calculate teams
      const uniqueTeams = new Set(
        filteredRecords.filter((r) => r.area === data.area).map((r) => r.teamNo)
      );
      data.teams = uniqueTeams.size;
  
      return data;
    });
  
    // Filter by selected area if not "all"
    if (selectedArea !== "all") {
      setAreaData(finalData.filter(area => area.area === selectedArea));
    } else {
      setAreaData(finalData);
    }
  };

  const handleDownloadExcel = () => {
    generateAreaWiseExcel(areaData, dateRange, selectedArea);
  };

  const handleDownloadPDF = () => {
    generateAreaWisePDF(areaData, dateRange, selectedArea);
  };

  const calculateTotals = () => {
    return areaData.reduce(
      (totals, area) => ({
        returned: totals.returned + area.returned,
        broughtForward: totals.broughtForward + area.broughtForward,
        jobsReceived: totals.jobsReceived + area.jobsReceived,
        totalJobs: totals.totalJobs + area.totalJobs,
        teams: totals.teams + area.teams,
        waiting: totals.waiting + area.waiting,
        dcDone: totals.dcDone + area.dcDone,
        totalDcDone: totals.totalDcDone + area.totalDcDone, 
        rcDone: totals.rcDone + area.rcDone,
        payment100: totals.payment100 + area.payment100,
        payment80: totals.payment80 + area.payment80,
        payment50: totals.payment50 + area.payment50,
        alreadyPaid: totals.alreadyPaid + area.alreadyPaid,
        unSolvedCusComp: totals.unSolvedCusComp + area.unSolvedCusComp,
        gateClosed: totals.gateClosed + area.gateClosed,
        meterRemoved: totals.meterRemoved + area.meterRemoved,
        alreadyDisconnected:
          totals.alreadyDisconnected + area.alreadyDisconnected,
        wrongMeter: totals.wrongMeter + area.wrongMeter,
        billingError: totals.billingError + area.billingError,
        cantFind: totals.cantFind + area.cantFind,
        objections: totals.objections + area.objections,
        stoppedByNWSDB: totals.stoppedByNWSDB + area.stoppedByNWSDB,
        unableToAttend: totals.unableToAttend + area.unableToAttend,
      }),
      {
        returned: 0,
        broughtForward: 0,
        jobsReceived: 0,
        totalJobs: 0,
        teams: 0,
        waiting: 0,
        dcDone: 0,
        totalDcDone: 0,
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
      }
    );
  };

  const totals = calculateTotals();

  return (
    <Card className="gap-1 py-2 overflow-x-hidden">
     
      <CardHeader>
  <div className="flex items-center justify-between">
    <CardTitle>Area Wise Disconnection Report</CardTitle>
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
</CardHeader>
      {/* <CardContent className="relative">
        <ScrollArea className="h-[450px] w-full whitespace-nowrap">
          <div className="rounded-md border">
            <Table className="w-full">
              <TableHeader className="sticky top-0 bg-background z-20 shadow-sm">
                <TableRow>
                  <TableHead rowSpan={2} className="text-center border">
                    Area
                  </TableHead>
                  <TableHead colSpan={4} className="text-center border">
                    Balance
                  </TableHead>
                  <TableHead rowSpan={2} className="text-center border">
                    Total
                    <br />
                    Jobs
                  </TableHead>
                  <TableHead rowSpan={2} className="text-center border">
                    Teams
                  </TableHead>
                  <TableHead rowSpan={2} className="text-center border">
                    Waiting
                  </TableHead>
                  <TableHead colSpan={2} className="text-center border">
                    12:00:00 PM DC
                  </TableHead>
                  <TableHead colSpan={2} className="text-center border">
                    Total DC Done
                  </TableHead>
                  <TableHead colSpan={2} className="text-center border">
                    RC Done
                  </TableHead>
                  <TableHead
                    colSpan={4}
                    className="text-center border bg-green-50"
                  >
                    Payment
                  </TableHead>
                  <TableHead colSpan={9} className="text-center border">
                    Reasons
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="text-center border">Returned</TableHead>
                  <TableHead className="text-center border">B/F</TableHead>
                  <TableHead className="text-center border">
                    Jobs
                    <br />
                    Received
                  </TableHead>
                  <TableHead className="text-center border">Total</TableHead>
                  <TableHead className="text-center border">DC Done</TableHead>
                  <TableHead className="text-center border">%</TableHead>
                  <TableHead className="text-center border">Total</TableHead>
                  <TableHead className="text-center border">%</TableHead>
                  <TableHead className="text-center border">Total</TableHead>
                  <TableHead className="text-center border">%</TableHead>
                  <TableHead className="text-center border bg-green-50">
                    100%
                  </TableHead>
                  <TableHead className="text-center border bg-green-50">
                    80%
                  </TableHead>
                  <TableHead className="text-center border bg-green-50">
                    50%
                  </TableHead>
                  <TableHead className="text-center border bg-green-50">
                    Already
                    <br />
                    Paid
                  </TableHead>
                  <TableHead className="text-center border">
                    Gate
                    <br />
                    Closed
                  </TableHead>
                  <TableHead className="text-center border">
                    Meter
                    <br />
                    Removed
                  </TableHead>
                  <TableHead className="text-center border">
                    Already
                    <br />
                    Disconnected
                  </TableHead>
                  <TableHead className="text-center border">
                    Wrong
                    <br />
                    Meter
                  </TableHead>
                  <TableHead className="text-center border">
                    Billing
                    <br />
                    Error
                  </TableHead>
                  <TableHead className="text-center border">
                    Can't
                    <br />
                    Find
                  </TableHead>
                  <TableHead className="text-center border">
                    Objections
                  </TableHead>
                  <TableHead className="text-center border">
                    Stopped By
                    <br />
                    NWSDB
                  </TableHead>
                  <TableHead className="text-center border">
                    Unable To
                    <br />
                    Attend
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areaData.map((area) => (
                  <TableRow key={area.area}>
                    <TableCell className="font-medium">{area.area}</TableCell>
                    <TableCell className="text-center">
                      {area.returned}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.broughtForward}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.jobsReceived}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.totalJobs}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {area.totalJobs}
                    </TableCell>
                    <TableCell className="text-center">{area.teams}</TableCell>
                    <TableCell className="text-center">
                      {area.waiting}
                    </TableCell>
                    <TableCell className="text-center">{area.dcDone}</TableCell>
                    <TableCell className="text-center">
                      {area.dcDonePercentage}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.totalDcDone}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.totalDcPercentage}
                    </TableCell>
                    <TableCell className="text-center">{area.rcDone}</TableCell>
                    <TableCell className="text-center">
                      {area.rcDonePercentage}
                    </TableCell>
                    <TableCell className="text-center bg-green-50">
                      {area.payment100}
                    </TableCell>
                    <TableCell className="text-center bg-green-50">
                      {area.payment80}
                    </TableCell>
                    <TableCell className="text-center bg-green-50">
                      {area.payment50}
                    </TableCell>
                    <TableCell className="text-center bg-green-50">
                      {area.alreadyPaid}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.gateClosed}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.meterRemoved}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.alreadyDisconnected}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.wrongMeter}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.billingError}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.cantFind}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.objections}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.stoppedByNWSDB}
                    </TableCell>
                    <TableCell className="text-center">
                      {area.unableToAttend}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-gray-100">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-center">
                    {totals.returned}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.broughtForward}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.jobsReceived}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.totalJobs}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.totalJobs}
                  </TableCell>
                  <TableCell className="text-center">{totals.teams}</TableCell>
                  <TableCell className="text-center">
                    {totals.waiting}
                  </TableCell>
                  <TableCell className="text-center">{totals.dcDone}</TableCell>
                  <TableCell className="text-center">
                    {totals.totalJobs > 0
                      ? `${((totals.dcDone / totals.totalJobs) * 100).toFixed(
                          2
                        )}%`
                      : "0%"}
                  </TableCell>
                  <TableCell className="text-center">{totals.totalDcDone}</TableCell>
                  <TableCell className="text-center">
                    {totals.totalJobs > 0
                      ? `${((totals.totalDcDone / totals.totalJobs) * 100).toFixed(2)}%`
                      : "0%"}
                  </TableCell> 
                  <TableCell className="text-center">{totals.rcDone}</TableCell>
                  <TableCell className="text-center">
                    {totals.totalJobs > 0
                      ? `${((totals.rcDone / totals.totalJobs) * 100).toFixed(
                          2
                        )}%`
                      : "0%"}
                  </TableCell>
                  <TableCell className="text-center bg-green-50">
                    {totals.payment100}
                  </TableCell>
                  <TableCell className="text-center bg-green-50">
                    {totals.payment80}
                  </TableCell>
                  <TableCell className="text-center bg-green-50">
                    {totals.payment50}
                  </TableCell>
                  <TableCell className="text-center bg-green-50">
                    {totals.alreadyPaid}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.gateClosed}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.meterRemoved}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.alreadyDisconnected}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.wrongMeter}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.billingError}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.cantFind}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.objections}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.stoppedByNWSDB}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.unableToAttend}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent> */}
      <CardContent>
  <ScrollArea className="h-[600px] w-full">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 z-10 bg-background w-[200px] min-w-[200px]">
            Parameter
          </TableHead>
          {areaData.map((area) => (
            <TableHead key={area.area} className="text-center min-w-[120px]">
              {area.area}
            </TableHead>
          ))}
          <TableHead className="text-center font-bold min-w-[120px]">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Define row structure */}
        {[
          { label: "Returned", key: "returned", percentage: true, percentageBase: "returnedBF" },
          { label: "Brought Forward", key: "broughtForward", percentage: true, percentageBase: "returnedBF" },
          { label: "Jobs Received", key: "jobsReceived" },
          { label: "Total Jobs", key: "totalJobs", bold: true },
          { label: "Teams", key: "teams" },
          { label: "Waiting", key: "waiting" },
          // { label: "12:00:00 PM DC", key: "dcDone", showPercentage: "dcDonePercentage" },
          { label: "Total DC Done", key: "totalDcDone", showPercentage: "totalDcPercentage", bgColor: "bg-blue-50" },
          { label: "Total RC Done", key: "rcDone", showPercentage: "rcDonePercentage", bgColor: "bg-green-50" },
          { label: "100%", key: "payment100", percentage: true, bgColor: "bg-red-50" },
          { label: "80%", key: "payment80", percentage: true, bgColor: "bg-red-50" },
          { label: "50%", key: "payment50", percentage: true, bgColor: "bg-red-50" },
          { label: "Already Paid", key: "alreadyPaid", percentage: true, bgColor: "bg-red-50" },
          { label: "Un Solved Cus Comp.", key: "unSolvedCusComp", percentage: true },
          { label: "Gate Closed", key: "gateClosed", percentage: true },
          { label: "Meter Removed", key: "meterRemoved", percentage: true },
          { label: "Already Disconnected", key: "alreadyDisconnected", percentage: true },
          { label: "Wrong Meter", key: "wrongMeter", percentage: true },
          { label: "Billing Error", key: "billingError", percentage: true },
          { label: "Can't Find", key: "cantFind", percentage: true },
          { label: "Objections", key: "objections", percentage: true },
          { label: "Stopped By NWSDB", key: "stoppedByNWSDB", percentage: true },
          { label: "Unable To Attend", key: "unableToAttend", percentage: true },
        ].map((row) => {
          const totals = calculateTotals();
          const totalValue = totals[row.key as keyof typeof totals];
          
          return (
            <TableRow className=" [&>td]:py-1 [&>td]:px-2" key={row.key}>
              <TableCell className={`sticky left-0 z-10 bg-background w-[200px] min-w-[200px] ${row.bold ? 'font-bold' : ''}`}>
                {row.label}
              </TableCell>
              {areaData.map((area) => {
                const value = area[row.key as keyof AreaWiseData];
                const percentage = row.showPercentage ? area[row.showPercentage as keyof AreaWiseData] : null;
                
                // Calculate percentage for rows that need it
                let calculatedPercentage = "";
                if (row.percentage && row.key !== "returned" && row.key !== "broughtForward") {
                  calculatedPercentage = area.totalJobs > 0 
                    ? `${((Number(value) / area.totalJobs) * 100).toFixed(2)}%`
                    : "0.00%";
                } else if (row.percentageBase === "returnedBF") {
                  const base = area.returned + area.broughtForward;
                  calculatedPercentage = base > 0
                    ? `${((Number(value) / base) * 100).toFixed(2)}%`
                    : "0.00%";
                }
                
                return (
                  <TableCell 
                    key={area.area} 
                    className={`text-center ${row.bgColor || ''} min-w-[120px]`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className={row.bold ? 'font-bold' : ''}>{value}</span>
                      {(percentage || calculatedPercentage) && (
                        <span className="text-xs text-red-500">
                          {percentage || calculatedPercentage}
                        </span>
                      )}
                    </div>
                  </TableCell>
                );
              })}
              <TableCell className="text-center font-bold min-w-[120px]">
                <div className="flex items-center justify-center gap-2">
                  <span>{totalValue}</span>
                  {row.percentage && totals.totalJobs > 0 && (
                    <span className="text-xs text-red-500">
                      {`${((Number(totalValue) / totals.totalJobs) * 100).toFixed(2)}%`}
                    </span>
                  )}
                  {row.showPercentage && totals.totalJobs > 0 && (
                    <span className="text-xs text-red-500">
                      {`${((Number(totalValue) / totals.totalJobs) * 100).toFixed(2)}%`}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</CardContent>
    </Card>
  );
}
