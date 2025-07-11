"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import { Plus, Loader2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  getUserCourses,
  addUserCourses,
  removeUserCourses,
} from "@/api/user.api";
import { getCourses, createCourse } from "@/api/course.api";
import { Course } from "@/lib/types/response.type";
import DepartmentByFacultySelectModal from "@/components/DepartmentByFacultySelectModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams, useRouter } from "next/navigation";

const CoursesPage = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userCourses, setUserCourses] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [isLoadingAllCourses, setIsLoadingAllCourses] = useState(false);
  const { toast } = useToast();

  // Form state for creating a new course
  const [newCourse, setNewCourse] = useState({
    courseName: "",
    courseCode: "",
    description: "",
    departmentId: user?.departmentId || "",
    level: user?.level || 100,
  });

  useEffect(() => {
    fetchCourses();
  }, [user]);

  // Check for action=create query parameter to open create course modal
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "create") {
      setIsCreateDialogOpen(true);
      // Clear the action parameter from URL without causing a page reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("action");
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    }
  }, [searchParams, router]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const [userCoursesRes, availableCoursesRes] = await Promise.all([
        getUserCourses(),
        getCourses({
          departmentId: user?.departmentId,
          level: user?.level,
        }),
      ]);

      setUserCourses(userCoursesRes || []);
      setAvailableCourses(
        (availableCoursesRes?.data || []).filter(
          (course) =>
            !userCoursesRes.some((uc: any) => uc.courseId === course.id)
        )
      );
    } catch (err) {
      setError("Failed to load courses");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      setIsLoadingAllCourses(true);
      const allCoursesRes = await getCourses(); // No filters to get all courses
      
      setAllCourses(
        (allCoursesRes?.data || []).filter(
          (course) =>
            !userCourses.some((uc: any) => uc.courseId === course.id)
        )
      );
    } catch (err) {
      setError("Failed to load all courses");
      console.error(err);
    } finally {
      setIsLoadingAllCourses(false);
    }
  };

  const handleToggleAllCourses = async () => {
    if (!showAllCourses && allCourses.length === 0) {
      // First time loading all courses
      await fetchAllCourses();
    }
    setShowAllCourses(!showAllCourses);
    setSearchTerm(""); // Clear search when toggling
  };

  const handleAddCourses = async () => {
    if (!selectedCourses.length) return;

    try {
      setIsSubmitting(true);
      await addUserCourses(selectedCourses);
      await fetchCourses();
      setSelectedCourses([]);
      setIsAddDialogOpen(false);
    } catch (err) {
      setError("Failed to add courses");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCourse = async (courseId: string) => {
    try {
      setIsSubmitting(true);
      await removeUserCourses([courseId]);
      await fetchCourses();
    } catch (err) {
      setError("Failed to remove course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await createCourse(newCourse);
      setIsCreateDialogOpen(false);
      setNewCourse({
        courseName: "",
        courseCode: "",
        description: "",
        departmentId: user?.departmentId || "",
        level: user?.level || 100,
      });
      // Refresh courses list
      await fetchCourses();
    } catch (err) {
      setError("Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCourseCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Check for spaces
    if (value.includes(" ")) {
      toast({
        variant: "destructive",
        title: "Invalid Course Code",
        description: "Course code should not contain spaces",
      });
      return;
    }

    // Limit to 6 characters
    if (value.length > 6) {
      toast({
        variant: "destructive",
        title: "Invalid Course Code",
        description: "Course code should not exceed 6 characters",
      });
      return;
    }

    setNewCourse({ ...newCourse, courseCode: value });
  };

  const filteredCourses = (showAllCourses ? allCourses : availableCourses).filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="section-heading">Manage Courses</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => {
              setIsAddDialogOpen(true);
              setSelectedCourses([]); // Reset selected courses when opening dialog
            }}
            className="w-full sm:w-auto"
          >
            Add Courses
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            Create  Course
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center bg-red-50 mb-6 p-4 rounded-lg text-red-600">
          <AlertCircle className="mr-2 w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="mb-4 font-semibold text-xl">Your Current Courses</h2>

        {userCourses.length === 0 ? (
          <p className="text-gray-500">No courses added yet.</p>
        ) : (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {userCourses.map((uc: any) => (
              <div key={uc.courseId} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{uc.course.courseName}</h3>
                    <p className="text-gray-500 text-sm">
                      {uc.course.courseCode}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCourse(uc.courseId)}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                  {uc.course.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Courses Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            // Reset state when dialog closes
            setShowAllCourses(false);
            setSearchTerm("");
            setSelectedCourses([]);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Courses</DialogTitle>
            <DialogDescription>
              Select courses to add to your list
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full p-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-gray-600">
                {showAllCourses ? "All Courses" : "Courses for your department & level"}
              </p>
              <button
                type="button"
                onClick={handleToggleAllCourses}
                disabled={isLoadingAllCourses}
                className="text-blue-600 hover:text-blue-700 text-sm underline disabled:opacity-50"
              >
                {isLoadingAllCourses ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Loading...
                  </span>
                ) : showAllCourses ? (
                  "Show Department Courses"
                ) : (
                  "All Courses"
                )}
              </button>
            </div>
          </div>
          <div className="mt-4 max-h-[400px] overflow-y-auto">
            {filteredCourses.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No courses found</p>
            ) : (
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-start p-3 last:border-0 border-b"
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={selectedCourses.includes(course.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCourses([...selectedCourses, course.id]);
                      } else {
                        setSelectedCourses(
                          selectedCourses.filter((id) => id !== course.id)
                        );
                      }
                    }}
                  />
                  <div className="ml-3 flex-1">
                    <h4 className="font-medium">{course.courseName}</h4>
                    <p className="text-gray-500 text-sm">{course.courseCode}</p>
                    {showAllCourses && course.departments && course.departments.length > 0 && (
                      <p className="text-gray-400 text-xs mt-1">
                        Level {course.departments[0].level} • {course.departments[0].department?.name || course.departments[0].departmentId}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCourses}
              disabled={isSubmitting || selectedCourses.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Selected Courses"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Course Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Submit a course for review. Once approved, it will be added to the
              course list.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCourse}>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-sm">
                  Course Name
                </label>
                <input
                  type="text"
                  required
                  className="p-2 border rounded-md w-full"
                  value={newCourse.courseName}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, courseName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-sm">
                  Course Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="p-2 border rounded-md w-full"
                  value={newCourse.courseCode}
                  onChange={handleCourseCodeChange}
                  placeholder="Enter course code (max 6 characters)"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-sm">
                  Department
                </label>
                <DepartmentByFacultySelectModal
                  onDepartmentSelect={(departmentId) =>
                    setNewCourse({ ...newCourse, departmentId })
                  }
                  defaultDepartmentId={newCourse.departmentId}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-sm">
                  Level
                </label>
                <Select
                  value={newCourse.level.toString()}
                  onValueChange={(value) =>
                    setNewCourse({ ...newCourse, level: parseInt(value) })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[100, 200, 300, 400, 500, 600].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        {level} Level
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-2 font-medium text-sm">
                  Description
                </label>
                <textarea
                  required
                  className="p-2 border rounded-md w-full"
                  rows={3}
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Submit for Review"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesPage;
