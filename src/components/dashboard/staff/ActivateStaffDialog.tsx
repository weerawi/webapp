"use client";
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
// import { Staff } from "@/lib/store/slices/staffSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { computeTeamHints, findPartnerOnTeam } from "@/lib/utils/team";
// import { updateStaffAndSync } from "@/lib/services/staffService";
import { toast } from "sonner";
import { Staff, combineStaffLists } from "@/types/staff";
import { updateSupervisorAndSync } from "@/lib/services/supervisorService";
import { updateHelperAndSync } from "@/lib/services/helperService";

type Props = {
  open: boolean;
  staff: Staff;
  onOpenChange: (open: boolean) => void;
};

export default function ActivateStaffDialog({ open, staff, onOpenChange }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const supervisors = useSelector((state: RootState) => state.supervisor.supervisors);
  const helpers = useSelector((state: RootState) => state.helper.helpers);
  const staffList = combineStaffLists(supervisors, helpers);

  const { incompleteTeamsNeedingThisRole, suggestedNewTeam } = useMemo(
    () => computeTeamHints(staffList, staff.area, staff.userType),
    [staffList, staff.area, staff.userType]
  );

  const [teamNumber, setTeamNumber] = useState<number>(
    incompleteTeamsNeedingThisRole[0] ?? suggestedNewTeam
  );

  const options = useMemo(() => {
    const opts: { value: number; label: string }[] = [];
    incompleteTeamsNeedingThisRole.forEach(n => {
      // show which role is missing
      const need = staff.userType === "Supervisor" ? "Supervisor" : "Helper";
      // Actually the team needs THIS user (staff.userType), not the opposite.
      opts.push({ value: n, label: `Team ${n} (needs ${staff.userType})` });
    });
    opts.push({ value: suggestedNewTeam, label: `Create / Reuse new team (Team ${suggestedNewTeam})` });
    return opts;
  }, [incompleteTeamsNeedingThisRole, suggestedNewTeam, staff.userType]);

const handleConfirm = async () => {
  try {
    const opposite = staff.userType === "Supervisor" ? "Helper" : "Supervisor";
    const partner = findPartnerOnTeam(staffList, staff.area, teamNumber, opposite);

    if (staff.userType === "Supervisor") {
      await updateSupervisorAndSync(dispatch, staff.id, {
        isActive: true,
        teamNumber,
        linkedHelperId: partner ? partner.id : "",
        status: partner ? 'Active' : 'Incomplete' // Add explicit status
      });
    } else {
      await updateHelperAndSync(dispatch, staff.id, {
        isActive: true,
        teamNumber,
        linkedSupervisorId: partner ? partner.id : "",
        status: partner ? 'Active' : 'Incomplete' // Add explicit status
      });
    }

    // Update partner's status if exists
    if (partner) {
      if (partner.userType === "Supervisor") {
        await updateSupervisorAndSync(dispatch, partner.id, {
          teamNumber,
          linkedHelperId: staff.id,
          status: 'Active' // Both are now active and linked
        });
      } else {
        await updateHelperAndSync(dispatch, partner.id, {
          teamNumber,
          linkedSupervisorId: staff.id,
          status: 'Active' // Both are now active and linked
        });
      }
    }

    toast.success(`Activated ${staff.username} on Team ${teamNumber}`);
    onOpenChange(false);
  } catch (e) {
    toast.error("Failed to activate staff");
    console.error(e);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Activate {staff.username}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Choose Team in {staff.area}</Label>
            <Select
              value={String(teamNumber)}
              onValueChange={(v) => setTeamNumber(parseInt(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select team number" />
              </SelectTrigger>
              <SelectContent>
                {options.map(opt => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Incomplete teams that need a {staff.userType} are listed first (lowest numbers first). 
              Otherwise, we reuse the lowest free team number.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleConfirm}>Activate</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
