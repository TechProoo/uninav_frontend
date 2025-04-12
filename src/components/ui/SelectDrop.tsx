"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Department } from "@/lib/types/response.type";

interface dataProp {
  dept: { message: string; status: string; data: Department[] }; // Updated to reflect the shape of your data
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SelectDemo: React.FC<dataProp> = ({
  dept,
  value,
  onChange,
  placeholder = "Select a faculty",
}) => {
  // Ensure data is an array and not empty
  const departments = dept?.data || []; // Access the array of departments from data.data
  const [open, setOpen] = React.useState(false);

  if (!Array.isArray(departments) || departments.length === 0) {
    return <p>No faculties available</p>; // Handle case where data is empty or not an array
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {value
            ? departments.find((dept) => dept.id.toString() === value)?.name
            : placeholder}
          <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command>
          <CommandInput placeholder="Search faculty..." />
          <CommandList>
            <CommandEmpty>No faculty found.</CommandEmpty>
            <CommandGroup>
              {departments.map((dept) => (
                <CommandItem
                  key={dept.id}
                  value={dept.name.toLowerCase()}
                  onSelect={() => {
                    onChange(dept.id.toString());
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === dept.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {dept.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
