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
