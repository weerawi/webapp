"use client";
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { Staff } from "@/lib/store/slices/staffSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { computeTeamHints, findPartnerOnTeam } from "@/lib/utils/team";
import { updateStaffAndSync } from "@/lib/services/staffService";
import { toast } from "sonner";

type Props = {
  open: boolean;
  staff: Staff;
  onOpenChange: (open: boolean) => void;
};

export default function ActivateStaffDialog({ open, staff, onOpenChange }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const staffList = useSelector((s: RootState) => s.staff.staffList);

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
      // Determine partner (if any) on the chosen team
      const opposite = staff.userType === "Supervisor" ? "Helper" : "Supervisor";
      const partner = findPartnerOnTeam(staffList, staff.area, teamNumber, opposite);

      // 1) Update this staff
      await updateStaffAndSync(dispatch, staff.id, {
        isActive: true,
        teamNumber,
        linkedStaffId: partner ? partner.id : "",
      });

      // 2) If there is a partner, ALWAYS converge to the LOWER team number:
      //    (If partner is on a higher number, move partner down to the lower number.)
      if (partner && partner.teamNumber !== teamNumber) {
        await updateStaffAndSync(dispatch, partner.id, {
          teamNumber,           // pull partner to the chosen team
          linkedStaffId: staff.id,
        });
      } else if (partner) {
        // ensure backlink
        if (partner.linkedStaffId !== staff.id) {
          await updateStaffAndSync(dispatch, partner.id, { linkedStaffId: staff.id });
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
