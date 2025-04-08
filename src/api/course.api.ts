import { api } from "./base.api";
import { Course, Response, Pagination } from "@/lib/types/response.type";

interface CreateCourseDto {
  courseName: string;
  courseCode: string;
  description: string;
  departmentId: string;
  level: number;
}

export const getCourses = async ({
  departmentId,
  level,
  page = 1,
  limit = 10,
}: {
  departmentId?: string;
  level?: number;
  page?: number;
  limit?: number;
}): Promise<Response<Course[]> | null> => {
  try {
    let url = `/courses?page=${page}&limit=${limit}`;
    if (departmentId) url += `&departmentId=${departmentId}`;
    if (level) url += `&level=${level}`;

    const response = await api.get<Response<Course[]>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return null;
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
