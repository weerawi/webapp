"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useDispatch } from 'react-redux';
import { updateTask, addTask } from '@/lib/store/slices/reconnectionSlice';
import { reconnectionService } from '@/lib/services/reconnectionService';
import { toast } from 'sonner';
import { ReconnectionTask } from '@/lib/store/slices/reconnectionSlice';
import { toZonedTime } from 'date-fns-tz';

interface StatusUpdateDialogProps {
  task: ReconnectionTask;
  type: 'confirm' | 'transfer';
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StatusUpdateDialog({ task, type, open, onClose, onSuccess }: StatusUpdateDialogProps) {
  const dispatch = useDispatch();
  const [newTeam, setNewTeam] = useState('');
  const teams = ['Team A', 'Team B', 'Team C', 'Team D'];

  const getSriLankanTime = () => {
    return toZonedTime(new Date(), 'Asia/Colombo');
  };

  const handleConfirmDone = async () => {
    const sriLankanTime = getSriLankanTime();
    const updates = {
      status: 'done_by_waterboard' as const,
      finishTime: sriLankanTime.toISOString(),
      finished: true
    };

    try {
      await reconnectionService.updateTaskStatus(task.id, updates);
      dispatch(updateTask({ ...task, ...updates }));
      toast.success('Task marked as done');
      onSuccess();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleTransfer = async () => {
    if (!newTeam) return;
    
    const sriLankanTime = getSriLankanTime();
    
    const currentTaskUpdates = {
      status: 'transfer_to_new' as const,
      finishTime: sriLankanTime.toISOString(),
      finished: true
    };

    try {
      await reconnectionService.updateTaskStatus(task.id, currentTaskUpdates);
      dispatch(updateTask({ ...task, ...currentTaskUpdates }));
      
      const newTask = {
        accountNumber: task.accountNumber,
        team: newTeam,
        imageUrl: task.imageUrl,
        allocatedTime: sriLankanTime.toISOString(),
        status: 'pending' as const,
        finished: false,
        transferredFrom: task.team
      };
      
      const taskId = await reconnectionService.addTask(newTask);
      dispatch(addTask({ ...newTask, id: taskId }));
      
      toast.success('Task transferred successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to transfer task');
    }
  };

  if (type === 'confirm') {
    return (
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this task as "Done by Waterboard"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDone}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Task to New Team</DialogTitle>
          <DialogDescription>
            Current Team: {task.team}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="newTeam">Select New Team</Label>
            <Select value={newTeam} onValueChange={setNewTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a team" />
              </SelectTrigger>
              <SelectContent>
                {teams
                  .filter(team => team !== task.team)
                  .map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleTransfer} disabled={!newTeam}>
            Transfer Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}