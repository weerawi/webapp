// "use client";
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Upload, Clock, CheckCircle, ArrowRightLeft } from 'lucide-react';
// import Breadcrumb from "@/components/navigation/Breadcrumb";
// import { useDispatch, useSelector } from "react-redux";
// import { hideLoader, showLoader } from "@/lib/store/slices/loaderSlice";
// import { addTask, setTasks, updateTask } from "@/lib/store/slices/reconnectionSlice";
// import { reconnectionService } from "@/lib/services/reconnectionService";
// import { useEffect, useState } from "react";
// import { RootState } from "@/lib/store/store";
// import { format } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz';
// import { toast } from 'sonner';

// export default function ReconnectionManagement() {
//   const dispatch = useDispatch();
//   const tasks = useSelector((state: RootState) => state.reconnection.tasks);
  
//   // Form states
//   const [accountNumber, setAccountNumber] = useState('');
//   const [selectedTeam, setSelectedTeam] = useState('');
//   const [imageFile, setImageFile] = useState<File | null>(null);
  
//   // Dialog states
//   const [confirmDialog, setConfirmDialog] = useState(false);
//   const [transferDialog, setTransferDialog] = useState(false);
//   const [selectedTask, setSelectedTask] = useState<any>(null);
//   const [newTeam, setNewTeam] = useState('');


//   // Helper function to get Sri Lankan time
// const getSriLankanTime = () => {
//   const now = new Date();
//   // Sri Lanka is UTC+5:30
//   const sriLankanTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Colombo"}));
//   return sriLankanTime;
// };

//   // Teams list (you can fetch this from Firebase)
//   const teams = ['Team A', 'Team B', 'Team C', 'Team D'];

//   useEffect(() => {
//     loadTasks();
//   }, []);

//   const loadTasks = async () => {
//     dispatch(showLoader());
//     try {
//       const activeTasks = await reconnectionService.getActiveTasks();
//       dispatch(setTasks(activeTasks));
//     } catch (error) {
//       toast.error('Failed to load tasks');
//       console.error(error);
//     } finally {
//       dispatch(hideLoader());
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!accountNumber || !selectedTeam) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     dispatch(showLoader());
//     try {
//       let imageUrl = '';
//       if (imageFile) {
//         imageUrl = await reconnectionService.uploadImage(imageFile);
//       }

//       const sriLankanTime = getSriLankanTime();
//       const newTask = {
//         accountNumber,
//         team: selectedTeam,
//         imageUrl,
//         allocatedTime: sriLankanTime.toISOString(),
//         status: 'pending' as const,
//         finished: false
//       };

//       const taskId = await reconnectionService.addTask(newTask);
//       dispatch(addTask({ ...newTask, id: taskId }));
      
//       // Reset form
//       setAccountNumber('');
//       setSelectedTeam('');
//       setImageFile(null);
      
//       toast.success('Task added successfully');
//     } catch (error) {
//       toast.error('Failed to add task');
//       console.error(error);
//     } finally {
//       dispatch(hideLoader());
//     }
//   };

//   const handleStatusChange = (task: any, newStatus: string) => {
//     setSelectedTask(task);
    
//     if (newStatus === 'done_by_waterboard') {
//       setConfirmDialog(true);
//     } else if (newStatus === 'transfer_to_new') {
//       setTransferDialog(true);
//       setNewTeam('');
//     }
//   };

//   const confirmDoneByWaterboard = async () => {
//     if (!selectedTask) return;
    
//     const sriLankanTime = getSriLankanTime();
//     const updates = {
//       status: 'done_by_waterboard' as const,
//       finishTime: sriLankanTime.toISOString(),
//       finished: true
//     };

//     try {
//       await reconnectionService.updateTaskStatus(selectedTask.id, updates);
//       dispatch(updateTask({ ...selectedTask, ...updates }));
//       toast.success('Task marked as done');
//     } catch (error) {
//       toast.error('Failed to update task');
//     }
    
//     setConfirmDialog(false);
//     setSelectedTask(null);
//   };

//   const handleTransfer = async () => {
//     if (!selectedTask || !newTeam) return;
    
//     const sriLankanTime = toZonedTime(new Date(), 'Asia/Colombo');
    
//     // Update current task
//     const currentTaskUpdates = {
//       status: 'transfer_to_new' as const,
//       finishTime: sriLankanTime.toISOString(),
//       finished: true
//     };

//     try {
//       // Update current task
//       await reconnectionService.updateTaskStatus(selectedTask.id, currentTaskUpdates);
//       dispatch(updateTask({ ...selectedTask, ...currentTaskUpdates }));
      
//       // Create new task
//       const newTask = {
//         accountNumber: selectedTask.accountNumber,
//         team: newTeam,
//         imageUrl: selectedTask.imageUrl,
//         allocatedTime: sriLankanTime.toISOString(),
//         status: 'pending' as const,
//         finished: false,
//         transferredFrom: selectedTask.team
//       };
      
//       const taskId = await reconnectionService.addTask(newTask);
//       dispatch(addTask({ ...newTask, id: taskId }));
      
//       toast.success('Task transferred successfully');
//     } catch (error) {
//       toast.error('Failed to transfer task');
//     }
    
//     setTransferDialog(false);
//     setSelectedTask(null);
//     setNewTeam('');
//   };

//   const formatDateTime = (dateString: string) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     return format(date, 'dd/MM/yyyy HH:mm');
//   };

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       pending: { label: 'Pending', variant: 'secondary' as const },
//       done_by_waterboard: { label: 'Done by Waterboard', variant: 'success' as const },
//       transfer_to_new: { label: 'Transferred', variant: 'default' as const }
//     };
    
