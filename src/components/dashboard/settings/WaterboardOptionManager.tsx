"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WaterboardOptionsManagerProps {
  selectedOptions: string[];
  availableOptions: string[];
  onOptionsChange: (options: string[]) => void;
  onAddNewOption: (option: string) => Promise<void>;
}

export function WaterboardOptionsManager({
  selectedOptions,
  availableOptions,
  onOptionsChange,
  onAddNewOption,
}: WaterboardOptionsManagerProps) {
  const [newOption, setNewOption] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddOption = async () => {
    if (!newOption.trim()) return;
    
    setShowConfirm(true);
  };

  const confirmAddOption = async () => {
    setLoading(true);
    try {
      await onAddNewOption(newOption.trim());
      onOptionsChange([...selectedOptions, newOption.trim()]);
      setNewOption("");
    } catch (error: any) {
      // Error handling done in parent
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      onOptionsChange(selectedOptions.filter(o => o !== option));
    } else {
      onOptionsChange([...selectedOptions, option]);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Disconnection Options</Label>
      
      {/* Available options */}
      <div className="flex flex-wrap gap-2">
        {availableOptions.map((option) => (
          <Badge
            key={option}
            variant={selectedOptions.includes(option) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleOption(option)}
          >
            {option}
            {selectedOptions.includes(option) && (
              <X className="ml-1 h-3 w-3" />
            )}
          </Badge>
        ))}
      </div>

      {/* Add new option */}
      <div className="flex gap-2">
        <Input
          placeholder="Add new option (e.g., DC, RC)"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddOption()}
        />
        <Button
          type="button"
          size="sm"
          onClick={handleAddOption}
          disabled={!newOption.trim() || loading}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Option</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to add "{newOption}" as a new disconnection option? 
              This will be available for all waterboard users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAddOption} disabled={loading}>
              Add Option
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}