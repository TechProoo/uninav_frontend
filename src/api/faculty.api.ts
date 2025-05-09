import { api } from "./base.api";
import { Faculty, Response } from "@/lib/types/response.type";

export interface FacultyWithDepartments extends Faculty {
  departments: Array<{
    id: string;
    name: string;
    description: string;
    facultyId: string;
  }>;
}

export const getAllFaculties = async (): Promise<Response<
  FacultyWithDepartments[]
> | null> => {
  try {
    const response = await api.get<Response<FacultyWithDepartments[]>>(
      "/faculty"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching faculties:", error);
    return null;
  }
};

export const getFacultyById = async (
  facultyId: string
): Promise<Response<FacultyWithDepartments> | null> => {
  try {
    const response = await api.get<Response<FacultyWithDepartments>>(
      `/faculty/${facultyId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return null;
  }
};
