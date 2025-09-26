

// "use client";

// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/lib/store/store";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Search, MapPin, Clock, Calendar, Download, X } from "lucide-react";
// import { useEffect, useState } from "react";
// import { AttendanceRecord } from "@/lib/store/slices/attendanceSlice";
// import { updateAttendanceAndSync } from "@/lib/services/staffService";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { DatePickerWithRange } from "@/components/ui/date-range-picker"; // Add this import
// import { DatePicker } from "@/components/ui/date-picker";
// import { addDays, format } from "date-fns"; // Add if you need date utilities
// import { fetchDateAttendance, fetchTodayAttendance } from "@/lib/services/attendaceService";

// export default function AttendanceTable() {
//   const dispatch = useDispatch();
//   const attendanceRecords = useSelector(
//     (state: RootState) => state.attendance?.records || []
//   );

//   // // Load mock data once
//   // useEffect(() => {
//   //   if (attendanceRecords.length === 0) {
//   //     updateAttendanceAndSync(dispatch as any);
//   //   }
//   // }, [attendanceRecords.length, dispatch]);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterArea, setFilterArea] = useState("all");
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());

//   // Fetch data when date changes
//   useEffect(() => {
//     const dateString = selectedDate.toISOString().split('T')[0];
//     const today = new Date().toISOString().split('T')[0];
    
//     if (dateString === today) {
//       fetchTodayAttendance(dispatch);
//     } else {
//       fetchDateAttendance(dispatch, selectedDate);
//     }
//   }, [selectedDate, dispatch]);


