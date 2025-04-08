"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllFaculties } from "@/api/faculty.api";
import { Department, Faculty } from "@/lib/types/response.type";

interface FacultySelectProps {
  onDepartmentSelect: (departmentId: string) => void;
  defaultDepartmentId?: string;
}

const FacultySelect: React.FC<FacultySelectProps> = ({
  onDepartmentSelect,
  defaultDepartmentId,
}) => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(
    defaultDepartmentId || ""
  );

  useEffect(() => {
    const loadFaculties = async () => {
      try {
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

  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    onDepartmentSelect(departmentId);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-md w-full h-10 animate-pulse"></div>
    );
  }

  return (
    <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a department" />
      </SelectTrigger>
      <SelectContent>
        {faculties.map((faculty) => (
          <SelectGroup key={faculty.id}>
            <SelectLabel>{faculty.name}</SelectLabel>
            {faculty.departments?.map((department) => (
              <SelectItem key={department.id} value={department.id}>
                {department.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FacultySelect;
