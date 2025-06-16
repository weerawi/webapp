// "use client";
// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Clock, CheckCircle, ArrowRightLeft } from "lucide-react";
// import { format } from "date-fns";
// import { ReconnectionTask } from "@/lib/store/slices/reconnectionSlice";
// import StatusUpdateDialog from "./StatusUpdatedDialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// // import StatusUpdateDialog from './StatusUpdateDialog';

// interface TaskTableProps {
//   tasks: ReconnectionTask[];
//   onTaskUpdated: () => void;
//   showActions?: boolean;
// }

// export default function TaskTable({
//   tasks,
//   onTaskUpdated,
//   showActions = true,
// }: TaskTableProps) {
//   const [selectedTask, setSelectedTask] = useState<ReconnectionTask | null>(
//     null
//   );
//   const [dialogType, setDialogType] = useState<"confirm" | "transfer" | null>(
//     null
//   );

//   const handleStatusChange = (task: ReconnectionTask, newStatus: string) => {
//     setSelectedTask(task);

//     if (newStatus === "done_by_waterboard") {
//       setDialogType("confirm");
//     } else if (newStatus === "transfer_to_new") {
//       setDialogType("transfer");
//     }
//   };

//   const formatDateTime = (dateString: string) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     return format(date, "dd/MM/yyyy HH:mm");
//   };

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       pending: { label: "Pending", variant: "secondary" as const },
//       done_by_waterboard: {
//         label: "Done by Waterboard",
//         variant: "success" as const,
//       },
//       transfer_to_new: { label: "Transferred", variant: "default" as const },
//     };

