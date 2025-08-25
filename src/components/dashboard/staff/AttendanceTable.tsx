// components/dashboard/staff/AttendanceTable.tsx
"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Card, CardContent } from "@/components/ui/card";
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
  Filter,
} from "lucide-react";
import { useState } from "react";

export default function AttendanceTable() {
  // components/dashboard/staff/AttendanceTable.tsx
  // Line 22 - Update this line:
  const attendanceRecords = useSelector(
    (state: RootState) => state.attendance?.records || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterArea, setFilterArea] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch =
      record.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.staffId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesArea = filterArea === "all" || record.area === filterArea;
    const matchesDate = !filterDate || record.date === filterDate;

    return matchesSearch && matchesArea && matchesDate;
  });

  const uniqueAreas = [...new Set(attendanceRecords.map((r) => r.area))];

  return (
    <Card className="border-0 shadow-lg py-0">
      <div className="px-6 py-2 ">
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
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Staff
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Area
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Team
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Time In
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Time Out
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
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
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">
                          {record.staffName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {record.staffId.slice(0, 8)}
                        </p>
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
                        {record.role.charAt(0).toUpperCase() +
                          record.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-green-600" />
                        <span className="text-sm font-mono">
                          {record.timeIn}
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
                        variant={
                          record.status === "in" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {record.status === "in" ? "Checked In" : "Checked Out"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() =>
                          window.open(record.gpsLocation, "_blank")
                        }
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
    </Card>
  );
}
