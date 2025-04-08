import { api } from "./base.api";
import { Department, Response } from "@/lib/types/response.type";

interface CreateDepartmentDto {
  name: string;
  description: string;
  facultyId: string;
}

export const getAllFaculty = async () => {
  try {
    const response = await api.get("/faculty");
    return response.data;
  } catch (error) {
    console.error("Error fetching faculties:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

export const getDepartments = async (): Promise<Response<
  Department[]
> | null> => {
  try {
    const response = await api.get<Response<Department[]>>("/department");
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return null;
  }
};

export const getDepartmentsByFaculty = async (
  facultyId: string
): Promise<Response<Department[]> | null> => {
  try {
    const response = await api.get<Response<Department[]>>(
      `/department/faculty/${facultyId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty departments:", error);
    return null;
  }
};

export const getDepartmentById = async (
  id: string
): Promise<Response<Department> | null> => {
  try {
    const response = await api.get<Response<Department>>(`/department/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching department:", error);
    return null;
  }
};

export const createDepartment = async (
  data: CreateDepartmentDto
): Promise<Response<Department> | null> => {
  try {
    const response = await api.post<Response<Department>>("/department", data);
    return response.data;
  } catch (error) {
    console.error("Error creating department:", error);
    return null;
  }
};

export const updateDepartment = async (
  id: string,
  data: Partial<CreateDepartmentDto>
): Promise<Response<Department> | null> => {
  try {
    const response = await api.patch<Response<Department>>(
      `/department/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating department:", error);
    return null;
  }
};

export const deleteDepartment = async (
  id: string
): Promise<Response<void> | null> => {
  try {
    const response = await api.delete<Response<void>>(`/department/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting department:", error);
    return null;
  }
};
