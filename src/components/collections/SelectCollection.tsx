"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { getMyCollections } from "@/api/collection.api";
import { cn } from "@/lib/utils";
import { Collection } from "@/lib/types/response.type";
import { toast } from "react-hot-toast";

interface SelectCollectionProps {
  onChange: (value: string) => void;
  value?: string;
  excludeIds?: string[];
  onCancel?: () => void;
}

export const SelectCollection = ({
  onChange,
  value: externalValue = "",
  excludeIds = [],
  onCancel,
}: SelectCollectionProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await getMyCollections();
        const filteredCollections = response.data.filter(
          (c) => !excludeIds.includes(c.id)
        );
        setCollections(filteredCollections);
      } catch (error) {
        console.error("Error fetching collections:", error);
        toast.error("Failed to load collections");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const selectedCollection = collections.find(
    (collection) => collection.id === externalValue
  );

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
            disabled={loading}
          >
            {loading
              ? "Loading collections..."
              : externalValue && selectedCollection
                ? selectedCollection.label
                : "Select collection..."}
            <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full">
          <Command>
            <CommandInput placeholder="Search collections..." />
            <CommandList>
              <CommandEmpty>No collections found.</CommandEmpty>
              <CommandGroup>
                {collections.map((collection) => (
                  <CommandItem
                    key={collection.id}
                    value={collection.label}
                    onSelect={() => {
                      onChange(collection.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        externalValue === collection.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{collection.label}</span>
                      {collection.targetCourse && (
                        <span className="text-muted-foreground text-xs">
                          Course: {collection.targetCourse.courseName}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {onCancel && (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-8"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!externalValue}
            onClick={() => {
              if (externalValue) onChange(externalValue);
            }}
            className="h-8"
          >
            Add to Collection
          </Button>
        </div>
      )}
    </div>
  );
};
