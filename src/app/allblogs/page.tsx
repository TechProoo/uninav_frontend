"use client";
import { TabsDemo } from "@/components/blog/tabs";
import Card from "@/components/ui/card/card";
import { useAuth } from "@/contexts/authContext";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const { user } = useAuth();

  if (!user?.courses || user.courses.length === 0) {
    return null;
  }

  const router = useRouter();

  return (
    <div className="w-full m-auto">
      <div className="m-2 flex items-center gap-5">
        <button
          type="button"
          onClick={() => router.back()}
          className=" flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back
        </button>
        <h1 className="fst text-3xl bg_main">All blogs</h1>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="md:col-span-8 col-span-12">
          <TabsDemo />
        </div>
        <div className="md:col-span-4  col-span-12">
          <div className="sticky top-0 pt-2">
            <div className="flex justify-between items-center">
              <h1>Explore your course files</h1>
              <button className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                Explore
              </button>
            </div>
            {user.courses.slice(0, 3).map((courseEnrollment) => (
              <Card
                key={courseEnrollment.courseId}
                className="flex flex-col bg-white/50 mt-4 hover:shadow-lg backdrop-blur-sm p-4 min-w-[250px] transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {courseEnrollment.course.courseCode}
                  </h3>
                </div>
                <p className="mb-2 text-gray-600 text-sm line-clamp-2">
                  {courseEnrollment.course.courseName}
                </p>
                <p className="text-gray-500 text-xs line-clamp-2">
                  {courseEnrollment.course.description ||
                    "No description available"}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
