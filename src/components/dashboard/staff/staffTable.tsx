// components/staff/StaffTable.tsx
"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  UserCheck,
  Shield,
  Users,
  User,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function StaffTable() {
  const staffList = useSelector((state: RootState) => state.staff.staffList);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone.includes(searchQuery)
  );

  const getLinkedStaffName = (linkedId: string) => {
    const linkedStaff = staffList.find((s) => s.id === linkedId);
    return linkedStaff?.username || "-";
  };

  const supervisorCount = staffList.filter(
    (s) => s.userType === "Supervisor"
  ).length;
  const helperCount = staffList.filter((s) => s.userType === "Helper").length;

  return (
    <Card className="border-0 shadow-lg mt-0 pt-2">
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-0 shadow-sm py-0 ">
              <CardContent className="px-6 ">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Staff
                    </p>
                    <p className="text-2xl font-bold">{staffList.length}</p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">+12%</span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm py-0">
              <CardContent className="px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Supervisors
                    </p>
                    <p className="text-2xl font-bold">{supervisorCount}</p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="mt-1">
                  <div className="text-sm text-muted-foreground">
                    {supervisorCount > 0
                      ? `${Math.round(
                          (supervisorCount / staffList.length) * 100
                        )}% of total staff`
                      : "No supervisors yet"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm py-0">
              <CardContent className="px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Helpers
                    </p>
                    <p className="text-2xl font-bold">{helperCount}</p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <div className="mt-1">
                  <div className="text-sm text-muted-foreground">
                    {helperCount > 0
                      ? `${Math.round(
                          (helperCount / staffList.length) * 100
                        )}% of total staff`
                      : "No helpers yet"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredStaff.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No staff members found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search query"
                : "Add your first staff member to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border  min-h-[350px]">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-2 text-left text-sm font-medium text-muted-foreground">
                    Staff Member
                  </th>
                  <th className="px-6 py-2 text-left text-sm font-medium text-muted-foreground">
                    Contact
                  </th>
                  <th className="px-6 py-2 text-left text-sm font-medium text-muted-foreground">
                    Role
                  </th>
                  <th className="px-6 py-2 text-left text-sm font-medium text-muted-foreground">
                    Assigned To
                  </th>
                  <th className="px-6 py-2 text-right text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${staff.email}`}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {staff.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{staff.username}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {staff.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          {staff.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {staff.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2">
                      <Badge
                        variant={
                          staff.userType === "Supervisor"
                            ? "default"
                            : "secondary"
                        }
                        className="gap-1"
                      >
                        {staff.userType === "Supervisor" ? (
                          <Shield className="h-3 w-3" />
                        ) : (
                          <UserCheck className="h-3 w-3" />
                        )}
                        {staff.userType}
                      </Badge>
                    </td>
                    <td className="px-6 py-2">
                      {staff.linkedStaffId ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getLinkedStaffName(staff.linkedStaffId)
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {getLinkedStaffName(staff.linkedStaffId)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Staff
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
