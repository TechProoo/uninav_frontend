"use client";

import React, { useEffect, useState } from "react";
import { School, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/BackButton";
import { getDepartmentById } from "@/api/department.api";
import { getCourses } from "@/api/course.api";
import { Department, Course } from "@/lib/types/response.type";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  params: { id: string };
};

// Group courses by level based on course code
const groupCoursesByLevel = (courses: Course[]) => {
  return courses.reduce((acc: { [key: number]: Course[] }, course) => {
    const level =
      Math.floor(parseInt(course.courseCode.replace(/[^\d]/g, "")) / 100) * 100;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(course);
    return acc;
  }, {});
};

export default function DepartmentPage({ params }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [department, setDepartment] = useState<Department | null>(null);
  const [groupedCourses, setGroupedCourses] = useState<{
    [key: number]: Course[];
  }>({});
  const [activeLevel, setActiveLevel] = useState<number>(100);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const departmentId = params.id;

        // Fetch department details
        const departmentResponse = await getDepartmentById(departmentId);
        if (departmentResponse?.status === "success") {
          setDepartment(departmentResponse.data);
        } else {
          toast.error("Failed to load department details");
          return;
        }

        // Fetch courses for this department
        const coursesResponse = await getCourses({
          departmentId,
          limit: 100, // Get all courses
        });

        if (
          coursesResponse?.status === "success" &&
          Array.isArray(coursesResponse.data)
        ) {
          // Filter courses to only those that belong to this department
          const departmentCourses = coursesResponse.data.filter((course) =>
            course.departments?.find(
              (dept) => dept.departmentId === departmentId
            )
          );
          const grouped = groupCoursesByLevel(departmentCourses);
          setGroupedCourses(grouped);

          // Set active level to the first level that has courses
          const levels = Object.keys(grouped).map(Number);
          if (levels.length > 0) {
            setActiveLevel(Math.min(...levels));
          }
        } else {
          toast.error("Failed to load courses");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong while loading the data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const levels = [100, 200, 300, 400, 500];
  const hasAnyCourses = Object.values(groupedCourses).some(
    (courses) => courses.length > 0
  );

  const departmentId = params.id;
  const handleClick = (details: string) => {
    router.push(`/dashboard/university_map/${departmentId}/${details}`);
  };

  console.log(departmentId)

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      {/* Header with Navigation */}
      <div className="mb-6 flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold text-[#003666]">
          {department?.name || "Loading..."}
        </h1>
      </div>

      {/* Department Info Card */}
      <div className="mb-8 bg-gradient-to-br from-[#003666] to-[#0c4a8c] rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <School className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Department Overview</h2>
            </div>
            <p className="max-w-2xl text-blue-100">
              {department?.description || "Loading department description..."}
            </p>
          </div>
        </div>
      </div>

      {/* Level Navigation Scroll */}
      {hasAnyCourses ? (
        <div className="relative mb-8">
          <div className="flex overflow-x-auto no-scrollbar gap-2 p-1">
            {levels.map((level) => {
              const coursesCount = (groupedCourses[level] || []).length;
              if (coursesCount === 0) return null;

              return (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap min-w-fit ${
                    activeLevel === level
                      ? "bg-[#003666] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-medium">{level} Level</span>
                  <Badge
                    variant="outline"
                    className={`${
                      activeLevel === level
                        ? "bg-blue-500/20 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {coursesCount}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Courses Section */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Available Courses
          </h2>
          {hasAnyCourses && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {(groupedCourses[activeLevel] || []).length} Courses
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-lg p-6 h-40"
              ></div>
            ))}
          </div>
        ) : !hasAnyCourses ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Courses Available
            </h3>
            <p className="text-gray-500 max-w-md">
              There are currently no courses available in this department.
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(groupedCourses[activeLevel] || []).map((course) => (
              <div
                key={course.id}
                onClick={() => handleClick(course.id)}
                className="bg-white hover:shadow-lg transition-shadow rounded-lg p-6 border border-gray-100"
              >
                <Badge className="mb-3 bg-blue-50 text-blue-700">
                  {course.courseCode}
                </Badge>
                <h3 className="font-medium text-gray-900 mb-2">
                  {course.courseName}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
