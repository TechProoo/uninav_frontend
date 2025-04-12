import { api } from "./base.api";
import { Response, Material, Pagination } from "@/lib/types/response.type";

// Types for material creation and update
export interface CreateMaterialDto {
  label: string;
  description?: string;
  type: string; // MaterialTypeEnum
  tags?: string[];
  visibility?: string; // VisibilityEnum
  restriction?: string; // RestrictionEnum
  targetCourseId?: string;
  resourceAddress?: string;
  metaData?: string[];
  file?: File;
}

export const fetchRecommendedMaterials = async ({
  page = 1,
  limit = 6,
}: {
  page?: number;
  limit?: number;
}): Promise<Response<Pagination<Material[]>>> => {
  try {
    const response = await api.get<Response<Pagination<Material[]>>>(
      `/materials/recommendations?page=${page}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch recommended materials"
    );
  } catch (error: any) {
    console.error("Error fetching recommended materials:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Get my materials i created
export const getMyMaterials = async (): Promise<Response<Material[]>> => {
  try {
    const response = await api.get<Response<Material[]>>(`/materials/me`);

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to fetch my materials");
  } catch (error: any) {
    console.error("Error fetching my materials:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Search Materials
export const searchMaterials = async ({
  query,
  page = 1,
  limit = 10,
  creatorId,
  courseId,
  type,
  tag,
}: {
  query?: string;
  page?: number;
  limit?: number;
  creatorId?: string;
  courseId?: string;
  type?: string;
  tag?: string;
}): Promise<Response<Pagination<Material[]>>> => {
  try {
    let url = `/materials/search?page=${page}&limit=${limit}`;

    if (query) url += `&query=${encodeURIComponent(query)}`;
    if (creatorId) url += `&creatorId=${creatorId}`;
    if (courseId) url += `&courseId=${courseId}`;
    if (type) url += `&type=${type}`;
    if (tag) url += `&tag=${tag}`;

    const response = await api.get<Response<Pagination<Material[]>>>(url);

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to search materials");
  } catch (error: any) {
    console.error("Error searching materials:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Get Material By ID
export const getMaterialById = async (
  id: string
): Promise<Response<Material>> => {
  try {
    const response = await api.get<Response<Material>>(`/materials/${id}`);

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch material details"
    );
  } catch (error: any) {
    console.error(`Error fetching material with ID ${id}:`, error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Create Material
export const createMaterial = async (
  materialData: CreateMaterialDto
): Promise<Response<Material>> => {
  try {
    const formData = new FormData();

    // Add all text fields
    Object.entries(materialData).forEach(([key, value]) => {
      if (
        key !== "file" &&
        key !== "tags" &&
        key !== "metaData" &&
        value !== undefined
      ) {
        formData.append(key, value.toString());
      }
    });

    // Add arrays as JSON strings
    if (materialData.tags && materialData.tags.length > 0) {
      formData.append("tags", JSON.stringify(materialData.tags));
    }

    if (materialData.metaData && materialData.metaData.length > 0) {
      formData.append("metaData", JSON.stringify(materialData.metaData));
    }

    // Add file if present
    if (materialData.file) {
      formData.append("file", materialData.file);
    }

    const response = await api.post<Response<Material>>(
      "/materials",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to create material");
  } catch (error: any) {
    console.error("Error creating material:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Update Material
export const updateMaterial = async (
  id: string,
  materialData: Partial<CreateMaterialDto>
): Promise<Response<Material>> => {
  try {
    const formData = new FormData();

    // Add all text fields
    Object.entries(materialData).forEach(([key, value]) => {
      if (
        key !== "file" &&
        key !== "tags" &&
        key !== "metaData" &&
        value !== undefined
      ) {
        formData.append(key, value.toString());
      }
    });

    // Add arrays as JSON strings
    if (materialData.tags && materialData.tags.length > 0) {
      formData.append("tags", JSON.stringify(materialData.tags));
    }

    if (materialData.metaData && materialData.metaData.length > 0) {
      formData.append("metaData", JSON.stringify(materialData.metaData));
    }

    // Add file if present
    if (materialData.file) {
      formData.append("file", materialData.file);
    }

    const response = await api.patch<Response<Material>>(
      `/materials/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to update material");
  } catch (error: any) {
    console.error(`Error updating material with ID ${id}:`, error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Delete Material
export const deleteMaterial = async (
  id: string
): Promise<Response<{ id: string }>> => {
  try {
    const response = await api.delete<Response<{ id: string }>>(
      `/materials/${id}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to delete material");
  } catch (error: any) {
    console.error(`Error deleting material with ID ${id}:`, error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Like/Unlike Material
export const toggleMaterialLike = async (
  id: string
): Promise<Response<{ liked: boolean; likesCount: number }>> => {
  try {
    const response = await api.post<
      Response<{ liked: boolean; likesCount: number }>
    >(`/materials/like/${id}`);

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to toggle material like");
  } catch (error: any) {
    console.error(`Error toggling like for material with ID ${id}:`, error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Get Download URL for Material
export const getMaterialDownloadUrl = async (
  id: string
): Promise<Response<{ url: string }>> => {
  try {
    const response = await api.get<Response<{ url: string }>>(
      `/materials/download/${id}`
    );

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to get download URL");
  } catch (error: any) {
    console.error(
      `Error getting download URL for material with ID ${id}:`,
      error
    );
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Get Material Resource
export const getMaterialResource = async (
  materialId: string
): Promise<
  Response<{
    resourceType: string;
    resourceAddress: string;
    metaData: string[];
    fileKey: string;
  }>
> => {
  try {
    const response = await api.get<
      Response<{
        resourceType: string;
        resourceAddress: string;
        metaData: string[];
        fileKey: string;
      }>
    >(`/materials/resource/${materialId}`);

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to get material resource");
  } catch (error: any) {
    console.error(
      `Error getting resource for material with ID ${materialId}:`,
      error
    );
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

export const incrementDownloadCount = async (
  materialId: string
): Promise<void> => {
  try {
    await api.post(`/materials/downloaded/${materialId}`);
  } catch (error: any) {
    console.error(
      `Error incrementing download count for material with ID ${materialId}:`,
      error
    );
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// This will toggle like and unlike material and prevents duplicates
export const likeOrUnlikeMaterial = async (
  materialId: string
): Promise<Response<{ liked: boolean; likesCount: number }>> => {
  try {
    const response = await api.post<
      Response<{ liked: boolean; likesCount: number; message: string }>
    >(`/materials/like/${materialId}`);

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to like/unlike material");
  } catch (error: any) {
    console.error("Error liking/unliking material:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Get Materials
export const getMaterials = async ({
  creatorId,
  courseId,
  type,
  tag,
  page = 1,
  limit = 10,
}: {
  creatorId?: string;
  courseId?: string;
  type?: string;
  tag?: string;
  page?: number;
  limit?: number;
}): Promise<Response<Pagination<Material[]>>> => {
  try {
    let url = `/materials?page=${page}&limit=${limit}`;

    if (creatorId) url += `&creatorId=${creatorId}`;
    if (courseId) url += `&courseId=${courseId}`;
    if (type) url += `&type=${type}`;
    if (tag) url += `&tag=${tag}`;

    const response = await api.get<Response<Pagination<Material[]>>>(url);

    if (response.data.status === "success") {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to fetch materials");
  } catch (error: any) {
    console.error("Error fetching materials:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};