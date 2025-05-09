"use client";

import React, { useEffect, useState } from "react";

type Props = {
  params: { id: string };
};

const dummyCourses = [
  { id: 1, name: "Introduction to Computer Science", code: "CSC101" },
  { id: 2, name: "Data Structures & Algorithms", code: "CSC201" },
  { id: 3, name: "Computer Architecture", code: "CSC202" },
  { id: 4, name: "Operating Systems", code: "CSC301" },
  { id: 5, name: "Database Systems", code: "CSC302" },
  { id: 6, name: "Computer Networks", code: "CSC303" },
  { id: 7, name: "Software Engineering", code: "CSC304" },
  { id: 8, name: "Artificial Intelligence", code: "CSC401" },
];

export default function DepartmentPage({ params }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  // simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Department of Computer Science
        </h1>
        <p className="text-lg md:text-2xl">
          Explore our diverse courses designed to shape tomorrow's innovators.
        </p>
      </section>

      {/* Courses Grid */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-gray-500">Loading Courses...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-3xl font-extrabold text-blue-600 mb-2">
                  {course.code}
                </div>
                <div className="text-lg text-gray-700">{course.name}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About the Department</h2>
          <p className="text-gray-600 leading-relaxed">
            The Department of Computer Science offers a rigorous curriculum
            covering fundamental concepts and cutting-edge technologies. Our
            mission is to foster critical thinking, innovation, and ethical
            practices among students, preparing them for successful careers in
            academia and industry.
          </p>
        </div>
      </section>
    </div>
  );
}
