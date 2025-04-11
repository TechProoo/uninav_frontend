import { Course, Response } from "@/lib/types/response.type";
import { api } from "./base.api";

const getAllCourses = async (): Promise<Response<Course[]>> => {
  try {
    const response = await api.get<Response<Course[]>>("/courses");
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses. Please try again later.");
  }
};

export default getAllCourses;
