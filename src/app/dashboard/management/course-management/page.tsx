"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import {
  ChevronLeft,
  Loader2,
  Plus,
  GraduationCap,
  Search,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getCourses,
  createCourse,
  getDepartmentLevelCourses,
} from "@/api/course.api";
import { Course, DLC } from "@/lib/types/response.type";
import { Badge } from "@/components/ui/badge";
import CourseForm from "@/components/management/CourseForm";

const CourseManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [departmentCourses, setDepartmentCourses] = useState<DLC[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

      const response = await getCourses({
        page: currentPage,
        limit: 10,
      });

      if (response?.status === "success") {
        setCourses(response.data);
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

  const fetchDepartmentCourses = async () => {
    try {
      setIsLoading(true);
      const response = await getDepartmentLevelCourses({
        page: 1,
        limit: 20,
      });

      if (response?.status === "success") {
        setDepartmentCourses(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching department courses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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

  // If user not loaded yet or not admin/moderator, show nothing
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return null;
  }

  return (
    <div className="mx-auto px-4 container">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/dashboard/management">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </Button>
        <h1 className="font-bold text-3xl">Course Management</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Button type="submit">
            <Search className="mr-2 w-4 h-4" />
            Search
          </Button>
        </form>
        <Button onClick={handleFormToggle}>
          <Plus className="mr-2 w-4 h-4" />
          {showForm ? "Cancel" : "Add Course"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white shadow-sm mb-8 p-6 border rounded-lg">
          <h2 className="mb-4 font-semibold text-xl">Add New Course</h2>
          <CourseForm onSuccess={handleFormSuccess} />
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-500">
            <p>{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-md text-center">
            <GraduationCap className="mx-auto mb-4 w-12 h-12 text-gray-400" />
            <h3 className="mb-2 font-medium text-xl">No courses found</h3>
            <p className="text-gray-500">
              Get started by adding your first course.
            </p>
          </div>
        ) : (
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white shadow-sm hover:shadow-md border rounded-lg overflow-hidden transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 w-5 h-5 text-blue-600" />
                      <Badge className="bg-blue-100 text-blue-700">
                        {course.courseCode}
                      </Badge>
                    </div>
                    <Badge variant="outline">Level {course.level}</Badge>
                  </div>

                  <h3 className="mb-2 font-semibold text-lg">
                    {course.courseName}
                  </h3>
                  <p className="mb-4 text-gray-500 text-sm line-clamp-2">
                    {course.description || "No description provided."}
                  </p>

                  <div className="flex items-center text-gray-500 text-sm">
                    <Building className="mr-1 w-4 h-4" />
                    <span>
                      Department: {course.departmentId.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagementPage;
