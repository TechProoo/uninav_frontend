"use client";

import { useState, useEffect } from "react";
import { Course, DLC } from "@/lib/types/response.type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { getCourseById, getDepartmentLevelCourses } from "@/api/course.api";
// import LinkCourseForm from "@/components/management/LinkCourseForm";

interface CourseModalProps {
  courseId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseModal({
  courseId,
  isOpen,
  onClose,
}: CourseModalProps) {
  const [course, setCourse] = useState<Required<Course> | null>(null);
  // const [departmentCourses, setDepartmentCourses] = useState<DLC[]>([]);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId && isOpen) {
      fetchCourseDetails();
    }
  }, [courseId, isOpen]);

  const fetchCourseDetails = async () => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch course details
      const courseResponse = await getCourseById(courseId);
      if (courseResponse?.status === "success") {
        setCourse(courseResponse.data as Required<Course>);
      }

      // // Fetch department level courses
      // const dlcResponse = await getDepartmentLevelCourses({
      //   courseId: courseId,
      // });
      // if (dlcResponse?.status === "success") {
      //   setDepartmentCourses(dlcResponse.data.data);
      // }
    } catch (err) {
      console.error("Error fetching course details:", err);
      setError("Failed to load course details");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-500">
            <p>{error}</p>
          </div>
        ) : course ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-bold text-2xl">
                Course Details
              </DialogTitle>
            </DialogHeader>

            <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
              {/* Course Information */}
              <div className="space-y-6 lg:col-span-2">
                <div className="bg-white rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge className="bg-blue-100 mb-2 text-blue-700 text-sm">
                        {course.courseCode}
                      </Badge>
                      <h2 className="mb-2 font-semibold text-xl">
                        {course.courseName}
                      </h2>
                      <p className="text-gray-600">{course.description}</p>
                    </div>
                    <Badge variant="outline" className="px-3 py-1 text-sm">
                      {course?.departments?.length} Departments
                    </Badge>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <span className="mr-4">
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                    <Badge
                      variant={
                        course.reviewStatus === "approved"
                          ? "success"
                          : "secondary"
                      }
                    >
                      {course.reviewStatus}
                    </Badge>
                  </div>
                </div>

                {/* Department Offerings */}
                <div className="bg-white rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">
                      Department Offerings
                    </h3>
                    <Button
                      size="sm"
                      onClick={() => setShowLinkForm(!showLinkForm)}
                    >
                      <Plus className="mr-1 w-4 h-4" />
                      Link Department
                    </Button>
                  </div>

                  {showLinkForm && (
                    <div className="bg-gray-50 mb-6 p-4 border rounded-lg">
                      <h4 className="mb-3 font-medium text-sm">
                        Link to Department
                      </h4>
                      {/* <LinkCourseForm
                        courseId={course.id}
                        onSuccess={() => {
                          setShowLinkForm(false);
                          fetchCourseDetails();
                        }}
                      /> */}
                    </div>
                  )}

                  <div className="space-y-4">
                    {course.departments.length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        This course is not yet linked to any departments.
                      </p>
                    ) : (
                      <div className="gap-3 grid">
                        {course.departments.map(
                          ({ level, department, reviewStatus }) => (
                            <div
                              key={`${department.id}-${level}`}
                              className="flex justify-between items-center bg-gray-50 p-3 border rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-sm">
                                  {department.name}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  Level {level}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  reviewStatus === "approved"
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {reviewStatus}
                              </Badge>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistics and Actions */}
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="mb-4 font-semibold text-lg">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Departments</span>
                      <span className="font-medium">
                        {course.departments.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Approved Links</span>
                      <span className="font-medium">
                        {
                          course.departments.filter(
                            (d) => d.reviewStatus === "approved"
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending Links</span>
                      <span className="font-medium">
                        {
                          course.departments.filter(
                            (d) => d.reviewStatus === "pending"
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h3 className="mb-4 font-semibold text-lg">Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="justify-start w-full">
                      Edit Course Details
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start hover:bg-red-50 w-full text-red-600 hover:text-red-700"
                    >
                      Delete Course
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
