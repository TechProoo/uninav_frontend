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
import getAllCourses from "@/api/getAllCourses";
import { Course } from "@/lib/types/response.type"; // Assuming Course is defined there

type Props = {
  onChange: (value: string) => void;
};

export const SelectCourse = ({ onChange }: Props) => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getAllCourses();
        if (res.status === "success" && res.data) {
          setCourses(res.data);
        }
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Filter by course" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Courses</SelectLabel>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.courseName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
