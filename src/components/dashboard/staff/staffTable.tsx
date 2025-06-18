// components/staff/StaffTable.tsx
"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { deleteStaffAndSync } from "@/lib/services/staffService";
import { toast } from "sonner";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Shield,
  Users,
  User,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import EditStaffDialog from "./EditStaffDialog";
import { Staff } from "@/lib/store/slices/staffSlice"; 
import { updateStaffAndSync } from "@/lib/services/staffService";


export default function StaffTable() {
  const staffList = useSelector((state: RootState) => state.staff.staffList);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );
  const dispatch = useDispatch<AppDispatch>(); // Add this
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null); // Add this state

  const handleDelete = async () => {
    if (!deletingStaff) return;

    try {
      await deleteStaffAndSync(dispatch, deletingStaff.id);
      toast.success(`${deletingStaff.username} has been deleted successfully`);
      setDeletingStaff(null);
    } catch (error) {
      toast.error("Failed to delete staff member");
      console.error("Delete error:", error);
    }
  };

  const filteredStaff = staffList.filter(
    (staff) =>
      // staff.isActive && 
      (staff.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.phone.includes(searchQuery))
  );

  const getLinkedStaffName = (linkedId: string) => {
    if (!linkedId || linkedId === "") return "None"; // Handle empty strings
    const linkedStaff = staffList.find((s) => s.id === linkedId);
    return linkedStaff?.username || "None";
  };

  const togglePasswordVisibility = (staffId: string) => {
    setShowPasswords((prev) => ({ ...prev, [staffId]: !prev[staffId] }));
  };

  // const handleStatusToggle = async (staff: Staff) => {
  //   const newStatus = !staff.isActive;
  //   const action = newStatus ? "activate" : "deactivate";
  
  //   const confirmed = await new Promise((resolve) => {
  //     const result = window.confirm(
  //       `Are you sure you want to ${action} ${staff.username}? ` +
  //         (!newStatus && staff.linkedStaffId
  //           ? "This will also unlink their team partner."
  //           : "")
  //     );
  //     resolve(result);
  //   });
  
  //   if (!confirmed) return;
  
  //   try {
  //     // Update the staff member
  //     await updateStaffAndSync(dispatch, staff.id, { isActive: newStatus });
  
  //     // If deactivating and has a linked partner, unlink both
  //     if (!newStatus && staff.linkedStaffId) {
  //       const linkedStaff = staffList.find(s => s.id === staff.linkedStaffId);
  //       if (linkedStaff) {
  //         await updateStaffAndSync(dispatch, staff.linkedStaffId, {
  //           linkedStaffId: "",
  //           teamNumber: 0 // Reset team number for the unlinked staff
  //         });
  //       }
  //     }
  
  //     toast.success(`${staff.username} has been ${action}d successfully`);
  //   } catch (error) {
  //     toast.error(`Failed to ${action} staff member`);
  //   }
  // };

  // Calculate trend based on last month's data
  
  
  const handleStatusToggle = async (staff: Staff) => {
    const newStatus = !staff.isActive;
    const action = newStatus ? "activate" : "deactivate";
  
    const confirmed = await new Promise((resolve) => {
      const result = window.confirm(
        `Are you sure you want to ${action} ${staff.username}? ` +
          (!newStatus && staff.linkedStaffId
            ? "Their partner will remain in the team waiting for a new partner."
            : "")
      );
      resolve(result);
    });
  
    if (!confirmed) return;
  
    try {
      // If deactivating, also reset team number
      const updates: Partial<Staff> = { isActive: newStatus };
      if (!newStatus) {
        updates.teamNumber = 0; // Reset team number when deactivating
        updates.linkedStaffId = "";
      }
      
      // Update the staff member
      await updateStaffAndSync(dispatch, staff.id, updates);
  
      // If deactivating and has a linked partner, only unlink (don't reset partner's team)
      if (!newStatus && staff.linkedStaffId) {
        await updateStaffAndSync(dispatch, staff.linkedStaffId, {
          linkedStaffId: "" // Only unlink, keep their team number
        });
      }
  
      toast.success(`${staff.username} has been ${action}d successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} staff member`);
    }
  };
  
  
  const calculateTrend = () => {
    const now = new Date();
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthStaff = staffList.filter((staff) => {
      if (staff.createdAt) {
        const createdDate = new Date(staff.createdAt);
        return createdDate <= lastMonth;
      }
      return false;
    });

    const currentCount = staffList.length;
    const lastMonthCount = lastMonthStaff.length;

    if (lastMonthCount === 0) return { percentage: 0, isUp: true };

    const percentage = ((currentCount - lastMonthCount) / lastMonthCount) * 100;
    return { percentage: Math.abs(percentage), isUp: percentage >= 0 };
  };

  const trend = calculateTrend();
  const supervisorCount = staffList.filter(
    (s) => s.userType === "Supervisor"
  ).length;
  const helperCount = staffList.filter((s) => s.userType === "Helper").length;

  return (
    <>
      <Card className="border-0 shadow-lg mt-0 pt-2 ">
        <div className="px-6">
          <div className="flex items-center justify-between mb-3 ">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-0 shadow-sm py-0">
                <CardContent className="px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Staff
                      </p>
                      <p className="text-2xl font-bold">{staffList.length}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-sm">
                    {trend.isUp ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={trend.isUp ? "text-green-500" : "text-red-500"}
                    >
                      {trend.isUp ? "+" : "-"}
                      {trend.percentage.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">
                      from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm py-0">
                <CardContent className="px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Supervisors
                      </p>
                      <p className="text-2xl font-bold">{supervisorCount}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {supervisorCount > 0
                      ? `${Math.round(
                          (supervisorCount / staffList.length) * 100
                        )}% of total`
                      : "No supervisors yet"}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm py-0">
                <CardContent className="px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Helpers
                      </p>
                      <p className="text-2xl font-bold">{helperCount}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {helperCount > 0
                      ? `${Math.round(
                          (helperCount / staffList.length) * 100
                        )}% of total`
                      : "No helpers yet"}
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

          <div className="overflow-hidden rounded-lg border min-h-[380px] max-h-screen">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground w-[200px]">
                    Staff
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground w-[250px]">
                    Contact
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                    Area
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                    Team
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                    Emp #
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground w-[160px]">
                    Password
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground w-[120px]">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground w-[200px]">
                    Assigned
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-muted-foreground w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center">
                      <User className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No staff members found
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery
                          ? "Try adjusting your search"
                          : "Add your first staff member"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => (
                    <tr
                      key={staff.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {staff.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {staff.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {staff.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col items-center  text-sm">
                          <span className="text-muted-foreground">
                            {staff.email}
                          </span> 
                          <span className="text-muted-foreground">
                            {staff.phone}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-2">
                        <span className="text-sm">{staff.area}</span>
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant="outline" className="text-xs">
                          Team {staff.teamNumber}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-sm font-mono">
                          {staff.empNumber}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={staff.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {staff.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">
                            {showPasswords[staff.id]
                              ? staff.password
                              : "••••••••"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => togglePasswordVisibility(staff.id)}
                          >
                            {showPasswords[staff.id] ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={
                            staff.userType === "Supervisor"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {staff.userType}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-sm">
                          {staff.linkedStaffId
                            ? getLinkedStaffName(staff.linkedStaffId)
                            : "None"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {setEditingStaff(staff); console.log("EDit cllicj")}}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusToggle(staff)}
                            >
                              {staff.isActive ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeletingStaff(staff)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {editingStaff && (
        <EditStaffDialog
          staff={editingStaff}
          open={!!editingStaff}
          onOpenChange={(open) => !open && setEditingStaff(null)}
        />
      )}

      <DeleteConfirmDialog
        staff={deletingStaff}
        open={!!deletingStaff}
        onOpenChange={(open) => !open && setDeletingStaff(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
