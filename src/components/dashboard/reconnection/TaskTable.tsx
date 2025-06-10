"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, CheckCircle, ArrowRightLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ReconnectionTask } from '@/lib/store/slices/reconnectionSlice';
import StatusUpdateDialog from './StatusUpdatedDialog';
// import StatusUpdateDialog from './StatusUpdateDialog';

interface TaskTableProps {
  tasks: ReconnectionTask[];
  onTaskUpdated: () => void;
}

export default function TaskTable({ tasks, onTaskUpdated }: TaskTableProps) {
  const [selectedTask, setSelectedTask] = useState<ReconnectionTask | null>(null);
  const [dialogType, setDialogType] = useState<'confirm' | 'transfer' | null>(null);

  const handleStatusChange = (task: ReconnectionTask, newStatus: string) => {
    setSelectedTask(task);
    
    if (newStatus === 'done_by_waterboard') {
      setDialogType('confirm');
    } else if (newStatus === 'transfer_to_new') {
      setDialogType('transfer');
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const },
      done_by_waterboard: { label: 'Done by Waterboard', variant: 'success' as const },
      transfer_to_new: { label: 'Transferred', variant: 'default' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Active Reconnection Tasks ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Allocated Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Finish Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No active tasks
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.accountNumber}</TableCell>
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
                      <TableCell>{formatDateTime(task.finishTime || '')}</TableCell>
                      <TableCell>
                        {task.status === 'pending' && (
                          <Select 
                            onValueChange={(value) => handleStatusChange(task, value)}
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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