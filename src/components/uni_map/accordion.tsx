import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FacultyWithDepartments, getAllFaculties } from "@/api/faculty.api";
import toast from "react-hot-toast";
import { Response } from "@/lib/types/response.type";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AccordionDemo() {
  const [faculties, setFaculties] = useState<Response<
    FacultyWithDepartments[]
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getDetails = async () => {
      const response = await getAllFaculties();
      if (response?.status === "success") {
        setFaculties(response);
      } else if (response?.status === "error") {
        toast.error(response?.message);
      }
      setLoading(false);
    };

    getDetails();
  }, []);

  const handleClick = (id: string) => {
    router.push(`/dashboard/university_map/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <p className="text-center text-gray-500">Loading faculties...</p>
      ) : faculties?.data.length ? (
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
                {faculty.name}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 cursor-pointer">
                  {faculty.departments.map((dept) => (
                    <li
                      key={dept.id}
                      onClick={() => handleClick(dept.id)}
                      className="border border-borderMain/50 rounded-md px-3 py-2 hover:bg-bgMain/30 text-textDark/90 transition-colors"
                    >
                      {dept.name}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-center text-gray-500">No faculties available.</p>
      )}
    </div>
  );
}
