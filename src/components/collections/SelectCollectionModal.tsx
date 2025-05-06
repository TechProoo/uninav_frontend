import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMyCollections } from "@/api/collection.api";
import { Collection } from "@/lib/types/response.type";
import { toast } from "react-hot-toast";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";

interface SelectCollectionModalProps {
  onChange: (value: string) => void;
  value?: string;
  excludeIds?: string[];
}

export const SelectCollectionModal: React.FC<SelectCollectionModalProps> = ({
  onChange,
  value = "",
  excludeIds = [],
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [query, setQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState(value);
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
  }, [excludeIds]);

  // Update selectedValue when external value prop changes
  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  const selectedCollection = collections.find(
    (collection) => collection.id === selectedValue
  );

  const filteredCollections =
    query === ""
      ? collections
      : collections.filter((collection) =>
          collection.label.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="relative w-full">
      <Combobox
        value={selectedValue}
        onChange={(newValue) => {
          const selectedVal = newValue || "";
          setSelectedValue(selectedVal);
          onChange(selectedVal);
        }}
        onClose={() => setQuery("")}
      >
        <div className="relative w-full">
          <div className="flex items-center w-full">
            <ComboboxInput
              className="bg-background py-2 pr-10 pl-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-sm leading-5"
              displayValue={() =>
                loading
                  ? "Loading collections..."
                  : selectedCollection
                    ? selectedCollection.label
                    : ""
              }
              onChange={(event) => setQuery(event.target.value)}
              disabled={loading}
              placeholder="Select collection..."
            />
            <ComboboxButton className="right-0 absolute inset-y-0 flex items-center pr-2">
              <ChevronsUpDown className="opacity-50 w-4 h-4 shrink-0" />
            </ComboboxButton>
          </div>
          <ComboboxOptions className="z-50 absolute bg-background ring-opacity-5 shadow-lg mt-1 py-1 border border-input rounded-md focus:outline-none ring-1 ring-black w-full max-h-60 overflow-auto sm:text-sm text-base">
            {loading ? (
              <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                Loading collections...
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                No collections found.
              </div>
            ) : (
              filteredCollections.map((collection) => (
                <ComboboxOption
                  key={collection.id}
                  value={collection.id}
                  className={({ active }) =>
                    cn(
                      "relative cursor-default select-none py-2 pl-10 pr-4",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    )
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={cn(
                          "block truncate",
                          selected ? "font-medium" : "font-normal"
                        )}
                      >
                        {collection.label}
                      </span>
                      {selected ? (
                        <span
                          className={cn(
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                            active ? "text-primary-foreground" : "text-primary"
                          )}
                        >
                          <Check className="w-4 h-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
};

export default SelectCollectionModal;