//     const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
//     return <Badge variant={config.variant}>{config.label}</Badge>;
//   };

//   // Filter active tasks (not finished)
//   const activeTasks = tasks.filter(task => !task.finished);

//   return (
//     <>
//       <Breadcrumb />
//       <div className="space-y-6">
//         <Tabs defaultValue="add" className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="add">Add New Task</TabsTrigger>
//             <TabsTrigger value="list">Active Tasks ({activeTasks.length})</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="add">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Add New Reconnection Task</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="accountNumber">Account Number</Label>
//                       <Input
//                         id="accountNumber"
//                         value={accountNumber}
//                         onChange={(e) => setAccountNumber(e.target.value)}
//                         placeholder="Enter account number"
//                         required
//                       />
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="team">Team</Label>
//                       <Select value={selectedTeam} onValueChange={setSelectedTeam} required>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a team" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {teams.map(team => (
//                             <SelectItem key={team} value={team}>{team}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="image">Upload Image (Optional)</Label>
//                     <div className="flex items-center gap-4">
//                       <Input
//                         id="image"
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => setImageFile(e.target.files?.[0] || null)}
//                         className="flex-1"
//                       />
//                       {imageFile && (
//                         <span className="text-sm text-muted-foreground">
//                           {imageFile.name}
//                         </span>
//                       )}
//                     </div>
//                   </div>
                  
//                   <Button type="submit" className="w-full md:w-auto">
//                     <Upload className="mr-2 h-4 w-4" />
//                     Submit Task
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </TabsContent>
          
//           <TabsContent value="list">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Active Reconnection Tasks</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Account Number</TableHead>
//                         <TableHead>Team</TableHead>
//                         <TableHead>Allocated Time</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Finish Time</TableHead>
//                         <TableHead>Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {activeTasks.length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={6} className="text-center text-muted-foreground">
//                             No active tasks
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         activeTasks.map(task => (
//                           <TableRow key={task.id}>
//                             <TableCell className="font-medium">{task.accountNumber}</TableCell>
//                             <TableCell>
//                               {task.team}
//                               {task.transferredFrom && (
//                                 <span className="text-xs text-muted-foreground block">
//                                   (from {task.transferredFrom})
//                                 </span>
//                               )}
//                             </TableCell>
//                             <TableCell>
//                               <div className="flex items-center gap-1">
//                                 <Clock className="h-3 w-3" />
//                                 {formatDateTime(task.allocatedTime)}
//                               </div>
//                             </TableCell>
//                             <TableCell>{getStatusBadge(task.status)}</TableCell>
//                             <TableCell>{formatDateTime(task.finishTime || '')}</TableCell>
//                             <TableCell>
//                               {task.status === 'pending' && (
//                                 <Select 
//                                   onValueChange={(value) => handleStatusChange(task, value)}
//                                 >
//                                   <SelectTrigger className="w-[180px]">
//                                     <SelectValue placeholder="Change status" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="done_by_waterboard">
//                                       <div className="flex items-center">
//                                         <CheckCircle className="mr-2 h-4 w-4" />
//                                         Done by Waterboard
//                                       </div>
//                                     </SelectItem>
//                                     <SelectItem value="transfer_to_new">
//                                       <div className="flex items-center">
//                                         <ArrowRightLeft className="mr-2 h-4 w-4" />
//                                         Transfer to New Team
//                                       </div>
//                                     </SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               )}
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
        
//         {/* Confirmation Dialog */}
//         <AlertDialog open={confirmDialog} onOpenChange={setConfirmDialog}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
//               <AlertDialogDescription>
//                 Are you sure you want to mark this task as "Done by Waterboard"? This action cannot be undone.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={confirmDoneByWaterboard}>Confirm</AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
        
//         {/* Transfer Dialog */}
//         <Dialog open={transferDialog} onOpenChange={setTransferDialog}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Transfer Task to New Team</DialogTitle>
//               <DialogDescription>
//                 Current Team: {selectedTask?.team}
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               <div className="space-y-2">
//                 <Label htmlFor="newTeam">Select New Team</Label>
//                 <Select value={newTeam} onValueChange={setNewTeam}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Choose a team" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {teams
//                       .filter(team => team !== selectedTask?.team)
//                       .map(team => (
//                         <SelectItem key={team} value={team}>{team}</SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setTransferDialog(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleTransfer} disabled={!newTeam}>
//                 Transfer Task
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </>
//   );
// }
"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'sonner';
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { hideLoader, showLoader } from "@/lib/store/slices/loaderSlice";
import { setTasks } from "@/lib/store/slices/reconnectionSlice";
import { reconnectionService } from "@/lib/services/reconnectionService";
import { RootState } from "@/lib/store/store";
import TaskForm from "@/components/dashboard/reconnection/TaskForm";
import TaskTable from "@/components/dashboard/reconnection/TaskTable";
import { Card } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
// import TaskForm from "./components/TaskForm";
// import TaskTable from "./components/TaskTable";

export default function ReconnectionManagement() {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.reconnection.tasks);
  const activeTasks = tasks.filter(task => !task.finished);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    dispatch(showLoader());
    try {
      const activeTasks = await reconnectionService.getActiveTasks();
      dispatch(setTasks(activeTasks));
    } catch (error) {
      toast.error('Failed to load tasks');
      console.error(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <>
      <Breadcrumb />
      <ProtectedRoute allowedRoles={["Admin"]}>
        <div className="space-y-6 mx-5">
        <Card className="px-5">
          <TaskForm onTaskAdded={loadTasks} />
        <TaskTable tasks={activeTasks} onTaskUpdated={loadTasks} />
        </Card>
        
      </div>
      </ProtectedRoute>
      
    </>
  );
}