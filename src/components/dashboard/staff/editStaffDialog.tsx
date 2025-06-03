// components/staff/EditStaffDialog.tsx
"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store"; 
import { updateStaffAndSync } from "@/lib/services/staffService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Staff } from "@/lib/store/slices/staffSlice";

interface EditStaffDialogProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditStaffDialog({
  staff,
  open,
  onOpenChange,
}: EditStaffDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const staffList = useSelector((state: RootState) => state.staff.staffList);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: staff.email,
    phone: staff.phone,
    password: staff.password,
    userType: staff.userType,
    linkedStaffId: staff.linkedStaffId || "none",  
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = {
        ...form,
        linkedStaffId: form.linkedStaffId === "none" ? "" : form.linkedStaffId,
      };
      await updateStaffAndSync(dispatch, staff.id, updateData); 
      toast.success("Staff member updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update staff member");
    } finally {
      setLoading(false);
    }
  };

  const linkedOptions =
    form.userType === "Helper"
      ? staffList.filter(
          (s) => s.userType === "Supervisor" && s.id !== staff.id
        )
      : staffList.filter((s) => s.userType === "Helper" && s.id !== staff.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update staff member details for {staff.username}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">User Type</Label>
            <Select
              value={form.userType}
              onValueChange={(val) =>
                setForm({
                  ...form,
                  userType: val as any,
                  linkedStaffId: "none",
                })
              }
            >
              <SelectTrigger id="userType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Helper">Helper</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {linkedOptions.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="linkedStaff">
                {form.userType === "Helper"
                  ? "Assign to Supervisor"
                  : "Assign Helpers"}
              </Label>
              <Select
                value={form.linkedStaffId || "none"}
                onValueChange={(val) =>
                  setForm({ ...form, linkedStaffId: val })
                }
              >
                <SelectTrigger id="linkedStaff">
                  <SelectValue
                    placeholder={`Select ${
                      form.userType === "Helper" ? "supervisor" : "helper"
                    }`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {linkedOptions.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.username} - {s.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