//     const config =
//       statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
//     return <Badge variant={config.variant}>{config.label}</Badge>;
//   };

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle> {showActions ? "Active" : "Finished"}  Reconnection Tasks ({tasks.length})</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               <ScrollArea className="h-[400px]">
//                 <TableHeader className="sticky top-0 bg-background z-10">
//                 <TableRow>
//                   <TableHead>Account Number</TableHead>
//                   <TableHead>Team</TableHead>
//                   <TableHead>Allocated Time</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Finish Time</TableHead>
//                   {showActions && <TableHead>Actions</TableHead>}
//                 </TableRow>
//               </TableHeader>
//               <TableBody className="">
//                 {tasks.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={showActions ? 6 : 5}
//                       className="text-center text-muted-foreground py-8"
//                     >
//                       No {showActions ? "active" : "finished"} tasks
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   tasks.map((task) => (
//                     <TableRow key={task.id}>
//                       <TableCell className="font-medium">
//                         {task.accountNumber}
//                       </TableCell>
//                       <TableCell>
//                         {task.team}
//                         {task.transferredFrom && (
//                           <span className="text-xs text-muted-foreground block">
//                             (from {task.transferredFrom})
//                           </span>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-1">
//                           <Clock className="h-3 w-3" />
//                           {formatDateTime(task.allocatedTime)}
//                         </div>
//                       </TableCell>
//                       <TableCell>{getStatusBadge(task.status)}</TableCell>
//                       <TableCell className="flex items-center gap-1">
//                         <Clock className="h-3 w-3" />
//                         {formatDateTime(task.finishTime || "")}
//                       </TableCell>

//                       {showActions && (
//                         <TableCell>
//                           {task.status === "pending" && (
//                             <Select
//                               onValueChange={(value) =>
//                                 handleStatusChange(task, value)
//                               }
//                             >
//                               <SelectTrigger className="w-[180px]">
//                                 <SelectValue placeholder="Change status" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="done_by_waterboard">
//                                   <div className="flex items-center">
//                                     <CheckCircle className="mr-2 h-4 w-4" />
//                                     Done by Waterboard
//                                   </div>
//                                 </SelectItem>
//                                 <SelectItem value="transfer_to_new">
//                                   <div className="flex items-center">
//                                     <ArrowRightLeft className="mr-2 h-4 w-4" />
//                                     Transfer to New Team
//                                   </div>
//                                 </SelectItem>
//                               </SelectContent>
//                             </Select>
//                           )}
//                         </TableCell>
//                       )}
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//               </ScrollArea>
              
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       {selectedTask && dialogType && (
//         <StatusUpdateDialog
//           task={selectedTask}
//           type={dialogType}
//           open={!!dialogType}
//           onClose={() => {
//             setDialogType(null);
//             setSelectedTask(null);
//           }}
//           onSuccess={() => {
//             setDialogType(null);
//             setSelectedTask(null);
//             onTaskUpdated();
//           }}
//         />
//       )}
//     </>
//   );
// }




"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, CheckCircle, ArrowRightLeft, User } from "lucide-react";
import { format } from "date-fns";
import { ReconnectionTask } from "@/lib/store/slices/reconnectionSlice";
import StatusUpdateDialog from "./StatusUpdatedDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskTableProps {
  tasks: ReconnectionTask[];
  onTaskUpdated: () => void;
  showActions?: boolean;
}

export default function TaskTable({
  tasks,
  onTaskUpdated,
  showActions = true,
}: TaskTableProps) {
  const [selectedTask, setSelectedTask] = useState<ReconnectionTask | null>(
    null
  );
  const [dialogType, setDialogType] = useState<"confirm" | "transfer" | null>(
    null
  );

  // Sort and group tasks for finished view
  const processTasksForDisplay = () => {
    if (showActions) {
      // For active tasks, just return as is
      return { type: 'flat', data: tasks };
    }

    // For finished tasks, sort by finishTime (most recent first) and group by account
    const sorted = [...tasks].sort((a, b) => {
      const dateA = new Date(a.finishTime || '').getTime();
      const dateB = new Date(b.finishTime || '').getTime();
      return dateB - dateA;
    });

    // Group by account number
    const grouped = sorted.reduce((acc, task) => {
      if (!acc[task.accountNumber]) {
        acc[task.accountNumber] = [];
      }
      acc[task.accountNumber].push(task);
      return acc;
    }, {} as Record<string, ReconnectionTask[]>);

    return { type: 'grouped', data: grouped };
  };

  const handleStatusChange = (task: ReconnectionTask, newStatus: string) => {
    setSelectedTask(task);

    if (newStatus === "done_by_waterboard") {
      setDialogType("confirm");
    } else if (newStatus === "transfer_to_new") {
      setDialogType("transfer");
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const },
      done_by_waterboard: {
        label: "Done by Waterboard",
        variant: "success" as const,
      },
      transfer_to_new: { label: "Transferred", variant: "default" as const },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const processedTasks = processTasksForDisplay();

  // Render table rows for active tasks (flat structure)
  const renderFlatRows = (tasks: ReconnectionTask[]) => (
    <>
      {tasks.map((task) => (
        <TableRow key={task.id}>
          <TableCell className="font-medium">
            {task.accountNumber}
          </TableCell>
          <TableCell>
            {task.team}
            {task.transferredFrom && (
              <span className="text-xs text-muted-foreground block">
                (from {task.transferredFrom})
              </span>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDateTime(task.allocatedTime)}
            </div>
          </TableCell>
          <TableCell>{getStatusBadge(task.status)}</TableCell>
          {/* <TableCell>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDateTime(task.finishTime || "")}
            </div>
          </TableCell> */}
          {showActions && (
            <TableCell>
              {task.status === "pending" && (
                <Select
                  onValueChange={(value) =>
                    handleStatusChange(task, value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="done_by_waterboard">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Done by Waterboard
                      </div>
                    </SelectItem>
                    <SelectItem value="transfer_to_new">
                      <div className="flex items-center">
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Transfer to New Team
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );

  // Render grouped rows for finished tasks
  const renderGroupedRows = (groupedTasks: Record<string, ReconnectionTask[]>) => {
    const accountNumbers = Object.keys(groupedTasks).sort((a, b) => {
      // Get the most recent finish time for each account group
      const mostRecentA = new Date(groupedTasks[a][0].finishTime || '').getTime();
      const mostRecentB = new Date(groupedTasks[b][0].finishTime || '').getTime();
      return mostRecentB - mostRecentA; // Sort descending (most recent first)
    });
    return (
      <>
        {accountNumbers.map((accountNumber, index) => (
          <>
            {/* Account header row */}
            <TableRow key={`header-${accountNumber}`} className="bg-muted/50">
              <TableCell colSpan={5} className="font-semibold">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Account: {accountNumber}</span>
                  <span className="text-sm text-muted-foreground">
                    ({groupedTasks[accountNumber].length} task{groupedTasks[accountNumber].length > 1 ? 's' : ''})
                  </span>
                </div>
              </TableCell>
            </TableRow>
            
            {/* Task rows for this account */}
            {groupedTasks[accountNumber].map(task => {
              const duration = task.finishTime && task.allocatedTime
                ? Math.round((new Date(task.finishTime).getTime() - new Date(task.allocatedTime).getTime()) / 60000)
                : 0;
                
              return (
                <TableRow key={task.id}>
                  <TableCell className="pl-8">{task.team}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDateTime(task.allocatedTime)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDateTime(task.finishTime || '')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      Duration: {duration > 0 ? `${duration} mins` : '-'}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {/* Add spacing between groups */}
            {index < accountNumbers.length - 1 && (
              <TableRow key={`spacer-${accountNumber}`}>
                <TableCell colSpan={5} className="h-2 p-0" />
              </TableRow>
            )}
          </>
        ))}
      </>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {showActions ? "Active" : "Finished"} Reconnection Tasks ({tasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    {showActions ? (
                      <>
                        <TableHead>Account Number</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Allocated Time</TableHead>
                        <TableHead>Status</TableHead>
                        {/* <TableHead>Finish Time</TableHead> */}
                        <TableHead>Actions</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead>Team</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Allocated Time</TableHead>
                        <TableHead>Finish Time</TableHead>
                        <TableHead>Duration</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={showActions ? 6 : 5}
                        className="text-center text-muted-foreground py-8"
                      >
                        No {showActions ? "active" : "finished"} tasks
                      </TableCell>
                    </TableRow>
                  ) : (
                    processedTasks.type === 'flat' 
                      ? renderFlatRows(processedTasks.data as ReconnectionTask[])
                      : renderGroupedRows(processedTasks.data as Record<string, ReconnectionTask[]>)
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {selectedTask && dialogType && (
        <StatusUpdateDialog
          task={selectedTask}
          type={dialogType}
          open={!!dialogType}
          onClose={() => {
            setDialogType(null);
            setSelectedTask(null);
          }}
          onSuccess={() => {
            setDialogType(null);
            setSelectedTask(null);
            onTaskUpdated();
          }}
        />
      )}
    </>
  );
}