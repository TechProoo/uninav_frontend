"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import BackButton from "@/components/ui/BackButton";
import {
  ChevronLeft,
  Loader2,
  Plus,
  GraduationCap,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";
import { getCoursesPaginated } from "@/api/course.api";
import { Course } from "@/lib/types/response.type";
import { Badge } from "@/components/ui/badge";
import CourseForm from "@/components/management/CourseForm";
import CourseModal from "./CourseModal";

const CourseManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect if not admin or moderator
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "moderator") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Fetch courses on load
  useEffect(() => {
    fetchCourses();
  }, [currentPage]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getCoursesPaginated({
        page: currentPage,
        limit: 10,
        allowDepartments: true,
        ...(searchQuery ? { query: searchQuery } : {}),
      });

      if (response?.status === "success") {
        setCourses(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError("Failed to load courses");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("An error occurred while loading courses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchCourses();
  };

  const handleFormToggle = () => {
    setShowForm(!showForm);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchCourses();
    toast.success("Course created successfully");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsModalOpen(true);
  };

  const handleCourseDeleted = () => {
    // Refresh the courses list
    fetchCourses();
    toast.success("Course deleted successfully");
  };

  // If user not loaded yet or not admin/moderator, show nothing
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return null;
  }

  return (
    <div className="mx-auto px-3 sm:px-4 container">
      <div className="mb-4">
        <BackButton 
          onClick={() => router.push("/dashboard/management")} 
          label="Back to Management"
          className="mb-4"
        />
      </div>
      
      <div className="flex justify-between items-center mb-3 sm:mb-6">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
          Course Management
        </h1>
      </div>

      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <Input
            type="search"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-full sm:max-w-md text-sm"
          />
          <Button type="submit" size="sm" className="whitespace-nowrap">
            <Search className="mr-1 sm:mr-2 w-3 sm:w-4 h-3 sm:h-4" />
            <span className="text-xs sm:text-sm">Search</span>
          </Button>
        </form>
        <Button
          onClick={handleFormToggle}
          size="sm"
          className="mt-2 sm:mt-0 w-full sm:w-auto text-xs sm:text-sm"
        >
          <Plus className="mr-1 sm:mr-2 w-3 sm:w-4 h-3 sm:h-4" />
          {showForm ? "Cancel" : "Add Course"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white shadow-sm mb-6 sm:mb-8 p-3 sm:p-6 border rounded-lg">
          <h2 className="mb-3 sm:mb-4 font-semibold text-lg sm:text-xl">
            Add New Course
          </h2>
          <CourseForm onSuccess={handleFormSuccess} />
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12 sm:py-20">
            <Loader2 className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-3 sm:p-4 rounded-md text-red-500 text-sm sm:text-base">
            <p>{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-gray-50 p-4 sm:p-8 rounded-md text-center">
            <GraduationCap className="mx-auto mb-3 sm:mb-4 w-8 sm:w-12 h-8 sm:h-12 text-gray-400" />
            <h3 className="mb-1 sm:mb-2 font-medium text-lg sm:text-xl">
              No courses found
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Get started by adding your first course.
            </p>
          </div>
        ) : (
          <>
            <div className="gap-3 sm:gap-4 lg:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white shadow-sm hover:shadow-md border rounded-lg overflow-hidden transition-shadow"
                >
                  <div className="p-3 sm:p-4 lg:p-6">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <div className="flex items-center">
                        <GraduationCap className="mr-1 sm:mr-2 w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                        <Badge className="bg-blue-100 text-blue-700 text-xs sm:text-sm">
                          {course.courseCode}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="bg-gray-50 text-xs">
                        {course.departments?.length || 0} departments
                      </Badge>
                    </div>

                    <h3 className="mb-1 sm:mb-2 font-semibold text-base sm:text-lg">
                      {course.courseName}
                    </h3>
                    <p className="mb-3 sm:mb-4 text-gray-500 text-xs sm:text-sm line-clamp-2">
                      {course.description || "No description provided."}
                    </p>

                    {course.departments && course.departments.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <div className="font-medium text-gray-600 text-sm">
                          Offered in:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {course.departments.map((dept, index) => (
                            <Badge
                              key={`${dept.departmentId}-${index}`}
                              variant="secondary"
                              className="text-xs"
                            >
                              Level {dept.level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end mt-3 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleViewCourse(course.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {courses.length > 0 && (
              <div className="flex xs:flex-row flex-col justify-between items-center gap-2 pt-4 sm:pt-8">
                <p className="text-gray-600 text-xs sm:text-sm">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="h-8 sm:h-9 text-xs"
                  >
                    <ChevronLeft className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span className="ml-1">Prev</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="h-8 sm:h-9 text-xs"
                  >
                    <span className="mr-1">Next</span>
                    <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <CourseModal
        courseId={selectedCourseId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourseId(null);
        }}
        onCourseDeleted={handleCourseDeleted}
      />
    </div>
  );
};

export default CourseManagementPage;
