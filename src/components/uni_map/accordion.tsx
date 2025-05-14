import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FacultyWithDepartments, getAllFaculties } from "@/api/faculty.api";
import { School, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { Response } from "@/lib/types/response.type";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export function AccordionDemo() {
  const [faculties, setFaculties] = useState<Response<
    FacultyWithDepartments[]
  > | null>(null);
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
    router.push(`/course-map/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {faculties?.data.length ? (
        <Accordion
          type="multiple"
          className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-4"
        >
          {faculties.data.map((faculty) => (
            <AccordionItem
              key={faculty.id}
              value={faculty.id}
              className="border border-borderMain rounded-md overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-bgMain/50 text-textDark font-semibold transition-colors">
                <div className="flex items-center gap-3">
                  <School className="h-5 w-5 text-blue-600" />
                  <span>{faculty.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 cursor-pointer p-2">
                  {faculty.departments.map((dept) => (
                    <li
                      key={dept.id}
                      onClick={() => handleClick(dept.id)}
                      className="border border-borderMain/50 rounded-md px-4 py-3 hover:bg-blue-50 hover:border-blue-200 text-textDark/90 transition-all duration-200 flex items-center justify-between group"
                    >
                      <span>{dept.name}</span>
                      <ChevronDown className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
      )}
    </div>
  );
}
