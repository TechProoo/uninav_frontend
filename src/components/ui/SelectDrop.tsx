"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Department } from "@/lib/types/response.type";

interface dataProp {
  dept: { message: string; status: string; data: Department[] }; // Updated to reflect the shape of your data
  value: string;
  onChange: (value: string) => void;
}

export const SelectDemo: React.FC<dataProp> = ({ dept, value, onChange }) => {
  // Ensure data is an array and not empty
  const departments = dept?.data || []; // Access the array of departments from data.data

  if (!Array.isArray(departments) || departments.length === 0) {
    return <p>No faculties available</p>; // Handle case where data is empty or not an array
  }

  // Log the departments array

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a faculty" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Faculties</SelectLabel>
          {/* Directly map over the departments array */}
          {departments.map((n) => (
            <SelectItem key={n.id} value={n.id.toString()}>
              {n.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
