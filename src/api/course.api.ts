import { api } from "./base.api";
import { Course, Response, Pagination, DLC } from "@/lib/types/response.type";

interface CreateCourseDto {
  courseName: string;
  courseCode: string;
  description: string;
  departmentId: string;
  level: number;
}

interface LinkCourseDto {
  courseId: string;
  departmentId: string;
  level: number;
}

interface UpdateCourseDto {
  courseName?: string;
  courseCode?: string;
  description?: string;
}

export const getCourses = async (filters?: {
  departmentId?: string;
  level?: number;
  limit?: number;
  // necessary if you want to get(departmentId, and level since this will course duplicates for different departments)
  allowDepartments?: boolean;
}): Promise<Response<Course[]>> => {
  try {
    const { departmentId, level, limit = 10 } = filters || {};
    let url = `/courses?limit=${limit}`;
    if (departmentId) url += `&departmentId=${departmentId}`;
    if (level) url += `&level=${level}`;
    if (filters?.allowDepartments)
      url += `&allowDepartments=${filters.allowDepartments}`;

    const response = await api.get<Response<Course[]>>(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch courses"
    );
  }
};
export const getCoursesPaginated = async (filters?: {
  departmentId?: string;
  level?: number;
  page?: number;
  limit?: number;
  // necessary if you want to get(departmentId, and level since this will course duplicates for different departments)
  allowDepartments?: boolean;
}): Promise<Response<Pagination<Course[]>>> => {
  try {
    const { departmentId, level, page = 1, limit = 10 } = filters || {};
    let url = `/courses?page=${page}&limit=${limit}`;
    if (departmentId) url += `&departmentId=${departmentId}`;
    if (level) url += `&level=${level}`;
    if (filters?.allowDepartments)
      url += `&allowDepartments=${filters.allowDepartments}`;

    const response = await api.get<Response<Pagination<Course[]>>>(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch courses"
    );
  }
};

export const getCourseById = async (
  id: string
): Promise<Response<Course> | null> => {
  try {
    const response = await api.get<Response<Course>>(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
};

export const getCourseByCode = async (
  courseCode: string
): Promise<Response<Course> | null> => {
  try {
    const response = await api.get<Response<Course>>(
      `/courses/code/${courseCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course by code:", error);
    return null;
  }
};

export const createCourse = async (
  courseData: CreateCourseDto
): Promise<Response<Course> | null> => {
  try {
    const response = await api.post<Response<Course>>("/courses", courseData);
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    return null;
  }
};

export const linkCourseToDepartment = async (
  linkData: LinkCourseDto
): Promise<Response<DLC> | null> => {
  try {
    const response = await api.post<Response<DLC>>(
      "/courses/department-level",
      linkData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error linking course to department:", error);
    throw new Error(
      error.response?.data?.message || "Failed to link course to department"
    );
  }
};

// remove link between course and department
export const unlinkCourseToDepartment = async (
  departmentId: string,
  courseId: string
): Promise<Response<void> | null> => {
  try {
    const response = await api.delete<Response<void>>(
      `/courses/department-level/${departmentId}/${courseId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error unlinking course to department:", error);
    throw new Error(
      error.response?.data?.message || "Failed to link course to department"
    );
  }
};
export const getDepartmentLevelCourses = async ({
  departmentId,
  courseId,
  page = 1,
  limit = 10,
}: {
  departmentId?: string;
  courseId?: string;
  page?: number;
  limit?: number;
}): Promise<Response<Pagination<DLC[]>> | null> => {
  try {
    let url = `/courses/department-level?page=${page}&limit=${limit}`;
    if (departmentId) url += `&departmentId=${departmentId}`;
    if (courseId) url += `&courseId=${courseId}`;

    const response = await api.get<Response<Pagination<DLC[]>>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching department level courses:", error);
    return null;
  }
};

export const updateCourse = async (
  courseId: string,
  updateData: UpdateCourseDto
): Promise<Response<Course>> => {
  try {
    const response = await api.patch<Response<Course>>(
      `/courses/${courseId}`,
      updateData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating course:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to update course"
    );
  }
};

export const deleteCourse = async (
  courseId: string
): Promise<Response<void>> => {
  try {
    const response = await api.delete<Response<void>>(`/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting course:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to delete course"
    );
  }
};
