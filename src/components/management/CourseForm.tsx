"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DepartmentByFacultySelect from "@/components/ui/DepartmentByFacultySelect";
import { Loader2, Search, Plus, X } from "lucide-react";
import { SelectCourse } from "@/components/search/SelectCourse";
import { createCourse, linkCourseToDepartment } from "@/api/course.api";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

// Link Course Form Props
export interface LinkCourseFormProps {
  courseId?: string; // Optional for when we already have a course ID
  onSuccess: () => void;
}

// Link Course Form data type
interface LinkCourseFormData {
  courseId: string;
  departmentId: string;
  level: number;
}

// LinkCourseForm component for linking an existing course to a department
export const LinkCourseForm: React.FC<LinkCourseFormProps> = ({
  courseId: initialCourseId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<LinkCourseFormData>({
    courseId: initialCourseId || "",
    departmentId: "",
    level: 100,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCourseId) {
      setFormData((prev) => ({ ...prev, courseId: initialCourseId }));
    }
  }, [initialCourseId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle department selection
  const handleDepartmentSelect = (departmentId: string) => {
    setFormData((prev) => ({ ...prev, departmentId }));
  };

  // Handle course selection
  const handleCourseSelect = (courseId: string) => {
    setFormData((prev) => ({ ...prev, courseId }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.courseId) {
      setError("Please select a course");
      return;
    }

    if (!formData.departmentId) {
      setError("Department selection is required");
      return;
    }

    try {
      setIsSubmitting(true);

      // Link course to department
      const response = await linkCourseToDepartment({
        courseId: formData.courseId,
        departmentId: formData.departmentId,
        level: Number(formData.level),
      });

      if (response?.status === "success") {
        toast.success("Course linked to department successfully");
        onSuccess();
      } else {
        setError("Failed to link course to department. Please try again.");
      }
    } catch (err: any) {
      console.error("Error linking course:", err);
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 p-3 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {/* Only show course selection if no courseId was provided */}
      {!initialCourseId && (
        <div className="space-y-2">
          <Label htmlFor="courseId">Select Course</Label>
          <SelectCourse
            onChange={handleCourseSelect}
            currentValue={formData.courseId}
          />
        </div>
      )}

      {/* Department and Level selection */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="departmentId">Department</Label>
          <DepartmentByFacultySelect
            onDepartmentSelect={handleDepartmentSelect}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="block px-3 py-2 border border-gray-300 rounded-md w-full text-sm"
            required
          >
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
            <option value="600">600 Level</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Linking Course...
            </>
          ) : (
            <>
              <Plus className="mr-2 w-4 h-4" />
              Link Course to Department
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

// Course form props
interface CourseFormProps {
  onSuccess: () => void;
}

// Course form data type
interface FormData {
  courseId: string; // Used for existing course selection
  courseName: string;
  courseCode: string;
  description: string;
  departmentId: string;
  level: number;
  useExistingCourse: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    courseId: "",
    courseName: "",
    courseCode: "",
    description: "",
    departmentId: "",
    level: 100,
    useExistingCourse: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle department selection from the DepartmentByFacultySelect component
  const handleDepartmentSelect = (departmentId: string) => {
    setFormData((prev) => ({ ...prev, departmentId }));
  };

  // Handle course selection from the SelectCourse component
  const handleCourseSelect = (courseId: string) => {
    setFormData((prev) => ({ ...prev, courseId }));
  };

  // Toggle between existing/new course
  const toggleCourseMode = () => {
    setFormData((prev) => ({
      ...prev,
      useExistingCourse: !prev.useExistingCourse,
      // Reset relevant fields
      courseId: "",
      courseName: "",
      courseCode: "",
      description: "",
    }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.useExistingCourse && !formData.courseId) {
      setError("Please select an existing course");
      return;
    }

    if (!formData.useExistingCourse) {
      if (!formData.courseName.trim()) {
        setError("Course name is required");
        return;
      }
      if (!formData.courseCode.trim()) {
        setError("Course code is required");
        return;
      }
    }

    if (!formData.departmentId) {
      setError("Department selection is required");
      return;
    }

    try {
      setIsSubmitting(true);

      if (formData.useExistingCourse) {
        // Link existing course to department
        const response = await linkCourseToDepartment({
          courseId: formData.courseId,
          departmentId: formData.departmentId,
          level: Number(formData.level),
        });

        if (response?.status === "success") {
          toast.success("Course linked to department successfully");
          onSuccess();
        } else {
          setError("Failed to link course to department. Please try again.");
        }
      } else {
        // Create a new course
        const response = await createCourse({
          courseName: formData.courseName,
          courseCode: formData.courseCode,
          description: formData.description,
          departmentId: formData.departmentId,
          level: Number(formData.level),
        });

        if (response?.status === "success") {
          toast.success("Course created successfully");
          onSuccess();
        } else {
          setError("Failed to create course. Please try again.");
        }
      }
    } catch (err: any) {
      console.error("Error creating/linking course:", err);
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex md:flex-row flex-col items-center gap-4 mb-6">
        <Badge
          className={
            formData.useExistingCourse
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }
        >
          Link Existing Course
        </Badge>
        <div className="flex items-center">
          <div
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
              formData.useExistingCourse ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={toggleCourseMode}
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200 ease-in-out ${
                formData.useExistingCourse ? "left-6" : "left-0.5"
              }`}
            ></div>
          </div>
        </div>
        <Badge
          className={
            !formData.useExistingCourse
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }
        >
          Create New Course
        </Badge>
      </div>

      {error && (
        <div className="bg-red-50 p-3 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {/* Course selection or creation */}
      {formData.useExistingCourse ? (
        <div className="space-y-2">
          <Label htmlFor="courseId">Select Existing Course</Label>
          <SelectCourse
            onChange={handleCourseSelect}
            currentValue={formData.courseId}
          />
        </div>
      ) : (
        <>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                placeholder="e.g., Introduction to Computer Science"
                required={!formData.useExistingCourse}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code</Label>
              <Input
                id="courseCode"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                placeholder="e.g., CS101"
                required={!formData.useExistingCourse}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the course"
              rows={3}
            />
          </div>
        </>
      )}

      {/* Department and Level selection - required for both modes */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="departmentId">Department</Label>
          <DepartmentByFacultySelect
            onDepartmentSelect={handleDepartmentSelect}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="block px-3 py-2 border border-gray-300 rounded-md w-full text-sm"
            required
          >
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
            <option value="600">600 Level</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              {formData.useExistingCourse
                ? "Linking Course..."
                : "Creating Course..."}
            </>
          ) : (
            <>
              <Plus className="mr-2 w-4 h-4" />
              {formData.useExistingCourse ? "Link Course" : "Create Course"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;
