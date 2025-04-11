import { api } from "./base.api";
import {
  ApprovalStatusEnum,
  Response,
  Pagination,
  Blog,
  Course,
  DLC,
  Material,
} from "@/lib/types/response.type";

// Review Action DTO
export interface ReviewActionDTO {
  action: ApprovalStatusEnum;
  comment?: string;
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
  status?: string;
}

// Materials Review Endpoints
export const listMaterialReviews = async (
  params: PaginationParams & { type?: string } = {}
) => {
  try {
    let url = `/review/materials?page=${params.page || 1}&limit=${
      params.limit || 10
    }`;
    if (params.status) url += `&status=${params.status}`;
    if (params.type) url += `&type=${params.type}`;

    const response = await api.get<Response<Pagination<Material[]>>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching material reviews:", error);
    return null;
  }
};

export const reviewMaterial = async (
  materialId: string,
  reviewData: ReviewActionDTO
) => {
  try {
    const response = await api.post<Response<Material>>(
      `/review/materials/review/${materialId}`,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error("Error reviewing material:", error);
    throw error;
  }
};

export const deleteMaterialAsAdmin = async (materialId: string) => {
  try {
    const response = await api.delete<Response<{ id: string }>>(
      `/review/materials/${materialId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting material:", error);
    throw error;
  }
};

// Blogs Review Endpoints
export const listBlogReviews = async (
  params: PaginationParams & { type?: string } = {}
) => {
  try {
    let url = `/review/blogs?page=${params.page || 1}&limit=${
      params.limit || 10
    }`;
    if (params.status) url += `&status=${params.status}`;
    if (params.type) url += `&type=${params.type}`;

    const response = await api.get<Response<Pagination<Blog[]>>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog reviews:", error);
    return null;
  }
};

export const reviewBlog = async (
  blogId: string,
  reviewData: ReviewActionDTO
) => {
  try {
    const response = await api.post<Response<Blog>>(
      `/review/blogs/review/${blogId}`,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error("Error reviewing blog:", error);
    throw error;
  }
};

export const deleteBlogAsAdmin = async (blogId: string) => {
  try {
    const response = await api.delete<Response<{ id: string }>>(
      `/review/blogs/${blogId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

// Courses Review Endpoints
export const listCourseReviews = async (params: PaginationParams = {}) => {
  try {
    let url = `/review/courses?page=${params.page || 1}&limit=${
      params.limit || 10
    }`;
    if (params.status) url += `&status=${params.status}`;

    const response = await api.get<Response<Pagination<Course[]>>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching course reviews:", error);
    return null;
  }
};

export const reviewCourse = async (
  courseId: string,
  reviewData: ReviewActionDTO
) => {
  try {
    const response = await api.post<Response<Course>>(
      `/review/courses/review/${courseId}`,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error("Error reviewing course:", error);
    throw error;
  }
};

export const deleteCourseAsAdmin = async (courseId: string) => {
  try {
    const response = await api.delete<Response<{ id: string }>>(
      `/review/courses/${courseId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

// Department Level Courses (DLC) Review Endpoints
export const listDLCReviews = async (params: PaginationParams = {}) => {
  try {
    let url = `/review/dlc?page=${params.page || 1}&limit=${
      params.limit || 10
    }`;
    if (params.status) url += `&status=${params.status}`;

    const response = await api.get<Response<Pagination<DLC[]>>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching DLC reviews:", error);
    return null;
  }
};

export const reviewDLC = async (
  departmentId: string,
  courseId: string,
  reviewData: ReviewActionDTO
) => {
  try {
    const response = await api.post<Response<DLC>>(
      `/review/dlc/review/${departmentId}/${courseId}`,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error("Error reviewing DLC:", error);
    throw error;
  }
};

export const deleteDLCAsAdmin = async (
  departmentId: string,
  courseId: string
) => {
  try {
    const response = await api.delete<
      Response<{ departmentId: string; courseId: string }>
    >(`/review/dlc/${departmentId}/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting DLC:", error);
    throw error;
  }
};

// Moderator Review Endpoints (Admin Only)
export interface ModeratorApplication {
  id: string;
  userId: string;
  reason: string;
  reviewStatus: ApprovalStatusEnum;
  reviewedById: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
}

export const listModeratorApplications = async (
  params: PaginationParams = {}
) => {
  try {
    let url = `/review/moderators?page=${params.page || 1}&limit=${
      params.limit || 10
    }`;
    if (params.status) url += `&status=${params.status}`;

    const response = await api.get<
      Response<Pagination<ModeratorApplication[]>>
    >(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching moderator applications:", error);
    return null;
  }
};

export const reviewModeratorApplication = async (
  userId: string,
  reviewData: ReviewActionDTO
) => {
  try {
    const response = await api.post<Response<ModeratorApplication>>(
      `/review/moderators/review/${userId}`,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error("Error reviewing moderator application:", error);
    throw error;
  }
};
