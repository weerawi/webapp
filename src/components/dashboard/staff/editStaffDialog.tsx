"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";  
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
// import { Staff } from "@/lib/store/slices/staffSlice";
// import { updateStaffAndSync } from "@/lib/services/staffService";
import { Staff, combineStaffLists } from "@/types/staff";
import { updateSupervisorAndSync } from "@/lib/services/supervisorService";
import { updateHelperAndSync } from "@/lib/services/helperService";

interface EditStaffDialogProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditStaffDialog({
  staff,
  open,
  onOpenChange,
}: EditStaffDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const supervisors = useSelector((state: RootState) => state.supervisor.supervisors);
  const helpers = useSelector((state: RootState) => state.helper.helpers);
  const staffList = combineStaffLists(supervisors, helpers);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    userType: "Helper" as "Helper" | "Supervisor",
    linkedStaffId: "none",
    area: "",  
  });

  // Initialize form when dialog opens or staff changes
  useEffect(() => {
    if (open && staff) {
      setForm({
        email: staff.email,
        phone: staff.phone,
        password: staff.password,
        userType: staff.userType,
        linkedStaffId: staff.linkedStaffId || "none",
        area: staff.area,
      });
    }
  }, [open, staff]);

  useEffect(()=>{

    console.log("edit open /////////////////////////////")
  },[])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const oldLinkedStaffId = staff.linkedStaffId;
  //     const newLinkedStaffId = form.linkedStaffId === "none" ? "" : form.linkedStaffId;
      
  //     const updateData = {
  //       ...form,
  //       linkedStaffId: newLinkedStaffId,
  //     };
      
  //     // Update current staff
  //     await updateStaffAndSync(dispatch, staff.id, updateData);
      
  //     // Handle partner changes
  //     if (oldLinkedStaffId !== newLinkedStaffId) {
  //       // Unlink old partner and reset their team number
  //       if (oldLinkedStaffId) {
  //         await updateStaffAndSync(dispatch, oldLinkedStaffId, { 
  //           linkedStaffId: "",
  //           teamNumber: 0 // Reset team number when unlinked
  //         });
  //       }
        
  //       // Link new partner and update their team number
  //       if (newLinkedStaffId) {
  //         await updateStaffAndSync(dispatch, newLinkedStaffId, { 
  //           linkedStaffId: staff.id,
  //           teamNumber: staff.teamNumber // Assign same team number as current staff
  //         });
  //       }
  //     }
      
  //     toast.success("Staff member updated successfully");
  //     onOpenChange(false);
  //   } catch (error) {
  //     toast.error("Failed to update staff member");
  //   } finally {
  //     setLoading(false);
  //   }
  // };





