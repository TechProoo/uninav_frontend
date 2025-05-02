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
}: SelectCollectionProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(externalValue);

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
    (collection) => collection.id === selectedId
  );

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen} modal={false}>
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
              : selectedCollection
                ? selectedCollection.label
                : "Select collection..."}
            <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[--radix-popover-trigger-width]"
          style={{ zIndex: 1000 }} // Set a very high z-index to ensure it appears above Dialog
          align="start"
          sideOffset={5}
          avoidCollisions={false}
          onEscapeKeyDown={(e) => {
            // Prevent escape from closing parent dialog
            e.stopPropagation();
          }}
          onInteractOutside={(e) => {
            // Prevent clicks outside from bubbling up to Dialog
            e.stopPropagation();
          }}
          onFocusOutside={(e) => {
            // Prevent focus outside from bubbling up to Dialog
            e.stopPropagation();
          }}
          onPointerDownOutside={(e) => {
            // Prevent pointer down outside from bubbling up to Dialog
            e.stopPropagation();
          }}
        >
          <Command shouldFilter={false}>
            <CommandInput placeholder="Search collections..." />
            <CommandList>
              <CommandEmpty>No collections found.</CommandEmpty>
              <CommandGroup>
                {collections.map((collection) => (
                  <CommandItem
                    key={collection.id}
                    value={collection.label}
                    onSelect={(currentValue) => {
                      const selected = collections.find(
                        (c) =>
                          c.label.toLowerCase() === currentValue.toLowerCase()
                      );
                      if (selected) {
                        setSelectedId(selected.id);
                        onChange(selected.id);
                        setOpen(false);
                      }
                    }}
                    onPointerDown={(e) => {
                      // Prevent default to help with the Dialog interaction
                      e.stopPropagation();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        collection.id === selectedId
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span>{collection.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
