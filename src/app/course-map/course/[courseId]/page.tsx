"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, School, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/BackButton";
import { getCourseById } from "@/api/course.api";
import { Course } from "@/lib/types/response.type";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

type Props = {
  params: { courseId: string };
};

export default function CourseDetailsPage({ params }: Props) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const courseId = params.courseId;
        const response = await getCourseById(courseId);

        if (response?.status === "success") {
          setCourse(response.data);
        } else {
          setError("Failed to load course details");
          toast.error("Could not load course details");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("An error occurred while loading the course");
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [params.courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Course not found"}
          </h2>
          <p className="text-gray-600">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  const department = course.departments?.[0]?.department;
  const level = course.departments?.[0]?.level;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold text-[#003666]">
          {course.courseName}
        </h1>
        <Badge className="bg-blue-100 text-blue-800">{course.courseCode}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Info */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Course Overview
            </h2>
          </div>
          <p className="text-gray-700 mb-4">{course.description}</p>
          {level && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">Level:</span> {level}
            </p>
          )}
          <p className="text-sm text-gray-500">
            <span className="font-medium">Review Status:</span>{" "}
            <span
              className={`capitalize font-semibold ${
                course.reviewStatus === "pending"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {course.reviewStatus}
            </span>
          </p>
        </div>

        {/* Department Info */}
        {department && (
          <div className="bg-gradient-to-br from-[#003666] to-[#0c4a8c] p-6 rounded-xl text-white">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <School className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Department</h3>
              </div>
              <p className="text-blue-100 mb-2">{department.name}</p>
              <p className="text-sm text-blue-100">{department.description}</p>
            </div>

            {department.faculty && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Faculty</h3>
                </div>
                <p className="text-blue-100 mb-2">{department.faculty.name}</p>
                <p className="text-sm text-blue-100">
                  {department.faculty.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