//   // Image preview dialog state
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewRecord, setPreviewRecord] = useState<AttendanceRecord | null>(
//     null
//   );

//   const openPreview = (r: AttendanceRecord) => {
//     setPreviewRecord(r);
//     setPreviewOpen(true);
//   };
//   const closePreview = () => {
//     setPreviewOpen(false);
//     setPreviewRecord(null);
//   };

//   // const filteredRecords = attendanceRecords.filter((record) => {
//   //   const q = searchQuery.toLowerCase();
//   //   const matchesSearch =
//   //     record.staffName.toLowerCase().includes(q) ||
//   //     record.staffId.toLowerCase().includes(q);
//   //   const matchesArea = filterArea === "all" || record.area === filterArea;
    
//   //   // Updated date matching logic
//   //   let matchesDate = true;
//   //   if (dateRange.from) {
//   //     const recordDate = new Date(record.date);
//   //     const fromDate = new Date(dateRange.from);
//   //     fromDate.setHours(0, 0, 0, 0);
      
//   //     if (dateRange.to) {
//   //       const toDate = new Date(dateRange.to);
//   //       toDate.setHours(23, 59, 59, 999);
//   //       matchesDate = recordDate >= fromDate && recordDate <= toDate;
//   //     } else {
//   //       // Single date selected
//   //       matchesDate = recordDate.toDateString() === fromDate.toDateString();
//   //     }
//   //   }
    
//   //   return matchesSearch && matchesArea && matchesDate;
//   // });

//   const filteredRecords = attendanceRecords.filter((record) => {
//     const q = searchQuery.toLowerCase();
//     const matchesSearch =
//       record.staffName.toLowerCase().includes(q) ||
//       record.staffId.toLowerCase().includes(q);
//     const matchesArea = filterArea === "all" || record.area === filterArea;
//     const matchesDate = record.date === selectedDate.toISOString().split('T')[0];
    
//     return matchesSearch && matchesArea && matchesDate;
//   });
  
//   const uniqueAreas = [...new Set(attendanceRecords.map((r) => r.area))];

//   const formatRole = (role?: string) =>
//     role ? role.charAt(0).toUpperCase() + role.slice(1) : "Helper";

//   return (
//     <Card className="border-0 shadow-lg py-0">
//       <div className="px-6 py-1">
//         {/* Filters */}
//         <div className="flex flex-wrap gap-4 mb-4">
//           <div className="relative flex-1 min-w-[300px]">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search by name or ID..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9"
//             />
//           </div>

//           <Select value={filterArea} onValueChange={setFilterArea}>
//             <SelectTrigger className="w-[150px]">
//               <SelectValue placeholder="All Areas" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Areas</SelectItem>
//               {uniqueAreas.map((area) => (
//                 <SelectItem key={area} value={area}>
//                   {area}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* <DatePickerWithRange
//             value={dateRange}
//             onChange={setDateRange}
//             className="w-[300px]"
//           /> */}
//           <DatePicker
//             value={selectedDate}
//             onChange={(date) => date && setSelectedDate(date)}
//             className="w-[200px]"
//             placeholder="Select date"
//           />

//           <Button variant="outline" size="icon">
//             <Download className="h-4 w-4" />
//           </Button>
//         </div>

//         {/* Table */}
//         <div className="overflow-hidden rounded-lg border">
//           <table className="w-full">
//             <thead className="bg-muted/50">
//               <tr>
//                 <th className="px-2 py-2 text-left text-sm font-medium">
//                   Date
//                 </th>
//                 <th className="px-2 py-2 text-left text-sm font-medium">
//                   Staff
//                 </th>
//                 <th className="px-2 py-2 text-left text-sm font-medium">
//                   Area
//                 </th>
//                 <th className="px-2 py-2 text-left text-sm font-medium">
//                   Team
//                 </th>
//                 <th className="px-2 py-2 text-left text-sm font-medium">
//                   Role
//                 </th>
//                 <th className="px-2 py-2 text-left text-sm font-medium">
//                   Time In
//                 </th>
//                 <th className="px-2 py-2 text-left text-sm font-medium">
//                   Time Out
//                 </th>
//                 <th className="px-2 py-2 text-left text-sm font-medium">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {filteredRecords.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="py-12 text-center">
//                     <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
//                     <h3 className="text-lg font-medium mb-2">
//                       No attendance records found
//                     </h3>
//                     <p className="text-sm text-muted-foreground">
//                       {searchQuery || filterArea !== "all" || selectedDate
//                         ? "Try adjusting your filters"
//                         : "No attendance data available"}
//                     </p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredRecords.map((record) => (
//                   <tr
//                     key={record.id}
//                     className="hover:bg-muted/30 transition-colors"
//                   >
//                     <td className="px-2 py-1">
//                       <span className="text-sm font-medium">
//                         {new Date(record.date).toLocaleDateString()}
//                       </span>
//                     </td>

//                     {/* Staff + avatar */}
//                     <td className="px-4 py-0">
//                       <div className="flex items-center gap-3">
//                         <button
//                           type="button"
//                           onClick={() => openPreview(record)}
//                           className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition cursor-pointer"
//                           aria-label={`View ${record.staffName} photo`}
//                         >
//                           {record.imageUrl ? (
//                             <img
//                               src={record.imageUrl}
//                               alt={record.staffName}
//                               width={35}
//                               height={35}
//                               className="h-8 w-8 object-cover"
//                               onError={(e) => {
//                                 (
//                                   e.currentTarget as HTMLImageElement
//                                 ).style.display = "none";
//                               }}
//                             />
//                           ) : (
//                             <span className="text-xs font-medium">
//                               {record.staffName.charAt(0).toUpperCase()}
//                             </span>
//                           )}
//                         </button>
//                         <div>
//                           <p className="font-medium text-sm">
//                             {record.staffName}
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             ID: {record.staffId.slice(0, 8)}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-4 py-2">
//                       <span className="text-sm">{record.area}</span>
//                     </td>

//                     <td className="px-4 py-2">
//                       <Badge variant="outline" className="text-xs">
//                         Team {record.teamNumber}
//                       </Badge>
//                     </td>

//                     <td className="px-4 py-2">
//                       <Badge
//                         variant={
//                           record.role === "supervisor" ? "default" : "secondary"
//                         }
//                         className="text-xs"
//                       >
//                         {formatRole(record.role)}
//                       </Badge>
//                     </td>

//                     <td className="px-4 py-2">
//                       <div className="flex items-center gap-2">
//                         <div className="flex items-center gap-1">
//                           <Clock className="h-3 w-3 text-green-600" />
//                           <span className="text-sm font-mono">
//                             {record.timeIn || "-"}
//                           </span>
//                         </div>
//                         {record.timeIn && record.gpsLocationIn && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="h-6 px-1.5 text-xs cursor-pointer"
//                             onClick={() =>
//                               window.open(record.gpsLocationIn, "_blank")
//                             }
//                           >
//                             <MapPin className="h-3 w-3" />
//                           </Button>
//                         )}
//                       </div>
//                     </td>

//                     <td className="px-4 py-2">
//                       <div className="flex items-center gap-2">
//                         {record.timeOut ? (
//                           <>
//                             <div className="flex items-center gap-1">
//                               <Clock className="h-3 w-3 text-red-600" />
//                               <span className="text-sm font-mono">
//                                 {record.timeOut}
//                               </span>
//                             </div>
//                             {record.gpsLocationOut && (
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="h-6 px-1.5 text-xs cursor-pointer"
//                                 onClick={() =>
//                                   window.open(record.gpsLocationOut, "_blank")
//                                 }
//                               >
//                                 <MapPin className="h-3 w-3" />
//                               </Button>
//                             )}
//                           </>
//                         ) : (
//                           <span className="text-sm text-muted-foreground">
//                             -
//                           </span>
//                         )}
//                       </div>
//                     </td>

//                     <td className="px-4 py-2">
//                       <Badge
//                         variant={
//                           record.status === "in" ? "default" : "secondary"
//                         }
//                         className="text-xs"
//                       >
//                         {record.status === "in" ? "Checked In" : "Checked Out"}
//                       </Badge>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Image Preview Dialog */}
//       <Dialog open={previewOpen} onOpenChange={(o) => !o && closePreview()}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-between">
//               <span>{previewRecord?.staffName}</span>
//               {/* <button
//                 onClick={closePreview}
//                 className="p-1 rounded hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
//                 aria-label="Close"
//               >
//                 <X className="h-4 w-4" />
//               </button> */}
//             </DialogTitle>
//           </DialogHeader>
//           {previewRecord && (
//             <div className="space-y-4">
//               <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
//                 {previewRecord.imageUrl ? (
//                   <img
//                     src={previewRecord.imageUrl}
//                     alt={previewRecord.staffName}
//                     className="object-cover w-full h-full"
//                     onError={(e) => {
//                       (e.currentTarget as HTMLImageElement).style.display =
//                         "none";
//                     }}
//                   />
//                 ) : (
//                   <span className="text-5xl font-semibold">
//                     {previewRecord.staffName.charAt(0).toUpperCase()}
//                   </span>
//                 )}
//               </div>
//               <div className="text-sm text-muted-foreground space-y-1 break-all">
//                 <div>
//                   <strong>ID:</strong> {previewRecord.staffId}
//                 </div>
//                 <div>
//                   <strong>Area:</strong> {previewRecord.area}
//                 </div>
//                 <div>
//                   <strong>Role:</strong> {formatRole(previewRecord.role)}
//                 </div>
//                 <div>
//                   <strong>Status:</strong>{" "}
//                   {previewRecord.status === "in" ? "Checked In" : "Checked Out"}
//                 </div>
//                 {previewRecord.gpsLocationIn && (
//                   <div>
//                     <strong>Location In:</strong>{" "}
//                     <a
//                       href={previewRecord.gpsLocationIn}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-blue-600 underline"
//                     >
//                       View Map
//                     </a>
//                   </div>
//                 )}
//                 {previewRecord.gpsLocationOut && (
//                   <div>
//                     <strong>Location Out:</strong>{" "}
//                     <a
//                       href={previewRecord.gpsLocationOut}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-blue-600 underline"
//                     >
//                       View Map
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Card>
//   );
// }


"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  MapPin, 
  Clock, 
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { AttendanceRecord } from "@/lib/store/slices/attendanceSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { fetchDateAttendance, fetchTodayAttendance } from "@/lib/services/attendaceService";

export default function AttendanceTable() {
  const dispatch = useDispatch();
  const attendanceRecords = useSelector(
    (state: RootState) => state.attendance?.records || []
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filterArea, setFilterArea] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default 15 for attendance

  // Image preview dialog state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<AttendanceRecord | null>(null);

  // Fetch data when date changes
  useEffect(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    
    if (dateString === today) {
      fetchTodayAttendance(dispatch);
    } else {
      fetchDateAttendance(dispatch, selectedDate);
    }
  }, [selectedDate, dispatch]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterArea, selectedDate]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        record.staffName.toLowerCase().includes(q) ||
        record.staffId.toLowerCase().includes(q);
      const matchesArea = filterArea === "all" || record.area === filterArea;
      const matchesDate = record.date === selectedDate.toISOString().split('T')[0];
      
      return matchesSearch && matchesArea && matchesDate;
    });
  }, [attendanceRecords, searchQuery, filterArea, selectedDate]);

  // Pagination calculations
  const paginationInfo = useMemo(() => {
    const totalRecords = filteredRecords.length;
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRecords);
    const currentRecords = filteredRecords.slice(startIndex, endIndex);
    
    return {
      totalRecords,
      totalPages,
      startIndex,
      endIndex,
      currentRecords,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  }, [filteredRecords, currentPage, rowsPerPage]);

  const uniqueAreas = useMemo(() => 
    [...new Set(attendanceRecords.map((r) => r.area))],
    [attendanceRecords]
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
    }
  };

  const openPreview = (r: AttendanceRecord) => {
    setPreviewRecord(r);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewRecord(null);
  };

  const formatRole = (role?: string) =>
    role ? role.charAt(0).toUpperCase() + role.slice(1) : "Helper";

  const handleDownload = () => {
    const csv = convertToCSV(filteredRecords);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate.toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const convertToCSV = (records: AttendanceRecord[]) => {
    const headers = ['Date', 'Staff ID', 'Name', 'Area', 'Team', 'Role', 'Time In', 'Time Out', 'Status'];
    const rows = records.map(r => [
      r.date,
      r.staffId,
      r.staffName,
      r.area,
      r.teamNumber,
      r.role || 'helper',
      r.timeIn || '-',
      r.timeOut || '-',
      r.status
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // Generate page numbers to display
  const getPageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 3; // Show less pages for simpler UI
    
    if (paginationInfo.totalPages <= maxVisible) {
      for (let i = 1; i <= paginationInfo.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage === 1) {
        pages.push(1, 2, 3);
      } else if (currentPage === paginationInfo.totalPages) {
        pages.push(
          paginationInfo.totalPages - 2,
          paginationInfo.totalPages - 1,
          paginationInfo.totalPages
        );
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    
    return pages.filter(p => p >= 1 && p <= paginationInfo.totalPages);
  }, [currentPage, paginationInfo.totalPages]);

  return (
    <Card className="border-0 shadow-lg">
      <div className="px-6 py-2">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {uniqueAreas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePicker
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            className="w-[200px]"
            placeholder="Select date"
          />

          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Fixed height scrollable table */}
        <ScrollArea className="h-[400px] rounded-lg border">
          <table className="w-full">
            <thead className="sticky top-0 bg-background border-b z-10">
              <tr>
                <th className="px-2 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-2 py-3 text-left text-sm font-medium">Staff</th>
                <th className="px-2 py-3 text-left text-sm font-medium">Area</th>
                <th className="px-2 py-3 text-left text-sm font-medium">Team</th>
                <th className="px-2 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-2 py-3 text-left text-sm font-medium">Time In</th>
                <th className="px-2 py-3 text-left text-sm font-medium">Time Out</th>
                <th className="px-2 py-3 text-left text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginationInfo.currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No attendance records found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery || filterArea !== "all" || selectedDate
                        ? "Try adjusting your filters"
                        : "No attendance data available"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginationInfo.currentRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-2 py-2">
                      <span className="text-sm font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Staff + avatar */}
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openPreview(record)}
                          className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition cursor-pointer hover:ring-2"
                          aria-label={`View ${record.staffName} photo`}
                        >
                          {record.imageUrl ? (
                            <img
                              src={record.imageUrl}
                              alt={record.staffName}
                              className="h-8 w-8 object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-xs font-medium">
                              {record.staffName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </button>
                        <div>
                          <p className="font-medium text-sm">{record.staffName}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {record.staffId.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-2">
                      <span className="text-sm">{record.area}</span>
                    </td>

                    <td className="px-4 py-2">
                      <Badge variant="outline" className="text-xs">
                        Team {record.teamNumber}
                      </Badge>
                    </td>

                    <td className="px-4 py-2">
                      <Badge
                        variant={record.role === "supervisor" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {formatRole(record.role)}
                      </Badge>
                    </td>

                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-green-600" />
                          <span className="text-sm font-mono">
                            {record.timeIn || "-"}
                          </span>
                        </div>
                        {record.timeIn && record.gpsLocationIn && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5 text-xs"
                            onClick={() => window.open(record.gpsLocationIn, "_blank")}
                          >
                            <MapPin className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {record.timeOut ? (
                          <>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-red-600" />
                              <span className="text-sm font-mono">{record.timeOut}</span>
                            </div>
                            {record.gpsLocationOut && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-xs"
                                onClick={() => window.open(record.gpsLocationOut, "_blank")}
                              >
                                <MapPin className="h-3 w-3" />
                              </Button>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-2">
                      <Badge
                        variant={record.status === "in" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {record.status === "in" ? "Checked In" : "Checked Out"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Pagination Controls */}
        {paginationInfo.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Showing {paginationInfo.startIndex + 1} to {paginationInfo.endIndex} of{" "}
              {paginationInfo.totalRecords} entries
            </span>

            <div className="flex items-center gap-2">
              {/* Rows per page selector */}
              <Select 
                value={rowsPerPage.toString()} 
                onValueChange={(value) => {
                  setRowsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>

              {/* Page navigation */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={!paginationInfo.hasPrevPage}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!paginationInfo.hasPrevPage}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {/* Page numbers */}
                {getPageNumbers.map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!paginationInfo.hasNextPage}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(paginationInfo.totalPages)}
                  disabled={!paginationInfo.hasNextPage}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      
             {/* {/* Image Preview Dialog  */}
      <Dialog open={previewOpen} onOpenChange={(o) => !o && closePreview()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{previewRecord?.staffName}</span>
              {/* <button
                onClick={closePreview}
                className="p-1 rounded hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button> */}
            </DialogTitle>
          </DialogHeader>
          {previewRecord && (
            <div className="space-y-4">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {previewRecord.imageUrl ? (
                  <img
                    src={previewRecord.imageUrl}
                    alt={previewRecord.staffName}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : (
                  <span className="text-5xl font-semibold">
                    {previewRecord.staffName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground space-y-1 break-all">
                <div>
                  <strong>ID:</strong> {previewRecord.staffId}
                </div>
                <div>
                  <strong>Area:</strong> {previewRecord.area}
                </div>
                <div>
                  <strong>Role:</strong> {formatRole(previewRecord.role)}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  {previewRecord.status === "in" ? "Checked In" : "Checked Out"}
                </div>
                {previewRecord.gpsLocationIn && (
                  <div>
                    <strong>Location In:</strong>{" "}
                    <a
                      href={previewRecord.gpsLocationIn}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Map
                    </a>
                  </div>
                )}
                {previewRecord.gpsLocationOut && (
                  <div>
                    <strong>Location Out:</strong>{" "}
                    <a
                      href={previewRecord.gpsLocationOut}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Map
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
