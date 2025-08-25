// // components/dashboard/staff/AttendanceTable.tsx
// "use client";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/lib/store/store";
// import { Card, CardContent } from "@/components/ui/card";
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
// import {
//   Search,
//   MapPin,
//   Clock,
//   Calendar,
//   Download,
//   Filter,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { mockAttendanceData } from "@/lib/data/mockAttendanceData";
// import { setAttendance, AttendanceRecord } from "@/lib/store/slices/attendanceSlice";
// import Image from "next/image";

// export default function AttendanceTable() {
//   // components/dashboard/staff/AttendanceTable.tsx
//   // Line 22 - Update this line:
//   const dispatch = useDispatch();
//   const attendanceRecords = useSelector(
//     (state: RootState) => state.attendance?.records || []
//   );

//   useEffect(() => {
//     if (attendanceRecords.length === 0) {
//       const raw = Array.isArray(mockAttendanceData)
//         ? (mockAttendanceData[0]?.attendance || [])
//         : [];

//       const normalized: AttendanceRecord[] = raw.map((r: any, i: number) => ({
//         // fallback id if missing
//         id: r.id || `mock-${i}`,
//         staffId: r.staffId || r.staffID || `STAFF-${i}`,
//         staffName: r.staffName || r.name || "Unknown",
//         area: r.area || "Unknown",
//         teamNumber: r.teamNumber ?? r.team ?? 0,
//         role: r.role === "supervisor" ? "supervisor" : "helper", // default helper
//         date: r.date || new Date().toISOString().slice(0, 10),
//         timeIn: r.timeIn || "",
//         timeOut: r.timeOut || "",
//         status: r.status === "in" ? "in" : "out",
//         gpsLocation: r.gpsLocation || r.location || "",
//         imageUrl: r.imageUrl,
//       }));

//       dispatch(setAttendance(normalized));
//     }
//   }, [attendanceRecords.length, dispatch]);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterArea, setFilterArea] = useState("all");
//   const [filterDate, setFilterDate] = useState("");

//   const filteredRecords = attendanceRecords.filter((record) => {
//     const matchesSearch =
//       record.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       record.staffId.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesArea = filterArea === "all" || record.area === filterArea;
//     const matchesDate = !filterDate || record.date === filterDate;

//     return matchesSearch && matchesArea && matchesDate;
//   });

//   const uniqueAreas = [...new Set(attendanceRecords.map((r) => r.area))];

//   return (
//     <Card className="border-0 shadow-lg py-0">
//       <div className="px-6 py-2 ">
//         {/* Filters */}
//         <div className="flex flex-wrap gap-4 mb-6">
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

//           <div className="flex items-center gap-2">
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//             <Input
//               type="date"
//               value={filterDate}
//               onChange={(e) => setFilterDate(e.target.value)}
//               className="w-[180px]"
//             />
//           </div>

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
//                 <th className="px-2 py-2 text-left text-sm font-medium">
//                   Location
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
//                       {searchQuery || filterArea !== "all" || filterDate
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
//                     {/* <td className="px-4 py-3">
//                       <div>
//                         <p className="font-medium text-sm">
//                           {record.staffName}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           ID: {record.staffId.slice(0, 8)}
//                         </p>
//                       </div>
//                     </td> */}
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ring-1 ring-gray-300">
//                           {record.imageUrl ? (
//                             <img
//                               src={record.imageUrl}
//                               alt={record.staffName}
//                               width={40}
//                               height={40}
//                               className="h-10 w-10 object-cover"
//                             />
//                           ) : (
//                             <span className="text-xs font-medium">
//                               {record.staffName.charAt(0).toUpperCase()}
//                             </span>
//                           )}
//                         </div>
//                         <div>
//                           <p className="font-medium text-sm">{record.staffName}</p>
//                           <p className="text-xs text-muted-foreground">
//                             ID: {record.staffId.slice(0, 8)}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="text-sm">{record.area}</span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <Badge variant="outline" className="text-xs">
//                         Team {record.teamNumber}
//                       </Badge>
//                     </td>
//                     <td className="px-4 py-3">
//                       <Badge
//                         variant={
//                           record.role === "supervisor" ? "default" : "secondary"
//                         }
//                         className="text-xs"
//                       >
//                         {record.role.charAt(0).toUpperCase() +
//                           record.role.slice(1)}
//                       </Badge>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-1">
//                         <Clock className="h-3 w-3 text-green-600" />
//                         <span className="text-sm font-mono">
//                           {record.timeIn}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       {record.timeOut ? (
//                         <div className="flex items-center gap-1">
//                           <Clock className="h-3 w-3 text-red-600" />
//                           <span className="text-sm font-mono">
//                             {record.timeOut}
//                           </span>
//                         </div>
//                       ) : (
//                         <span className="text-sm text-muted-foreground">-</span>
//                       )}
//                     </td>
//                     <td className="px-4 py-3">
//                       <Badge
//                         variant={
//                           record.status === "in" ? "default" : "secondary"
//                         }
//                         className="text-xs"
//                       >
//                         {record.status === "in" ? "Checked In" : "Checked Out"}
//                       </Badge>
//                     </td>
//                     <td className="px-4 py-3">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-7 px-2"
//                         onClick={() =>
//                           window.open(record.gpsLocation, "_blank")
//                         }
//                       >
//                         <MapPin className="h-3 w-3 mr-1" />
//                         View
//                       </Button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
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
  Calendar,
  Download,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AttendanceRecord } from "@/lib/store/slices/attendanceSlice";
