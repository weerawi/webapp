// ADD this to the existing file:
import { Supervisor } from "@/lib/store/slices/supervisorSlice";
import { Helper } from "@/lib/store/slices/helperSlice";

// Unified Staff type for UI components
export type Staff = (Supervisor | Helper) & {
  userType: "Supervisor" | "Helper";
  password?: string; // Optional for helpers
  linkedStaffId?: string; // Generic link field
};

// Helper function to combine lists 
export function combineStaffLists(supervisors: Supervisor[] | undefined, helpers: Helper[] | undefined): Staff[] {
  const supervisorList = supervisors || [];
  const helperList = helpers || [];
  
  const combined = [
    ...supervisorList.map(s => {
      let status: 'Active' | 'Inactive' | 'Incomplete' | 'Deleted' = s.status || 'Incomplete';
      
      // Check for Deleted status first
      if (s.status === 'Deleted') {
        status = 'Deleted';
      } else if (!s.isActive) {
        status = 'Inactive';
      } else if (s.linkedHelperId && s.teamNumber > 0) {
        const linkedHelper = helperList.find(h => h.id === s.linkedHelperId);
        status = (linkedHelper?.isActive) ? 'Active' : 'Incomplete';
      } else {
        status = 'Incomplete';
      }
      
      return {
        ...s,
        userType: 'Supervisor' as const,
        linkedStaffId: s.linkedHelperId || '',
        password: s.password || '',
        status
      };
    }),
    ...helperList.map(h => {
      let status: 'Active' | 'Inactive' | 'Incomplete' | 'Deleted' = h.status || 'Incomplete';
      
      // Check for Deleted status first
      if (h.status === 'Deleted') {
        status = 'Deleted';
      } else if (!h.isActive) {
        status = 'Inactive';
      } else if (h.linkedSupervisorId && h.teamNumber > 0) {
        const linkedSupervisor = supervisorList.find(s => s.id === h.linkedSupervisorId);
        status = (linkedSupervisor?.isActive) ? 'Active' : 'Incomplete';
      } else {
        status = 'Incomplete';
      }
      
      return {
        ...h,
        userType: 'Helper' as const,
        password: '',
        linkedStaffId: h.linkedSupervisorId || '',
        status
      };
    })
  ];
  
  // Sort to put deleted users at the bottom
  return combined.sort((a, b) => {
    if (a.status === 'Deleted' && b.status !== 'Deleted') return 1;
    if (a.status !== 'Deleted' && b.status === 'Deleted') return -1;
    return 0;
  });
}