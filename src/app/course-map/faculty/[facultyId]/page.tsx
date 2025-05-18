"use client";

import React, { useEffect, useState } from "react";
import { School, Building, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/BackButton";
import { getFacultyById, FacultyWithDepartments } from "@/api/faculty.api";
import { Response } from "@/lib/types/response.type";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  params: { facultyId: string };
};

export default function FacultyDetailsPage({ params }: Props) {
  const [faculty, setFaculty] = useState<FacultyWithDepartments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const facultyId = params.facultyId;
        if (!facultyId) {
          setError("Faculty ID is missing.");
          toast.error("Faculty ID is missing.");
          setLoading(false);
          return;
        }
        const response = await getFacultyById(facultyId);

        if (response?.status === "success") {
          setFaculty(response.data);
        } else {
          const errorMessage = response?.message || "Failed to load faculty details";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        console.error("Error fetching faculty:", err);
        setError("An error occurred while loading the faculty details.");
        toast.error("Failed to load faculty details");
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyDetails();
  }, [params.facultyId]);

  const handleDepartmentClick = (departmentId: string) => {
    router.push(`/course-map/department/${departmentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-lg text-gray-700">Loading faculty details...</p>
      </div>
    );
  }

  if (error || !faculty) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="text-center bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold text-red-600 mb-3">
            {error || "Faculty Not Found"}
          </h2>
          <p className="text-gray-600">
            The faculty details could not be loaded. Please try again later or check if the ID is correct.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl md:text-3xl font-bold text-[#003666] flex items-center">
            <School className="w-8 h-8 mr-3 text-blue-600" />
            {faculty.name}
          </h1>
        </div>

        {faculty.description && (
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              About this Faculty
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {faculty.description}
            </p>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Building className="w-7 h-7 mr-3 text-blue-500" />
            Departments
          </h2>
          {faculty.departments && faculty.departments.length > 0 ? (
            <ul className="space-y-4">
              {faculty.departments.map((dept) => (
                <li
                  key={dept.id}
                  onClick={() => handleDepartmentClick(dept.id)}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-blue-50 hover:ring-2 hover:ring-blue-300 text-gray-700 transition-all duration-200 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md border border-gray-200"
                >
                  <div>
                    <h3 className="text-base md:text-lg font-medium text-[#003666]">
                      {dept.name}
                    </h3>
                    {dept.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {dept.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No departments found for this faculty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