import { updateAttendanceAndSync } from "@/lib/services/staffService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AttendanceTable() {
  const dispatch = useDispatch();
  const attendanceRecords = useSelector(
    (state: RootState) => state.attendance?.records || []
  );

  // Load mock data once
  useEffect(() => {
  
    if (attendanceRecords.length === 0) {
      updateAttendanceAndSync(dispatch as any);
  }
  }, [attendanceRecords.length, dispatch]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterArea, setFilterArea] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Image preview dialog state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<AttendanceRecord | null>(
    null
  );

  const openPreview = (r: AttendanceRecord) => {
    setPreviewRecord(r);
    setPreviewOpen(true);
  };
  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewRecord(null);
  };

  const filteredRecords = attendanceRecords.filter((record) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      record.staffName.toLowerCase().includes(q) ||
      record.staffId.toLowerCase().includes(q);
    const matchesArea = filterArea === "all" || record.area === filterArea;
    const matchesDate = !filterDate || record.date === filterDate;
    return matchesSearch && matchesArea && matchesDate;
  });

  const uniqueAreas = [...new Set(attendanceRecords.map((r) => r.area))];

  const formatRole = (role?: string) =>
    role ? role.charAt(0).toUpperCase() + role.slice(1) : "Helper";

  return (
    <Card className="border-0 shadow-lg py-0">
      <div className="px-6 py-2">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
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

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-[180px]"
              />
            </div>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-2 py-2 text-left text-sm font-medium">Date</th>
                <th className="px-2 py-2 text-left text-sm font-medium">Staff</th>
                <th className="px-2 py-2 text-left text-sm font-medium">Area</th>
                <th className="px-2 py-2 text-left text-sm font-medium">Team</th>
                <th className="px-2 py-2 text-left text-sm font-medium">Role</th>
                <th className="px-2 py-2 text-left text-sm font-medium">Time In</th>
                <th className="px-2 py-2 text-left text-sm font-medium">Time Out</th>
                <th className="px-2 py-2 text-left text-sm font-medium">Status</th>
                <th className="px-2 py-2 text-left text-sm font-medium">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No attendance records found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery || filterArea !== "all" || filterDate
                        ? "Try adjusting your filters"
                        : "No attendance data available"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-2 py-1">
                      <span className="text-sm font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Staff + avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openPreview(record)}
                          className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition cursor-pointer"
                          aria-label={`View ${record.staffName} photo`}
                        >
                          {record.imageUrl ? (
                            <img
                              src={record.imageUrl}
                              alt={record.staffName}
                              width={40}
                              height={40}
                              className="h-10 w-10 object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display =
                                  "none";
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

                    <td className="px-4 py-3">
                      <span className="text-sm">{record.area}</span>
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        Team {record.teamNumber}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          record.role === "supervisor" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {formatRole(record.role)}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-green-600" />
                        <span className="text-sm font-mono">
                          {record.timeIn || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {record.timeOut ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-red-600" />
                          <span className="text-sm font-mono">
                            {record.timeOut}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        variant={record.status === "in" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {record.status === "in" ? "Checked In" : "Checked Out"}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 cursor-pointer"
                        onClick={() =>
                          record.gpsLocation &&
                          window.open(record.gpsLocation, "_blank")
                        }
                        disabled={!record.gpsLocation}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Dialog */}
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
                      (e.currentTarget as HTMLImageElement).style.display = "none";
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
                {previewRecord.gpsLocation && (
                  <div>
                    <strong>Location:</strong>{" "}
                    <a
                      href={previewRecord.gpsLocation}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Map
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