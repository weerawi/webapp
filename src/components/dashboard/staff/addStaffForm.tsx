// components/staff/StaffForm.tsx
"use client";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { AppDispatch, RootState } from "@/lib/store/store";
import { addStaff } from "@/lib/store/slices/staffSlice";
import { saveStaffToFirestore } from "@/lib/services/staffService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Mail, Phone, Lock, User, Shield, Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

export default function AddStaffForm() {
  const dispatch = useDispatch<AppDispatch>();
  const staffList = useSelector((state: RootState) => state.staff.staffList);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    userType: "Helper" as "Helper" | "Supervisor",
    linkedStaffId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = await saveStaffToFirestore(form);
      dispatch(addStaff({ id, ...form }));
      toast({
        title: "Success",
        description: "Staff member added successfully",
      });
      setForm({ username: "", email: "", phone: "", password: "", userType: "Helper", linkedStaffId: "" });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add staff member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const linkedOptions =
    form.userType === "Helper"
      ? staffList.filter((s) => s.userType === "Supervisor")
      : staffList.filter((s) => s.userType === "Helper");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 cursor-pointer">
          <UserPlus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new staff member to your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Username
              </Label>
              <Input 
                id="username"
                name="username" 
                value={form.username} 
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input 
                id="email"
                name="email" 
                type="email"
                value={form.email} 
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </Label>
              <Input 
                id="phone"
                name="phone" 
                value={form.phone} 
                onChange={handleChange}
                placeholder="+94 71 234 5678"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Password
              </Label>
              <Input 
                id="password"
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType" className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                User Type
              </Label>
              <Select value={form.userType} onValueChange={(val) => setForm({ ...form, userType: val as any, linkedStaffId: "" })}>
                <SelectTrigger id="userType">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Helper">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Helper
                    </div>
                  </SelectItem>
                  <SelectItem value="Supervisor">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Supervisor
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {linkedOptions.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="linkedStaff" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {form.userType === "Helper" ? "Assign to Supervisor" : "Assign Helpers"}
                </Label>
                <Select
                  value={form.linkedStaffId}
                  onValueChange={(val) => setForm({ ...form, linkedStaffId: val })}
                >
                  <SelectTrigger id="linkedStaff">
                    <SelectValue placeholder={`Select ${form.userType === "Helper" ? "supervisor" : "helper"}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {linkedOptions.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.username} - {staff.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Staff Member"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}