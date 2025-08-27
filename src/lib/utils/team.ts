import { Staff } from "@/lib/store/slices/staffSlice";

/**
 * Teams are per-area and must be positive integers (>=1).
 * - Incomplete teams: teams with exactly 1 active member.
 * - Free team numbers: positive integers that currently have 0 active members.
 */
export function computeTeamHints(
  staffList: Staff[],
  area: string,
  role: "Helper" | "Supervisor"
) {
  const opposite = role === "Supervisor" ? "Helper" : "Supervisor";

  // Active staff in area with valid teamNumber
  const areaActive = staffList.filter(
    s => s.area === area && s.isActive && s.teamNumber > 0
  );

  const groups = new Map<number, Staff[]>();
  areaActive.forEach(s => {
    groups.set(s.teamNumber, [...(groups.get(s.teamNumber) || []), s]);
  });

  // Incomplete teams that NEED this role
  const incompleteTeamsNeedingThisRole: number[] = [];
  const usedTeamNumbers = new Set<number>();

  groups.forEach((members, t) => {
    usedTeamNumbers.add(t);
    const hasSup = members.some(m => m.userType === "Supervisor");
    const hasHel = members.some(m => m.userType === "Helper");
    const total = members.length;
    if (total === 1) {
      const only = members[0];
      if (only.userType === opposite) incompleteTeamsNeedingThisRole.push(t);
    } else if (!hasSup || !hasHel) {
      // edge: more than 1 but still missing a type — also incomplete
      if ((role === "Supervisor" && !hasSup) || (role === "Helper" && !hasHel)) {
        incompleteTeamsNeedingThisRole.push(t);
      }
    }
  });

  incompleteTeamsNeedingThisRole.sort((a, b) => a - b);

  // Find the LOWEST free positive integer not used
  let candidate = 1;
  while (usedTeamNumbers.has(candidate)) candidate++;

  const suggestedNewTeam = candidate; // lowest gap or max+1

  return { incompleteTeamsNeedingThisRole, suggestedNewTeam };
}

/** Find active opposite-role partner on a given team in an area (if exists) */
export function findPartnerOnTeam(
  staffList: Staff[],
  area: string,
  teamNumber: number,
  neededRole: "Helper" | "Supervisor"
): Staff | null {
  const partner = staffList.find(
    s =>
      s.area === area &&
      s.teamNumber === teamNumber &&
      s.isActive &&
      s.userType === neededRole
  );
  return partner || null;
}
