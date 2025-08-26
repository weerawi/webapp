export interface StaffLike {
  id: string;
  userType: "Helper" | "Supervisor";
  area: string;
  teamNumber: number;
  isActive: boolean;
  status?: 'Active' | 'Inactive' | 'Incomplete';
}