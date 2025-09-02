// components/staff/StaffForm.tsx
"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/lib/store/store";
// import { addStaff } from "@/lib/store/slices/staffSlice";
// import {
//   saveStaffToFirestore,
//   updateLinkedStaff,
// } from "@/lib/services/staffService";
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
import { computeTeamHints } from "@/lib/utils/team";    
import { Staff, combineStaffLists } from "@/types/staff";
import { addSupervisor } from "@/lib/store/slices/supervisorSlice";
import { addHelper } from "@/lib/store/slices/helperSlice";
import { saveSupervisorToFirestore, updateSupervisorAndSync, createSupervisorAuthUser } from "@/lib/services/supervisorService";
import { saveHelperToFirestore, updateHelperAndSync } from "@/lib/services/helperService";

export default function AddStaffForm() {
  const dispatch = useDispatch<AppDispatch>();
  const supervisors = useSelector((state: RootState) => state.supervisor.supervisors);
  const helpers = useSelector((state: RootState) => state.helper.helpers);
  const staffList = combineStaffLists(supervisors, helpers);
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

const mergedTeamForPair = (partner: Staff | undefined, currentTeam: number, area: string) => {
  if (!partner) return currentTeam;
  // prefer the lowest valid team number (>0) between the two;
  const candidates = [partner.teamNumber, currentTeam].filter(n => n && n > 0);
  if (candidates.length) return Math.min(...candidates);

  // if neither has a valid team yet, reuse the lowest free number for THIS role
  const { suggestedNewTeam } = computeTeamHints(staffList, area, form.userType);
  return suggestedNewTeam;
};

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   // Existing validation checks...
//   const dup = staffList.some(
//     s => s.empNumber.trim().toLowerCase() === form.empNumber.trim().toLowerCase()
//   );
//   if (dup) {
//     toast.error("Employee number must be unique.");
//     return;
//   }

//   const password = form.userType === "Supervisor" ? form.password : "";
//   if (form.userType === "Supervisor" && password.trim().length === 0) {
//     toast.error("Please set a password for the supervisor.");
//     return;
//   }

//   setLoading(true);
//   try {
//     // Create Firebase Auth user for Supervisor
//     let uid: string | undefined;
//     if (form.userType === "Supervisor" && password) {
//       try {
//         const { createStaffAuthUser } = await import("@/lib/services/staffService");
//         uid = await createStaffAuthUser(form.email, password);
//       } catch (error: any) {
//         toast.error(error.message || "Failed to create authentication for supervisor");
//         setLoading(false);
//         return;
//       }
//     }

//     // Rest of your existing logic for partner and team...
//     const partner = form.linkedStaffId && form.linkedStaffId !== "none"
//       ? staffList.find(s => s.id === form.linkedStaffId)
//       : undefined;

//     const targetTeam = mergedTeamForPair(partner, form.teamNumber, form.area);

//     const staffData = {
//       ...form,
//       uid, // Add the UID if created
//       teamNumber: targetTeam,
//       password,
//       linkedStaffId: form.linkedStaffId === "none" ? "" : form.linkedStaffId,
//       joinDate: new Date().toISOString(),
//       createdAt: new Date().toISOString(),
//       isActive: true,
//     };

//     const id = await saveStaffToFirestore(staffData);
//     dispatch(addStaff({ id, ...staffData }));

//     if (partner) {
//       await updateLinkedStaff(dispatch, id, partner.id, targetTeam);
//     }

//     toast.success("Staff member added successfully");
//     resetForm();
//     setOpen(false);
//   } catch (error) {
//     toast.error("Failed to add staff member");
//   } finally {
//     setLoading(false);
//   }
// };



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


  // const getAvailableTeamNumbers = (selectedArea: string) => {
  //   // Get all staff in the selected area (including inactive)
  //   const areaStaff = staffList.filter((staff) => staff.area === selectedArea);
  
  //   // Group by team number, counting only active members
  //   const teamGroups = areaStaff.reduce((acc, staff) => {
  //     if (staff.teamNumber > 0) { // Ignore staff with team number 0
  //       if (!acc[staff.teamNumber]) {
  //         acc[staff.teamNumber] = { 
  //           supervisors: 0, 
  //           helpers: 0, 
  //           activeSupervisors: 0,
  //           activeHelpers: 0,
  //           members: [] 
  //         };
  //       }
        
  //       acc[staff.teamNumber].members.push(staff);
        
  //       if (staff.userType === "Supervisor") {
  //         acc[staff.teamNumber].supervisors++;
  //         if (staff.isActive) acc[staff.teamNumber].activeSupervisors++;
  //       } else {
  //         acc[staff.teamNumber].helpers++;
  //         if (staff.isActive) acc[staff.teamNumber].activeHelpers++;
  //       }
  //     }
  //     return acc;
  //   }, {} as Record<number, { 
  //     supervisors: number; 
  //     helpers: number; 
  //     activeSupervisors: number;
  //     activeHelpers: number;
  //     members: Staff[] 
  //   }>);
  
  //   // Find incomplete teams (teams with only one active member)
  //   const incompleteTeams = Object.entries(teamGroups)
  //     .filter(([_, team]) => {
  //       const totalActive = team.activeSupervisors + team.activeHelpers;
  //       return totalActive === 1; // Only one active member
  //     })
  //     .map(([teamNum, _]) => parseInt(teamNum));
  
  //   // Find the highest team number
  //   const maxTeamNumber = Math.max(0, ...Object.keys(teamGroups).map(Number));
  
  //   // Return incomplete teams and option for new team
  //   return [...incompleteTeams.sort((a, b) => a - b), maxTeamNumber + 1];
  // }; 

// const getAvailableTeamNumbers = (selectedArea: string) => {
//   // Get all staff in the selected area (both active and inactive)
//   const areaStaff = staffList.filter((staff) => 
//     staff.area === selectedArea && 
//     staff.teamNumber > 0 // Only consider valid team numbers
//   );

//   // Group by team number, counting active and total members separately
//   const teamGroups = areaStaff.reduce((acc, staff) => {
//     if (!acc[staff.teamNumber]) {
//       acc[staff.teamNumber] = { 
//         supervisors: 0, 
//         helpers: 0,
//         activeSupervisors: 0,  // NEED THIS - only active supervisors
//         activeHelpers: 0,      // NEED THIS - only active helpers
//         members: [] 
//       };
//     }
    
//     acc[staff.teamNumber].members.push(staff);
    
//     if (staff.userType === "Supervisor") {
//       acc[staff.teamNumber].supervisors++;
//       if (staff.isActive) acc[staff.teamNumber].activeSupervisors++; // Track active separately
//     } else {
//       acc[staff.teamNumber].helpers++;
//       if (staff.isActive) acc[staff.teamNumber].activeHelpers++; // Track active separately
//     }
    
//     return acc;
//   }, {} as Record<number, { 
//     supervisors: number; 
//     helpers: number; 
//     activeSupervisors: number;  // RESTORED
//     activeHelpers: number;      // RESTORED
//     members: Staff[] 
//   }>);

//   // Find incomplete teams (teams with only one ACTIVE member)
//   const incompleteTeams = Object.entries(teamGroups)
//     .filter(([_, team]) => {
//       const totalActive = team.activeSupervisors + team.activeHelpers; // Use ACTIVE counts
//       return totalActive === 1; // Only one active member = incomplete
//     })
//     .map(([teamNum, _]) => parseInt(teamNum));

//   // Find the highest valid team number (> 0)
//   const validTeamNumbers = Object.keys(teamGroups).map(Number).filter(n => n > 0);
//   const maxTeamNumber = validTeamNumbers.length > 0 ? Math.max(...validTeamNumbers) : 0;

//   // Return incomplete teams and option for new team
//   return [...incompleteTeams.sort((a, b) => a - b), maxTeamNumber + 1];
// };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  const dup = staffList.some(
    s => s.empNumber.trim().toLowerCase() === form.empNumber.trim().toLowerCase()
  );
  if (dup) {
    toast.error("Employee number must be unique.");
    return;
  }

  setLoading(true);
   try {
    let uid: string | undefined;
    let finalPassword = "";

    if (form.userType === "Supervisor") {
      if (!form.password || form.password.trim().length === 0) {
        toast.error("Please set a password for the supervisor.");
        setLoading(false);
        return;
      }
      
      finalPassword = form.password;
      
      try {
        uid = await createSupervisorAuthUser(form.email, finalPassword);
      } catch (error: any) {
        toast.error(error.message || "Failed to create authentication");
        setLoading(false);
        return;
      }

      const supervisorData: any = {
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: finalPassword,
        uid,
        area: form.area,
        teamNumber: form.teamNumber,
        empNumber: form.empNumber,
        linkedHelperId: form.linkedStaffId === "none" ? "" : form.linkedStaffId,
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      const id = await saveSupervisorToFirestore(supervisorData);
      dispatch(addSupervisor({ id, ...supervisorData }));

      // Update linked helper if exists
      if (form.linkedStaffId && form.linkedStaffId !== "none") {
        await updateHelperAndSync(dispatch, form.linkedStaffId, {
          linkedSupervisorId: id,
          teamNumber: form.teamNumber
        });
      }
    } else {
      // Helper
      const helperData: any = {
        username: form.username,
        email: form.email,
        phone: form.phone,
        area: form.area,
        teamNumber: form.teamNumber,
        empNumber: form.empNumber,
        linkedSupervisorId: form.linkedStaffId === "none" ? "" : form.linkedStaffId,
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      const id = await saveHelperToFirestore(helperData);
      dispatch(addHelper({ id, ...helperData }));

      // Update linked supervisor if exists
      if (form.linkedStaffId && form.linkedStaffId !== "none") {
        await updateSupervisorAndSync(dispatch, form.linkedStaffId, {
          linkedHelperId: id,
          teamNumber: form.teamNumber
        });
      }
    }

    toast.success("Staff member added successfully");
    resetForm();
    setOpen(false);
  } catch (error) {
    console.error("Error adding staff:", error);
    toast.error("Failed to add staff member");
  } finally {
    setLoading(false);
  }
};


const getAvailableTeamNumbers = (selectedArea: string) => {
  // For the form we don't yet know the final role (user can pick),
  // so expose both kinds — but we’ll still show the "new team"
  // based on Supervisor by default; the list will refresh once userType changes.
  const { incompleteTeamsNeedingThisRole, suggestedNewTeam } =
    computeTeamHints(staffList, selectedArea, form.userType);

  // Return: incomplete teams first (ascending), then one "new" slot
  return [...incompleteTeamsNeedingThisRole, suggestedNewTeam];
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
    
    // Must be opposite userType
    const oppositeType = form.userType === "Helper" ? "Supervisor" : "Helper";
    if (s.userType !== oppositeType) {
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
            {/* <div className="space-y-2">
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
            </div> */}
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
                    // if switching to Helper, clear password
                    password: val === "Helper" ? "" : form.password,
                  })
                }
                disabled={existingTeamMember !== null}
              >
                <SelectTrigger id="userType" className="w-full">
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
              <Label htmlFor="area">Area</Label>
              <Select
                value={form.area}
                onValueChange={(val) => setForm({ ...form, area: val })}
              >
                <SelectTrigger className="w-full">
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
                  <SelectTrigger className="w-full">
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
            {/* <div className="space-y-2">
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
                <SelectTrigger className="w-full" id="userType">
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
            </div> */}
            {form.userType === "Supervisor" && (
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
                    className="pr-10 w-full"
                    required={form.userType === "Supervisor"}
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
            
            <div className="space-y-2">
              <Label htmlFor="linkedStaff" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Team Partner
              </Label>
              <Select
                value={form.linkedStaffId || "none"}
                onValueChange={(val) => {
                  if (val === "none") {
                    setForm(prev => ({ ...prev, linkedStaffId: "none" }));
                    return;
                  }
                  const partner = staffList.find(s => s.id === val);
                  const newTeam = mergedTeamForPair(partner, form.teamNumber, form.area);
                  setForm(prev => ({ ...prev, linkedStaffId: val, teamNumber: newTeam }));
                }}
                disabled={existingTeamMember !== null}
              >
                <SelectTrigger className="w-full" id="linkedStaff">
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
