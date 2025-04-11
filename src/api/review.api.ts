import { api } from "./base.api";
import {
  ApprovalStatusEnum,
  Response,
  Pagination,
  Blog,
  Course,
  DLC,
  Material,
  Advert,
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

// Review Count Types
export interface ReviewCounts {
  pending: number;
  approved: number;
  rejected: number;
}

// Material Review Count
export const getMaterialReviewCounts = async (departmentId?: string) => {
  try {
    const url = `/review/materials/count${
      departmentId ? `?departmentId=${departmentId}` : ""
    }`;
    const response = await api.get<Response<ReviewCounts>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching material review counts:", error);
    return null;
  }
};

// Blog Review Count
export const getBlogReviewCounts = async (departmentId?: string) => {
  try {
    const url = `/review/blogs/count${
      departmentId ? `?departmentId=${departmentId}` : ""
    }`;
    const response = await api.get<Response<ReviewCounts>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog review counts:", error);
    return null;
  }
};

// Course Review Count
export const getCourseReviewCounts = async (departmentId?: string) => {
  try {
    const url = `/review/courses/count${
      departmentId ? `?departmentId=${departmentId}` : ""
    }`;
    const response = await api.get<Response<ReviewCounts>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching course review counts:", error);
    return null;
  }
};

// DLC Review Count
export const getDLCReviewCounts = async (departmentId?: string) => {
  try {
    const url = `/review/dlc/count${
      departmentId ? `?departmentId=${departmentId}` : ""
    }`;
    const response = await api.get<Response<ReviewCounts>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching DLC review counts:", error);
    return null;
  }
};

// Moderator Review Count (Admin Only)
export const getModeratorReviewCounts = async (departmentId?: string) => {
  try {
    const url = `/review/moderators/count${
      departmentId ? `?departmentId=${departmentId}` : ""
    }`;
    const response = await api.get<Response<ReviewCounts>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching moderator review counts:", error);
    return null;
  }
};

// Advertisements Review Endpoints
export const listAdvertReviews = async (
  params: PaginationParams & { type?: string } = {}
) => {
  try {
    let url = `/review/adverts?page=${params.page || 1}&limit=${
      params.limit || 10
    }`;
    if (params.status) url += `&status=${params.status}`;
    if (params.type) url += `&type=${params.type}`;

    const response = await api.get<Response<Pagination<Advert[]>>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching advert reviews:", error);
    return null;
  }
};

export const reviewAdvert = async (
  advertId: string,
  reviewData: ReviewActionDTO
) => {
  try {
    const response = await api.post<Response<Advert>>(
      `/review/adverts/review/${advertId}`,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error("Error reviewing advertisement:", error);
    throw error;
  }
};

export const deleteAdvertAsAdmin = async (advertId: string) => {
  try {
    const response = await api.delete<Response<{ id: string }>>(
      `/review/adverts/${advertId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    throw error;
  }
};

export const getAdvertReviewCounts = async (departmentId?: string) => {
  try {
    const url = `/review/adverts/count${
      departmentId ? `?departmentId=${departmentId}` : ""
    }`;
    const response = await api.get<Response<ReviewCounts>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching advertisement review counts:", error);
    return null;
  }
};
