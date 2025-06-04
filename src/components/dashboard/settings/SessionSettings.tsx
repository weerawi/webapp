"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store/store";
import { setSessionTimeout } from "@/lib/store/slices/adminSlice";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function SessionSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const { sessionTimeout } = useSelector((state: RootState) => state.admin);
  const [timeout, setTimeout] = useState(sessionTimeout.toString());

  const handleSave = async () => {
    const timeoutValue = parseInt(timeout);
    if (isNaN(timeoutValue) || timeoutValue < 1) {
      toast.error("Please enter a valid timeout value");
      return;
    }

    try {
      // Save to Firebase
      await updateDoc(doc(db, "settings", "session"), {
        timeout: timeoutValue,
        updatedAt: new Date().toISOString(),
      });
      
      dispatch(setSessionTimeout(timeoutValue));
      toast.success("Session timeout updated successfully");
    } catch (error) {
      toast.error("Failed to update session timeout");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Session Configuration
        </CardTitle>
        <CardDescription>
          Configure session timeout settings for all users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="timeout">Session Timeout (minutes)</Label>
          <div className="flex gap-2">
            <Input
              id="timeout"
              type="number"
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
              placeholder="30"
              className="max-w-[200px]"
            />
            <Button onClick={handleSave}>Save</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Users will be automatically logged out after {timeout} minutes of inactivity
          </p>
        </div>
      </CardContent>
    </Card>
  );
}