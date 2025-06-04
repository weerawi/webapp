"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store/store";
import { Admin, addAdmin, updateAdmin, deleteAdmin } from "@/lib/store/slices/adminSlice";
import {
  saveAdminToFirestore,
  updateAdminInFirestore,
  deleteAdminFromFirestore,
  fetchAdminsFromFirestore,
  saveAuditLogToFirestore,
} from "@/lib/services/adminService";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const AVAILABLE_MODULES = [
  { id: "staff", label: "Staff Management" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
  { id: "dashboard", label: "Dashboard" },
];

export default function AdminManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { adminList } = useSelector((state: RootState) => state.admin);
  const [open, setOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Sub-admin" as "Admin" | "Sub-admin",
    modules: [] as string[],
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      await fetchAdminsFromFirestore(dispatch);
    } catch (error) {
      toast.error("Failed to load admins");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const adminData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        modules: formData.role === "Admin" ? AVAILABLE_MODULES.map(m => m.id) : formData.modules,
        status: "Active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingAdmin) {
        await updateAdminInFirestore(editingAdmin.id, adminData);
        dispatch(updateAdmin({ id: editingAdmin.id, updates: adminData }));
        
        // Log the action
        await saveAuditLogToFirestore({
          userId: "current-admin-id", // Replace with actual current user ID
          userName: "Current Admin", // Replace with actual current user name
          action: `Updated admin: ${formData.username}`,
          details: { adminId: editingAdmin.id },
        });
        
        toast.success("Admin updated successfully");
      } else {
        const id = await saveAdminToFirestore(adminData);
        dispatch(addAdmin({ id, ...adminData }));
        
        // Log the action
        await saveAuditLogToFirestore({
          userId: "current-admin-id", // Replace with actual current user ID
          userName: "Current Admin", // Replace with actual current user name
          action: `Added new admin: ${formData.username}`,
          details: { adminId: id },
        });
        
        toast.success("Admin added successfully");
      }

      resetForm();
      setOpen(false);
    } catch (error) {
      toast.error(editingAdmin ? "Failed to update admin" : "Failed to add admin");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    
    try {
      const admin = adminList.find(a => a.id === id);
      await deleteAdminFromFirestore(id);
      dispatch(deleteAdmin(id));
      
      // Log the action
      await saveAuditLogToFirestore({
        userId: "current-admin-id", // Replace with actual current user ID
        userName: "Current Admin", // Replace with actual current user name
        action: `Deleted admin: ${admin?.username}`,
        details: { adminId: id },
      });
      
      toast.success("Admin deleted successfully");
    } catch (error) {
      toast.error("Failed to delete admin");
    }
  };

  const toggleStatus = async (admin: Admin) => {
    const newStatus = admin.status === "Active" ? "Disabled" : "Active";
    try {
      await updateAdminInFirestore(admin.id, { status: newStatus });
      dispatch(updateAdmin({ id: admin.id, updates: { status: newStatus } }));
      
      // Log the action
      await saveAuditLogToFirestore({
        userId: "current-admin-id", // Replace with actual current user ID
        userName: "Current Admin", // Replace with actual current user name
        action: `${newStatus === "Active" ? "Enabled" : "Disabled"} admin: ${admin.username}`,
        details: { adminId: admin.id, newStatus },
      });
      
      toast.success(`Admin ${newStatus === "Active" ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to update admin status");
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "Sub-admin",
      modules: [],
    });
    setEditingAdmin(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingAdmin ? "Edit Admin" : "Add New Admin"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingAdmin}
                  placeholder={editingAdmin ? "Leave empty to keep current password" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as "Admin" | "Sub-admin" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Sub-admin">Sub-admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.role === "Sub-admin" && (
                <div className="space-y-2">
                  <Label>Module Access</Label>
                  <div className="space-y-2">
                    {AVAILABLE_MODULES.map((module) => (
                      <div key={module.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={module.id}
                          checked={formData.modules.includes(module.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                modules: [...formData.modules, module.id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                modules: formData.modules.filter(m => m !== module.id),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={module.id} className="text-sm font-normal cursor-pointer">
                          {module.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAdmin ? "Update" : "Add"} Admin
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Modules</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminList.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.username}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <Badge variant={admin.role === "Admin" ? "default" : "secondary"}>
                  {admin.role}
                </Badge>
              </TableCell>
              <TableCell>
                {admin.role === "Admin" ? (
                  <Badge variant="outline">All Modules</Badge>
                ) : (
                  admin.modules?.map(m => 
                    AVAILABLE_MODULES.find(am => am.id === m)?.label
                  ).join(", ") || "-"
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={admin.status === "Active" ? "default" : "destructive"}
                  className="cursor-pointer"
                  onClick={() => toggleStatus(admin)}
                >
                  {admin.status}
                </Badge>
              </TableCell>
              <TableCell>{admin.lastLogin || "Never"}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingAdmin(admin);
                      setFormData({
                        username: admin.username,
                        email: admin.email,
                        password: "",
                        role: admin.role,
                        modules: admin.modules || [],
                      });
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(admin.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}