// Replace the handleSubmit function with this version:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const oldLinkedStaffId = staff.linkedStaffId;
    const newLinkedStaffId = form.linkedStaffId === "none" ? "" : form.linkedStaffId;
    
    if (staff.userType === "Supervisor") {
      const updateData = {
        email: form.email,
        phone: form.phone,
        password: form.password,
        linkedHelperId: newLinkedStaffId,
      };
      
      await updateSupervisorAndSync(dispatch, staff.id, updateData);
      
      // Handle partner changes
      if (oldLinkedStaffId !== newLinkedStaffId) {
        if (oldLinkedStaffId) {
          await updateHelperAndSync(dispatch, oldLinkedStaffId, {
            linkedSupervisorId: ""
          });
        }
        if (newLinkedStaffId) {
          await updateHelperAndSync(dispatch, newLinkedStaffId, {
            linkedSupervisorId: staff.id,
            teamNumber: staff.teamNumber
          });
        }
      }
    } else {
      // Helper update
      const updateData = {
        email: form.email,
        phone: form.phone,
        linkedSupervisorId: newLinkedStaffId,
      };
      
      await updateHelperAndSync(dispatch, staff.id, updateData);
      
      // Handle partner changes
      if (oldLinkedStaffId !== newLinkedStaffId) {
        if (oldLinkedStaffId) {
          await updateSupervisorAndSync(dispatch, oldLinkedStaffId, {
            linkedHelperId: ""
          });
        }
        if (newLinkedStaffId) {
          await updateSupervisorAndSync(dispatch, newLinkedStaffId, {
            linkedHelperId: staff.id,
            teamNumber: staff.teamNumber
          });
        }
      }
    }
    
    toast.success("Staff member updated successfully");
    onOpenChange(false);
  } catch (error) {
    console.error("Error updating staff:", error);
    toast.error(`Failed to update staff member`);
  } finally {
    setLoading(false);
  }
};
  // const getLinkedOptions = () => {
  //   return staffList.filter((s) => {
  //     // Same area and active
  //     if (s.area !== staff.area || !s.isActive || s.id === staff.id) {
  //       return false;
  //     }
      
  //     // Get the opposite user type
  //     const targetType = form.userType === "Helper" ? "Supervisor" : "Helper";
      
  //     // Must be the opposite type
  //     if (s.userType !== targetType) {
  //       return false;
  //     }
      
  //     // Include current partner OR staff without partners
  //     return s.id === staff.linkedStaffId || !s.linkedStaffId || s.linkedStaffId === "";
  //   });
  // };


  // const getLinkedOptions = () => {
  //   console.log("Current staff area:", staff.area); // Debug line
  
  //   return staffList.filter((s) => {
  //     console.log("Checking staff:", s.username, "Area:", s.area); // Debug line
      
  //     // Use staff.area directly instead of form.area
  //     if (s.area !== staff.area || !s.isActive || s.id === staff.id) {
  //       return false;
  //     }
      
  //     // Get the opposite user type based on form.userType
  //     const targetType = form.userType === "Helper" ? "Supervisor" : "Helper";
      
  //     if (s.userType !== targetType) {
  //       return false;
  //     }
      
  //     // Include current partner
  //     if (s.id === staff.linkedStaffId) {
  //       return true;
  //     }
      
  //     // Include staff without partners
  //     if (!s.linkedStaffId || s.linkedStaffId === "") {
  //       return true;
  //     }
      
  //     // Include staff with team number 0
  //     if (s.teamNumber === 0) {
  //       return true;
  //     }
      
  //     // Include staff whose partner is inactive
  //     const partner = staffList.find(p => p.id === s.linkedStaffId);
  //     if (partner && !partner.isActive) {
  //       return true;
  //     }
      
  //     return false;
  //   });
  // };


const getLinkedOptions = () => {
  const targetType = form.userType === "Helper" ? "Supervisor" : "Helper";

  // For debugging
  console.log("Looking for available", targetType, "in area", staff.area);
  console.log("All staff:", staffList.map(s => ({
    name: s.username,
    type: s.userType,
    area: s.area,
    team: s.teamNumber,
    status: s.status,
    linkedTo: s.linkedStaffId || "none"
  })));

  return staffList.filter((s) => {
    // Basic criteria
    if (s.id === staff.id) return false;
    if (s.area !== staff.area) return false;
    if (!s.isActive) return false;
    if (s.userType !== targetType) return false;

    // Also include staff with "Incomplete" status regardless of linkedStaffId
    // This is the key fix - show helpers/supervisors waiting for partners
    if (s.status === 'Incomplete') return true;

    // Original checks
    const emptyLink = !s.linkedStaffId || s.linkedStaffId === "" || s.linkedStaffId === "none";
    if (emptyLink) return true;
    if (s.linkedStaffId === staff.id) return true;

    // Partner inactive?
    const partner = staffList.find(p => p.id === s.linkedStaffId);
    if (partner && !partner.isActive) return true;

    return false;
  });
};

  const linkedOptions = getLinkedOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh]  flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update staff member details for {staff.username}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          {staff.userType === 'Supervisor' && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          )}
          <div className="space-y-2 ">
            <Label htmlFor="userType">User Type</Label>
            <Select
              value={form.userType}
              onValueChange={(val) =>
                setForm({
                  ...form,
                  userType: val as "Helper" | "Supervisor",
                  linkedStaffId: "none",
                })
              }
            >
              <SelectTrigger id="userType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Helper">Helper</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Partner Selection - This should ALWAYS be visible */}
          <div className="space-y-2">
            <Label htmlFor="linkedStaff">
              {form.userType === "Helper"
                ? "Assign to Supervisor"
                : "Assign Helper"}
            </Label>
            <Select
              value={form.linkedStaffId}
              onValueChange={(val) =>
                setForm({ ...form, linkedStaffId: val })
              }
            >
              <SelectTrigger id="linkedStaff">
                <SelectValue placeholder="Select partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {linkedOptions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.username} - {s.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {linkedOptions.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No available {form.userType === "Helper" ? "supervisors" : "helpers"} in this area
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}