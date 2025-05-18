"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FacultyWithDepartments, getAllFaculties } from "@/api/faculty.api";
import { School, ChevronDown, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Response } from "@/lib/types/response.type";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const page = () => {
  const [faculties, setFaculties] = useState<Response<FacultyWithDepartments[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await getAllFaculties();
        if (response?.status === "success") {
          setFaculties(response);
        } else if (response?.status === "error") {
          toast.error(response?.message);
        }
      } catch (error) {
        toast.error("Failed to load faculties");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, []);

  const handleClick = (id: string) => {
    router.push(`/course-map/department/${id}`);
  };

  const renderFacultiesAndDepartments = () => {
    if (loading) {
      return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <div className="pl-4 space-y-3">
                <Skeleton className="h-10 w-[90%]" />
                <Skeleton className="h-10 w-[85%]" />
                <Skeleton className="h-10 w-[80%]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return faculties?.data.length ? (
      <Accordion
        type="multiple"
        className="w-full max-w-4xl mx-auto space-y-4"
      >
        {faculties.data.map((faculty) => (
          <AccordionItem
            key={faculty.id}
            value={faculty.id}
            className="bg-white rounded-lg shadow hover:shadow-md border border-gray-200 overflow-hidden transition-shadow duration-200"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-100 text-gray-800 font-medium transition-colors w-full text-left group">
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-3">
                  <School className="h-6 w-6 text-blue-600" />
                  <span className="text-base md:text-lg font-semibold text-[#003666]">{faculty.name}</span>
                </div>
                {/* Default chevron from shadcn/ui will appear here */}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 cursor-default py-3 px-6 bg-gray-50/50">
                {faculty.departments.map((dept) => (
                  <li
                    key={dept.id}
                    onClick={() => handleClick(dept.id)}
                    className="bg-white rounded-lg px-4 py-3 hover:bg-blue-50 hover:ring-2 hover:ring-blue-300 text-gray-700 transition-all duration-200 flex items-center justify-between group cursor-pointer shadow hover:shadow-lg border border-gray-200"
                  >
                    <span className="text-sm md:text-base">{dept.name}</span>
                    <ArrowRight className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    ) : (
      <div className="text-center py-10">
        <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Faculties Available
        </h3>
        <p className="text-gray-500">
          There are currently no faculties to display.
        </p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#003666]">Course Map</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderFacultiesAndDepartments()}
      </div>
    </div>
  );
};

export default page;
