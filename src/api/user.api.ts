import { api } from "./base.api";
import { Response, UserProfile, Bookmark } from "@/lib/types/response.type";

export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await api.get<Response<UserProfile>>("/user/profile");

    if (response.data.status === "success") {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (
  data: Partial<
    Pick<
      UserProfile,
      "firstName" | "lastName" | "username" | "level" | "departmentId"
    >
  >
): Promise<UserProfile | null> => {
  try {
    const response = await api.patch<Response<UserProfile>>("/user", data);

    if (response.data.status === "success") {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

type CreateBookmarkData = {
  materialId?: string;
  collectionId?: string;
};

export const createBookmark = async (
  data: CreateBookmarkData
): Promise<Bookmark | null> => {
  try {
    const response = await api.post<Response<Bookmark>>(
      "/user/bookmarks",
      data
    );

    if (response.data.status === "success") {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error creating bookmark:", error);
    throw error;
  }
};

export const getAllBookmarks = async (): Promise<Bookmark[] | null> => {
  try {
    const response = await api.get<Response<Bookmark[]>>("/user/bookmarks");

    if (response.data.status === "success") {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw error;
  }
};

export const getBookmark = async (
  bookmarkId: string
): Promise<Bookmark | null> => {
  try {
    const response = await api.get<Response<Bookmark>>(
      `/user/bookmarks/${bookmarkId}`
    );

    if (response.data.status === "success") {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching bookmark:", error);
    throw error;
  }
};

export const deleteBookmark = async (bookmarkId: string): Promise<boolean> => {
  try {
    const response = await api.delete<Response<{ id: string }>>(
      `/user/bookmarks/${bookmarkId}`
    );
    return response.data.status === "success";
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    throw error;
  }
};

// Course management endpoints
export const getUserCourses = async () => {
  try {
    const response = await api.get("/user/courses");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching user courses:", error);
    return [];
  }
};

export const addUserCourses = async (courseIds: string[]) => {
  try {
    const response = await api.post("/user/courses", { courseIds });
    return response.data;
  } catch (error) {
    console.error("Error adding user courses:", error);
    throw error;
  }
};

export const removeUserCourses = async (courseIds: string[]) => {
  try {
    const response = await api.delete("/user/courses", {
      data: { courseIds },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing user courses:", error);
    throw error;
  }
};

export const getUserBlogs = async (creatorId: string | undefined) => {
  try {
    const response = await api.get(`/blogs/user/${creatorId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    throw error;
  }
};

export const fetchAllUsers = async (page: number, limit: number, query?: string): Promise< { data: UserProfile[], total: number, page: number, limit: number} | null> => {
  try {
    const params: { page: number; limit: number; query?: string } = {
      page,
      limit,
    };
    if (query) {
      params.query = query;
    }
    const response = await api.get<Response<{ data: UserProfile[], total: number, page: number, limit: number}>>('/user', {
      params,
    });
    if (response.data.status === "success") {
      return response.data.data;
    }
    return null;
  } catch (error: any) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};
