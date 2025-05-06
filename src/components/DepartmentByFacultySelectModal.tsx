import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllFaculties } from "@/api/faculty.api";
import { Faculty } from "@/lib/types/response.type";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";

interface DepartmentByFacultySelectModalProps {
  onDepartmentSelect: (value: string) => void;
  defaultDepartmentId?: string;
}

interface Department {
  id: string;
  name: string;
  facultyName: string;
  facultyId: string;
}

export const DepartmentByFacultySelectModal: React.FC<
  DepartmentByFacultySelectModalProps
> = ({ onDepartmentSelect, defaultDepartmentId }) => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [value, setValue] = useState(defaultDepartmentId || "");

  // Flatten departments for easier access and filtering
  const departments: Department[] = faculties.flatMap((faculty) =>
    (faculty.departments || []).map((department) => ({
      id: department.id,
      name: department.name,
      facultyName: faculty.name,
      facultyId: faculty.id,
    }))
  );

  const selectedDepartment = departments.find((dept) => dept.id === value);

  useEffect(() => {
    const loadFaculties = async () => {
      try {
        setLoading(true);
        const response = await getAllFaculties();
        if (response?.status === "success") {
          setFaculties(response.data);
        }
      } catch (error) {
        console.error("Error loading faculties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFaculties();
  }, []);

  // Update value when defaultDepartmentId changes
  useEffect(() => {
    if (defaultDepartmentId) {
      setValue(defaultDepartmentId);
    }
  }, [defaultDepartmentId]);

  const filteredDepartments =
    query === ""
      ? departments
      : departments.filter((department) =>
          `${department.name} ${department.facultyName}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );

  return (
    <div className="relative w-full">
      <Combobox
        value={value}
        onChange={(newValue) => {
          const selectedValue = newValue || "";
          setValue(selectedValue);
          onDepartmentSelect(selectedValue);
        }}
        onClose={() => setQuery("")}
      >
        <div className="relative w-full">
          <div className="flex items-center w-full">
            <ComboboxInput
              className="bg-background py-2 pr-10 pl-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full text-sm leading-5"
              displayValue={() =>
                loading
                  ? "Loading departments..."
                  : selectedDepartment
                    ? `${selectedDepartment.name} (${selectedDepartment.facultyName})`
                    : ""
              }
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search departments..."
              disabled={loading}
            />
            <ComboboxButton className="right-0 absolute inset-y-0 flex items-center pr-2">
              <ChevronsUpDown className="opacity-50 w-4 h-4 shrink-0" />
            </ComboboxButton>
          </div>
          <ComboboxOptions className="z-50 absolute bg-background ring-opacity-5 shadow-lg mt-1 py-1 border border-input rounded-md focus:outline-none ring-1 ring-black w-full max-h-60 overflow-auto sm:text-sm text-base">
            {loading ? (
              <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                Loading departments...
              </div>
            ) : filteredDepartments.length === 0 ? (
              <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                No department found.
              </div>
            ) : (
              filteredDepartments.map((department) => (
                <ComboboxOption
                  key={department.id}
                  value={department.id}
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
                        {department.name} ({department.facultyName})
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

export default DepartmentByFacultySelectModal;
