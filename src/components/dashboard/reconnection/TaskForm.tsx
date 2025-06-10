"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileImage, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '@/lib/store/slices/loaderSlice';
import { addTask } from '@/lib/store/slices/reconnectionSlice';
import { reconnectionService } from '@/lib/services/reconnectionService';
import { toast } from 'sonner';

interface TaskFormProps {
  onTaskAdded: () => void;
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const dispatch = useDispatch();
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const teams = ['Team A', 'Team B', 'Team C', 'Team D'];

  const getSriLankanTime = () => {
    const now = new Date();
    const sriLankanTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Colombo"}));
    return sriLankanTime;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountNumber || !selectedTeam) {
      toast.error('Please fill all required fields');
      return;
    }

    dispatch(showLoader());
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await reconnectionService.uploadImage(imageFile);
      }

      const sriLankanTime = getSriLankanTime();
      const newTask = {
        accountNumber,
        team: selectedTeam,
        imageUrl,
        allocatedTime: sriLankanTime.toISOString(),
        status: 'pending' as const,
        finished: false
      };

      const taskId = await reconnectionService.addTask(newTask);
      dispatch(addTask({ ...newTask, id: taskId }));
      
      // Reset form
      setAccountNumber('');
      setSelectedTeam('');
      setImageFile(null);
      
      toast.success('Task added successfully');
      onTaskAdded();
    } catch (error) {
      toast.error('Failed to add task');
      console.error(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Reconnection Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                required
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <Label htmlFor="team">Team</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <Label>Upload Image (Optional)</Label>
              <div className="flex items-center gap-2">
                <label 
                  htmlFor="image-upload" 
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {imageFile ? (
                    <>
                      <FileImage className="h-4 w-4 text-green-600" />
                      <span className="text-sm truncate max-w-[150px]">{imageFile.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Choose File</span>
                    </>
                  )}
                </label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {imageFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setImageFile(null)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-end">
              <Button type="submit" className="h-10">
                <Upload className="mr-2 h-4 w-4" />
                Submit Task
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}