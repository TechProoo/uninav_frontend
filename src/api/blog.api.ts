import { api } from "./base.api";
import {
  Blog,
  Response,
  BlogType,
  Pagination,
} from "@/lib/types/response.type";

export const createBlog = async (
  fileInput: FormData
): Promise<Response<Blog>> => {
  try {
    const config = {
      method: "POST",
      url: "/blogs",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: fileInput,
    };

    const response = await api<Response<Blog>>(config);

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to create blog");
  } catch (error: any) {
    console.error("Error during blog creation:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

export const searchBlogs = async (filters?: {
  query?: string;
  page?: number;
  type?: BlogType;
}): Promise<Response<Pagination<Blog[]>>> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (filters?.query) params.append("query", filters.query);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.type) params.append("type", filters.type);

    const config = {
      method: "GET",
      url: `/blogs${params.toString() ? `?${params.toString()}` : ""}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await api<Response<Pagination<Blog[]>>>(config);

    return response.data;
  } catch (error: any) {
    console.error("Error searching blogs:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

export const editBlog = async (
  fileInput: FormData,
  id: string
): Promise<Response<Blog>> => {
  try {
    const config = {
      method: "PATCH",
      url: `/blogs/${id}`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: fileInput,
    };

    const response = await api<Response<Blog>>(config);

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to update blog");
  } catch (error: any) {
    console.error("Error updating blog:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

export const deleteBlog = async (blogId: string): Promise<void> => {
  try {
    const response = await api.delete(`/blogs/${blogId}`);

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Failed to delete blog");
    }
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

export const getBlogById = async (blogId: string): Promise<Response<Blog>> => {
  try {
    const response = await api.get<Response<Blog>>(`/blogs/${blogId}`);

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to fetch blog details");
  } catch (error: any) {
    console.error("Error fetching blog:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Get blogs for a specific user, but uses browser caching
export const getBlogByCreatorId = async (
  creatorId: string
): Promise<Response<Blog[]>> => {
  try {
    const response = await api.get<Response<Blog[]>>(
      `/blogs/user/${creatorId}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to fetch user blogs");
  } catch (error: any) {
    console.error("Error fetching user blogs:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// This gets user blogs that are currently in session
export const getUserBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await api.get<Response<Blog[]>>("/blogs/me");

    if (response.data.status === "success") {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch your blogs");
  } catch (error: any) {
    console.error("Error fetching user blogs:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};
