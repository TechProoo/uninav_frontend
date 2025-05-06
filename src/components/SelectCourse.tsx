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
import { Course } from "@/lib/types/response.type";
import { getCourses } from "@/api/course.api";
import { cn } from "@/lib/utils";

type Props = {
  onChange: (value: string) => void;
  currentValue?: string;
};

export const SelectCourse = ({ onChange, currentValue }: Props) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentValue || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await getCourses();
        setCourses(res.data);
      } catch (err: any) {
        console.error("Error fetching courses", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Update value when currentValue prop changes
  useEffect(() => {
    if (currentValue) {
      setValue(currentValue);
    }
  }, [currentValue]);

  const selectedCourse = courses.find((course) => course.id === value);

  return (
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
            ? "Loading courses..."
            : value
              ? selectedCourse
                ? `${selectedCourse.courseCode}: ${selectedCourse.courseName}`
                : "Select course..."
              : "Select course..."}
          <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full" tabIndex={1}>
        <Command>
          <CommandInput placeholder="Search courses..." />
          <CommandList>
            <CommandEmpty>No course found.</CommandEmpty>
            <CommandGroup>
              {courses.map((course) => (
                <CommandItem
                  key={course.id}
                  value={`${course.courseCode} ${course.courseName}`}
                  onSelect={() => {
                    setValue(course.id);
                    onChange(course.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === course.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {course.courseCode}: {course.courseName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
