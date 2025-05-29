// TypeScript interfaces for the report system

export interface Report {
    id: string
    title: string
    area: string
    areaId: string
    status: "D" | "OC" | "RC" | "GC" | "ETC"
    date: string
    amount: number
    assignee: string
    assigneeId: string
    priority: "Low" | "Medium" | "High" | "Critical"
    description?: string
    createdAt: string
    updatedAt: string
    createdBy: string
  }
  
  export interface Area {
    id: string
    name: string
    code: string
    description?: string
    isActive: boolean
  }
  
  export interface ReportFilters {
    areaId?: string
    status?: string[]
    dateFrom?: Date
    dateTo?: Date
    priority?: string[]
  }
  
  export interface ReportStats {
    totalReports: number
    completedReports: number
    pendingReports: number
    totalRevenue: number
    monthlyGrowth: number
    statusBreakdown: Record<string, number>
  }
  
  export const StatusLabels = {
    D: "Draft",
    OC: "On Call",
    RC: "Ready to Complete",
    GC: "Good to Complete",
    ETC: "Estimated Time Complete",
  } as const
  
  export const PriorityLabels = {
    Low: "Low Priority",
    Medium: "Medium Priority",
    High: "High Priority",
    Critical: "Critical Priority",
  } as const
  