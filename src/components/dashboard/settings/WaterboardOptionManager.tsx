// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Plus, X } from "lucide-react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// interface WaterboardOptionsManagerProps {
//   selectedOptions: string[];
//   availableOptions: string[];
//   onOptionsChange: (options: string[]) => void;
//   onAddNewOption: (option: string) => Promise<void>;
// }

// export function WaterboardOptionsManager({
//   selectedOptions,
//   availableOptions,
//   onOptionsChange,
//   onAddNewOption,
// }: WaterboardOptionsManagerProps) {
//   const [newOption, setNewOption] = useState("");
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleAddOption = async () => {
//     if (!newOption.trim()) return;
    
//     setShowConfirm(true);
//   };

//   const confirmAddOption = async () => {
//     setLoading(true);
//     try {
//       await onAddNewOption(newOption.trim());
//       onOptionsChange([...selectedOptions, newOption.trim()]);
//       setNewOption("");
//     } catch (error: any) {
//       // Error handling done in parent
//     } finally {
//       setLoading(false);
//       setShowConfirm(false);
//     }
//   };

//   const toggleOption = (option: string) => {
//     if (selectedOptions.includes(option)) {
//       onOptionsChange(selectedOptions.filter(o => o !== option));
//     } else {
//       onOptionsChange([...selectedOptions, option]);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <Label>Disconnection Options</Label>
      
//       {/* Available options */}
//       <div className="flex flex-wrap gap-2">
//         {availableOptions.map((option) => (
//           <Badge
//             key={option}
//             variant={selectedOptions.includes(option) ? "default" : "outline"}
//             className="cursor-pointer"
//             onClick={() => toggleOption(option)}
//           >
//             {option}
//             {selectedOptions.includes(option) && (
//               <X className="ml-1 h-3 w-3" />
//             )}
//           </Badge>
//         ))}
//       </div>

//       {/* Add new option */}
//       <div className="flex gap-2">
//         <Input
//           placeholder="Add new option (e.g., DC, RC)"
//           value={newOption}
//           onChange={(e) => setNewOption(e.target.value)}
//           onKeyPress={(e) => e.key === "Enter" && handleAddOption()}
//         />
//         <Button
//           type="button"
//           size="sm"
//           onClick={handleAddOption}
//           disabled={!newOption.trim() || loading}
//         >
//           <Plus className="h-4 w-4" />
//         </Button>
//       </div>

//       <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Add New Option</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to add "{newOption}" as a new disconnection option? 
//               This will be available for all waterboard users.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={confirmAddOption} disabled={loading}>
//               Add Option
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [newOptionToAdd, setNewOptionToAdd] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      onOptionsChange(selectedOptions.filter(o => o !== option));
    } else {
      onOptionsChange([...selectedOptions, option]);
    }
  };

  const handleRemoveOption = (option: string) => {
    onOptionsChange(selectedOptions.filter(o => o !== option));
  };

  const confirmAddOption = async () => {
    setLoading(true);
    try {
      await onAddNewOption(newOptionToAdd.trim());
      onOptionsChange([...selectedOptions, newOptionToAdd.trim()]);
      setSearchValue("");
      setNewOptionToAdd("");
      setOpen(false);
    } catch (error) {
      // Error handling done in parent
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const handleAddNewOption = () => {
    if (searchValue.trim() && !availableOptions.includes(searchValue.trim())) {
      setNewOptionToAdd(searchValue.trim());
      setShowConfirm(true);
    }
  };

  return (
    <div className="space-y-3">
      <Label>Disconnection Options</Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className="text-muted-foreground">
              {selectedOptions.length > 0
                ? `${selectedOptions.length} option${selectedOptions.length > 1 ? 's' : ''} selected`
                : "Select disconnection options..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0 z-50" 
          align="start"
          side="top"
          sideOffset={4}
          avoidCollisions={false}
        >
          <Command>
            <CommandInput 
              placeholder="Search or add new option..." 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList className="max-h-[200px] min-h-[150px]">
              <CommandEmpty className="py-2 px-4 text-sm">
                {searchValue.trim() ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground">No option found.</span>
                    <Button
                      size="sm"
                      onClick={handleAddNewOption}
                      className="w-full"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add "{searchValue}"
                    </Button>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Type to search or add new option</span>
                )}
              </CommandEmpty>
              <CommandGroup>
                {availableOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedOptions.includes(option) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected options as chips */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/30 min-h-[50px]  ">
          {selectedOptions.map((option) => (
            <Badge
              key={option}
              variant="secondary"
              className="py-1 px-2 h-fit"
            >
              {option}
              <button
                type="button"
                onClick={() => handleRemoveOption(option)}
                className="ml-1.5 hover:text-destructive transition-colors focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Disconnection Option</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to add "{newOptionToAdd}" as a new disconnection option? 
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