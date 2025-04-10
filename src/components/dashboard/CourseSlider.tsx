import React from "react";
import Card from "@/components/ui/card/card";
import { useAuth } from "@/contexts/authContext";
import { BookOpen } from "lucide-react";

const CourseSlider = () => {
  const { user } = useAuth();

  if (!user?.courses || user.courses.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="mb-4 font-semibold text-xl">My Courses</h2>
      <div className="pb-4 overflow-x-auto">
        <div className="flex gap-4">
          {user.courses.map((courseEnrollment) => (
            <Card
              key={courseEnrollment.courseId}
              className="flex flex-col bg-white/50 hover:shadow-lg backdrop-blur-sm p-4 min-w-[250px] transition-shadow cursor-pointer"
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
  );
};

export default CourseSlider;
