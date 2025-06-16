// components/staff/StaffForm.tsx
"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/lib/store/store";
import { addStaff } from "@/lib/store/slices/staffSlice";
import {
  saveStaffToFirestore,
  updateLinkedStaff,
} from "@/lib/services/staffService";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  UserPlus,
  Mail,
  Phone,
  Lock,
  User,
  Shield,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AddStaffForm() {
  const dispatch = useDispatch<AppDispatch>();
  const staffList = useSelector((state: RootState) => state.staff.staffList);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    userType: "Helper" as "Helper" | "Supervisor",
    linkedStaffId: "none",
    area: "",
    teamNumber: 0,
    empNumber: "",
  });
  const areas = useSelector((state: RootState) => state.area.areas);
  const [availableTeamNumbers, setAvailableTeamNumbers] = useState<number[]>(
    []
  );
  const [existingTeamMember, setExistingTeamMember] = useState<Staff | null>(
    null
  );

  const resetForm = () => {
    setForm({
      username: "",
      email: "",
      phone: "",
      password: "",
      userType: "Helper",
      linkedStaffId: "none",
      area: "",
      teamNumber: 0,
      empNumber: "",
    });
    setExistingTeamMember(null);
    setAvailableTeamNumbers([]);
    setShowPassword(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const staffData = {
        ...form,
        linkedStaffId: form.linkedStaffId === "none" ? "" : form.linkedStaffId,
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      const id = await saveStaffToFirestore(staffData);
      dispatch(addStaff({ id, ...staffData }));
      
      // If this staff is linked to another, update the other staff member
      if (form.linkedStaffId && form.linkedStaffId !== "none") {
        await updateLinkedStaff(dispatch, id, form.linkedStaffId);
      }
      
      toast.success("Staff member added successfully");
      resetForm(); // Use resetForm instead of manual reset
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add staff member");
    } finally {
      setLoading(false);
    }
  };

  // In StaffForm.tsx, update the getAvailableTeamNumbers function:
  // const getAvailableTeamNumbers = (selectedArea: string) => {
  //   // Get all active staff in the selected area
  //   const areaStaff = staffList.filter(
  //     (staff) => staff.area === selectedArea && staff.isActive
  //   );

  //   // Group by team number to find incomplete teams
  //   const teamGroups = areaStaff.reduce((acc, staff) => {
  //     if (!acc[staff.teamNumber]) {
  //       acc[staff.teamNumber] = { supervisors: 0, helpers: 0, members: [] };
  //     }
  //     if (staff.userType === "Supervisor") {
  //       acc[staff.teamNumber].supervisors++;
  //     } else {
  //       acc[staff.teamNumber].helpers++;
  //     }
  //     acc[staff.teamNumber].members.push(staff);
  //     return acc;
  //   }, {} as Record<number, { supervisors: number; helpers: number; members: Staff[] }>);

  //   // Find incomplete teams (teams with only one member)
  //   const incompleteTeams = Object.entries(teamGroups)
  //     .filter(([_, team]) => team.supervisors + team.helpers === 1)
  //     .map(([teamNum, _]) => parseInt(teamNum));

  //   // Find the highest team number
  //   const maxTeamNumber = Math.max(0, ...Object.keys(teamGroups).map(Number));

  //   // Add option for new team
  //   return [...incompleteTeams, maxTeamNumber + 1];
  // };


  const getAvailableTeamNumbers = (selectedArea: string) => {
    // Get all staff in the selected area (including inactive)
    const areaStaff = staffList.filter((staff) => staff.area === selectedArea);
  
    // Group by team number, counting only active members
    const teamGroups = areaStaff.reduce((acc, staff) => {
      if (staff.teamNumber > 0) { // Ignore staff with team number 0
        if (!acc[staff.teamNumber]) {
          acc[staff.teamNumber] = { 
            supervisors: 0, 
            helpers: 0, 
            activeSupervisors: 0,
            activeHelpers: 0,
            members: [] 
          };
        }
        
        acc[staff.teamNumber].members.push(staff);
        
        if (staff.userType === "Supervisor") {
          acc[staff.teamNumber].supervisors++;
          if (staff.isActive) acc[staff.teamNumber].activeSupervisors++;
        } else {
          acc[staff.teamNumber].helpers++;
          if (staff.isActive) acc[staff.teamNumber].activeHelpers++;
        }
      }
      return acc;
    }, {} as Record<number, { 
      supervisors: number; 
      helpers: number; 
      activeSupervisors: number;
      activeHelpers: number;
      members: Staff[] 
    }>);
  
    // Find incomplete teams (teams with only one active member)
    const incompleteTeams = Object.entries(teamGroups)
      .filter(([_, team]) => {
        const totalActive = team.activeSupervisors + team.activeHelpers;
        return totalActive === 1; // Only one active member
      })
      .map(([teamNum, _]) => parseInt(teamNum));
  
    // Find the highest team number
    const maxTeamNumber = Math.max(0, ...Object.keys(teamGroups).map(Number));
  
    // Return incomplete teams and option for new team
    return [...incompleteTeams.sort((a, b) => a - b), maxTeamNumber + 1];
  };



  // const linkedOptions =
  //   form.userType === "Helper"
  //     ? staffList.filter((s) => s.userType === "Supervisor")
  //     : staffList.filter((s) => s.userType === "Helper");
  const linkedOptions = staffList.filter((s) => {
    // Must be active, different from current, and in same area
    if (!s.isActive || s.id === form.linkedStaffId || s.area !== form.area) {
      return false;
    }
    
    // Must not already have a partner (available for pairing)
    return !s.linkedStaffId || s.linkedStaffId === "";
  });

  useEffect(() => {
    if (form.area) {
      const numbers = getAvailableTeamNumbers(form.area);
      setAvailableTeamNumbers(numbers);

      // Auto-select team number if only one available
      if (numbers.length === 1) {
        handleTeamNumberSelection(numbers[0]);
      }
    }
  }, [form.area]);

  const handleTeamNumberSelection = (teamNumber: number) => {
    setForm((prev) => ({ ...prev, teamNumber }));

    // Find existing team member with this number
    const teamMember = staffList.find(
      (staff) =>
        staff.area === form.area &&
        staff.teamNumber === teamNumber &&
        staff.isActive
    );

    setExistingTeamMember(teamMember || null);

    if (teamMember) {
      // Auto-select opposite role and link to existing member
      const oppositeRole =
        teamMember.userType === "Supervisor" ? "Helper" : "Supervisor";
      setForm((prev) => ({
        ...prev,
        userType: oppositeRole,
        linkedStaffId: teamMember.id, // This should properly set the team partner
      }));
    } else {
      // New team - reset linked staff
      setForm((prev) => ({
        ...prev,
        linkedStaffId: "none",
      }));
    }
  };

  useEffect(() => {
    if (form.area) {
      const numbers = getAvailableTeamNumbers(form.area);
      setAvailableTeamNumbers(numbers);
      setExistingTeamMember(null); // Reset when area changes

      // Auto-select team number if only one available
      if (numbers.length === 1) {
        handleTeamNumberSelection(numbers[0]);
      }
    }
  }, [form.area]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new staff member to your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+94 71 234 5678"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Select
                value={form.area}
                onValueChange={(val) => setForm({ ...form, area: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.name}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.area && (
              <div className="space-y-2">
                <Label htmlFor="teamNumber">Team Number</Label>
                <Select
                  value={form.teamNumber.toString()}
                  onValueChange={(val) =>
                    handleTeamNumberSelection(parseInt(val))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team number" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeamNumbers.map((num) => {
                      const existingMember = staffList.find(
                        (s) =>
                          s.area === form.area &&
                          s.teamNumber === num &&
                          s.isActive
                      );
                      const isNewTeam =
                        num === Math.max(...availableTeamNumbers);

                      return (
                        <SelectItem key={num} value={num.toString()}>
                          Team {num}
                          {existingMember &&
                            ` (needs ${
                              existingMember.userType === "Supervisor"
                                ? "Helper"
                                : "Supervisor"
                            })`}
                          {isNewTeam && " (New Team)"}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="empNumber">Employee Number</Label>
              <Input
                id="empNumber"
                name="empNumber"
                value={form.empNumber}
                onChange={handleChange}
                placeholder="EMP001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userType" className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                User Type
              </Label>
              <Select
                value={form.userType}
                onValueChange={(val) =>
                  setForm({
                    ...form,
                    userType: val as any,
                    linkedStaffId: "none",
                  })
                }
                disabled={existingTeamMember !== null} // Disable if auto-selected
              >
                <SelectTrigger id="userType">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Helper">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Helper
                    </div>
                  </SelectItem>
                  <SelectItem value="Supervisor">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Supervisor
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
             
            <div className="space-y-2">
              <Label htmlFor="linkedStaff" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Team Partner
              </Label>
              <Select
                value={form.linkedStaffId || "none"}
                onValueChange={(val) =>
                  setForm({ ...form, linkedStaffId: val })
                }
                disabled={existingTeamMember !== null} // Disable if auto-selected
              >
                <SelectTrigger id="linkedStaff">
                  <SelectValue placeholder="Select team partner">
                    {form.linkedStaffId && form.linkedStaffId !== "none"
                      ? linkedOptions.find((s) => s.id === form.linkedStaffId)
                          ?.username || "None"
                      : "None"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {existingTeamMember ? (
                    <SelectItem value={existingTeamMember.id}>
                      {existingTeamMember.username} (
                      {existingTeamMember.userType})
                    </SelectItem>
                  ) : (
                    linkedOptions.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.username} ({s.userType})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Select
                value={form.area}
                onValueChange={(val) => setForm({ ...form, area: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.name}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {form.area && (
              <div className="space-y-2">
                <Label htmlFor="teamNumber">Team Number</Label>
                <Select
                  value={form.teamNumber.toString()}
                  onValueChange={(val) =>
                    handleTeamNumberSelection(parseInt(val))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team number" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeamNumbers.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Team {num}
                      </SelectItem>
                    ))}
                    <SelectItem
                      value={(
                        Math.max(...availableTeamNumbers, 0) + 1
                      ).toString()}
                    >
                      Create New Team (
                      {Math.max(...availableTeamNumbers, 0) + 1})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="empNumber">Employee Number</Label>
              <Input
                id="empNumber"
                name="empNumber"
                value={form.empNumber}
                onChange={handleChange}
                placeholder="EMP001"
                required
              />
            </div>
          </div> */}

          {/* <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType" className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                User Type
              </Label>
              <Select
                value={form.userType}
                onValueChange={(val) =>
                  setForm({
                    ...form,
                    userType: val as any,
                    linkedStaffId: "none",
                  })
                }
              >
                <SelectTrigger id="userType">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Helper">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Helper
                    </div>
                  </SelectItem>
                  <SelectItem value="Supervisor">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Supervisor
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {linkedOptions.length > 0 && (
              <div className="space-y-2">
                <Label
                  htmlFor="linkedStaff"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {form.userType === "Helper"
                    ? "Assign to Supervisor"
                    : "Assign Helpers"}
                </Label>
                <Select
                  value={form.linkedStaffId || "none"}
                  onValueChange={(val) =>
                    setForm({ ...form, linkedStaffId: val })
                  }
                >
                  <SelectTrigger id="linkedStaff">
                    <SelectValue placeholder="Select supervisor" />
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
              </div>
            )}
          </div> */}

          <div className="mt-6 flex justify-end gap-3">
          <Button
  type="button"
  variant="outline"
  onClick={() => {
    resetForm();
    setOpen(false);
  }}
>
  Cancel
</Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Staff Member"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
